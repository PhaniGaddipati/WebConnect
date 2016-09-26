/**
 * Created by Phani on 7/24/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Charts from "./charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import * as Comments from "/imports/api/comments/comments.js";
import {insertGraph, getGraph} from "../graphs/methods.js";

/**
 * Inserts a new chart into the database, given the name and description.
 * A graph is created and associated with the chart automatically.
 *
 * The unique _id of the chart is returned, or null on failure.
 */
export const insertNewChart = new ValidatedMethod({
    name: "charts.insertNewChart",
    validate: Charts.Charts.simpleSchema()
        .pick([Charts.NAME, Charts.DESCRIPTION])
        .validator({
            clean: true,
            filter: true
        }),
    run({name, description}){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("charts.insertNewChart.accessDenied",
                "A user must be logged in to insert a new Chart");
        }
        let graphId               = insertGraph.call();
        let chart                 = {};
        chart[Charts.OWNER]       = ownerId;
        chart[Charts.NAME]        = name;
        chart[Charts.DESCRIPTION] = description;
        chart[Charts.GRAPH_ID]    = graphId;

        return Charts.Charts.insert(chart);
    }
});

/**
 * Attempts to upsert a chart. If the chart doesn't exist in the DB,
 * it is inserted with a new ID. The chart owner must be the current
 * user. The result of the upsert operation is returned.
 */
export const upsertChart = new ValidatedMethod({
    name: "charts.upsertChart",
    validate: Charts.Charts.simpleSchema().validator({
        clean: true,
        filter: true
    }),
    run(chart){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("charts.upsertChart.accessDenied",
                "A user must be logged in to insert or update a Chart");
        }
        if (chart[Charts.OWNER] === ownerId) {
            return Charts.Charts.upsert(chart);
        } else {
            throw new Meteor.Error("charts.upsertChart.accessDenied",
                "The given Chart's owner does not match the current user");
        }
    }
});

/**
 * Returns an array of the current user's charts. An empty array
 * returned if either there is no user logged in or there are no charts.
 */
export const getCurrentUserCharts = new ValidatedMethod({
    name: "charts.currentUsersCharts",
    validate: function (obj) {
        // No arguments to validate
    },
    run(){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            return [];
        }
        return Charts.Charts.find({_id: ownerId}).fetch();
    }
});

/**
 * Returns all of the charts present in the catalog.
 */
export const getChartsInCatalog = new ValidatedMethod({
    name: "charts.chartsInCatalog",
    validate: function (obj) {
        // No arguments to validate
    },
    run(){
        // For now, all charts are in the catalog
        return Charts.Charts.find({}).fetch();
    }
});

/**
 * Gets a chart by ID.
 */
export const getChart = new ValidatedMethod({
    name: "charts.getChart",
    validate: function (obj) {
        // Nothing to validate
    },
    run(id){
        return Charts.Charts.findOne({_id: id});
    }
});

/**
 * Gets multiple charts by ID.
 */
export const getCharts = new ValidatedMethod({
    name: "charts.getCharts",
    validate: new SimpleSchema({
        ids: {
            type: [String]
        }
    }).validator(),
    run({ids:ids}){
        return Charts.Charts.find({
            _id: {
                $in: ids
            }
        }).fetch();
    }
});

/**
 * Gets the n most downloaded charts.
 */
export const findMostDownloadedCharts = new ValidatedMethod({
    name: "charts.findMostDownloadedCharts",
    validate: function (n) {
        check(n, Number);
    },
    run(n){
        let sortParam               = {};
        sortParam[Charts.DOWNLOADS] = -1;
        return Charts.Charts.find({},
            {
                sort: sortParam,
                limit: n
            }
        );
    }
});

export const incrementChartDownload = new ValidatedMethod({
    name: "charts.incrementChartDownload",
    validate: function (id) {
        // Nothing to validate
    },
    run(id){
        let incField               = {};
        incField[Charts.DOWNLOADS] = 1;
        let selector               = {};
        selector[Charts.CHART_ID]  = id;
        return Charts.Charts.update(selector, {
            $inc: incField
        });
    }
});

/**
 * Returns an array of all the resources found in the given chart by ID,
 * or null if the chart wasn't found. This includes all resources from
 * every graph node and comment.
 */
export const getAllChartResources = new ValidatedMethod({
    name: "charts.getAllChartResources",
    validate: function (id) {
        //Nothing to validate
    },
    run(id){
        let chart = Charts.Charts.findOne({_id: id});
        if (!chart) {
            return null;
        }
        let resList = [];
        let graph   = getGraph.call(chart[Charts.GRAPH_ID]);
        let cmnts   = [];

        cmnts = cmnts.concat(chart[Charts.COMMENTS]);
        _.each(graph[Graphs.NODES], function (node) {
            // Add all comments of nodes
            cmnts   = cmnts.concat(node[Graphs.NODE_COMMENTS]);
            // Add the node's resources
            resList = resList.concat(node[Graphs.NODE_IMAGES]);
            resList = resList.concat(node[Graphs.NODE_RESOURCES]);
        });
        _.each(cmnts, function (cmnt) {
            // Add the comment's attachments
            resList.push(cmnt[Comments.ATTACHMENT]);
        });
        return _.without(_.uniq(resList), null);
    }
});

/**
 * Updates a user's feedback on a chart as an upvote or a downvote.
 * If feedback is true, then any downvote is removed and an upvote is marked.
 *
 * Returns whether the operation was successful
 */
export const updateUserChartFeedback = new ValidatedMethod({
    name: "charts.updateUserChartFeedback",
    validate: new SimpleSchema({
        chartId: {
            type: SimpleSchema.RegEx.Id,
            optional: false
        },
        userId: {
            type: SimpleSchema.RegEx.Id,
            optional: false
        },
        feedback: {
            type: Boolean,
            optional: false
        }
    }).validator(),
    run({chartId:chartId, userId:userId, feedback:feedback}){
        let selector = {};
        let addToSet = {};
        let pop      = {};

        selector[Charts.CHART_ID]                                      = chartId;
        addToSet[feedback ? Charts.UPVOTED_IDS : Charts.DOWNVOTED_IDS] = userId;
        pop[feedback ? Charts.DOWNVOTED_IDS : Charts.UPVOTED_IDS]      = userId;

        return Charts.Charts.update({_id: chartId}, {
                $pop: pop,
                $addToSet: addToSet
            }) > 0;
    }
});