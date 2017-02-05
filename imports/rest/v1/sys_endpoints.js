/**
 * Created by Phani on 9/28/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {validateGraph, getGraphWithoutLinks} from "/imports/api/graphs/methods.js";
import {getChart} from "/imports/api/charts/methods.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";
import {postFeedback} from "/imports/api/sys/methods.js";

const RESPONSE_STATUS         = "status";
const RESPONSE_MESSAGE        = "message";
const RESPONSE_DATA           = "data";
const RESPONSE_STATUS_SUCCESS = "success";
const RESPONSE_STATUS_ERROR   = "error";

RestAPI.addRoute("sys/graph/:id", {
    get: function () {
        let id = this.urlParams.id;
        console.log("GET sys/graph/" + id);
        let graph    = getGraphWithoutLinks.call(id);
        let response = {};
        if (!graph) {
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "Graph not found: " + id;
            return {
                statusCode: 404,
                body: response
            }
        } else {
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                graph: graph
            };
            return response;
        }
    }
});

RestAPI.addRoute("sys/graph/validate", {
    post: function () {
        let flowchart = this.bodyParams.flowchart;
        let graph     = this.bodyParams.graph;
        let response  = {};
        if ((!flowchart || flowchart[Charts.GRAPH_ID]) && !graph) {
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "Graph not provided";
            return {
                statusCode: 404,
                body: response
            }
        }
        if (!graph) {
            graph = flowchart[Charts.GRAPH_ID];
        }
        try {
            validateGraph.call(graph);
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                valid: valid,
                errors: []
            };
        } catch (err) {
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                valid: false,
                errors: err
            };
        }
        return response;
    }
});

RestAPI.addRoute("sys/feedback", {
    post: function () {
        let response = {};
        let userId   = this.bodyParams.userId;
        let text     = this.bodyParams.text;
        console.log("POST sys/feedback \"" + text + "\"");
        try {
            postFeedback.call({userId, text});
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {};
            return response;
        } catch (err) {
            console.log(err);
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "Failed to post feedback";
            return {
                statusCode: 400,
                body: response
            }
        }
    }
});

RestAPI.addRoute("sys/chart", {authRequired: true}, {
    post: function () {
        console.log("POST sys/chart");
        let chart    = this.bodyParams.flowchart;
        let response = {};
        if (chart && this.userId) {
            // Convert inline graph into separate objs
            // Override the owner to the admin
            let graph           = chart[Charts.GRAPH_ID];
            chart[Charts.OWNER] = this.userId;
            graph[Graphs.OWNER] = this.userId;

            if (graph[Graphs.GRAPH_ID]) {
                // ID given, check if it exists
                if (Graphs.Graphs.findOne({_id: graph[Graphs.GRAPH_ID]})) {
                    response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                    response[RESPONSE_MESSAGE] = "Graph with ID " + graph[Graphs.GRAPH_ID] + " already exists";
                    return {
                        statusCode: 400,
                        body: response
                    }
                }
            }

            try {
                validateGraph.call(graph);
            }
            catch (err) {
                //Failed :(
                response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                response[RESPONSE_MESSAGE] = error;
                return {
                    statusCode: 400,
                    body: response
                }
            }

            let graphId = Graphs.Graphs.insert(graph);
            if (graphId) {
                chart[Charts.GRAPH_ID] = graphId;
                let chartId            = Charts.Charts.insert(chart);
                if (chartId) {
                    // Success
                    response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
                    response[RESPONSE_DATA]   = {
                        flowchart: RESTUtils.formatChartForREST(getChart.call(chartId))
                    };
                    return response;
                } else {
                    response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                    response[RESPONSE_MESSAGE] = "Failed to insert the chart, but inserted the graph.";
                    return {
                        statusCode: 400,
                        body: response
                    }
                }
            } else {
                response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                response[RESPONSE_MESSAGE] = "Failed to insert the graph.";
                return {
                    statusCode: 400,
                    body: response
                }
            }
        }
        response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
        response[RESPONSE_MESSAGE] = "No flowchart was provided";
        return {
            statusCode: 400,
            body: response
        }
    }
});