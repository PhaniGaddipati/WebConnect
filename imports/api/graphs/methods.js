/**
 * Created by Phani on 7/24/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {ValidationError} from "meteor/mdg:validation-error";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Graphs from "./graphs.js";
import * as Charts from "/imports/api/charts/charts.js";

export const NODE_MAP_NODE       = "node";
export const NODE_MAP_INCOMING_EDGES = "incomingEdges";
export const NODE_MAP_OUTGOING_EDGES = "outgoingEdges";
export const NODE_MAP_IS_VIRTUAL = "isVirtual";

/**
 * Checks that a graph is well formed. This includes:
 *    1) edges point to existing nodes
 *    2) objects match schema
 *    3) every node, except for the first node or terminating nodes, is a target of at least 1 edge
 *
 * Returns true on successful validation, or throws a ValidationError on failure
 */
export const validateGraph = new ValidatedMethod({
    name: "graphs.validateGraph",
    validate: function (g) {
        let errors = [];
        try {
            let gId = g[Graphs.GRAPH_ID];
            if (!gId) {
                errors.push({
                    name: Graphs.GRAPH_ID,
                    type: "missing-field"
                });
            }
            if (!g[Graphs.NODES]) {
                errors.push({
                    name: Graphs.NODES,
                    type: "missing-field",
                    message: "The graph's nodes field is missing"
                });
            } else {
                let nodeSchemaContext = Graphs.Graphs.schema.nodeSchema.newContext();
                _.each(g[Graphs.NODES], function (node) {
                    let cleanedNode = Graphs.Graphs.schema.nodeSchema.clean(node);
                    if (!nodeSchemaContext.validate(cleanedNode)) {
                        errors.push({
                            name: Graphs.NODES,
                            type: "invalid-node",
                            source: node[Graphs.NODE_ID],
                            value: cleanedNode
                        });
                    }
                });
            }
            if (!g[Graphs.EDGES]) {
                errors.push({
                    name: Graphs.EDGES,
                    type: "missing-field",
                    message: "The graph's edges field is missing"
                });
            } else {
                let edgeSchemaContext = Graphs.Graphs.schema.edgeSchema;
                _.each(g[Graphs.EDGES], function (edge) {
                    let cleanedEdge = Graphs.Graphs.schema.edgeSchema.clean(edge);
                    if (!edgeSchemaContext.newContext().validate(cleanedEdge)) {
                        errors.push({
                            name: Graphs.EDGES,
                            type: "invalid-edge",
                            source: edge[Graphs.EDGE_ID],
                            value: cleanedEdge
                        });
                    }
                });
            }
            if (!g[Graphs.FIRST_NODE]) {
                errors.push({
                    name: Graphs.FIRST_NODE,
                    type: "missing-field",
                    message: "The graph's firstNode field is missing"
                });
            }

            if (errors.length == 0) {
                // Check edges only if the rest is good
                let nodeMap = {}; // Map of existing nodes
                _.each(g[Graphs.NODES], function (node) {
                    nodeMap[node[Graphs.NODE_ID]] = true;
                });
                if (!nodeMap[g[Graphs.FIRST_NODE]]) {
                    errors.push({
                        name: Graphs.FIRST_NODE,
                        type: "missing-node",
                        value: g[Graphs.FIRST_NODE],
                        message: "The graph's firstNode does not exist"
                    });
                }
                _.each(g[Graphs.EDGES], function (edge) {
                    if (!nodeMap[edge[Graphs.EDGE_SOURCE]]) {
                        errors.push({
                            name: Graphs.EDGE_SOURCE,
                            type: "missing-node",
                            source: edge[Graphs.EDGE_ID],
                            value: edge[Graphs.EDGE_SOURCE],
                            message: "Edge source is missing"
                        });
                    }
                    if (!nodeMap[edge[Graphs.EDGE_TARGET]]) {
                        errors.push({
                            name: Graphs.EDGE_TARGET,
                            type: "missing-node",
                            source: edge[Graphs.EDGE_ID],
                            value: edge[Graphs.EDGE_TARGET],
                            message: "Edge target is missing"
                        });
                    }
                });

                // Now we check #3, that every node has an incoming edge
                let nodeEdgeMap = getNodeEdgeMap(g);
                _.each(g[Graphs.NODES], function (node) {
                    // Don't check the first node
                    if (node[Graphs.NODE_ID] !== g[Graphs.FIRST_NODE]) {
                        if (nodeEdgeMap[node[Graphs.NODE_ID]][NODE_MAP_INCOMING_EDGES].length < 1) {
                            // This node doesn't have an incoming edge
                            errors.push({
                                name: Graphs.EDGE_SOURCE,
                                type: "unreferenced-node",
                                source: node[Graphs.NODE_ID],
                                message: "Node does not have any incoming edges"
                            });
                        }
                    }
                });
            }
        } catch (err) {
            errors.push({
                name: "unknown",
                type: "unknown",
                value: err,
                message: "An unknown error occured during validation"
            });
        }
        if (errors.length > 0) {
            throw new ValidationError(errors);
        }
    },
    run(g){
        return true;
    }
});

