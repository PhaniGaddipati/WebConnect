import "./edit_node_modal.html";
import * as Graphs from "/imports/api/graphs/graphs.js";

export const DATA_NODE = "node";
export const DATA_SAVE_CALLBACK = "save_callback";

editNodeO = null;

Template.edit_node_modal.onCreated(function () {
    editNodeO = Template.instance().data[DATA_NODE];
});

Template.edit_node_modal.helpers({
    node: function () {
        return Template.instance().data[DATA_NODE];
    },
    formatResource: function (res) {
        if (res) {
            return res.substring(res.lastIndexOf("/") + 1, res.length);
        }
        return "";
    }
});

Template.edit_node_modal.events({
    "click #cancelModalBtn": function () {
        $("#editNodeModal").modal("hide");
    },
    "click #saveNodeModalBtn": function (evt, self) {
        $("#editNodeModal").modal("hide");
        onSaveNode(self);
    }
});

function onSaveNode(self) {
    let newNode = {};
    _.each(_.keys(self.data[DATA_NODE]), function (key) {
        newNode[key] = self.data[DATA_NODE][key];
    });

    newNode[Graphs.NODE_NAME] = self.find("#nodeNameField").value;
    newNode[Graphs.NODE_DETAILS] = self.find("#nodeDetailsField").value;
    // images & resources are updated as the user makes changes

    let callback = self.data[DATA_SAVE_CALLBACK];
    if (callback) {
        callback(newNode);
    }
}