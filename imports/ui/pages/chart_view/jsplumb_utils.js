/**
 * Created by Phani on 11/8/2016.
 */
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getNodeEdgeMap} from "/imports/api/graphs/methods.js";

const dagre = require("dagre");
const NODE_WIDTH = 250;

export const OPTIONS = "options";
export const TYPE = "type";
export const NODE_TYPE_PROCESS = "process";
export const NODE_TYPE_DECISION = "decision";
export const NODE_TYPE_TERMINATOR = "terminator";
export const NODE_TYPE_VIRTUAL = "virtual";
export const NODE_TYPE_FIRST = "first";

/**
 * Adds "type" field for node types: process, decision, terminator, virtual
 * Adds "options" array field for outgoing edges
 * @param graph
 */
export const labelNodesAndEdges = function (graph) {
    let nodeMap = getNodeEdgeMap(graph);
    _.each(graph[Graphs.NODES], function (node) {
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
        node[OPTIONS] = [];
        _.each(nodeMap[node[Graphs.NODE_ID]].outgoingEdges, function (edge) {
            node[OPTIONS].push({name: edge[Graphs.EDGE_NAME]});
        });
    });
    return graph;
};

export const extendEdgeSources = function (graph) {
    // Extends the source id to id.edge_name to reference the port inside the node
    _.each(graph[Graphs.EDGES], function (edge) {
        edge[Graphs.EDGE_SOURCE] = edge[Graphs.EDGE_SOURCE] + "." + edge[Graphs.EDGE_NAME];
    });
    return graph;
};

/**
 * Adds the "left" and "top" attributes to nodes, in px,
 * after laying out the graph.
 * @param graph
 */
export const layoutGraph = function (graph) {
    let nodes = graph[Graphs.NODES];
    let edges = graph[Graphs.EDGES];
    var dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({});
    dagreGraph.setDefaultEdgeLabel(function () {
        return {};
    });
    _.each(nodes, function (node) {
        node.width = NODE_WIDTH;
        node.height = computeHeight(node);
        // TODO trim text
        dagreGraph.setNode(node[Graphs.NODE_ID], node);
    });
    _.each(edges, function (edge) {
        dagreGraph.setEdge(edge[Graphs.EDGE_SOURCE], edge[Graphs.EDGE_TARGET]);
    });
    dagre.layout(dagreGraph);
    nodes = _.map(dagreGraph.nodes(), function (nodeId) {
        let node = dagreGraph.node(nodeId);
        node.left = node.x;
        node.top = node.y;
        return _.omit(node, "x", "y");
    });
    graph[Graphs.NODES] = nodes;
    return graph;
};

function computeHeight(node) {
    return node.options.length * 60 + 75;
}