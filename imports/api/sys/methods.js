/**
 * Created by Phani on 11/13/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Sys from "./sys.js";

export const postFeedback = new ValidatedMethod({
    name: "sys.postFeedback",
    validate: function ({userId, text}) {
    },
    run({userId, text}){
        let doc                                     = {};
        doc[Sys.SYS_FEEDBACK]                       = {};
        doc[Sys.SYS_FEEDBACK][Sys.FEEDBACK_USER_ID] = userId;
        doc[Sys.SYS_FEEDBACK][Sys.FEEDBACK_TEXT]    = text;

        return Sys.Sys.insert(doc);
    }
});
