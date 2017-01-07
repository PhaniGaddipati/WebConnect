/**
 * Created by Phani on 7/24/2016.
 */
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Random} from "meteor/random";
import {Comments} from "/imports/api/comments/comments.js";

// Constants for document field names
export const GRAPH_ID       = "_id";
export const NODES          = "nodes";
export const EDGES          = "edges";
export const OWNER          = "owner";
export const FIRST_NODE     = "firstNode";
export const NODE_ID        = "_id";
export const NODE_CHART_ID = "chartId";
export const NODE_NAME      = "name";
export const NODE_DETAILS   = "details";
export const NODE_RESOURCES = "resources";
export const NODE_IMAGES    = "images";
export const NODE_COMMENTS  = "comments";
export const EDGE_ID        = "_id";
export const EDGE_NAME      = "name";
export const EDGE_SOURCE    = "source";
export const EDGE_TARGET    = "target";
export const EDGE_DETAILS   = "details";

export const Graphs = new Mongo.Collection("graphs");

// Deny all client updates, except updates by the owner
Graphs.allow({
    update(userId, doc){
        return doc[OWNER] == userId;
    }
});
Graphs.deny({
    insert(){
        return true;
    },
    remove(){
        return true;
    }
});

Graphs.schema            = {};
Graphs.schema.nodeSchema   = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: false,
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                return Random.id();
            }
        }
    },
    chartId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
    },
    name: {
        type: String,
        optional: false
    },
    details: {
        type: String,
        optional: false,
        defaultValue: ""
    },
    resources: {
        type: [String],
        optional: false,
        defaultValue: []
    },
    images: {
        type: [String],
        optional: false,
        defaultValue: []
    },
    comments: {
        type: [Comments.schema],
        label: "Comments",
        optional: false,
        defaultValue: []
    }
});
Graphs.schema.edgeSchema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: false,
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                return Random.id();
            }
        }
    },
    name: {
        type: String,
        optional: false
    },
    details: {
        type: String,
        optional: false,
        defaultValue: ""
    },
    source: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: false
    },
    target: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: false
    }
});

Graphs.schema.graphSchema = new SimpleSchema({
    owner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "Owner User Id",
        optional: false
    },
    nodes: {
        type: [Graphs.schema.nodeSchema],
        optional: false,
        defaultValue: []
    },
    edges: {
        type: [Graphs.schema.edgeSchema],
        optional: false,
        defaultValue: []
    },
    firstNode: {
        type: SimpleSchema.RegEx.Id,
        optional: false
    }
});

Graphs.attachSchema(Graphs.schema.graphSchema);