import * as Graphs from "/imports/api/graphs/graphs.js";
import {insertNewChart} from "/imports/api/charts/methods.js";
import {insertGraph} from "/imports/api/graphs/methods.js";
import {Random} from "meteor/random";

export const createNewGuide = new ValidatedMethod({
    name: "misc.createNewGuide",
    validate: new SimpleSchema({
        name: {
            type: String,
            min: 4,
            regEx: /^[A-Z a-z0-9]+$/
        },
        description: {
            type: String
        }
    }).validator(),
    run({name: name, description: description}) {
        let firstNode  = {};
        let midNode    = {};
        let lastNode   = {};
        let firstEdge  = {};
        let secondEdge = {};

        firstNode[Graphs.NODE_ID]      = Random.id();
        firstNode[Graphs.NODE_NAME]    = "First Step";
        firstNode[Graphs.NODE_DETAILS] = "The user will see this step first.";
        midNode[Graphs.NODE_ID]        = Random.id();
        midNode[Graphs.NODE_NAME]      = "Next Step";
        midNode[Graphs.NODE_DETAILS]   = "The user will see this after pressing Next.";
        lastNode[Graphs.NODE_ID]       = Random.id();
        lastNode[Graphs.NODE_NAME]     = "Done";
        firstEdge[Graphs.EDGE_ID]      = Random.id();
        firstEdge[Graphs.EDGE_NAME]    = "Next";
        firstEdge[Graphs.EDGE_SOURCE]  = firstNode[Graphs.NODE_ID];
        firstEdge[Graphs.EDGE_TARGET]  = midNode[Graphs.NODE_ID];
        secondEdge[Graphs.EDGE_ID]     = Random.id();
        secondEdge[Graphs.EDGE_NAME]   = "Next";
        secondEdge[Graphs.EDGE_SOURCE] = midNode[Graphs.NODE_ID];
        secondEdge[Graphs.EDGE_TARGET] = lastNode[Graphs.NODE_ID];

        let graph                = {};
        graph[Graphs.NODES]      = [firstNode, midNode, lastNode];
        graph[Graphs.EDGES]      = [firstEdge, secondEdge];
        graph[Graphs.FIRST_NODE] = firstNode[Graphs.NODE_ID];
        graph[Graphs.OWNER]      = Meteor.userId();

        let graphId = insertGraph.call(graph);
        return insertNewChart.call({name: name, description: description, graph: graphId});
    }
});


