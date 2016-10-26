/**
 * Created by Phani on 10/25/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Users from "/imports/api/users/users.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";

const RESPONSE_STATUS         = "status";
const RESPONSE_MESSAGE        = "message";
const RESPONSE_DATA           = "data";
const RESPONSE_STATUS_SUCCESS = "success";
const RESPONSE_STATUS_ERROR   = "error";

/**
 * Login and logout endpoints are provided by Restivus by default.
 */



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