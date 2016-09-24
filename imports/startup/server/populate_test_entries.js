/**
 * Created by Phani on 9/15/2016.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getChart} from "/imports/api/charts/methods.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {Random} from "meteor/random";

let TEST_CHART = {
    _id: "testchart99999999",
    name: "Device Name",
    description: "A description of the device",
    owner: "wjQyQ6sGjzvNMDLiJ",
    graph: "testgraph99999999",
    type: "device"
};

let TEST_GRAPH = {
    _id: "testgraph99999999",
    owner: "wjQyQ6sGjzvNMDLiJ",
    nodes: [
        {
            _id: "somenode999999999",
            name: "Name for the node. For a question node, this should be the question",
            details: "Details for this node. Optional but non-nullable",
            resources: ["Array of associated resource URLs. URLs should be publicly accessible"],
            images: ["Array of associated image URLs. URLs should be publicly accessible"]
        },
        {
            _id: "someothernode9999",
            name: "Discard and replace batteries if they are leaking, rusted, corroding, or over two years old.",
            details: "",
            images: [
                "battery/imgs/battery_corroded.jpg"
            ]
        }
    ],
    "edges": [
        {
            _id: "someedge999999999",
            name: "test edge",
            details: "These are some random details about this edge",
            source: "somenode999999999",
            target: "someothernode9999"
        }

    ]
};

if (!getGraph.call(TEST_GRAPH[Graphs.GRAPH_ID])) {
    Graphs.Graphs.insert(TEST_GRAPH);
    console.log("Added TEST_GRAPH");
}
if (!getChart.call(TEST_CHART[Charts.CHART_ID])) {
    Charts.Charts.insert(TEST_CHART);
    console.log("Added TEST_CHART");
}
