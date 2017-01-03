import "./edit_node_modal.html";

export const DATA_NODE = "node";
export const DATA_SAVE_CALLBACK = "save_callback";

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
    "click #saveNodeModalBtn": function () {
        $("#editNodeModal").modal("hide");
        onSaveNode();
    }
});

function onSaveNode() {
    let self = Template.instance();
    let callback = self.data[DATA_SAVE_CALLBACK];
    if (callback) {
        callback(self.data[DATA_NODE], self.data[DATA_NODE]);
    }
}