/**
 * app-body is the main template that most other pages reside in. It provides standard
 * UI stuff such as the navbar and footer.
 */

import {Meteor} from "meteor/meteor";
import "./app_body.html";
import "../components/app_loading/app_loading";
import "/imports/ui/components/modals/new_guide_modal.js";

Template.app_body.helpers({
    "isSignedIn": function () {
        return Meteor.userId() != null;
    }
});

Template.app_body.events({
    "click #createGuide": function (evt) {
        evt.preventDefault();
        Modal.show("new_guide_modal");
    }
});