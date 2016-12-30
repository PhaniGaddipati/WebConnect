import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/ui/components/graph_view/templates/terminator_node.html";
import "/imports/ui/components/graph_view/templates/process_node.html";
import "/imports/ui/components/graph_view/graph_view.html";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {
    layoutGraph,
    labelNodesAndEdges,
    extendEdgeSources,
    TYPE,
    NODE_TYPE_VIRTUAL
} from "/imports/ui/components/graph_view/jsplumb_utils.js";
import {SELECTED_OPTION_TARGET_ID} from "/imports/ui/components/guide_view/guide_view.js";

export const GRPAH_SELECTION_NODE_ID = "graph_selection_nodeid";
const NODE_FILL = 0.25;

Session.set(GRPAH_SELECTION_NODE_ID, null);

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
    this.autorun(updateSelectionFromGuide);
});

function updateSelectionFromGuide() {
    let tmpl = Template.instance();
    let nodeId = Session.get(SELECTED_OPTION_TARGET_ID);
    if (nodeId) {
        let node = tmpl.jsPlumbToolkit.getNode(nodeId);
        setSelection(Template.instance(), node);
        tmpl.jsplumbRenderer.centerOnAndZoom(tmpl.jsPlumbToolkit.getSelection().getNodes()[0], NODE_FILL);
    }
}

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
    },
    selectedVirtual: function () {
        let sel = Template.instance().selection.get();
        if (!sel || sel.getNodes().length == 0) {
            return false;
        }
        return sel.getNodes()[0].data[TYPE] === NODE_TYPE_VIRTUAL;
    },
    selectedVirtualGraphId: function () {
        let sel = Template.instance().selection.get();
        if (sel && sel.getNodes().length > 0) {
            if (sel.getNodes()[0].data[TYPE] === NODE_TYPE_VIRTUAL) {
                return sel.getNodes()[0].data[Graphs.NODE_GRAPH_ID];
            }
        }
        return "#";
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
        clearSelection(Template.instance());
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
    let tmpl = Template.instance();
    let graph = tmpl.graph.get();
    if (graph) {
        graph = labelNodesAndEdges(graph);
        graph = layoutGraph(graph);
        graph = extendEdgeSources(graph);

        tmpl.jsPlumbToolkit.load({
            data: {
                "nodes": graph[Graphs.NODES],
                "edges": graph[Graphs.EDGES]
            }
        });
        tmpl.jsplumbRenderer =
            tmpl.jsPlumbToolkit.render(getJSPlumbOptions());
        tmpl.jsplumbRenderer.magnetize();
        let node = tmpl.jsPlumbToolkit.getNode(graph[Graphs.FIRST_NODE]);
        if (node) {
            setSelection(tmpl, node);
            //tmpl.jsplumbRenderer.centerOnAndZoom(tmpl.jsPlumbToolkit.getSelection().getNodes()[0], NODE_FILL);
        }
        tmpl.jsplumbRenderer.zoomToFit();
    }
}

function getJSPlumbOptions() {
    let tmpl = Template.instance();
    var events = {
        tap: function (params) {
            if (params.e.button == 0) {
                setSelection(tmpl, params.node);
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
                clearSelection(tmpl);
            }
        },
        consumeRightClick: false
    }
}

function setSelection(tmpl, node) {
    clearSelection(tmpl);
    tmpl.jsPlumbToolkit.addToSelection(node);
    tmpl.selection.set(tmpl.jsPlumbToolkit.getSelection());
    Session.set(GRPAH_SELECTION_NODE_ID, node.data[Graphs.NODE_ID]);
}

function clearSelection(tmpl) {
    tmpl.jsPlumbToolkit.clearSelection();
    tmpl.selection.set(null);
    Session.set(GRPAH_SELECTION_NODE_ID, null);
}