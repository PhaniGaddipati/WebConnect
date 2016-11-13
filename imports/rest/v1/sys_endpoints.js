/**
 * Created by Phani on 9/28/2016.
 */

import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getChart} from "/imports/api/charts/methods.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";
import {postFeedback} from "/imports/api/sys/methods.js";

const RESPONSE_STATUS         = "status";
const RESPONSE_MESSAGE        = "message";
const RESPONSE_DATA           = "data";
const RESPONSE_STATUS_SUCCESS = "success";
const RESPONSE_STATUS_ERROR   = "error";

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
        let chart    = this.bodyParams.flowchart;
        let response = {};
        if (chart && this.userId) {
            // Convert inline graph into separate objs
            // Override the owner to the admin
            let graph           = chart[Charts.GRAPH_ID];
            chart[Charts.OWNER] = this.userId;
            graph[Graphs.OWNER] = this.userId;

            graph._id = null;
            chart._id = null;

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