import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/ui/components/graph_view/templates/terminator_node.html";
import "/imports/ui/components/graph_view/templates/process_node.html";
import "/imports/ui/components/graph_view/graph_view.html";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {layoutGraph, labelNodesAndEdges, extendEdgeSources} from "/imports/ui/components/graph_view/jsplumb_utils.js";

const NODE_FILL = 0.20;

Template.graph_view.onCreated(function () {
    var self = Template.instance();
    self.graphId = Template.instance().data.graphId;
    self.graph = new ReactiveVar(null);
    self.selection = new ReactiveVar(null);
    self.errorLoadingGraph = new ReactiveVar(false);

    self.jsPlumbToolkit = jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data["_id"];
        }
    });
    getGraph.call(self.graphId, function (err, graph) {
        if (err || !graph) {
            self.errorLoadingGraph.set(true);
        } else {
            self.graph.set(graph);
        }
    });
});

Template.graph_view.onRendered(function () {
    this.autorun(loadFlowchart);
});

Template.graph_view.helpers({
    nodesSelection: function () {
        let sel = Template.instance().selection.get();
        if (!sel) {
            return false;
        }
        return sel.getNodes().length > 0;
    },
    errorLoadingGraph: function () {
        return Template.instance().errorLoadingGraph.get();
    }
});


Template.graph_view.events({
    "click #zoomToFitBtn": function (evt) {
        evt.preventDefault();
        Template.instance().jsplumbRenderer.zoomToFit();
    },
    "click #zoomOutBtn": function (evt) {
        evt.preventDefault();
        Template.instance().jsplumbRenderer.nudgeZoom(-.10);
    },
    "click #zoomInBtn": function (evt) {
        evt.preventDefault();
        Template.instance().jsplumbRenderer.nudgeZoom(+.10);
    },
    "click #relayoutBtn": function (evt) {
        evt.preventDefault();
        Template.instance().jsplumbRenderer.magnetize();
    },
    "click #clearSelectionBtn": function (evt) {
        evt.preventDefault();
        Template.instance().jsPlumbToolkit.clearSelection();
        Template.instance().selection.set(null);
    },
    "click #zoomToSelectionBtn": function (evt) {
        evt.preventDefault();
        let selection = Template.instance().selection.get();
        if (selection && selection.getNodes().length > 0) {
            Template.instance().jsplumbRenderer.centerOnAndZoom(selection.getNodes()[0], NODE_FILL);
        }
    }
});

function loadFlowchart() {
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
        Template.instance().jsplumbRenderer.magnetize();
        Template.instance().jsplumbRenderer.zoomToFit();
    }
}

function getJSPlumbOptions() {
    let tmpl = Template.instance();
    let toolkit = tmpl.jsPlumbToolkit;
    let selection = tmpl.selection;
    var events = {
        tap: function (params) {
            if (params.e.button == 0) {
                toolkit.clearSelection();
                toolkit.addToSelection(params.node);
                selection.set(toolkit.getSelection());
            }
        },
        dblclick: function (params) {
            tmpl.jsplumbRenderer.centerOnAndZoom(params.node, NODE_FILL);
        }
    };
    return {
        container: Template.instance().find("#jsplumbContainer"),
        miniview: {
            container: "jsplumbMiniviewContainer"
        },
        enablePanButtons: false,
        layout: {
            type: "Absolute",
            parameters: {}
        },
        view: {
            nodes: {
                "default": {
                    template: "processNode",
                    events: events
                },
                "terminator": {
                    template: "terminatorNode"
                },
                "first": {
                    parent: "default",
                    parameters: {
                        node_class: "first-node"
                    }
                },
                "virtual": {
                    parent: "default",
                    parameters: {
                        node_class: "virtual-node"
                    }
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
                toolkit.clearSelection();
                selection.set(null);
            }
        },
        consumeRightClick: false
    }
}