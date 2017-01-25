/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {CountryCodes} from "meteor/3stack:country-codes";
import * as Charts from "/imports/api/charts/charts.js";
import {Users, PROFILE, PROFILE_NAME} from "./users.js";

export const UPVOTES   = "upvotes";
export const DOWNVOTES = "downvotes";

const DEFAULT_SEARCH_LIMIT = 10;

export const currentUser = function () {
    return Users.findOne({_id: Meteor.userId()});
};

export const getUserName = new ValidatedMethod({
    name: "users.getUserName",
    validate: new SimpleSchema({
        userId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({userId:userId}){
        let user = Users.findOne({_id: userId});
        if (user) {
            return user[PROFILE][PROFILE_NAME];
        }
        return null;
    }
});

export const searchUsers = new ValidatedMethod({
    name: "users.searchUsers",
    validate: function ({query, limit, skip}) {
    },
    run({query, limit, skip}){
        if (!limit) {
            limit = DEFAULT_SEARCH_LIMIT;
        }
        if (!skip) {
            skip = 0;
        }

        let sel = {};
        if (query) {
            sel = {$text: {$search: query}}
        }
        let proj = {
            fields: {score: {$meta: "textScore"}},
            sort: {score: {$meta: "textScore"}},
            limit: limit,
            skip: skip
        };

        return Users.find(sel, proj).fetch();
    }
});

export const updateUserProfile = new ValidatedMethod({
    name: "users.updateUserProfile",
    validate: new SimpleSchema({
        user: {
            type: Object
        },
        "user._id": {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        "user.name": {
            type: String,
            optional: true
        },
        "user.organization": {
            type: String,
            optional: true
        },
        "user.expertises": {
            type: [String],
            optional: true
        },
        "user.countryCode": {
            type: String,
            regEx: /[A-Z]{2}/,
            optional: true
        }
    }).validator({
        clean: true,
        filter: true
    }),
    run({user}){
        let id = user._id;
        if (id == Meteor.userId()) {
            delete user._id;
            let profile = {};
            _.each(user, function (val, key) {
                if (key === "countryCode") {
                    profile["profile.country.code"] = val;
                    profile["profile.country.name"] = CountryCodes.countryName(val);
                } else {
                    profile["profile." + key] = val;
                }
            });
            let set = {$set: profile};
            return Users.update({_id: id}, set);
        }
        return null;
    }
});

export const getUserVotedCharts = new ValidatedMethod({
    name: "getUserVotedCharts",
    validate: new SimpleSchema({
        userId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({userId:userId}){
        let results = {};

        let upSelector                     = {};
        upSelector[Charts.UPVOTED_IDS]     = userId;
        let downSelector                   = {};
        downSelector[Charts.DOWNVOTED_IDS] = userId;
        let fields                         = {};
        fields[Charts.CHART_ID]            = 1;

        let upResults   = Charts.Charts.find(upSelector, {fields: fields}).fetch();
        let downResults = Charts.Charts.find(downSelector, {fields: fields}).fetch();

        results[UPVOTES]   = _.pluck(upResults, Charts.CHART_ID);
        results[DOWNVOTES] = _.pluck(downResults, Charts.CHART_ID);

        return results;
    }
});