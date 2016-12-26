import "meteor/reactive-var";
import "./chart_view.html";
import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/utils/jsplumb/templates/processNode.html";
import "/imports/utils/jsplumb/templates/virtualNode.html";
import "/imports/utils/jsplumb/templates/terminatorNode.html";
import * as Charts from "/imports/api/charts/charts.js";
import {getChart} from "/imports/api/charts/methods.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {layoutGraph} from "/imports/utils/jsplumb/jsplumb_utils.js";

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
    },
    chartDescription: function () {
        return Template.instance().chart.get()[Charts.DESCRIPTION];
    }
});

function loadFlowchart() {
    let graph = Template.instance().graph.get();
    if (graph) {
        graph = layoutGraph(graph);
        Template.instance().jsplumb.load({
            data: {
                "nodes": graph[Graphs.NODES],
                "edges": graph[Graphs.EDGES]
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
                        template: "processNode"
                    },
                    "virtual": {
                        template: "virtualNode"
                    },
                    "terminator": {
                        template: "terminatorNode"
                    }
                },
                edges: {
                    "default": {
                        anchor: "AutoDefault",
                        endpoint: "Blank",
                        connector: ["Flowchart", {cornerRadius: 5}],
                        paintStyle: {
                            lineWidth: 2,
                            strokeStyle: "#f76258",
                            outlineWidth: 3,
                            outlineStroke: "transparent"
                        },	//	paint style for this edge type.
                        hoverPaintStyle: {strokeWidth: 2, stroke: "rgb(67,67,67)"}, // hover paint style for this edge type.
                        overlays: [
                            ["Arrow", {location: 1, width: 10, length: 10}],
                            ["Arrow", {location: 0.3, width: 10, length: 10}],
                            ["Label", {label: "${name}", location: .25, labelStyle: {color: "black"}}]
                        ]
                    }
                },
                ports: {
                    "start": {
                        edgeType: "default"
                    },
                    "source": {
                        maxConnections: -1,
                        edgeType: "connection"
                    },
                    "target": {
                        maxConnections: -1,
                        isTarget: true,
                        dropOptions: {
                            hoverClass: "connection-drop"
                        }
                    }
                }
            }
        });
    }
}