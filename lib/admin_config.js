/**
 * Created by Phani on 7/23/2016.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";

// Collections need to be in a global scope for it to work
ChartCollection = Charts.Charts;
GraphCollection = Graphs.Graphs;

AdminConfig = {
    name: "Tech Connect",
    adminEmails: ["phanigaddipati@gmail.com"],
    collections: {
        ChartCollection: {},
        GraphCollection: {}
    }
};