/**
 * Created by Phani on 9/14/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChartsInCatalog, getChart, getCharts, incrementChartDownload} from "/imports/api/charts/methods.js";
import * as Comments from "/imports/api/comments/comments.js";
import {insertComment, getComment, deleteComment} from "/imports/api/comments/methods.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";

const RESPONSE_STATUS         = "status";
const RESPONSE_MESSAGE        = "message";
const RESPONSE_DATA           = "data";
const RESPONSE_STATUS_SUCCESS = "success";
const RESPONSE_STATUS_ERROR   = "error";

RestAPI.addRoute("catalog", {
    /**
     * @api {get} /catalog Request Catalog
     * @apiName GetCatalog
     * @apiGroup Charts
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.flowcharts Flowcharts in the catalog.
     */
    get: function () {
        console.log("GET v1/catalog");
        let rawChartsInCatalog = getChartsInCatalog.call();

        // For each chart in the array, convert to REST format and omit the graph field
        let charts = _.map(rawChartsInCatalog, function (chart) {
            return _.omit(RESTUtils.formatChartForREST(chart), RESTUtils.FLOWCHART_GRAPH);
        });

        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
        response[RESPONSE_DATA]   = {
            flowcharts: charts
        };
        return response;
    }
});

/**
 * Returns a flowchart by id.
 */
RestAPI.addRoute("chart/:id", {
    /**
     * @api {get} /chart/:id Request a Chart
     * @apiName GetChart
     * @apiGroup Charts
     *
     * @apiParam {String} id Chart unique ID.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.flowchart Flowchart that was requested.
     * @apiError ChartNotFound The id of the Chart was not found
     */
    get: function () {
        let id = this.urlParams.id;
        console.log("GET chart/" + id);

        let chart = getChart.call(id);
        if (!chart) {
            let response               = {};
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "The given chart id wasn't found.";
            return {
                statusCode: 404,
                body: response
            };
        }
        // New chart download, increment download
        incrementChartDownload.call(id);
        chart = RESTUtils.formatChartForREST(chart);

        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
        response[RESPONSE_DATA]   = {
            flowchart: chart
        };
        return response;
    }
});

/**
 * Returns multiple flowcharts by id.
 */
RestAPI.addRoute("charts", {
    /**
     * @api {post} /charts Request multiple Charts
     * @apiName PostCharts
     * @apiGroup Charts
     *
     * @apiParam {String[]} ids Chart unique IDs.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.flowcharts Flowcharts that were requested.
     * @apiSuccess (200) {Object} data.bad_ids Flowchart IDs that were requested but not found.
     */
    post: function () {
        let ids = this.bodyParams.ids;
        console.log("POST charts/ with ids: " + ids);

        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;

        if (ids) {
            let charts   = getCharts.call({ids: ids});
            charts       = _.map(charts, function (chart) {
                // New chart download, increment download
                incrementChartDownload.call(chart[Charts.CHART_ID]);
                return RESTUtils.formatChartForREST(chart);
            });
            let good_ids = _.pluck(charts, Charts.CHART_ID);
            let bad_ids  = _.difference(ids, good_ids);

            response[RESPONSE_DATA] = {
                bad_ids: bad_ids,
                flowcharts: charts
            };
        } else {
            response[RESPONSE_DATA] = {
                bad_ids: [],
                flowcharts: []
            };
        }
        return response;
    }
});

RestAPI.addRoute("chart/:id/comment", {authRequired: true}, {
    /**
     * @api {post} /chart/:id/comment Post a comment on a Chart.
     * @apiName PostComment
     * @apiGroup Charts
     *
     * @apiHeader {String} X-Auth-Token The auth token for the user.
     * @apiHeader {String} X-User-Id The ID of the user posting the comment.
     *
     * @apiParam {String} text Comment text.
     * @apiParam {String} attachment URL of an attachment.
     * @apiParam {String} nodeId The id of the node to post to. Optional.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.comment Comment that was posted.
     * @apiError (401) PermissionDenied The user cannot perform this operation.
     */
    post: function () {
        let chartId = this.urlParams.id;
        let nodeId  = this.bodyParams.nodeId;
        console.log("POST chart/" + chartId + "/comment");

        let comment                  = {};
        comment[Comments.TEXT]       = this.bodyParams.text;
        comment[Comments.ATTACHMENT] = this.bodyParams.attachment;
        comment[Comments.OWNER]      = this.userId;

        let commentId = insertComment.call({comment: comment, chartId: chartId, nodeId: nodeId});
        let response  = {};
        if (commentId) {
            comment                   = getComment.call({chartId, commentId});
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                comment: comment
            };
            return response;
        } else {
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "You don't have permission to do this.";
            return {
                statusCode: 401,
                body: response
            };
        }
    },
    /**
     * @api {delete} /chart/:id/comment Delete a comment on a Chart.
     * @apiName PostComment
     * @apiGroup Charts
     *
     * @apiHeader {String} X-Auth-Token The auth token for the user.
     * @apiHeader {String} X-User-Id The ID of the user posting the comment.
     *
     * @apiParam {String} commentId ID of the comment to delete.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.flowchart The new flowchart object.
     * @apiError (401) PermissionDenied The user cannot perform this operation.
     */
    delete: function () {
        let chartId   = this.urlParams.id;
        let commentId = this.bodyParams.commentId;
        console.log("DELETE chart/" + chartId + "/comment: " + commentId);

        let comment = getComment.call({chartId, commentId});
        if (comment && comment[Comments.OWNER] == this.userId) {
            // Comment exists somewhere, try and delete it
            let res      = deleteComment.call({chartId: chartId, commentId: commentId});
            let response = {};

            if (res) {
                response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
                response[RESPONSE_DATA]   = {
                    flowchart: RESTUtils.formatChartForREST(getChart.call(chartId))
                };
                return response;
            }
        }
        // Comment doesn't exist
        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_ERROR;
        if (comment) {
            response[RESPONSE_MESSAGE] = "You don't have permission to do this.";
        } else {
            response[RESPONSE_MESSAGE] = "The given commentId doesn't exist in the chart.";
        }
        return {
            statusCode: 401,
            body: response
        };

    }
});
