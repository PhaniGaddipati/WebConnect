import "/imports/ui/components/graph_view/templates/process_dummy_node.html";
import "/imports/ui/components/graph_view/templates/terminator_dummy_node.html";
import "/imports/api/jsplumb/graph_utils.js";
import {NODE_TYPE_TERMINATOR, TYPE, OPTIONS, OPTION_NAME, EDGE_NODE_SOURCE} from "/imports/api/jsplumb/graph_utils";
import * as Graphs from "/imports/api/graphs/graphs";

const dagre = require("dagre");
const NODE_WIDTH = 250; // Make sure to also change in dummy nodes

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
        dagreGraph.setEdge(edge[EDGE_NODE_SOURCE], edge[Graphs.EDGE_TARGET]);
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

export const computeHeight = function (node) {
    if (node[TYPE] === NODE_TYPE_TERMINATOR) {
        // No options for this kind of node
        document.getElementById("dummyTerminatorTitle").innerHTML = node[Graphs.NODE_NAME];
        return document.getElementById("terminatorDummyNode").offsetHeight;
    } else {
        document.getElementById("dummyProcessTitle").innerHTML = node[Graphs.NODE_NAME];
        let element = document.getElementById("dummyOptionList");
        element.innerHTML = "";
        _.each(node[OPTIONS], function (opt) {
            element.innerHTML = element.innerHTML + "<li class=\"list-group-item\">" + opt[OPTION_NAME] + "</li>";
        });
        element.innerHTML = element.innerHTML + "<li class=\"form-group\"><input class=\"form-control input-sm\"></input></li>";
        return document.getElementById("processDummyNode").offsetHeight;
    }
};