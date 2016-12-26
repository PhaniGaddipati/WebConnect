/**
 * Created by Phani on 12/26/2016.
 */
import {CountryCodes} from "meteor/3stack:country-codes";
import "./user_profile_fields.html";
import * as User from "/imports/api/users/users.js";

Template.user_profile_fields.helpers({
    "countries": function () {
        return _.values(CountryCodes.getList());
    },
    "countrySelectProps": function () {
        return {
            class: "form-control",
            id: "user_country"
        };
    }
});

export const setProfileFields = function (tmpl, user) {
    $("#user_name").val(user[User.PROFILE][User.PROFILE_NAME]);
    $("#user_organization").val(user[User.PROFILE][User.PROFILE_ORGANIZATION]);
    $("#user_country").val(user[User.PROFILE][User.PROFILE_COUNTRY][User.COUNTRY_CODE]);
    $("#user_skills").val(user[User.PROFILE][User.PROFILE_EXPERTISES].join(", "));
    $("#user_email").val(user[User.EMAILS][0][User.EMAIL_ADDRESS]);
};

export const getProfileFromFields = function (tmpl) {
    let name = tmpl.find("#user_name").value.trim();
    let org = tmpl.find("#user_organization").value.trim();
    let countryCode = tmpl.find("#user_country").value.trim();
    let skills = tmpl.find("#user_skills").value.trim();

    let profile = {};
    profile[User.PROFILE_ORGANIZATION] = org;
    profile[User.PROFILE_NAME] = name;
    profile[User.PROFILE_COUNTRY] = {};
    profile[User.PROFILE_COUNTRY][User.COUNTRY_NAME] = CountryCodes.countryName(countryCode);
    profile[User.PROFILE_COUNTRY][User.COUNTRY_CODE] = countryCode;
    if (skills) {
        let skillsArr = skills.toLowerCase().split(",");
        skillsArr = _.map(skillsArr, function (skill) {
            return skill.trim();
        });
        skillsArr = _.filter(skillsArr, function (skill) {
            return !_.isEmpty(skill);
        });
        profile[User.PROFILE_EXPERTISES] = _.uniq(skillsArr);
    }

    return profile;
};

export const getEmailFromFields = function (tmpl) {
    return tmpl.find("#user_email").value.trim();
};