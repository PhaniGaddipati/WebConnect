import "./new_guide_modal.html";
import "/imports/ui/components/modals/message_modal";
import {createNewGuide} from "/imports/utils/misc/new_guide.js"

Template.new_guide_modal.onCreated(function () {
    let self      = Template.instance();
    self.errorMsg = new ReactiveVar(null);
});

Template.new_guide_modal.events({
    "click #createGuide": function (evt, self) {
        evt.preventDefault();
        let title       = self.find("#title").value.trim();
        let description = self.find("#title").value.trim();
        let valid       = true;
        try {
            createNewGuide.validate({name: title, description: description});
            self.errorMsg.set(null);
        } catch (err) {
            console.log(err);
            self.errorMsg.set(TAPi18n.__("error_create_guide_valid"));
            valid = false;
        }
        if (valid) {

            createNewGuide.call({name: title, description: description}, function (err, res) {
                $("#new_guide_modal").modal("hide");
                if (err || !res) {
                    console.log(err);
                    Modal.show("message_modal", {
                        title: TAPi18n.__("error_create_guide"),
                        message: TAPi18n.__("error_create_guide_msg")
                    });
                } else {
                    FlowRouter.go("/chart/" + res);
                }
            });
        }
    }
});

Template.new_guide_modal.helpers({
    'hasErrorMsg': function () {
        return Template.instance().errorMsg.get() != null;
    },
    'errorMsg': function () {
        return Template.instance().errorMsg.get();
    }
});