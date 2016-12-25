/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {CountryCodes} from "meteor/3stack:country-codes";
import "./signin_register.html";
import * as User from "/imports/api/users/users.js";

const ENTER_KEY = 13;

signinError = new ReactiveVar(false);
registerError = new ReactiveVar(false);
registerMsg = new ReactiveVar("");

CountryCodes.setHighlightedCountries(["RW", "US", "ET"]);

Template.signin_register.helpers({
    "signinError": function () {
        return signinError.get();
    },
    "registerError": function () {
        return registerError.get();
    },
    "registerMsg": function () {
        return registerMsg.get();
    },
    "signingin": function () {
        return Meteor.loggingIn();
    },
    "countries": function () {
        return _.values(CountryCodes.getList());
    },
    "countrySelectProps": function () {
        return {
            class: "form-control",
            id: "register_country"
        };
    }
});

Template.signin_register.events({
    "click #signin_btn": function (evt, template) {
        evt.preventDefault();
        onSignin(template);
    },
    "keydown #signin_password": function (evt, template) {
        if (evt.which == ENTER_KEY) {
            evt.preventDefault();
            onSignin(template);
        }
    },
    "click #register_btn": function (evt, template) {
        evt.preventDefault();
        onRegister(template);
    },
    "keydown #register_c_password": function (evt, template) {
        if (evt.which == ENTER_KEY) {
            evt.preventDefault();
            onRegister(template);
        }
    }
});

function onSignin(tmpl) {
    let email = tmpl.find("#signin_email").value.trim();
    let password = tmpl.find("#signin_password").value;
    Meteor.loginWithPassword(email, password, function (err) {
        if (err) {
            signinError.set(true);
        } else {
            signinError.set(false);
        }
    });
}

function onRegister(tmpl) {
    let name = tmpl.find("#register_name").value.trim();
    let org = tmpl.find("#register_organization").value.trim();
    let countryCode = tmpl.find("#register_country").value.trim();
    let email = tmpl.find("#register_email").value.trim();
    let password = tmpl.find("#register_password").value;
    let cpassword = tmpl.find("#register_c_password").value;

    let valid = true;
    if (cpassword !== password) {
        valid = false;
        registerError.set(true);
        registerMsg.set(TAPi18n.__("mismatch_passwords"));
    }
    if (_.isEmpty(name) || _.isEmpty(org) || _.isEmpty(countryCode) || _.isEmpty(password) || _.isEmpty(email)) {
        valid = false;
        registerError.set(true);
        registerMsg.set(TAPi18n.__("empty_fields"));
    }

    if (valid) {
        let profile = {};
        profile[User.PROFILE_ORGANIZATION] = org;
        profile[User.PROFILE_NAME] = name;
        profile[User.PROFILE_COUNTRY] = {};
        profile[User.PROFILE_COUNTRY][User.COUNTRY_NAME] = CountryCodes.countryName(countryCode);
        profile[User.PROFILE_COUNTRY][User.COUNTRY_CODE] = countryCode;

        Accounts.createUser({
            username: email,
            email: email,
            password: password,
            profile: profile
        }, function (err) {
            if (err) {
                registerError.set(true);
                registerMsg.set(TAPi18n.__("try_register_again"));
            } else {
                registerError.set(false);
            }
        });
    }
}