import "./edit_node_modal.html";
import * as Graphs from "/imports/api/graphs/graphs.js";

export const DATA_NODE = "node";
export const DATA_SAVE_CALLBACK = "save_callback";

Template.edit_node_modal.onCreated(function () {
    let self = Template.instance();
    let nodeClone = {};
    _.each(_.keys(self.data[DATA_NODE]), function (key) {
        if (Array.isArray(self.data[DATA_NODE][key])) {
            nodeClone[key] = self.data[DATA_NODE][key].slice();
        } else {
            nodeClone[key] = self.data[DATA_NODE][key];
        }
    });
    self.node = nodeClone;
    self.nodeRx = new ReactiveVar(nodeClone);
});

Template.edit_node_modal.helpers({
    node: function () {
        return Template.instance().nodeRx.get();
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
    },
    "keyup #addResourceField": function (evt, self) {
        if (evt.which == 13) {
            evt.preventDefault();
            onAddResource(self);
        }
    },
    "click #addResourceBtn": function (evt, self) {
        evt.preventDefault();
        onAddResource(self);
    },
    "click #deleteResourceBtn": function (evt, self) {
        evt.preventDefault();
        let removeIdx = evt.currentTarget.getAttribute("data-resource-idx");
        self.node[Graphs.NODE_RESOURCES].splice(removeIdx, 1);
        self.nodeRx.set(self.node);
    },
    "click #deleteNodeImgBtn": function (evt, self) {
        evt.preventDefault();
        let removeIdx = evt.currentTarget.getAttribute("data-img-idx");
        self.node[Graphs.NODE_IMAGES].splice(removeIdx, 1);
        self.nodeRx.set(self.node);
    }
});

function onAddResource(self) {
    let newRes = self.find("#addResourceField").value;
    if (newRes) {
        newRes = newRes.trim();
        if (newRes.endsWith("/")) {
            newRes = newRes.substring(0, newRes.length - 1);
        }
        if (!_.contains(self.node[Graphs.NODE_RESOURCES], newRes)) {
            self.node[Graphs.NODE_RESOURCES].push(newRes);
            self.nodeRx.set(self.node);
            self.find("#addResourceField").value = "";
        }
    }
}

function onSaveNode(self) {
    self.node[Graphs.NODE_NAME] = self.find("#nodeNameField").value;
    self.node[Graphs.NODE_DETAILS] = self.find("#nodeDetailsField").value;
    // images & resources are updated as the user makes changes

    let callback = self.data[DATA_SAVE_CALLBACK];
    if (callback) {
        callback(self.node);
    }
}