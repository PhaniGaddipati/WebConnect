import "meteor/reactive-var";
import "./chart_view.html";
import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/ui/pages/chart_view/templates/process_node.html";
import "/imports/ui/pages/chart_view/templates/terminator_node.html";
import "/imports/ui/pages/chart_view/templates/first_node.html";
import "/imports/ui/pages/chart_view/templates/virtual_node.html";
import * as Charts from "/imports/api/charts/charts.js";
import {getChart} from "/imports/api/charts/methods.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {getUserName} from "/imports/api/users/methods.js";
import {layoutGraph, labelNodesAndEdges, extendEdgeSources} from "/imports/ui/pages/chart_view/jsplumb_utils.js";

Template.chart_view.onCreated(function () {
    var self = Template.instance();
    self.chartId = Template.instance().data.chartId;
    self.chartLoading = new ReactiveVar(true);
    self.chart = new ReactiveVar(null);
    self.graph = new ReactiveVar(null);

    jsPlumb.ready(function () {
        onJSPlumbReady(self);
    });
    getChart.call(this.chartId, function (err, chart) {
        self.chart.set(chart);
        getGraph.call(chart[Charts.GRAPH_ID], function (err, graph) {
            self.graph.set(graph);
        });
    });
});

function onJSPlumbReady(tmpl) {
    tmpl.jsPlumbToolkit = jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data["_id"];
        }
    });
}

Template.chart_view.onRendered(function () {
    this.autorun(loadFlowchart);
});

Template.chart_view.helpers({
    chartLoading: function () {
        return !Template.instance().chart.get()
            || Template.instance().chartLoading.get();
    },
    chartName: function () {
        return Template.instance().chart.get()[Charts.NAME];
    },
    chartDescription: function () {
        return Template.instance().chart.get()[Charts.DESCRIPTION];
    },
    chartLastUpdated: function () {
        return moment(Template.instance().chart.get()[Charts.UPDATED_DATE])
            .locale(TAPi18n.getLanguage()).format("MMMM DD, YYYY");
    },
    chartAuthor: function () {
        let owner = Template.instance().chart.get()[Charts.OWNER];
        return getUserName.call({userId: owner});
    }
});

function loadFlowchart() {
    Template.instance().chartLoading.set(true);
    let graph = Template.instance().graph.get();
    if (graph) {
        graph = labelNodesAndEdges(graph);
        graph = layoutGraph(graph);
        graph = extendEdgeSources(graph);

        Template.instance().jsPlumbToolkit.load({
            data: {
                "nodes": graph[Graphs.NODES],
                "edges": graph[Graphs.EDGES]
            }
        });
        Template.instance().jsplumbRenderer =
            Template.instance().jsPlumbToolkit.render(getJSPlumbOptions());
        Template.instance().jsplumbRenderer.zoomToFit();
    }
    Template.instance().chartLoading.set(false);
}

function getJSPlumbOptions() {
    let toolkit = Template.instance().jsPlumbToolkit;
    var selectEvent = {
        tap: function (params) {
            if (params.e.button == 0) {
                toolkit.toggleSelection(params.node);
            }
        }
    };
    return {
        container: Template.instance().find("#jsplumbContainer"),
        miniview: {
            container: "jsplumbMiniviewContainer"
        },
        layout: {
            type: "Absolute",
            parameters: {}
        },
        view: {
            nodes: {
                "default": {
                    template: "processNode",
                    events: selectEvent
                },
                "terminator": {
                    template: "terminatorNode"
                },
                "first": {
                    template: "firstNode",
                    parent: "default"
                },
                "virtual": {
                    template: "virtualNode",
                    parent: "default"
                }
            },
            edges: {
                "default": {
                    anchors: [["Right", "Left"], ["Perimeter", {shape: "Rectangle", anchorCount: 10}]],
                    endpoint: ["Dot", {radius: 8}],
                    connector: ["StateMachine", {cornerRadius: 5, stub: [10, 50], midpoint: 0.1}],
                    paintStyle: {
                        lineWidth: 3,
                        strokeStyle: "#0878CB"
                    },	//	paint style for this edge type.
                    hoverPaintStyle: {
                        lineWidth: 8,
                        strokeStyle: "#05518a"
                    }, // hover paint style for this edge type.
                    overlays: [["Arrow", {location: 1, width: 15, length: 20}]],
                    beforeDrop: function (p) {
                        // Nodes have ID nodeId
                        // Options have ID nodeId.edgeId
                        // Check that the nodeIds are different
                        let sourceId = p.sourceId;
                        let targetId = p.targetId;
                        if (sourceId.indexOf(".") > -1) {
                            sourceId = sourceId.substring(0, sourceId.indexOf("."));
                        }
                        if (targetId.indexOf(".") > -1) {
                            targetId = targetId.substring(0, targetId.indexOf("."));
                        }
                        return sourceId !== targetId;
                    }
                }
            },
            ports: {
                "default": {
                    edgeType: "default",
                    allowLoopback: false,
                    allowNodeLoopback: false
                },
                "option": {
                    maxConnections: 1,
                    allowLoopback: false,
                    allowNodeLoopback: false
                }
            }
        },
        events: {
            canvasClick: function (e) {
                console.log("Canvas click");
                toolkit.clearSelection();
            }
        },
        consumeRightClick: false
    }
}