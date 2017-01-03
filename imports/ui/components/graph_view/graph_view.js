import "/imports/ui/components/app_loading/app_loading.js";
import "/imports/utils/jsplumb/jsPlumb-2.2.8.js";
import "/imports/utils/jsplumb/jsPlumbToolkit-1.0.26-min.js";
import "/imports/ui/components/graph_view/templates/option_tmpl.html";
import "/imports/ui/components/graph_view/templates/terminator_node.html";
import "/imports/ui/components/graph_view/templates/process_node.html";
import "/imports/ui/components/graph_view/graph_view.html";
import "/imports/ui/components/graph_view/modals/delete_node_modal.js";
import "/imports/ui/components/graph_view/modals/edit_node_modal.js";
import * as DeleteNodeModal from "/imports/ui/components/graph_view/modals/delete_node_modal.js";
import * as EditNodeModal from "/imports/ui/components/graph_view/modals/edit_node_modal.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {layoutGraph} from "/imports/ui/components/graph_view/jsplumb_view_utils.js";
import * as GraphUtils from "/imports/api/jsplumb/graph_utils.js";
import {SELECTED_OPTION_ID} from "/imports/ui/components/guide_view/guide_view.js";

export const SELECTION_NODE_DATA = "graph_selection_nodeid";
const NODE_FILL = 0.25;

jstk = null;

Template.graph_view.onCreated(function () {
    let self = Template.instance();
    self.graphId = self.data.graphId;
    self.graph = new ReactiveVar(null);
    self.loadingGraph = new ReactiveVar(true);
    self.errorLoadingGraph = new ReactiveVar(false);

    self.jsPlumbToolkit = getJSPlumbInstance(self);
    jstk = self.jsPlumbToolkit;
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
        let self = Template.instance();
        let node = Session.get(SELECTION_NODE_DATA);
        if (node) {
            let id = node[GraphUtils.ID];
            self.jsplumbRenderer.centerOnAndZoom(self.jsPlumbToolkit.getNode(id), NODE_FILL);
        } else {
            self.jsplumbRenderer.zoomToFit();
        }
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
    "keyup #addOptionInput": function (evt) {
        if (evt.keyCode === 13) {
            evt.preventDefault();
            let self = Template.instance();
            let txt = evt.target.value;
            let nodeId = evt.currentTarget.parentElement.parentElement.parentElement.parentElement.id;
            let node = self.jsPlumbToolkit.getNode(nodeId);
            if (!_.contains(_.pluck(node.data[GraphUtils.OPTIONS], GraphUtils.OPTION_NAME), txt)) {
                let opt = GraphUtils.getOptionObject(txt, nodeId);
                self.jsPlumbToolkit.addNewPort(nodeId, "option", opt);
                evt.target.value = "";
                setSelection(self, node);
            }
        }
    },
    "click #deleteOptionBtn": function (evt) {
        evt.preventDefault();
        let self = Template.instance();
        let portId = evt.currentTarget.getAttribute("data-option-id");
        let nodeId = evt.currentTarget.getAttribute("data-node-id");
        let node = self.jsPlumbToolkit.getNode(nodeId);

        removePort(node, portId, self);
        setSelection(self, node);
    },
    "click #toolbarDeleteNodeBtn": function (evt) {
        evt.preventDefault();
        let self = Template.instance();
        let node = Session.get(SELECTION_NODE_DATA);
        if (node) {
            onDeleteNode(self, node[GraphUtils.ID]);
        }
    },
    "click #deleteNodeBtn": function (evt) {
        evt.preventDefault();
        let self = Template.instance();
        let nodeId = evt.currentTarget.getAttribute("data-node-id");
        onDeleteNode(self, nodeId);
    },
    "click #tooblarEditNodeBtn": function (evt) {
        evt.preventDefault();
        let self = Template.instance();
        let node = Session.get(SELECTION_NODE_DATA);
        if (node) {
            onEditNode(self, node[GraphUtils.ID]);
        }
    },
    "click #editNodeBtn": function (evt) {
        evt.preventDefault();
        let self = Template.instance();
        let nodeId = evt.currentTarget.getAttribute("data-node-id");
        if (node) {
            onEditNode(self, nodeId);
        }
    },
    "click #tooblarMakeFirstNodeBtn": function (evt) {
        evt.preventDefault();
        let self = Template.instance();
        let newFirstNode = (self.jsPlumbToolkit.getSelection().getNodes() || [null])[0];
        if (newFirstNode && newFirstNode[GraphUtils.TYPE] != GraphUtils.NODE_TYPE_VIRTUAL) {
            // make this node the only type:"first" node
            let nodeData = newFirstNode.data;
            nodeData[GraphUtils.TYPE] = GraphUtils.NODE_TYPE_FIRST;
            self.jsPlumbToolkit.updateNode(newFirstNode, nodeData);
            $("#" + nodeData[GraphUtils.ID]).addClass("first-node");

            _.each(self.jsPlumbToolkit.getNodes(), function (node) {
                if (node != newFirstNode && node.data[GraphUtils.TYPE] == GraphUtils.NODE_TYPE_FIRST) {
                    node.data[GraphUtils.TYPE] = GraphUtils.NODE_TYPE_PROCESS;
                    $("#" + node.data[GraphUtils.ID]).removeClass("first-node");
                    self.jsPlumbToolkit.updateNode(node, node.data);
                }
            });
        }
    }
});

