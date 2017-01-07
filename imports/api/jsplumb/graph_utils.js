import {Random} from "meteor/random";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {validateGraph, getGraph, getNodeEdgeMap} from "/imports/api/graphs/methods.js";

export const TYPE                 = "type";
export const ID                   = "id";
export const NODE_TYPE_PROCESS    = "process";
export const NODE_TYPE_TERMINATOR = "terminator";
export const NODE_TYPE_VIRTUAL    = "virtual";
export const NODE_TYPE_FIRST      = "first";
export const OPTIONS              = "options";
export const OPTION_NAME          = Graphs.EDGE_NAME;
export const OPTION_DETAILS       = Graphs.EDGE_DETAILS;
export const OPTION_PARENT_NODE_ID = "parentNode";
export const EDGE_NODE_SOURCE     = "nodeSource";

/**
 * Converts a JSPlumb Graph back into the MongoDB format.
 * This involves:
 *      - Merging options with the outgoing edges
 *      - Removing unused options
 *      - Removing unused nodes
 *      - Setting firstNode to the node with TYPE_FIRST_NODE
 *      - Converting id to _id
 *      - Ensuring all objects conform the schema
 *      - Validating the graph (graphs/methods/validateGraph)
 * @param jgraph graph in JSPlumb format
 */
export const getJSPlumbAsGraph = function (jgraph) {
    let jnodes = jgraph.getNodes();

    let owner = Meteor.userId();
    if (!owner) {
        throw new Error("The user must be logged in to do this");
    }
    let firstNode = getFirstNodeIDFromJSPlumb(jnodes);
    if (!firstNode) {
        throw new Error("There is not exactly 1 first node");
    }
    let edges = getEdgesFromJSPlumb(jnodes);
    let nodes = getNodesFromJSPlumb(jnodes);

    let graph                = {};
    graph[Graphs.OWNER]      = owner;
    graph[Graphs.FIRST_NODE] = firstNode;
    graph[Graphs.EDGES]      = edges;
    graph[Graphs.NODES]      = nodes;

    let error = validateGraph.call(graph);
    if (!error) {
        return graph;
    }
    throw new Error("The graph was invalid.\n\n" + error);
};

/**
 * Gets the node ID with type TYPE_FIRST, or null if there is not exactly 1 result
 * @param jnodes
 */
function getFirstNodeIDFromJSPlumb(jnodes) {
    let typeFirstNodes = _.filter(_.pluck(jnodes, "data"), function (node) {
        return node[TYPE] == NODE_TYPE_FIRST;
    });
    if (typeFirstNodes.length != 1) {
        return null;
    }
    return typeFirstNodes[0][ID];
}

function getNodesFromJSPlumb(jnodes) {
    let nodes = [];

    _.each(jnodes, function (jnode) {
        // Copy node data
        let node = {};
        _.each(_.keys(jnode.data), function (key) {
            node[key] = jnode.data[key];
        });

        // Clean the node with the MongoDB Schema
        Graphs.Graphs.schema.nodeSchema.clean(node);
        node.push(node);
    });

    return nodes;
}

/**
 * Gets all edges in the MongoDB format from the JSPlumb nodes
 * @param jnodes
 * @param edges
 */
function getEdgesFromJSPlumb(jnodes) {
    let edges = [];
    _.each(jnodes, function (jnode) {
        // Find all the edges that are outgoing
        // getAllEdges includes incoming edges
        let outgoingEdges = _.filter(jnode.getAllEdges(), function (jnodeEdge) {
            // source is a Port, get the parent node and compare to the node
            return jnodeEdge.source.getNode()[ID] == jnode[ID];
        });

        // Make proper edges out of outgoing edges
        _.each(outgoingEdges, function (outEdge) {
            let port = outEdge.source;
            let edge = {};
            _.each(_.keys(port.data), function (key) {
                edge[key] = port.data[key];
            });
            edge[Graphs.EDGE_ID]     = port[ID];
            edge[Graphs.EDGE_SOURCE] = port.getNode()[ID];
            edge[Graphs.EDGE_TARGET] = outEdge.target[ID]; // target is just a node

            // Clean the edge with the MongoDB Schema
            Graphs.Graphs.schema.edgeSchema.clean(edge);
            edges.push(edge);
        });
    });
    return edges;
}

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

        let newGraph           = {};
        newGraph[Graphs.FIRST_NODE] = graph[Graphs.FIRST_NODE];
        newGraph[Graphs.NODES] = graph[Graphs.NODES];
        newGraph[Graphs.EDGES] = graph[Graphs.EDGES];

        newGraph = labelJSPlumbNodeOptions(graph, newGraph);
        newGraph = labelJSPlumbNodeTypes(graph, newGraph);
        newGraph = cleanJSPlumbEdges(newGraph);
        newGraph = convertIdsToJSPlumb(newGraph);
        return newGraph;
    }
});

/**
 * Convert the _id field to id for nodes, edges, and options.
 * TODO: convert comment IDs
 * @param newGraph
 * @returns {*}
 */
function convertIdsToJSPlumb(newGraph) {
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
function cleanJSPlumbEdges(newGraph) {
    // JSPlumb edges are strictly source to target,
    // the other information is in the options as a part
    // of the node
    let oldEdges           = newGraph[Graphs.EDGES]
    let newEdges           = _.map(oldEdges, function (edge) {
        let e                 = {};
        // New source is the port, save for node source for layout purposes
        e[EDGE_NODE_SOURCE]   = edge[Graphs.EDGE_SOURCE];
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
function labelJSPlumbNodeOptions(graph, newGraph) {
    // All outgoing edges are transformed into node options, which will become
    // the ports. Each option has all of the edge information, with the ID
    // being the old edge ID, and no source and targets.
    let nodeMap = getNodeEdgeMap(graph);
    _.each(newGraph[Graphs.NODES], function (node) {
        node[OPTIONS] = [];
        _.each(nodeMap[node[Graphs.NODE_ID]].outgoingEdges, function (edge) {
            let opt                    = _.omit(edge, Graphs.EDGE_SOURCE, Graphs.EDGE_TARGET);
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
function labelJSPlumbNodeTypes(graph, newGraph) {
    _.each(newGraph[Graphs.NODES], function (node) {
        if (graph[Graphs.FIRST_NODE] == node[Graphs.NODE_ID]) {
            node[TYPE] = NODE_TYPE_FIRST;
        } else if (node[Graphs.NODE_CHART_ID]) {
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
    let node                    = {};
    node[ID]                    = Random.id();
    node[Graphs.NODE_NAME]      = name || "";
    node[Graphs.EDGE_DETAILS]   = "";
    node[TYPE]                  = NODE_TYPE_PROCESS;
    node[OPTIONS]               = [];
    node[Graphs.NODE_RESOURCES] = [];
    node[Graphs.NODE_IMAGES]    = [];
    node[Graphs.NODE_COMMENTS]  = [];

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
    let opt                    = {};
    opt[OPTION_NAME]           = optionText || "";
    opt[OPTION_DETAILS]        = "";
    opt[ID]                    = Random.id();
    opt[OPTION_PARENT_NODE_ID] = parentId;
    return opt;
};
