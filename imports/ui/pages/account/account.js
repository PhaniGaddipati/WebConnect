import "./account.html";
import "./signin_register.js";
import "/imports/ui/components/user_charts/user_charts.js";
import "/imports/ui/components/modals/edit_profile_modal.js";
import * as User from "/imports/api/users/users.js";
import {currentUser} from "/imports/api/users/methods.js";
import {getCurrentUserCharts} from "/imports/api/charts/methods.js";

Template.account.helpers({
    "isSignedIn": function () {
        return Meteor.userId() != null;
    },
    "currentUserRealName": function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_NAME];
        return "";
    },
    "currentUsername": function () {
        if (currentUser())
            return currentUser()[User.USERNAME];
        return "";
    },
    "currentUserCountry": function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_COUNTRY][User.COUNTRY_NAME];
        return "";
    },
    "currentUserOrganization": function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_ORGANIZATION];
        return "";
    },
    "currentUserJoinDate": function () {
        if (currentUser())
            return moment(currentUser()[User.CREATED_AT]).locale(TAPi18n.getLanguage()).format("MMMM DD, YYYY");
        return "";
    },
    "currentUserEmail": function () {
        if (currentUser())
            return currentUser()[User.EMAILS][0][User.EMAIL_ADDRESS];
        return "";
    },
    "currentUserHasSkills": function () {
        if (currentUser() && currentUser()[User.PROFILE][User.PROFILE_EXPERTISES].length > 0) {
            return true;
        }
        return false;
    },
    "currentUserSkills": function () {
        if (currentUser())
            return currentUser()[User.PROFILE][User.PROFILE_EXPERTISES];
        return "";
    },
    "hasCharts": function () {
        return getCurrentUserCharts.call().length < 0;
    }
});

Template.account.events({
    "click #editProfile": function (evt) {
        evt.preventDefault();
        Modal.show("edit_profile_modal");
    }
});