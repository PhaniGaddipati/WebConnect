/**
 * Created by phani on 12/29/16.
 */
import * as Graphs from "/imports/api/graphs/graphs.js";
import "./guide_view.html";
import * as GraphUtils from "/imports/api/jsplumb/graph_utils.js";
import {SELECTION_NODE_DATA} from "/imports/ui/components/graph_view/graph_view.js";

export const SELECTED_OPTION_ID = "selected_option_target_id";

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
    let node = Session.get(SELECTION_NODE_DATA);
    if (node) {
        tmpl.currentNode.set(node);
    } else {
        tmpl.currentNode.set(null);
    }
}

Template.guide_view.helpers({
    nodeSelected: function () {
        return Session.get(SELECTION_NODE_DATA) != null
    },
    currentNode: function () {
        return Template.instance().currentNode.get();
    },
    options: function () {
        let self = Template.instance();
        return self.currentNode.get()[GraphUtils.OPTIONS];
    },
    haveResources: function () {
        let self = Template.instance();
        return self.currentNode.get()[Graphs.NODE_RESOURCES].length > 0;
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
        Session.set(SELECTED_OPTION_ID, evt.target.getAttribute("value"));
    }
});
