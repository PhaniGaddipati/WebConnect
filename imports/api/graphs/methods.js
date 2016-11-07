/**
 * Created by Phani on 7/24/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Graphs from "./graphs.js";

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
        let graph           = {};
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
        let nodeMap = makeNodeMap(graph);

        // Go through the graph and find any virtual nodes,
        // which is indicated by a node with a graphId field
        // For each virtual node, insert the subgraph SG by
        // making all incoming edges point to SG.firstNode
        // SG.lastNode points to where the virtual node's
        // outgoing edge points. There should only be 1 outgoing edge

        let nodesToDelete = {};
        let newNodes      = [];
        let newEdges      = [];
        _.each(graph[Graphs.NODES], function (vNode) {
            if (vNode[Graphs.NODE_GRAPH_ID]) {
                // Virtual node found
                let bypass = false;
                if (nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges.length != 1) {
                    console.warn("Virtual node " + vNode[Graphs.NODE_ID] + " of graph " + graph[Graphs.GRAPH_ID] +
                        "contains " + nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges.length + " outgoing edges. Expected 1. " +
                        "Bypassing this virtual node.");
                    bypass = true;
                } else {
                    let vNodeOutTarget = nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges[0][Graphs.EDGE_TARGET];
                    let subGraphId     = vNode[Graphs.NODE_GRAPH_ID];
                    let subGraph       = getGraphWithoutLinks.call(subGraphId);

                    if (!subGraph) {
                        // Couldn't find subgraph. Ignore it by skipping the virtual node
                        console.warn("Couldn't find virtual node " + vNode[Graphs.NODE_ID] + " graph " + subGraphId + ". " +
                            "Bypassing this virtual node.");
                        bypass = true;
                    } else {
                        // Find all terminations of subGraph and set it to vNode's target
                        let sgNodeMap = makeNodeMap(subGraph);
                        _.each(subGraph[Graphs.EDGES], function (sgEdge) {
                            if (sgNodeMap[sgEdge[Graphs.EDGE_TARGET]].outgoingEdges.length == 0) {
                                // This terminating node is no longer needed
                                nodesToDelete[sgEdge[Graphs.EDGE_TARGET]] = true;
                                // Terminating edge, link back to parent graph
                                sgEdge[Graphs.EDGE_TARGET]                = vNodeOutTarget;
                            }
                            newEdges.push(sgEdge);
                        });
                        // vNode's incoming edges points to firstNode of subgraph
                        _.each(nodeMap[vNode[Graphs.NODE_ID]].incomingEdges, function (edge) {
                            edge[Graphs.EDGE_TARGET] = subGraph[Graphs.FIRST_NODE];
                            newEdges.push(edge);
                        });

                        // Add subgraph nodes and edges
                        let nodesToAdd = _.reject(subGraph[Graphs.NODES], function (node) {
                            return nodesToDelete[node[Graphs.NODE_ID]];
                        });
                        newNodes       = newNodes.concat(nodesToAdd);
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
                    return nodeMap[edge[Graphs.EDGE_SOURCE]].isVirtual;
                }));
                newEdges = newEdges.concat(_.reject(nodeMap[vNode[Graphs.NODE_ID]].outgoingEdges, function (edge) {
                    return nodeMap[edge[Graphs.EDGE_TARGET]].isVirtual;
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

function makeNodeMap(graph) {
    let nodeMap = {};
    _.each(graph[Graphs.NODES], function (node) {
        nodeMap[node[Graphs.NODE_ID]] = {
            incomingEdges: [],
            outgoingEdges: [],
            isVirtual: node[Graphs.NODE_GRAPH_ID] != null
        }
    });
    _.each(graph[Graphs.EDGES], function (edge) {
        if (nodeMap[edge[Graphs.EDGE_SOURCE]]) {
            nodeMap[edge[Graphs.EDGE_SOURCE]].outgoingEdges.push(edge);
        } else {
            console.warn("Couldn't find source node " + edge[Graphs.EDGE_SOURCE] + " for graph " + graph[Graphs.GRAPH_ID]);
        }
        if (nodeMap[edge[Graphs.EDGE_TARGET]]) {
            nodeMap[edge[Graphs.EDGE_TARGET]].incomingEdges.push(edge);
        } else {
            console.warn("Couldn't find target node " + edge[Graphs.EDGE_TARGET] + " for graph " + graph[Graphs.GRAPH_ID]);
        }
    });
    return nodeMap;
}

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
