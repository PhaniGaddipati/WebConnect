/**
 * Created by Phani on 9/14/2016.
 *
 * This file provides methods to ensure proper structure of
 * returned objects in the REST interface. This maps the mongo
 * objects into the REST format. It is mostly similar with some differences.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import * as Comments from "/imports/api/comments/comments.js";
import * as Users from "/imports/api/users/users.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {getAllChartResources} from "/imports/api/charts/methods";

/**
 * Names of the user REST json fields
 */
export const USER_ID           = "_id";
export const USER_EMAIL        = "email";
export const USER_NAME         = "name";
export const USER_COUNTRY_CODE = "countryCode";
export const USER_COUNTRY      = "country";
export const USER_ORGANIZATION = "organization";
export const USER_EXPERTISES   = "expertises";

/**
 * Names of the flowchart REST json fields.
 */
export const FLOWCHART_ID           = "_id";
export const FLOWCHART_NAME         = "name";
export const FLOWCHART_DESCRIPTION  = "description";
export const FLOWCHART_UPDATED_DATE = "updatedDate";
export const FLOWCHART_VERSION      = "version";
export const FLOWCHART_OWNER        = "owner";
export const FLOWCHART_GRAPH        = "graph";
export const FLOWCHART_ALL_RES      = "all_res";
export const FLOWCHART_COMMENTS     = "comments";
export const FLOWCHART_SCORE        = "score";
export const FLOWCHART_RESOURCES    = "resources";
export const FLOWCHART_IMAGE        = "image";
export const FLOWCHART_TYPE         = "type";

/**
 * Names of the graph REST json fields.
 */
export const GRAPH_NODES          = "vertices";
export const GRAPH_EDGES          = "edges";
export const GRAPH_FIRST_VERTEX   = "firstVertex";
export const GRAPH_NODE_ID        = "_id";
export const GRAPH_NODE_NAME      = "name";
export const GRAPH_NODE_DETAILS   = "details";
export const GRAPH_NODE_RESOURCES = "resources";
export const GRAPH_NODE_IMAGES    = "images";
export const GRAPH_NODE_COMMENTS  = "comments";
export const GRAPH_EDGE_ID        = "_id";
export const GRAPH_EDGE_NAME      = "_label";
export const GRAPH_EDGE_SOURCE    = "_outV";
export const GRAPH_EDGE_TARGET    = "_inV";
export const GRAPH_EDGE_DETAILS   = "details";

/**
 * Names of the comment REST json fields.
 */
export const COMMENT_ID           = "_id";
export const COMMENT_OWNER        = "owner";
export const COMMENT_OWNER_NAME   = "ownerName";
export const COMMENT_TEXT         = "text";
export const COMMENT_CREATED_DATE = "createdDate";
export const COMMENT_ATTACHMENT   = "attachment";


export const formatUserForREST = function (rawUser) {
    let user                = {};
    user[USER_ID]           = rawUser[Users.USER_ID];
    user[USER_EMAIL]        = rawUser[Users.EMAILS][0][Users.EMAIL_ADDRESS];
    user[USER_NAME]         = rawUser[Users.PROFILE][Users.PROFILE_NAME];
    user[USER_COUNTRY_CODE] = rawUser[Users.PROFILE][Users.PROFILE_COUNTRY][Users.COUNTRY_CODE];
    user[USER_COUNTRY]      = rawUser[Users.PROFILE][Users.PROFILE_COUNTRY][Users.COUNTRY_NAME];
    user[USER_ORGANIZATION] = rawUser[Users.PROFILE][Users.PROFILE_ORGANIZATION];
    user[USER_EXPERTISES]   = rawUser[Users.PROFILE][Users.PROFILE_EXPERTISES];
    return user;
};

/**
 * Converts the MongoDB representation of a chart into
 * what is used by the REST interface.
 * @param rawChart
 */
