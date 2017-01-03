import "meteor/random";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph, getNodeEdgeMap} from "/imports/api/graphs/methods.js";

export const TYPE = "type";
export const ID = "id";
export const NODE_TYPE_PROCESS = "process";
export const NODE_TYPE_TERMINATOR = "terminator";
export const NODE_TYPE_VIRTUAL = "virtual";
export const NODE_TYPE_FIRST = "first";
export const OPTIONS = "options";
export const OPTION_NAME = Graphs.EDGE_NAME;
export const OPTION_DETAILS = Graphs.EDGE_DETAILS;
export const OPTION_PARENT_NODE_ID = "parentNode";
export const EDGE_NODE_SOURCE = "nodeSource";

/**
 * Retrieves a graph from the graphs collection and
 * transforms it into a format expected by the JSPlumb library.
 * Changes in the JSPlumb form:
 *      - Different ID key
 *      - Outgoing edge information is stored in the node in the form of options (ports)
 *      - Edges are just source and target containers
 *      - Edge source is extended to be nodeId.optionId
 *      - Nodes have a new TYPE field
 * @param graphId
 */
export const getGraphAsJSPlumb = new ValidatedMethod({
    name: "getGraphAsJSPlumb",
    validate: function (id) {
    },
    run(graphId){
        let graph = getGraph.call(graphId);
        if (!graph) {
            return newGraph;
        }

        let newGraph = {};
        newGraph[Graphs.FIRST_NODE] = graph[Graphs.FIRST_NODE];
        newGraph[Graphs.NODES] = graph[Graphs.NODES];
        newGraph[Graphs.EDGES] = graph[Graphs.EDGES];

        newGraph = labelNodeOptions(graph, newGraph);
        newGraph = labelNodeTypes(graph, newGraph);
        newGraph = cleanEdges(newGraph);
        newGraph = convertIds(newGraph);
        return newGraph;
    }
});

/**
 * Convert the _id field to id for nodes, edges, and options.
 * TODO: convert comment IDs
 * @param newGraph
 * @returns {*}
 */
function convertIds(newGraph) {
    _.each(newGraph[Graphs.NODES], function (node) {
        node[ID] = node[Graphs.NODE_ID];
        delete node[Graphs.NODE_ID];
        _.each(node[OPTIONS], function (opt) {
            // option was made from an edge
            opt[ID] = opt[Graphs.EDGE_ID];
            delete opt[Graphs.EDGE_ID];
        })
    });
    _.each(newGraph[Graphs.EDGES], function (edge) {
        edge[ID] = edge[Graphs.EDGE_ID];
        delete edge[Graphs.EDGE_ID];
    });
    return newGraph;
}

/**
 * Extend the edge sources and remove every other attribute since it's
 * now a part of the option.
 * @param newGraph
 * @returns {*}
 */
function cleanEdges(newGraph) {
    // JSPlumb edges are strictly source to target,
    // the other information is in the options as a part
    // of the node
    let oldEdges = newGraph[Graphs.EDGES]
    let newEdges = _.map(oldEdges, function (edge) {
        let e = {};
        // New source is the port, save for node source for layout purposes
        e[EDGE_NODE_SOURCE] = edge[Graphs.EDGE_SOURCE];
        e[Graphs.EDGE_SOURCE] = edge[Graphs.EDGE_SOURCE] + "." + edge[Graphs.EDGE_ID];
        e[Graphs.EDGE_TARGET] = edge[Graphs.EDGE_TARGET];
        return e;
    });
    newGraph[Graphs.EDGES] = newEdges;
    return newGraph;
}

/**
 * Convert outgoing edges into options by copying the edge, sans source and target
 * @param graph
 * @param newGraph
 * @returns {*}
 */
function labelNodeOptions(graph, newGraph) {
    // All outgoing edges are transformed into node options, which will become
    // the ports. Each option has all of the edge information, with the ID
    // being the old edge ID, and no source and targets.
    let nodeMap = getNodeEdgeMap(graph);
    _.each(newGraph[Graphs.NODES], function (node) {
        node[OPTIONS] = [];
        _.each(nodeMap[node[Graphs.NODE_ID]].outgoingEdges, function (edge) {
            let opt = _.omit(edge, Graphs.EDGE_SOURCE, Graphs.EDGE_TARGET);
            opt[OPTION_PARENT_NODE_ID] = node[Graphs.NODE_ID];
            node[OPTIONS].push(opt);
        });
    });
    return newGraph;
}

/**
 * Label node types
 * @param graph
 * @param newGraph
 * @returns {*}
 */
function labelNodeTypes(graph, newGraph) {
    _.each(newGraph[Graphs.NODES], function (node) {
        if (graph[Graphs.FIRST_NODE] == node[Graphs.NODE_ID]) {
            node[TYPE] = NODE_TYPE_FIRST;
        } else if (node[Graphs.NODE_GRAPH_ID]) {
            node[TYPE] = NODE_TYPE_VIRTUAL;
        } else if (node[OPTIONS].length >= 1) {
            node[TYPE] = NODE_TYPE_PROCESS;
        } else {
            node[TYPE] = NODE_TYPE_TERMINATOR;
        }
    });
    return newGraph;
}

/**
 * Returns a new empty node object in JSPlumb format.
 * A random ID is assigned
 * @param name
 * @returns {{}}
 */
export const getJSPlumbNodeObject = function (name) {
    let node = {};
    node[ID] = Random.id();
    node[Graphs.NODE_NAME] = name || "";
    node[Graphs.EDGE_DETAILS] = "";
    node[TYPE] = NODE_TYPE_PROCESS;
    node[OPTIONS] = [];
    node[Graphs.NODE_RESOURCES] = [];
    node[Graphs.NODE_IMAGES] = [];
    node[Graphs.NODE_COMMENTS] = [];

    return node;
};

/**
 * Returns a new option object with a randomly assigned ID
 * and the given parentId
 * @param optionText
 * @param parentId
 * @returns {{}}
 */
export const getOptionObject = function (optionText, parentId) {
    let opt = {};
    opt[OPTION_NAME] = optionText || "";
    opt[OPTION_DETAILS] = "";
    opt[ID] = Random.id();
    opt[OPTION_PARENT_NODE_ID] = parentId;
    return opt;
};
