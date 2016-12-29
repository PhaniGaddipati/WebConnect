/**
 * app-body-fluid is the same except the container is not specified for full-wdth pages
 */
import {Meteor} from "meteor/meteor";
import "./app_body_fluid.html";
import "../components/app_loading/app_loading";

Template.app_body_fluid.helpers({
    "isSignedIn": function () {
        return Meteor.userId() != null;
    }
});