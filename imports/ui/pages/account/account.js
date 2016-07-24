/**
 * Created by Phani on 7/23/2016.
 */
import "./account.html";
import "./signin-register.js";
import * as User from "/imports/api/users/users.js";
import {currentUser} from "/imports/api/users/methods.js";

Template.account.helpers({
    'isSignedIn': function () {
        return Meteor.userId() != null;
    },
    'currentUserRealName': function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_NAME];
        return "";
    },
    'currentUsername': function () {
        if (currentUser())
            return currentUser()[User.USERNAME];
        return "";
    },
    'currentUserCountry': function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_COUNTRY][User.COUNTRY_NAME];
        return "";
    },
    'currentUserOrganization': function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_ORGANIZATION];
        return "";
    },
    'currentUserJoinDate': function () {
        if (currentUser())
            return moment(currentUser()[User.CREATED_AT]).locale(TAPi18n.getLanguage()).format("MMMM DD, YYYY");
        return "";
    },
    'currentUserEmail': function () {
        if (currentUser())
            return currentUser()[User.EMAILS][0][User.EMAIL_ADDRESS];
        return "";
    }
});