/**
 * Inserts a new graph into the database, given the owner id
 *
 * The unique _id of the graph is returned, or null on failure.
 */
export const insertGraph = new ValidatedMethod({
    name: "graphs.insert",
    validate: function (obj) {
        // No arguments to validate
    },
    run(){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("graphs.insert.accessDenied",
                "A user must be logged in to insert a new Graph");
        }
        let graph = {};
        graph[Graphs.OWNER] = ownerId;
        return Graphs.Graphs.insert(graph);
    }
});

export const getGraph = new ValidatedMethod({
    name: "graphs.getGraph",
    validate: function (id) {
        // Nothing to validate
    },
    run(id){
        return Graphs.Graphs.findOne({_id: id});
    }
});

/**
 * Finds a graph and looks for any virtual nodes.
 * If there are any, it is replaced with the subgraph.
 * Any terminations of the linked subgraph points back to the
 * virtual node's child.
 */
export const getGraphWithoutLinks = new ValidatedMethod({
    name: "graphs.getGraphWithoutLinks",
    validate: function (id) {
        // Nothing to validate
    },
    run(id){
        let graph = Graphs.Graphs.findOne({_id: id});
        if (!graph) {
            // graph wasn't found
            return null;
        }

        // Make map of node to incoming and outgoing edges
        let nodeMap = getNodeEdgeMap(graph);

        // Go through the graph and find any virtual nodes,
        // which is indicated by a node with a graphId field
        // For each virtual node, insert the subgraph SG by
        // making all incoming edges point to SG.firstNode
        // SG.lastNode points to where the virtual node's
        // outgoing edge points. There should only be 1 outgoing edge

        let nodesToDelete = {};
        let newNodes = [];
        let newEdges = [];
        _.each(graph[Graphs.NODES], function (vNode) {
            if (vNode[Graphs.NODE_CHART_ID]) {
                // Virtual node found
                let bypass = false;
                if (nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges.length < 1) {
                    console.warn("Virtual node " + vNode[Graphs.NODE_ID] + " of graph " + graph[Graphs.GRAPH_ID] +
                        "contains " + nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges.length + " outgoing edges. Expected 1. " +
                        "Bypassing this virtual node.");
                    bypass = true;
                } else {
                    let vNodeOutEdges = nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges;
                    let subChartId = vNode[Graphs.NODE_CHART_ID];
                    let subGraphId = Charts.Charts.findOne({_id: subChartId})[Charts.GRAPH_ID];
                    let subGraph   = getGraphWithoutLinks.call(subGraphId);

                    if (!subGraph) {
                        // Couldn't find subgraph. Ignore it by skipping the virtual node
                        console.warn("Couldn't find virtual node " + vNode[Graphs.NODE_ID] + " graph " + subGraphId + ". " +
                            "Bypassing this virtual node.");
                        bypass = true;
                    } else {
                        // vNode's incoming edges points to firstNode of subgraph
                        _.each(nodeMap[vNode[Graphs.NODE_ID]][NODE_MAP_INCOMING_EDGES], function (edge) {
                            edge[Graphs.EDGE_TARGET] = subGraph[Graphs.FIRST_NODE];
                            newEdges.push(edge);
                        });

                        // Find all terminations of subGraph and set it to vNode's target
                        let sgNodeMap = getNodeEdgeMap(subGraph);
                        _.each(subGraph[Graphs.EDGES], function (sgEdge) {
                            if (sgNodeMap[sgEdge[Graphs.EDGE_TARGET]][NODE_MAP_OUTGOING_EDGES].length == 0) {
                                // This leaf node is no longer needed
                                nodesToDelete[sgEdge[Graphs.EDGE_TARGET]] = true;
                                // Terminating edge, link to outgoing edges of the virtual node
                                _.each(vNodeOutEdges, function (outEdge) {
                                    // Make a new edge incase there's more than 1 terminating node
                                    let edge                 = outEdge;
                                    edge[Graphs.EDGE_SOURCE] = sgEdge[Graphs.EDGE_SOURCE];
                                    newEdges.push(edge);
                                });
                            } else {
                                newEdges.push(sgEdge);
                            }
                        });

                        // Add subgraph nodes and edges
                        let nodesToAdd = _.reject(subGraph[Graphs.NODES], function (node) {
                            return nodesToDelete[node[Graphs.NODE_ID]];
                        });
                        newNodes = newNodes.concat(nodesToAdd);
                    }
                }
                if (bypass) {
                    // Set virtual node's incoming edges to point to it's outgoing edge, if it has one.
                    // If it has more than 1, point to the first.
                    if (nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges.length > 0) {
                        let outgoingEdgeTarget = nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges[0][Graphs.EDGE_TARGET];
                        _.each(nodeMap[vNode[Graphs.NODE_ID]].incomingEdges, function (edge) {
                            edge[Graphs.EDGE_TARGET] = outgoingEdgeTarget;
                        });
                    }
                }
            } else {
                newNodes.push(vNode);
                // Add the edges that don't point/start from a virtual node
                newEdges = newEdges.concat(_.reject(nodeMap[vNode[Graphs.NODE_ID]].incomingEdges, function (edge) {
                    return nodeMap[edge[Graphs.EDGE_SOURCE]] && nodeMap[edge[Graphs.EDGE_SOURCE]][NODE_MAP_IS_VIRTUAL];
                }));
                newEdges = newEdges.concat(_.reject(nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges, function (edge) {
                    return nodeMap[edge[Graphs.EDGE_TARGET]] && nodeMap[edge[Graphs.EDGE_TARGET]][NODE_MAP_IS_VIRTUAL];
                }));
            }
        });

        // Add in all of the subgraph nodes and edges. Make sure duplicate IDs are deleted
        graph[Graphs.NODES] = _.uniq(newNodes, false, function (node) {
            return node[Graphs.NODE_ID]
        });
        graph[Graphs.EDGES] = _.uniq(newEdges, false, function (edge) {
            return edge[Graphs.EDGE_ID]
        });

        return graph;
    }
});

