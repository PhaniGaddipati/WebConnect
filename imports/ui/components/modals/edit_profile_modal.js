import "./edit_profile_modal.html";
import "/imports/ui/components/user_profile_fields/user_profile_fields.js";
import {
    getProfileFromFields,
    setProfileFields
} from "/imports/ui/components/user_profile_fields/user_profile_fields.js";
import {updateUserProfile, currentUser} from "/imports/api/users/methods.js";
import * as Users from "/imports/api/users/users.js";

const ENTER_KEY = 13;

Template.edit_profile_modal.onRendered(function () {
    let userId = Meteor.userId();
    if (userId) {
        setProfileFields(Template.instance(), currentUser());
        $("#user_email").prop("disabled", true);
    }
});

Template.edit_profile_modal.events({
    "click #cancelBtn": function (evt) {
        evt.preventDefault();
        $("#edit_profile_modal").modal("hide");
    },
    "click #saveProfileBtn": function (evt, tmpl) {
        evt.preventDefault();
        onSaveProfile(tmpl);
    },
    "keydown #user_skills": function (evt, tmpl) {
        if (evt.which == ENTER_KEY) {
            evt.preventDefault();
            onSaveProfile(tmpl);
        }
    }
});

function onSaveProfile(tmpl) {
    let profile = getProfileFromFields(tmpl);
    profile[Users.USER_ID] = Meteor.userId();
    profile["countryCode"] = profile[Users.PROFILE_COUNTRY][Users.COUNTRY_CODE];
    // updateUserProfile expects a slightly different format, country code should be root property
    updateUserProfile.call({user: profile});
    $("#edit_profile_modal").modal("hide");
}