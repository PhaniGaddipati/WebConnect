/**
 * Created by phani on 12/29/16.
 */
import * as Graphs from "/imports/api/graphs/graphs.js";
import {NODE_MAP_NODE, NODE_MAP_OUTGOING_EDGES} from "/imports/api/graphs/methods.js";
import "./guide_view.html";
import {SELECTION_NODE_MAP_ENTRY} from "/imports/ui/components/graph_view/graph_view.js";

export const SELECTED_OPTION_TARGET_ID = "selected_option_target_id";

Session.set(SELECTED_OPTION_TARGET_ID, null);

Template.guide_view.onCreated(function () {
    let self = Template.instance();
    self.currentNode = new ReactiveVar(null);

    self.jsPlumbToolkit = jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data["_id"];
        }
    });
    Tracker.autorun(function () {
        updateCurrentNode(self);
    });
});

function updateCurrentNode(tmpl) {
    let node = Session.get(SELECTION_NODE_MAP_ENTRY);
    if (node) {
        tmpl.currentNode.set(node);
    } else {
        tmpl.currentNode.set(null);
    }
}

Template.guide_view.helpers({
    nodeSelected: function () {
        return Session.get(SELECTION_NODE_MAP_ENTRY) != null
    },
    currentNode: function () {
        return Template.instance().currentNode.get()[NODE_MAP_NODE];
    },
    options: function () {
        let self = Template.instance();
        return self.currentNode.get()[NODE_MAP_OUTGOING_EDGES];
    },
    haveResources: function () {
        let self = Template.instance();
        return self.currentNode.get()[NODE_MAP_NODE][Graphs.NODE_RESOURCES].length > 0;
    },
    formatResource: function (res) {
        if (res) {
            return res.substring(res.lastIndexOf("/") + 1, res.length);
        }
        return "";
    }
});

Template.guide_view.events({
    "click .guide-option-button": function (evt) {
        evt.preventDefault();
        Session.set(SELECTED_OPTION_TARGET_ID, evt.target.getAttribute("value"));
    }
});