/**
 * Creates a map mapping node id to arrays of
 * incomingEdges, outgoingEdges, and the node. isVirtual marks
 * if the node is a virtual node.
 * @param graph
 * @returns {{}}
 */
export const getNodeEdgeMap = function (graph) {
    let nodeMap = {};
    _.each(graph[Graphs.NODES], function (node) {
        nodeMap[node[Graphs.NODE_ID]] = {
            incomingEdges: [],
            outgoingEdges: [],
            isVirtual: node[Graphs.NODE_CHART_ID] != null,
            node: node
        }
    });
    _.each(graph[Graphs.EDGES], function (edge) {
        if (nodeMap[edge[Graphs.EDGE_SOURCE]]) {
            nodeMap[edge[Graphs.EDGE_SOURCE]][NODE_MAP_OUTGOING_EDGES].push(edge);
        } else {
            console.warn("Couldn't find source node " + edge[Graphs.EDGE_SOURCE] + " for graph " + graph[Graphs.GRAPH_ID]);
        }
        if (nodeMap[edge[Graphs.EDGE_TARGET]]) {
            nodeMap[edge[Graphs.EDGE_TARGET]][NODE_MAP_INCOMING_EDGES].push(edge);
        } else {
            console.warn("Couldn't find target node " + edge[Graphs.EDGE_TARGET] + " for graph " + graph[Graphs.GRAPH_ID]);
        }
    });
    return nodeMap;
};

/**
 * Attempts to upsert a graph. If the graph doesn't exist in the DB,
 * it is inserted with a new ID. The graph owner must be the current
 * user. The result of the upsert operation is returned.
 */
export const upsertGraph = new ValidatedMethod({
    name: "graphs.upsertGraph",
    validate: Graphs.Graphs.simpleSchema().validator({
        clean: true,
        filter: true
    }),
    run(graph){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("graphs.upsertGraph.accessDenied",
                "A user must be logged in to insert or update a Graph");
        }
        if (graph[Graphs.OWNER] === ownerId) {
            return Graphs.Graphs.upsert(graph);
        } else {
            throw new Meteor.Error("graphs.upsertGraph.accessDenied",
                "The given Graph's owner does not match the current user");
        }
    }
});
