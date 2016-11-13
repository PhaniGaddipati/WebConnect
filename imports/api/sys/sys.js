/**
 * Created by Phani on 11/13/2016.
 */

import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const SYS_FEEDBACK     = "feedback";
export const FEEDBACK_DATE    = "date";
export const FEEDBACK_USER_ID = "userId";
export const FEEDBACK_TEXT    = "text";

export const Sys = new Mongo.Collection("sys");

// Deny all client updates, everything going to be done through methods
Sys.deny({
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

Sys.schema                = {};
Sys.schema.feedbackSchema = new SimpleSchema({
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
    userId: {
        type: SimpleSchema.RegEx.Id,
        optional: true
    },
    text: {
        type: String
    }
});

Sys.schema.sysSchema = new SimpleSchema({
    feedback: {
        type: Sys.schema.feedbackSchema
    }
});

Sys.attachSchema(Sys.schema.sysSchema);