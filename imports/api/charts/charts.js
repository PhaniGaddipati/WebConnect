/**
 * Created by Phani on 7/24/2016.
 */
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Comments} from "/imports/api/comments/comments.js";

// Constants for document field names
export const CHART_ID            = "_id";
export const OWNER               = "owner";
export const NAME                = "name";
export const DESCRIPTION         = "description";
export const CREATED_DATE        = "createdDate";
export const UPDATED_DATE        = "updatedDate";
export const VERSION             = "version";
export const UPVOTED_IDS         = "upvoted";
export const DOWNVOTED_IDS       = "downvoted";
export const DOWNLOADS           = "downloads";
export const GRAPH_ID            = "graph";
export const GRAPH_HIST          = "graphHist";
export const GRAPH_HIST_VERSION  = "version";
export const GRAPH_HIST_GRAPH_ID = "graphId";
export const GRAPH_HIST_COMMENTS = "comments";
export const GRAPH_HIST_USER_ID  = "userId";
export const COMMENTS            = "comments";
export const RESOURCES           = "resources";
export const IMAGE               = "image";
export const IN_CATALOG          = "inCatalog";

export const TYPE         = "type";
export const TYPE_MISC    = "misc";
export const TYPE_DEVICE  = "device";
export const TYPE_PROBLEM = "problem";

export const Charts = new Mongo.Collection("charts");

// Set up index for chart search
if (Meteor.isServer) {
    Charts._ensureIndex({
        "name": "text",
        "description": "text"
    });
}

// Deny all client updates, everything going to be done through methods
Charts.deny({
    insert(){
        return true;
    },
    remove(){
        return true;
    },
    update(){
        return true;
    }
});

Charts.graphHistSchema = new SimpleSchema({
    version: {
        type: String,
        optional: false,
        regEx: /\d+(\.\d+)+/
    },
    graph: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Id
    },
    date: {
        type: Date,
        optional: false,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        }
    },
    comments: {
        type: String,
        optional: false,
        defaultValue: ""
    },
    userId: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Id
    }
});

Charts.schema = new SimpleSchema({
    owner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: false
    },
    name: {
        type: String,
        optional: false
    },
    description: {
        type: String,
        optional: false
    },
    createdDate: {
        type: Date,
        optional: false,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        }
    },
    updatedDate: {
        type: Date,
        optional: false,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            }
        }
    },
    version: {
        type: String,
        optional: false,
        defaultValue: "1.0",
        regEx: /\d+(\.\d+)+/
    },
    upvoted: {
        type: [String],
        label: "Upvoted user Ids",
        optional: false,
        defaultValue: [],
    },
    downvoted: {
        type: [String],
        label: "Downvoted user Ids",
        optional: false,
        defaultValue: [],
    },
    downloads: {
        type: Number,
        optional: false,
        defaultValue: 0
    },
    graph: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Id
    },
    graphHist: {
        type: [Charts.graphHistSchema],
        optional: false,
        defaultValue: []
    },
    comments: {
        type: [Comments.schema],
        optional: false,
        defaultValue: []
    },
    type: {
        type: String,
        allowedValues: [TYPE_MISC, TYPE_DEVICE, TYPE_PROBLEM],
        optional: false,
        defaultValue: TYPE_MISC
    },
    image: {
        type: String,
        optional: true
    },
    resources: {
        type: [String],
        optional: false,
        defaultValue: []
    },
    inCatalog: {
        type: Boolean,
        optional: false,
        defaultValue: false
    }
});

Charts.attachSchema(Charts.schema);