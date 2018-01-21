import "./new_guide_modal.html";
import "/imports/ui/components/modals/message_modal";
import {createNewGuide} from "/imports/utils/misc/new_guide.js"

Template.new_guide_modal.events({
    "click #createGuide": function (evt, self) {
        evt.preventDefault();
        let title       = self.find("#title").value;
        let description = self.find("#title").value;
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
});