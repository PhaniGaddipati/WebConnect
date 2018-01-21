/**
 * app-body-fluid is the same except the container is not specified for full-wdth pages
 */
import {Meteor} from "meteor/meteor";
import "./app_body_fluid.html";
import "../components/app_loading/app_loading";
import "/imports/ui/components/modals/new_guide_modal.js";

Template.app_body_fluid.helpers({
    "isSignedIn": function () {
        return Meteor.userId() != null;
    }
});

Template.app_body_fluid.events({
    "click #createGuide": function (evt) {
        evt.preventDefault();
        Modal.show("new_guide_modal");
    }
});