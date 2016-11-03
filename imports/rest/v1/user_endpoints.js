/**
 * Created by Phani on 10/25/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Users from "/imports/api/users/users.js";
import {updateUserProfile, searchUsers} from "/imports/api/users/methods.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";
import {CountryCodes} from "meteor/3stack:country-codes";

const RESPONSE_STATUS         = "status";
const RESPONSE_MESSAGE        = "message";
const RESPONSE_DATA           = "data";
const RESPONSE_STATUS_SUCCESS = "success";
const RESPONSE_STATUS_ERROR   = "error";

/**
 * Login and logout endpoints are provided by Restivus by default.
 */

RestAPI.addRoute("register", {
    /**
     * @api {post} /register Registers a new user
     * @apiName Register
     * @apiGroup Users
     *
     * @apiParam {String} email User email.
     * @apiParam {String} password User password.
     * @apiParam {String} countryCode User country code.
     * @apiParam {String} name User name.
     * @apiParam {String} organization User organization.
     * @apiParam {String[]} expertises User listed expertises.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.user The newly registered user.
     * @apiError (400) RegistrationFailed
     */
    post: function () {
        let email       = this.bodyParams.email;
        let password    = this.bodyParams.password;
        let countryCode = this.bodyParams.countryCode;

        let profile                                        = {};
        profile[Users.PROFILE_ORGANIZATION]                = this.bodyParams.organization;
        profile[Users.PROFILE_NAME]                        = this.bodyParams.name;
        profile[Users.PROFILE_EXPERTISES]                  = this.bodyParams.expertises;
        profile[Users.PROFILE_COUNTRY]                     = {};
        profile[Users.PROFILE_COUNTRY][Users.COUNTRY_NAME] = CountryCodes.countryName(countryCode);
        profile[Users.PROFILE_COUNTRY][Users.COUNTRY_CODE] = countryCode;
        let userId                                         = null;
        try {
            userId = Accounts.createUser({
                username: email,
                email: email,
                password: password,
                profile: profile
            });
        } catch (err) {
            console.log(err);
        }
        if (userId) {
            let user                  = Users.Users.findOne({_id: userId});
            let response              = {};
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                user: RESTUtils.formatUserForREST(user)
            };
            return response;
        } else {
            let response               = {};
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "The user could not be registered";
            return {
                statusCode: 400,
                body: response
            };
        }
    }
});

RestAPI.addRoute("user/:id", {
    /**
     * @api {get} /user/:id Request a User
     * @apiName GetUser
     * @apiGroup Users
     *
     * @apiParam {String} id User unique ID.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.user User that was requested.
     * @apiError (404) UserNotFound The id of the User was not found.
     */
    get: function () {
        let id = this.urlParams.id;
        console.log("GET user/" + id);
        let user = Users.Users.findOne({_id: id});

        if (user) {
            let response              = {};
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                user: RESTUtils.formatUserForREST(user)
            };
            return response;
        }
        else {
            let response               = {};
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "The given user id wasn't found.";
            return {
                statusCode: 404,
                body: response
            };
        }
    },
    /**
     * @api {post} /user/:id Update a User
     * @apiName UpdateUser
     * @apiGroup Users
     *
     * @apiHeader {String} X-Auth-Token The auth token for the user.
     * @apiHeader {String} X-User-Id The ID of the user updating the profile.
     *
     * @apiParam {String} id User unique ID.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.user User that was updated.
     * @apiError (401) PermissionDenied The logged in user could not edit the user of the given id.
     * @apiError (404) UserNotFound The id of the User was not found.
     */
    post: {
        authRequired: true,
        action: function () {
            let id = this.urlParams.id;
            console.log("POST user/" + id);
            let user    = Users.Users.findOne({_id: id});
            let newUser = this.bodyParams.user;

            if (!newUser) {
                let response               = {};
                response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                response[RESPONSE_MESSAGE] = "Field 'user' is required.";
                return {
                    statusCode: 400,
                    body: response
                };
            }

            // Make sure ids match and id is in obj
            newUser[Users.USER_ID] = id;

            if (user) {
                if (user[Users.USER_ID] != this.userId) {
                    // Some pesky person is trying to change someone else's profile
                    let response               = {};
                    response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                    response[RESPONSE_MESSAGE] = "You don't have permission to do this.";
                    return {
                        statusCode: 401,
                        body: response
                    };
                } else {
                    // I'll allow it
                    try {
                        updateUserProfile.call({user: newUser});
                        let response              = {};
                        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
                        response[RESPONSE_DATA]   = {
                            user: RESTUtils.formatUserForREST(Users.Users.findOne({_id: id}))
                        };
                        return response;
                    } catch (err) {
                        console.log(err);
                        let response               = {};
                        response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                        response[RESPONSE_MESSAGE] = "The user could not be updated.";
                        return {
                            statusCode: 404,
                            body: response
                        };
                    }
                }
            }
            else {
                let response               = {};
                response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
                response[RESPONSE_MESSAGE] = "The given user id wasn't found.";
                return {
                    statusCode: 404,
                    body: response
                };
            }
        }
    }
});

RestAPI.addRoute("users/search", {
    /**
     * @api {post} /users/search Search for Users
     * @apiName SearchUsers
     * @apiGroup Users
     *
     * @apiParam {String} query The search query.
     * @apiParam {Number} limit The number of results to limit to, optional. Defaults to 50.
     *
     * @apiSuccess (200) {Object} status
     * @apiSuccess (200) {Object} data.results Array of users in ranked order
     */
    post: function () {
        let query = this.bodyParams.query;
        let limit = parseInt(this.bodyParams.limit);

        try {
            let users          = searchUsers.call({query, limit});
            let formattedUsers = _.map(users, RESTUtils.formatUserForREST);

            let response              = {};
            response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
            response[RESPONSE_DATA]   = {
                results: formattedUsers
            };
            return response;
        } catch (err) {
            console.log(err);
            let response               = {};
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "The search could not be completed";
            return {
                statusCode: 500,
                body: response
            };
        }
    }
});