import "./publish_graph_modal.html";
import {publishEditingGraph} from "/imports/api/charts/methods.js";
import "/imports/ui/components/modals/message_modal";

export const DATA_CHART_ID = "chartId";

Template.publish_graph_modal.onCreated(function () {
    let self      = Template.instance();
    self.errorMsg = new ReactiveVar(null);
});

Template.publish_graph_modal.events({
    "click #cancelModalBtn": function () {
        $("#publishGraphModal").modal("hide");
    },
    "click #publishBtn": function (evt, tmpl) {
        let comments = tmpl.find("#commentsField").value.trim();
        let version  = tmpl.find("#versionField").value.trim();
        let data     = {chartId: tmpl.data[DATA_CHART_ID], comments: comments, version: version};
        let valid    = true;
        try {
            publishEditingGraph.validate(data);
            tmpl.errorMsg.set(null);
        } catch (err) {
            valid = false;
            console.log(err);
            tmpl.errorMsg.set(TAPi18n.__("publish_valid_error"));
        }

        if (valid) {
            publishEditingGraph.call(data, function (err, res) {
                if (err || !res) {
                    console.log(err);
                    tmpl.errorMsg.set(TAPi18n.__("error_publish_msg"));
                } else {
                    $("#publishGraphModal").modal("hide");
                    console.log("Succesfully published graph");
                    location.reload();
                }
            });
        }

    },
});

Template.publish_graph_modal.helpers({
    'hasErrorMsg': function () {
        return Template.instance().errorMsg.get() != null;
    },
    'errorMsg': function () {
        return Template.instance().errorMsg.get();
    }
});