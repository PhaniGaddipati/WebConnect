import "./delete_node_modal.html";
import * as Graphs from "/imports/api/graphs/graphs.js";

export const DATA_NODE = "node";
export const DATA_DELETE_CALLBACK = "callback";

Template.delete_node_modal.helpers({
    nodeName: function () {
        return Template.instance().data[DATA_NODE][Graphs.NODE_NAME];
    }
});

Template.delete_node_modal.events({
    "click #cancelModalBtn": function () {
        $("#deleteNodeModal").modal("hide");
    },
    "click #deleteNodeModalBtn": function () {
        $("#deleteNodeModal").modal("hide");
        Template.instance().data[DATA_DELETE_CALLBACK]();
    },
});