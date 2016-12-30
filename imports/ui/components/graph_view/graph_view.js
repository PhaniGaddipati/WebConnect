import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/ui/components/graph_view/templates/terminator_node.html";
import "/imports/ui/components/graph_view/templates/process_node.html";
import "/imports/ui/components/graph_view/graph_view.html";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {layoutGraph} from "/imports/ui/components/graph_view/jsplumb_utils.js";
import * as GraphUtils from "/imports/api/jsplumb/graph_utils.js";
import {SELECTED_OPTION_ID} from "/imports/ui/components/guide_view/guide_view.js";

export const SELECTION_NODE_DATA = "graph_selection_nodeid";
const NODE_FILL = 0.2;

Template.graph_view.onCreated(function () {
    let self = Template.instance();
    self.graphId = self.data.graphId;
    self.graph = new ReactiveVar(null);
    self.loadingGraph = new ReactiveVar(true);
    self.errorLoadingGraph = new ReactiveVar(false);

    self.jsPlumbToolkit = jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data["_id"];
        }
    });
    GraphUtils.getGraphAsJSPlumb.call(self.graphId, function (err, graph) {
        if (err || !graph) {
            console.log(err);
            self.errorLoadingGraph.set(true);
        } else {
            self.graph.set(graph);
        }
        self.loadingGraph.set(false);
    });


});

Template.graph_view.onRendered(function () {
    Session.set(SELECTION_NODE_DATA, null);
    this.autorun(loadFlowchart);
    this.autorun(updateSelectionFromGuide);
});

function updateSelectionFromGuide() {
    let self = Template.instance();

    let optionId = Session.get(SELECTED_OPTION_ID);
    let node = self.jsPlumbToolkit.getSelection().getNodes()[0];
    if (optionId && node) {
        let port = node.getPort(optionId);
        if (port && port.getEdges().length > 0) {
            let nextNode = port.getEdges()[0].target;
            self.jsplumbRenderer.centerOnAndZoom(nextNode, NODE_FILL);
            setSelection(Template.instance(), nextNode);
        }
    }
}

Template.graph_view.helpers({
    loadingGraph: function () {
        return Template.instance().loadingGraph.get();
    },
    nodesSelection: function () {
        return Session.get(SELECTION_NODE_DATA) != null;
    },
    errorLoadingGraph: function () {
        return Template.instance().errorLoadingGraph.get();
    },
    selectedVirtual: function () {
        let node = Session.get(SELECTION_NODE_DATA);
        if (!node) {
            return false;
        }
        return node[Graphs.NODE_GRAPH_ID] != null;
    },
    selectedVirtualGraphId: function () {
        let node = Session.get(SELECTION_NODE_DATA);
        if (node) {
            return node[Graphs.NODE_GRAPH_ID];
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
        let self = Template.instance();
        let node = Session.get(SELECTION_NODE_DATA);
        if (node) {
            let id = node[Graphs.NODE_ID];
            self.jsplumbRenderer.centerOnAndZoom(self.jsPlumbToolkit.getNode(id), NODE_FILL);
        }
    }
});

function loadFlowchart() {
    let self = Template.instance();
    let graph = self.graph.get();
    if (graph) {
        graph = layoutGraph(graph);
        self.jsPlumbToolkit.load({
            data: {
                "nodes": graph[Graphs.NODES],
                "edges": graph[Graphs.EDGES]
            }
        });
        self.jsplumbRenderer =
            self.jsPlumbToolkit.render(getJSPlumbOptions());
        self.jsplumbRenderer.magnetize();
        let node = self.jsPlumbToolkit.getNode(graph[Graphs.FIRST_NODE]);
        if (node) {
            setSelection(self, node);
            self.jsplumbRenderer.centerOnAndZoom(self.jsPlumbToolkit.getSelection().getNodes()[0], .25);
        }
    }
}

function getJSPlumbOptions() {
    let self = Template.instance();
    var events = {
        tap: function (params) {
            if (params.e.button == 0) {
                setSelection(self, params.node);
            }
        },
        dblclick: function (params) {
            self.jsplumbRenderer.centerOnAndZoom(params.node, NODE_FILL);
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
                        let con = p.connection;
                        if (p.sourceId == p.targetId) {
                            // This should never really happen...
                            return false;
                        }
                        return con.source.getAttribute("data-parent-node") != p.targetId;
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
                clearSelection(self);
            }
        },
        consumeRightClick: false
    }
}

function setSelection(self, jsNode) {
    clearSelection(self);
    self.jsPlumbToolkit.addToSelection(jsNode);
    Session.set(SELECTION_NODE_DATA, jsNode.data);
}

function clearSelection(self) {
    self.jsPlumbToolkit.clearSelection();
    Session.set(SELECTION_NODE_DATA, null);
}