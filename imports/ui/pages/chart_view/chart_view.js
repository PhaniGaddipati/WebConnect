/**
 * Created by Phani on 10/18/2016.
 */
import "meteor/reactive-var";
import "./chart_view.html";
import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/utils/jsplumb/templates/tmplNode.html";
import * as Charts from "/imports/api/charts/charts.js";
import {getChart} from "/imports/api/charts/methods.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph} from "/imports/api/graphs/methods.js";

const dagre = require("dagre");

Template.chart_view.onCreated(function () {
    var self     = Template.instance();
    self.chartId = Template.instance().data.chartId;
    self.chart   = new ReactiveVar(null);
    self.graph   = new ReactiveVar(null);
    self.jsplumb = jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data["_id"];
        }
    });
    getChart.call(this.chartId, function (err, chart) {
        self.chart.set(chart);
        getGraph.call(chart[Charts.GRAPH_ID], function (err, graph) {
            self.graph.set(graph);
        });
    });
});

Template.chart_view.onRendered(function () {
    this.autorun(loadFlowchart);
});

Template.chart_view.helpers({
    chartLoading: function () {
        return Template.instance().chart.get() == null;
    },
    chartName: function () {
        return Template.instance().chart.get()[Charts.NAME];
    }
});

function loadFlowchart() {
    let graph = Template.instance().graph.get();
    if (graph) {
        let nodes      = graph[Graphs.NODES];
        let edges      = graph[Graphs.EDGES];
        var dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setGraph({});
        dagreGraph.setDefaultEdgeLabel(function () {
            return {};
        });
        _.each(nodes, function (node) {
            node.width  = 230;
            node.height = 50;
            dagreGraph.setNode(node[Graphs.NODE_ID], node);
        });
        _.each(edges, function (edge) {
            dagreGraph.setEdge(edge[Graphs.EDGE_SOURCE], edge[Graphs.EDGE_TARGET]);
        });
        dagre.layout(dagreGraph, {ranker: "tight-tree"});
        nodes = _.map(dagreGraph.nodes(), function (nodeId) {
            let node  = dagreGraph.node(nodeId);
            node.left = node.x;
            node.top  = node.y;
            return _.omit(node, "x", "y");
        });
        Template.instance().jsplumb.load({
            data: {
                "nodes": nodes,
                "edges": edges
            }
        });
        Template.instance().jsplumbRenderer = Template.instance().jsplumb.render({
            container: Template.instance().find("#jsplumbContainer"),
            layout: {
                type: "Absolute",
                parameters: {}
            },
            view: {
                nodes: {
                    "default": {
                        template: "tmplNode"
                    }
                },
                edges: {
                    "default": {
                        paintStyle: {lineWidth: 2, strokeStyle: '#89bcde'},
                        hoverPaintStyle: {strokeStyle: "orange"},
                        overlays: [
                            ["Arrow", {fillStyle: "#89bcde", width: 10, length: 10, location: 1}]
                        ]
                    }
                }
            },
            jsPlumb: {
                Endpoint: ["Dot", {cssClass: "endpoint", radius: 7}],
                EndpointStyle: {fillStyle: '#89bcde'},
                EndpointHoverStyle: {fillStyle: "orange"},
                Anchor: ["Perimeter", {shape: "Rectangle"}],
                Connector: ["Flowchart", {gap: 5, stub: 25, cornerRadius: 5}],
                ConnectionsDetachable: false
            }
        });
    }
}