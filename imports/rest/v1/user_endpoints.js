/**
 * Created by Phani on 10/25/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Users from "/imports/api/users/users.js";
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
        let id   = this.urlParams.id;
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
    }
});