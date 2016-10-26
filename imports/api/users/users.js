/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

// Constants for fields in user documents
export const Users                = Meteor.users;
export const USER_ID              = "_id";
export const USERNAME             = "username";
export const CREATED_AT           = "createdAt";
export const EMAILS               = "emails";
export const EMAIL_ADDRESS        = "address";
export const PROFILE              = "profile";
export const PROFILE_ORGANIZATION = "organization";
export const PROFILE_NAME         = "name";
export const PROFILE_COUNTRY      = "country";
export const PROFILE_EXPERTISES   = "expertises";
export const COUNTRY_CODE         = "code";
export const COUNTRY_NAME         = "name";

// Disallow client side updates of the profile field (default is allowed)
Users.deny({
    update() {
        return true;
    },
});

// Attach a schema to the users collection
// This schema is adapted from https://github.com/aldeed/meteor-collection2

Users.schema = {};

Users.schema.userCountry = new SimpleSchema({
    name: {
        type: String
    },
    code: {
        type: String
    }
});

Users.schema.userProfile = new SimpleSchema({
    name: {
        type: String
    },
    organization: {
        type: String,
        optional: true,
        defaultValue: null
    },
    country: {
        type: Users.schema.userCountry,
        optional: true
    },
    expertises: {
        type: [String],
        defaultValue: []
    }
});

Users.schema.user = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Users.schema.userProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Object,
        blackbox: true,
        optional: true
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});

Users.attachSchema(Users.schema.user);