export const formatChartForREST = function (rawChart) {
    let chart                     = {};
    chart[FLOWCHART_ID]           = rawChart[Charts.CHART_ID];
    chart[FLOWCHART_NAME]         = rawChart[Charts.NAME];
    chart[FLOWCHART_DESCRIPTION]  = rawChart[Charts.DESCRIPTION];
    chart[FLOWCHART_UPDATED_DATE] = rawChart[Charts.UPDATED_DATE];
    chart[FLOWCHART_VERSION]      = rawChart[Charts.VERSION];
    chart[FLOWCHART_OWNER]        = rawChart[Charts.OWNER];
    chart[FLOWCHART_RESOURCES]    = rawChart[Charts.RESOURCES];
    chart[FLOWCHART_TYPE]         = rawChart[Charts.TYPE];
    chart[FLOWCHART_IMAGE]        = rawChart[Charts.IMAGE];
    chart[FLOWCHART_SCORE]        = computeScore(rawChart);
    chart[FLOWCHART_GRAPH]        = formatGraphForREST(getGraph.call(rawChart[Charts.GRAPH_ID]));
    chart[FLOWCHART_ALL_RES]      = getAllChartResources.call(rawChart[Charts.CHART_ID]);

    let sortedComments        = _.sortBy(rawChart[Charts.COMMENTS], function (cmnt) {
        return new Date(cmnt[Comments.CREATED_DATE]).getTime();
    }).reverse();
    chart[FLOWCHART_COMMENTS] = _.map(sortedComments, function (rawComment) {
            return formatCommentForREST(rawComment);
        }
    );

    if (!chart[FLOWCHART_IMAGE]) {
        chart[FLOWCHART_IMAGE] = null;
    }

    return chart;
};

/**
 * Converts the MongoDB representation of a graph into
 * what is used by the REST interface.
 * @param rawGraph
 */
export const formatGraphForREST = function (rawGraph) {
    let graph          = {};
    graph[GRAPH_NODES] = _.map(rawGraph[Graphs.NODES], function (rawNode) {
        return formatNodeForREST(rawNode);
    });
    graph[GRAPH_EDGES] = _.map(rawGraph[Graphs.EDGES], function (rawEdge) {
        return formatEdgeForREST(rawEdge);
    });

    graph[GRAPH_FIRST_VERTEX] = rawGraph[Graphs.FIRST_NODE];
    return graph;
};

/**
 * Computes the score of a chart as the percentage upvotes.
 * If no feedback exists, -1 is returned.
 * @param chart
 * @returns {*}
 */
function computeScore(chart) {
    let up   = chart[Charts.UPVOTED_IDS].length;
    let down = chart[Charts.DOWNVOTED_IDS].length;
    if (up == 0 && down == 0) {
        return -1;
    }
    return parseInt(100.0 * parseFloat(up) / parseFloat(up + down));
}

function formatNodeForREST(rawNode) {
    let node                   = {};
    node[GRAPH_NODE_ID]        = rawNode[Graphs.NODE_ID];
    node[GRAPH_NODE_NAME]      = rawNode[Graphs.NODE_NAME];
    node[GRAPH_NODE_DETAILS]   = rawNode[Graphs.NODE_DETAILS];
    node[GRAPH_NODE_RESOURCES] = rawNode[Graphs.NODE_RESOURCES];
    node[GRAPH_NODE_IMAGES]    = rawNode[Graphs.NODE_IMAGES];

    let sortedComments        = _.sortBy(rawNode[Graphs.NODE_COMMENTS], function (cmnt) {
        return new Date(cmnt[Comments.CREATED_DATE]).getTime();
    }).reverse();
    node[GRAPH_NODE_COMMENTS] = _.map(sortedComments, function (rawComment) {
        return formatCommentForREST(rawComment);
    });
    return node;
}

function formatEdgeForREST(rawEdge) {
    let edge                 = {};
    edge[GRAPH_EDGE_ID]      = rawEdge[Graphs.EDGE_ID];
    edge[GRAPH_EDGE_NAME]    = rawEdge[Graphs.EDGE_NAME];
    edge[GRAPH_EDGE_SOURCE]  = rawEdge[Graphs.EDGE_SOURCE];
    edge[GRAPH_EDGE_TARGET]  = rawEdge[Graphs.EDGE_TARGET];
    edge[GRAPH_EDGE_DETAILS] = rawEdge[Graphs.EDGE_DETAILS];
    return edge;
}

export const formatCommentForREST = function (rawComment) {
    let comment                   = {};
    comment[COMMENT_ID]           = rawComment[Comments.COMMENT_ID];
    comment[COMMENT_OWNER]        = rawComment[Comments.OWNER];
    comment[COMMENT_TEXT]         = rawComment[Comments.TEXT];
    comment[COMMENT_CREATED_DATE] = rawComment[Comments.CREATED_DATE];
    comment[COMMENT_ATTACHMENT]   = rawComment[Comments.ATTACHMENT];
    comment[COMMENT_OWNER_NAME]   = Users.Users.findOne({_id: rawComment[Comments.OWNER]})[Users.PROFILE][Users.PROFILE_NAME];
    if (!comment[COMMENT_ATTACHMENT]) {
        comment[COMMENT_ATTACHMENT] = null;
    }
    return comment;
};