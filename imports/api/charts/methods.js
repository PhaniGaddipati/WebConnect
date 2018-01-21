/**
 * Created by Phani on 7/24/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Charts from "./charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import * as Comments from "/imports/api/comments/comments.js";
import {getGraph, getGraphWithoutLinks, validateGraph} from "../graphs/methods.js";

/**
 * Returns the graph associated with the chart's currently editing graph.
 * Returns null if the chart wasn't found.
 */
export const getChartEditingGraphId = new ValidatedMethod({
    name: "getChartEditingGraph",
    validate: new SimpleSchema({
        chartId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({chartId: chartId}) {
        let chart = getChart.call(chartId);
        if (!chart) {
            return null;
        }
        let editingGraphId = chart[Charts.EDITING_GRAPH_ID];
        if (!editingGraphId) {
            // No editing graph yet
            // duplicate the publishing one and set it as the editing graph
            let graph = getGraph.call(chart[Charts.GRAPH_ID]);
            if (!graph) {
                // huh?
                console.error("Chart ID " + chart[Charts.CHART_ID] + " has graph ID " + chart[Charts.GRAPH_ID] + ", but it doesn't exist!");
                return null;
            }
            delete graph[Graphs.GRAPH_ID];

            // Chart owner will own the editing graph
            graph[Graphs.OWNER] = chart[Charts.OWNER];
            editingGraphId      = Graphs.Graphs.insert(graph);

            if (!editingGraphId) {
                // huh?
                console.error("Could insert editing graph for chart ID " + chart[Charts.CHART_ID] + "!");
                return null;
            }
            let set                      = {};
            set[Charts.EDITING_GRAPH_ID] = editingGraphId;

            Charts.Charts.update({_id: chart[Charts.CHART_ID]}, {$set: set});
        }
        // Now we have an editing graph
        return editingGraphId;
    }
});

/**
 * Updates the current editing graph of the chart if the user
 * is allowed to. The graph is validated before updating.
 * Returns the result of the update operation, or null on failure.
 */
export const updateChartEditingGraph = new ValidatedMethod({
    name: "updateChartEditingGraph",
    validate: function ({chartId: chartId, graph: graph}) {
        // First check to see if the graph is cool with the schema
        Graphs.Graphs.schema.graphSchema.validate(graph);

        // Now do our own integrity validation
        validateGraph.call(graph);
    },
    run({chartId: chartId, graph: graph}) {
        let chart = getChart.call(chartId);
        if (!chart) {
            return null;
        }
        if (!canCurrentUserEditChart.call({chartId: chartId})) {
            // No permission
            return null;
        }
        // Make sure no one is trying to edit the owner
        graph[Graphs.OWNER] = chart[Charts.OWNER];

        // ID can't change
        let graphId = graph[Graphs.GRAPH_ID];
        delete graph[Graphs.GRAPH_ID];

        // We good, update the graph
        // Bypass validation since it's already done, and SimpleSchema doesn't support whole-document updates
        // See https://github.com/aldeed/meteor-simple-schema/issues/175
        return Graphs.Graphs.update({_id: graphId}, graph, {bypassCollection2: true});
    }
});


/**
 * If there's an editing graph, publish it as the live graph.
 * This results in a new graphId and a null editingGraph.
 * Returns the result of the update or false if the chart isn't found
 * or it doesn't have an editingGraph.
 */
export const publishEditingGraph = new ValidatedMethod({
    name: "publishEditingGraph",
    validate: new SimpleSchema({
        chartId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        comments: {
            type: String
        },
        version: {
            type: String,
            optional: false,
            defaultValue: "1.0",
            regEx: /\d+(\.\d+)+/
        }
    }).validator(),
    run({chartId: chartId, comments: comments, version: version}) {
        let chart = getChart.call(chartId);
        if (!chart) {
            return false;
        }
        let editingGraphId = chart[Charts.EDITING_GRAPH_ID];
        let oldGraphId     = chart[Charts.GRAPH_ID];
        if (!editingGraphId) {
            return false;
        }

        if (!canCurrentUserEditChart.call({chartId: chartId})) {
            // Someone is up to no good...
            throw new Meteor.Error("charts.publishEditingGraph.accessDenied",
                "The current user is not allowed to do this.");
        }

        updateChartGraphWithHistory.call({
            chartId: chartId,
            graphId: editingGraphId,
            version: version,
            comments: comments
        });

        let mod = {
            $unset: {}
        };

        // Remove the editing graph
        mod["$unset"][Charts.EDITING_GRAPH_ID] = "";
        return Charts.Charts.update({_id: chartId}, mod);
    }
});

/**
 * Restores a previous graph by making it the new editing graph.
 * Any old editing graph is put into the history.
 */
export const restoreOldGraph = new ValidatedMethod({
    name: "restoreOldGraph",
    validate: new SimpleSchema({
        chartId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        oldGraphId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({chartId: chartId, oldGraphId: oldGraphId}) {
        let chart = getChart.call(chartId);
        if (!chart) {
            return false;
        }
        if (!canCurrentUserEditChart.call({chartId: chartId})) {
            // Someone is up to no good...
            throw new Meteor.Error("charts.restoreOldGraph.accessDenied",
                "The current user is not allowed to do this.");
        }

        let graphHist = _.findWhere(chart[Charts.GRAPH_HIST], {graphId: oldGraphId});
        if (!graphHist) {
            throw new Meteor.Error("charts.restoreOldGraph.accessDenied",
                "The old graph id wasn't found in the history.");
        }

        let editingGraphId = chart[Charts.EDITING_GRAPH_ID];

        let push = {};
        if (editingGraphId) {
            // push the currently editing graph to the history
            let hist                         = {};
            hist[Charts.GRAPH_HIST_VERSION]  = chart[Charts.VERSION];
            hist[Charts.GRAPH_HIST_GRAPH_ID] = editingGraphId;
            hist[Charts.GRAPH_HIST_COMMENTS] = "Editing graph before restoring version " + graphHist[Charts.GRAPH_HIST_VERSION];
            hist[Charts.GRAPH_HIST_USER_ID]  = Meteor.userId();
            hist[Charts.GRAPH_HIST_DATE]     = new Date();
            push[Charts.GRAPH_HIST]          = hist;
        }

        // Set the new graph Id and version
        let set                      = {};
        set[Charts.EDITING_GRAPH_ID] = oldGraphId;

        return Charts.Charts.update({_id: chartId}, {
            $push: push,
            $set: set
        });
    }
});

/**
 * Inserts a new chart into the database, given the name and description and graph
 *
 * The unique _id of the chart is returned, or null on failure.
 */
export const insertNewChart = new ValidatedMethod({
    name: "charts.insertNewChart",
    validate: Charts.Charts.simpleSchema()
        .pick([Charts.NAME, Charts.DESCRIPTION, Charts.GRAPH_ID])
        .validator({
            clean: true,
            filter: true
        }),
    run({name: name, description: description, graph: graphId}) {
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("charts.insertNewChart.accessDenied",
                "A user must be logged in to insert a new Chart");
        }
        let chart                 = {};
        chart[Charts.OWNER]       = ownerId;
        chart[Charts.NAME]        = name;
        chart[Charts.DESCRIPTION] = description;
        chart[Charts.GRAPH_ID]    = graphId;

        return Charts.Charts.insert(chart);
    }
});

/**
 * Checks to see if the current user can edit the given chart by ID.
 * Returns true if the current user can edit the chart, and false
 * if the user cannot edit the chart or the chart doesn't exist.
 */
export const canCurrentUserEditChart = new ValidatedMethod({
    name: "charts.canCurrentUserEditChart",
    validate: function () {
    },
    run({chartId: chartId}) {
        if (this.isSimulation) {
            return true;
        }
        let userId = Meteor.userId();
        if (!userId) {
            // No one is logged in
            return false;
        }
        let chart = getChart.call(chartId);
        if (!chart) {
            // Chart doesn't exist
            return false;
        }
        if (chart[Charts.DELETED]) {
            return false;
        }
        // Check if user is the owner or if they are in the editor list
        return chart[Charts.OWNER] == userId || _.contains((chart[Charts.EDITORS] || []), userId);
    }
});

/**
 * Checks if the current user is the owner of the given chart.
 * Returns false if the chart doesn't exist or they are not the owner.
 */
export const isCurrentUserChartOwner = new ValidatedMethod({
    name: "charts.isCurrentUserChartOwner",
    validate: function () {
    },
    run({chartId: chartId}) {
        let userId = Meteor.userId();
        if (!userId) {
            // No one is logged in
            return false;
        }
        let chart = getChart.call(chartId);
        if (!chart) {
            // Chart doesn't exist
            return false;
        }
        return chart[Charts.OWNER] == userId;
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
    run(chart) {
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("charts.upsertChart.accessDenied",
                "A user must be logged in to insert or update a Chart");
        }
        if (isCurrentUserChartOwner.call({chartId: chart[Charts.CHART_ID]})) {
            return Charts.Charts.upsert(chart);
        } else {
            throw new Meteor.Error("charts.upsertChart.accessDenied",
                "The given Chart's owner or editors does not match the current user");
        }
    }
});

/**
 * Updates the ID of the graph for the given chart by ID, and
 * stores the previous graph in the history.
 *
 * Returns null on update failure (due to permission or bad IDs) or the result
 * of Mongo.update
 */
export const updateChartGraphWithHistory = new ValidatedMethod({
    name: "charts.updateChartGraphWithHistory",
    validate: new SimpleSchema({
        chartId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        graphId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        version: {
            type: String,
            regEx: /\d+(\.\d+)+/
        },
        comments: {
            type: String,
            optional: true
        }
    }).validator(),
    run(params) {
        let userId = Meteor.userId();
        if (!userId) {
            return null;
        }
        let chart = Charts.Charts.findOne({_id: params.chartId});
        let graph = Graphs.Graphs.findOne({_id: params.graphId});
        if (!chart || !graph) {
            // bad chart or graph ID
            throw new Meteor.Error("charts.updateChartGraphWithHistory.badIds",
                "The supplied chart or graph ID were not found");
        }
        if (chart[Charts.DELETED]) {
            throw new Meteor.Error("charts.updateChartGraphWithHistory.deleted",
                "The supplied chart is marked deleted");
        }
        if (!canCurrentUserEditChart.call({chartId: chart[Charts.CHART_ID]})) {
            // Someone is up to no good...
            throw new Meteor.Error("charts.updateChartGraphWithHistory.accessDenied",
                "The current user is not allowed to do this.");
        }
        // Continue with the update
        let hist                         = {};
        hist[Charts.GRAPH_HIST_VERSION]  = chart[Charts.VERSION];
        hist[Charts.GRAPH_HIST_GRAPH_ID] = chart[Charts.GRAPH_ID];
        hist[Charts.GRAPH_HIST_COMMENTS] = params.comments;
        hist[Charts.GRAPH_HIST_USER_ID]  = userId;
        hist[Charts.GRAPH_HIST_DATE]     = new Date();
        // Add the history entry
        let
            push                         = {};
        push[Charts.GRAPH_HIST]          = hist;
        // Set the new graph Id and version
        let set                          = {};
        set[Charts.VERSION]              = params.version;
        set[Charts.GRAPH_ID]             = params.graphId;

        return Charts.Charts.update({_id: params.chartId}, {
            $push: push,
            $set: set
        });
    }
});

/**
 * Deletes a chart by ID by setting deleted to true.
 */
export const deleteChart = new ValidatedMethod({
    name: "charts.deleteChart",
    validate: new SimpleSchema({
        chartId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({chartId: chartId}) {
        if (this.isSimulation) {
            return true;
        }
        let chart = getChart.call(chartId);
        if (!chart) {
            throw new Meteor.Error("charts.deleteChart.chartNotFound",
                "The given Chart id wasn't found");
        }
        if (!isCurrentUserChartOwner.call({chartId: chart[Charts.CHART_ID]})) {
            throw new Meteor.Error("charts.deleteChart.accessDenied",
                "The given Chart's owner does not match the current user");
        }
        if (chart[Charts.IN_CATALOG]) {
            throw new Meteor.Error("charts.deleteChart.accessDenied",
                "The given Chart is in the catalog and cannot be deleted");
        }
        let set             = {};
        set[Charts.DELETED] = true;
        return Charts.Charts.update({_id: chartId}, {$set: set});
    }
});

/**
 * Finds the current user's charts. An empty array
 * returned if either there is no user logged in or there are no charts.
 */
export const findCurrentUserCharts = new ValidatedMethod({
    name: "charts.findCurrentUsersCharts",
    validate: function (obj) {
        // No arguments to validate
    },
    run() {
        let ownerId = Meteor.userId();
        if (!ownerId) {
            return [];
        }
        let sel             = {};
        sel[Charts.OWNER]   = ownerId;
        sel[Charts.DELETED] = {$ne: true};
        return Charts.Charts.find(sel);
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
    run() {
        return findCurrentUserCharts.run().fetch();
    }
});

/**
 * Finds all of the charts present in the catalog,
 * sorted by number of downloads.
 */
export const findChartsInCatalog = new ValidatedMethod({
    name: "charts.findChartsInCatalog",
    validate: function (obj) {
        // No arguments to validate
    },
    run() {
        let sel                     = {};
        sel[Charts.IN_CATALOG]      = true;
        sel[Charts.DELETED]         = {$ne: true};
        let sortParam               = {};
        sortParam[Charts.DOWNLOADS] = -1;
        return Charts.Charts.find(sel, {sort: sortParam});
    }
});

/**
 * Returns all of the charts present in the catalog,
 * sorted by number of downloads.
 */
export const getChartsInCatalog = new ValidatedMethod({
    name: "charts.chartsInCatalog",
    validate: function (obj) {
        // No arguments to validate
    },
    run() {
        return findChartsInCatalog.run().fetch();
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
    run(id) {
        let chart = Charts.Charts.findOne({_id: id});
        if (!chart || chart[Charts.DELETED]) {
            return null;
        }
        return chart;
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
    run({ids: ids}) {
        let sel              = {};
        sel[Charts.CHART_ID] = {$in: ids};
        sel[Charts.DELETED]  = {$ne: true};
        return Charts.Charts.find(sel).fetch();
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
    run(n) {
        let sel                     = {};
        sel[Charts.DELETED]         = {$ne: true};
        let sortParam               = {};
        sortParam[Charts.DOWNLOADS] = -1;
        return Charts.Charts.find(sel,
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
    run(id) {
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
    run(id) {
        let chart = Charts.Charts.findOne({_id: id});
        if (!chart) {
            return null;
        }
        let resList = [];
        let graph   = getGraphWithoutLinks.call(chart[Charts.GRAPH_ID]);
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
            if (cmnt[Comments.ATTACHMENT] != null) {
                resList.push(cmnt[Comments.ATTACHMENT]);
            }
        });
        if (chart[Charts.IMAGE] != null) {
            resList.push(chart[Charts.IMAGE]);
        }
        return _.without(_.uniq(resList), null);
    }
});

/**
 * Returns an array of all the user Ids found in the given chart by ID,
 * or null if the chart wasn't found. This includes all users from
 * every graph node and comment.
 */
export const getAllChartUsers = new ValidatedMethod({
    name: "charts.getAllChartUsers",
    validate: function (id) {
        //Nothing to validate
    },
    run(id) {
        let chart = Charts.Charts.findOne({_id: id});
        if (!chart) {
            return null;
        }
        let userList = [];
        let graph    = getGraphWithoutLinks.call(chart[Charts.GRAPH_ID]);
        let cmnts    = [];

        cmnts = cmnts.concat(chart[Charts.COMMENTS]);
        _.each(graph[Graphs.NODES], function (node) {
            // Add all comments of nodes
            cmnts = cmnts.concat(node[Graphs.NODE_COMMENTS]);
        });
        userList = _.pluck(cmnts, Comments.OWNER);
        userList.push(chart[Charts.OWNER]);
        return _.without(_.uniq(userList), null);
    }
});

/**
 * Updates a particular chart's description
 */
export const updateChartDescription = new ValidatedMethod({
    name: "charts.updateChartDescription",
    validate: new SimpleSchema({
        chartId: {
            type: SimpleSchema.RegEx.Id,
            optional: false
        },
        description: {
            type: String,
            optional: false
        }
    }).validator(),
    run({chartId: chartId, description: description}) {
        let set                 = {};
        set[Charts.DESCRIPTION] = description;
        if (canCurrentUserEditChart.call({chartId: chartId})) {
            Charts.Charts.update({_id: chartId}, {
                $set: set
            });
            return true;
        } else {
            throw new Meteor.Error("charts.updateChartDescription.accessDenied",
                "The given Chart's owner or editors does not match the current user");
        }
    }
});

/**
 * Updates a user's feedback on a chart as an upvote or a downvote.
 * If feedback is true, then any downvote is removed and an upvote is marked.
 * If clear (optional) is true, then any feedback by the user is removed. In this
 * case, feedback is ignored.
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
        },
        clear: {
            type: Boolean,
            optional: true
        }
    }).validator(),
    run({chartId: chartId, userId: userId, feedback: feedback, clear: clear}) {
        let addToSet = {};
        let pop      = {};

        if (clear) {
            pop[Charts.DOWNVOTED_IDS] = userId;
            pop[Charts.UPVOTED_IDS]   = userId;
            Charts.Charts.update({_id: chartId}, {
                $pop: pop
            });
            return true;
        } else {
            addToSet[feedback ? Charts.UPVOTED_IDS : Charts.DOWNVOTED_IDS] = userId;
            pop[feedback ? Charts.DOWNVOTED_IDS : Charts.UPVOTED_IDS]      = userId;

            let sel              = {};
            sel[Charts.DELETED]  = {$ne: true};
            sel[Charts.CHART_ID] = chartId;
            return Charts.Charts.update(sel, {
                $pop: pop,
                $addToSet: addToSet
            }) > 0;
        }
    }
});