function onDeleteNode(self, nodeId) {
    let node = self.jsPlumbToolkit.getNode(nodeId);

    let data = {};
    data[DeleteNodeModal.DATA_NODE] = node.data;
    data[DeleteNodeModal.DATA_DELETE_CALLBACK] = function () {
        self.jsPlumbToolkit.removeNode(node);
        clearSelection(self);
    };
    Modal.show("delete_node_modal", data);
}
function onEditNode(self, nodeId) {
    let node = self.jsPlumbToolkit.getNode(nodeId);
    let data = {};
    data[EditNodeModal.DATA_NODE] = node.data;
    data[EditNodeModal.DATA_SAVE_CALLBACK] = function (newNodeData) {
        self.jsPlumbToolkit.updateNode(node, newNodeData);
        setSelection(self, node);
    };
    Modal.show("edit_node_modal", data);
}

/**
 * HACK ALERT
 * Work-around for some issues with using jsPlumbInstance.removePort.
 * Instead, remove the node completley, pull the port out, and add the
 * node and edges back. yeah, it's gross.
 * @param node
 * @param portId
 * @param self
 */
function removePort(node, portId, self) {
    let nodeData = node.data;
    let nodeEdges = node.getAllEdges();
    let edges = [];
    _.each(nodeEdges, function (nEdge) {
        if (nEdge.source.id !== portId) {
            let edge = {};
            edge[Graphs.EDGE_SOURCE] = nEdge.source.getNode().id + "." + nEdge.source.id;
            edge[Graphs.EDGE_TARGET] = nEdge.target.id;
            edges.push(edge);
        }
    });

    jsPlumb.batch(function () {
        self.jsPlumbToolkit.removeNode(node);
        nodeData[GraphUtils.OPTIONS] = _.reject(node.data[GraphUtils.OPTIONS], function (opt) {
            // Remove the port from the data
            return opt[GraphUtils.ID] === portId;
        });
        // add the node back
        self.jsPlumbToolkit.addNode(nodeData);
        // add the edges back
        _.each(edges, function (edge) {
            self.jsPlumbToolkit.addEdge(edge);
        });

    });
}

function loadFlowchart() {
    let self = Template.instance();
    let graph = self.graph.get();
    if (graph) {
        graph = layoutGraph(graph);
        self.jsplumbRenderer = self.jsPlumbToolkit.render(getJSPlumbOptions());
        self.jsPlumbToolkit.load({
            type: "json",
            data: {
                "nodes": graph[Graphs.NODES],
                "edges": graph[Graphs.EDGES]
            }
        });
        let node = self.jsPlumbToolkit.getNode(graph[Graphs.FIRST_NODE]);
        if (node) {
            setSelection(self, node);
            self.jsplumbRenderer.centerOnAndZoom(node, NODE_FILL);
        }
    }
}

function getJSPlumbInstance(self) {
    return jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data[GraphUtils.ID];
        },
        portExtractor: function (node) {
            return node[GraphUtils.OPTIONS] || [];
        },
        portFactory: function (params, data, callback) {
            params.node.data[GraphUtils.OPTIONS].push(data);
            callback(data);
        },
        edgeFactory: function (params, data, callback) {
            callback(data);
        }
    });
}

function getJSPlumbOptions() {
    let self = Template.instance();
    let events = {
        mousedown: function (params) {
            if (params.e.button == 0) {
                setSelection(self, params.node);
            }
        },
        dblclick: function (params) {
            self.jsplumbRenderer.centerOnAndZoom(params.node, NODE_FILL);
        }
    };
    return {
        container: self.find("#jsplumbContainer"),
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
                    endpoint: ["Dot", {radius: 12}],
                    connector: ["StateMachine", {cornerRadius: 5, stub: [10, 50], midpoint: 0.1}],
                    paintStyle: {
                        strokeWidth: 3,
                        stroke: "#0878CB"
                    },	//	paint style for this edge type.
                    hoverPaintStyle: {
                        strokeWidth: 8,
                        stroke: "#05518a"
                    }, // hover paint style for this edge type.
                    overlays: [["Arrow", {location: 1, width: 20, length: 25}]],
                    beforeDrop: function (p) {
                        // Make sure it's not a loopback connection and also
                        // that an option won't have more than 1 outgoing edge

                        let con = p.connection;
                        let sourceNodeId = con.source.getAttribute("data-parent-node");
                        let sourcePortId = con.source.getAttribute("data-port-id");
                        let sourceNode = self.jsPlumbToolkit.getNode(sourceNodeId);
                        let targetNodeId = p.targetId;

                        return sourceNodeId !== targetNodeId
                            && _.filter(sourceNode.getAllEdges(), function (edge) {
                                return edge != con.edge && edge.source.data.id === sourcePortId;
                            }).length == 0;
                    }
                }
            },
            ports: {
                "default": {
                    template: "option_tmpl",
                    edgeType: "default",
                    allowLoopback: false,
                    allowNodeLoopback: false
                }
            }
        },
        events: {
            portAdded: function (params) {
                let addOpt = params.nodeEl.querySelectorAll(".add-option")[0];
                params.nodeEl.querySelectorAll("ul")[0].insertBefore(params.portEl, addOpt);
            },
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