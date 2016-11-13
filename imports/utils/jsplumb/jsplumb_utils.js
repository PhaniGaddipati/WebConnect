/**
 * Created by Phani on 11/8/2016.
 */

import * as Graphs from "/imports/api/graphs/graphs.js";
import {getNodeEdgeMap} from "/imports/api/graphs/methods.js";

const dagre      = require("dagre");
const NODE_WIDTH = 250;

export const TYPE                 = "type";
export const NODE_TYPE_PROCESS    = "process";
export const NODE_TYPE_DECISION   = "decision";
export const NODE_TYPE_TERMINATOR = "terminator";
export const NODE_TYPE_VIRTUAL    = "virtual";

/**
 * Adds node types: process, decision, terminator, virtual
 * @param graph
 */
function labelTypes(graph) {
    let nodeMap = getNodeEdgeMap(graph);
    _.each(graph[Graphs.NODES], function (node) {
        if (graph[Graphs.FIRST_NODE] == node[Graphs.NODE_ID]) {
            node[TYPE] = NODE_TYPE_TERMINATOR;
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
    return graph;
}

/**
 * Adds the "left" and "top" attributes to nodes, in px,
 * after laying out the graph.
 * @param graph
 */
export const layoutGraph = function (graph) {
    graph          = labelTypes(graph);
    let nodes      = graph[Graphs.NODES];
    let edges      = graph[Graphs.EDGES];
    var dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({});
    dagreGraph.setDefaultEdgeLabel(function () {
        return {};
    });
    _.each(nodes, function (node) {
        node.width  = NODE_WIDTH;
        node.height = 0;
        if (node[TYPE] != NODE_TYPE_VIRTUAL) {
            node.height += computeTextHeight(NODE_WIDTH, node[Graphs.NODE_DETAILS])
                + computeTitleTextHeight(NODE_WIDTH, node[Graphs.NODE_NAME]);
        }
        if (!node[Graphs.NODE_DETAILS] || node[Graphs.NODE_DETAILS] == "") {
            node.height += 10;
        }
        dagreGraph.setNode(node[Graphs.NODE_ID], node);
    });
    _.each(edges, function (edge) {
        dagreGraph.setEdge(edge[Graphs.EDGE_SOURCE], edge[Graphs.EDGE_TARGET]);
    });
    dagre.layout(dagreGraph);
    nodes               = _.map(dagreGraph.nodes(), function (nodeId) {
        let node  = dagreGraph.node(nodeId);
        node.left = node.x;
        node.top  = node.y;
        return _.omit(node, "x", "y");
    });
    graph[Graphs.NODES] = nodes;
    return graph;
};

function computeTextHeight(width, txt) {
    let canvas         = document.getElementById("dummyNormalCanvas");
    canvas.style.width = width + "px";
    canvas.innerHTML   = txt;
    return canvas.offsetHeight;
}

function computeTitleTextHeight(width, txt) {
    let canvas         = document.getElementById("dummyTitleCanvas");
    canvas.style.width = width + "px";
    canvas.innerHTML   = txt;
    return canvas.offsetHeight;
}