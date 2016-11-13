/**
 * Created by Phani on 7/23/2016.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import * as Sys from "/imports/api/sys/sys.js";

// Collections need to be in a global scope for it to work
ChartCollection = Charts.Charts;
GraphCollection = Graphs.Graphs;
SysCollection   = Sys.Sys;

AdminConfig = {
    name: "Tech Connect",
    adminEmails: ["phanigaddipati@gmail.com", "dwalste1@jhu.edu"],
    collections: {
        ChartCollection: {
            tableColumns: [
                {label: "ID", name: "_id"},
                {label: "Name", name: Charts.NAME},
                {label: "Description", name: Charts.DESCRIPTION},
                {label: "Created", name: Charts.CREATED_DATE}
            ]
        },
        GraphCollection: {},
        SysCollection: {
            tableColumns: [
                {label: "ID", name: "_id"},
                {label: "userId", name: Sys.SYS_FEEDBACK + "." + Sys.FEEDBACK_USER_ID},
                {label: "Text", name: Sys.SYS_FEEDBACK + "." + Sys.FEEDBACK_TEXT},
                {label: "Created", name: Sys.SYS_FEEDBACK + "." + Sys.FEEDBACK_DATE}
            ]
        }
    }
};