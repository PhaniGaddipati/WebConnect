import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.1.5.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/ui/components/graph_view/templates/terminator_node.html";
import "/imports/ui/components/graph_view/templates/process_node.html";
import "/imports/ui/components/graph_view/graph_view.html";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {
    getGraph,
    getNodeEdgeMap,
    NODE_MAP_NODE,
    NODE_MAP_OUTGOING_EDGES,
    NODE_MAP_INCOMING_EDGES
} from "/imports/api/graphs/methods.js";
import {
    layoutGraph,
    labelNodesAndEdges,
    extendEdgeSources,
    TYPE,
    NODE_TYPE_VIRTUAL
} from "/imports/ui/components/graph_view/jsplumb_utils.js";
import {SELECTED_OPTION_TARGET_ID} from "/imports/ui/components/guide_view/guide_view.js";

export const SELECTION_NODE_MAP_ENTRY = "graph_selection_nodeid";
const NODE_FILL = 0.3;

Session.set(SELECTION_NODE_MAP_ENTRY, null);

Template.graph_view.onCreated(function () {
    var self = Template.instance();
    self.graphId = Template.instance().data.graphId;
    self.graph = new ReactiveVar(null);
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
            self.nodeMap = getNodeEdgeMap(graph);
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
        return Session.get(SELECTION_NODE_MAP_ENTRY) != null;
    },
    errorLoadingGraph: function () {
        return Template.instance().errorLoadingGraph.get();
    },
    selectedVirtual: function () {
        let sel = Session.get(SELECTION_NODE_MAP_ENTRY);
        if (!sel) {
            return false;
        }
        return sel[NODE_MAP_NODE][TYPE] === NODE_TYPE_VIRTUAL;
    },
    selectedVirtualGraphId: function () {
        let sel = Session.get(SELECTION_NODE_MAP_ENTRY);
        if (sel) {
            if (sel[NODE_MAP_NODE][TYPE] === NODE_TYPE_VIRTUAL) {
                return sel[NODE_MAP_NODE][Graphs.NODE_GRAPH_ID];
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
        let tmpl = Template.instance();
        let sel = Session.get(SELECTION_NODE_MAP_ENTRY);
        if (sel) {
            let id = sel[NODE_MAP_NODE][Graphs.NODE_ID];
            tmpl.jsplumbRenderer.centerOnAndZoom(tmpl.jsPlumbToolkit.getNode(id), NODE_FILL);
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

        let edgeObjs = _.map(graph[Graphs.EDGES], function (edge) {
            return {
                source: edge[Graphs.EDGE_SOURCE],
                target: edge[Graphs.EDGE_TARGET],
                data: _.omit(edge, Graphs.EDGE_SOURCE, Graphs.EDGE_TARGET)
            }
        });

        tmpl.jsPlumbToolkit.load({
            data: {
                "nodes": graph[Graphs.NODES],
                "edges": edgeObjs
            }
        });
        tmpl.jsplumbRenderer =
            tmpl.jsPlumbToolkit.render(getJSPlumbOptions());
        tmpl.jsplumbRenderer.magnetize();
        let node = tmpl.jsPlumbToolkit.getNode(graph[Graphs.FIRST_NODE]);
        if (node) {
            setSelection(tmpl, node);
            tmpl.jsplumbRenderer.centerOnAndZoom(tmpl.jsPlumbToolkit.getSelection().getNodes()[0], .25);
        }
        //tmpl.jsplumbRenderer.zoomToFit();
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
                        if (sourceId != targetId) {
                            setSelection(tmpl, tmpl.jsPlumbToolkit.getNode(targetId));
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

function setSelection(tmpl, jsNode) {
    clearSelection(tmpl);
    tmpl.jsPlumbToolkit.addToSelection(jsNode);
    // update edges to reflect any changes in the chart
    let nodeMapEntry = tmpl.nodeMap[jsNode.data[Graphs.NODE_ID]];
    nodeMapEntry[NODE_MAP_OUTGOING_EDGES] = getOutgoingEdges(jsNode);
    nodeMapEntry[NODE_MAP_INCOMING_EDGES] = getIncomingEdges(jsNode);
    Session.set(SELECTION_NODE_MAP_ENTRY, nodeMapEntry);
}

function getOutgoingEdges(jsNode) {
    let jsEdges = jsNode.getAllEdges();
    jsEdges = _.filter(jsEdges, function (jsEdge) {
        return jsEdge.source.getNode().id == jsNode.id;
    });
    _.each(jsEdges, function (jsEdge) {
        jsEdge.data[Graphs.EDGE_SOURCE] = jsEdge.source.id;
        jsEdge.data[Graphs.EDGE_TARGET] = jsEdge.target.id;
        let sel = $("#" + jsNode.id).find("[port-id=" + jsEdge.source.id + "]");
        jsEdge.data[Graphs.EDGE_NAME] = sel.attr("port-name");
        jsEdge.data[Graphs.EDGE_DETAILS] = sel.attr("port-details");
    });
    return _.pluck(jsEdges, "data");
}

function getIncomingEdges(jsNode) {
    let jsEdges = jsNode.getAllEdges();
    jsEdges = _.filter(jsEdges, function (jsEdge) {
        return jsEdge.source.getNode().id != jsNode.id;
    });
    _.each(jsEdges, function (jsEdge) {
        jsEdge.data[Graphs.EDGE_SOURCE] = jsEdge.source.id;
        jsEdge.data[Graphs.EDGE_TARGET] = jsEdge.target.id;
    });
    return _.pluck(jsEdges, "data");
}

function clearSelection(tmpl) {
    tmpl.jsPlumbToolkit.clearSelection();
    Session.set(SELECTION_NODE_MAP_ENTRY, null);
}