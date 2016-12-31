import "meteor/random";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph, getNodeEdgeMap} from "/imports/api/graphs/methods.js";

export const TYPE = "type";
export const HAS_ATTACHMENT = "hasAttachment";
export const NODE_TYPE_PROCESS = "process";
export const NODE_TYPE_DECISION = "decision";
export const NODE_TYPE_TERMINATOR = "terminator";
export const NODE_TYPE_VIRTUAL = "virtual";
export const NODE_TYPE_FIRST = "first";
export const OPTIONS = "options";
export const OPTION_NAME = Graphs.EDGE_NAME;
export const OPTION_DETAILS = Graphs.EDGE_DETAILS;
export const OPTION_ID = Graphs.EDGE_ID;
export const OPTION_PARENT_NODE_ID = "parentNode";
export const EDGE_NODE_SOURCE = "nodeSource";

/**
 * Retrieves a graph from the graphs collection and
 * transforms it into a format expected by the JSPlumb library.
 * The original ID field name is retained and should be
 * declared in the jsplumb configuration.
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

        let nodeMap = getNodeEdgeMap(graph);
        newGraph = labelNodeTypes(graph, nodeMap, newGraph);
        newGraph = labelNodeOptions(graph, nodeMap, newGraph);
        newGraph = labelNodeExtras(newGraph);
        newGraph = cleanEdges(newGraph);
        return newGraph;
    }
});

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

function labelNodeExtras(newGraph) {
    // a boolean if there are any resources or images
    _.each(newGraph[Graphs.NODES], function (node) {
        node[HAS_ATTACHMENT] = node[Graphs.NODE_RESOURCES].length > 0 ||
            node[Graphs.NODE_IMAGES].length > 0;
    });
    return newGraph;
}

function labelNodeOptions(graph, nodeMap, newGraph) {
    // All outgoing edges are transformed into node options, which will become
    // the ports. Each option has all of the edge information, with the ID
    // being the old edge ID, and no source and targets.
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

function labelNodeTypes(graph, nodeMap, newGraph) {
    _.each(newGraph[Graphs.NODES], function (node) {
        if (graph[Graphs.FIRST_NODE] == node[Graphs.NODE_ID]) {
            node[TYPE] = NODE_TYPE_FIRST;
        } else if (node[Graphs.NODE_GRAPH_ID]) {
            node[TYPE] = NODE_TYPE_VIRTUAL;
        } else if (nodeMap[node[Graphs.NODE_ID]].outgoingEdges.length == 1) {
            node[TYPE] = NODE_TYPE_PROCESS;
        } else if (nodeMap[node[Graphs.NODE_ID]].outgoingEdges.length > 1) {
            node[TYPE] = NODE_TYPE_DECISION;
        } else {
            node[TYPE] = NODE_TYPE_TERMINATOR;
        }
    });
    return newGraph;
}

export const getOptionObject = function (optionText, parentId) {
    let opt = {};
    opt[OPTION_NAME] = optionText;
    opt[OPTION_DETAILS] = "";
    opt[OPTION_ID] = Random.id();
    opt[OPTION_PARENT_NODE_ID] = parentId;
    return opt;
};
