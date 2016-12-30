/**
 * Created by phani on 12/29/16.
 */
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph, getNodeEdgeMap, NODE_MAP_NODE, NODE_MAP_OUTGOING_EDGES} from "/imports/api/graphs/methods.js";
import "./guide_view.html";
import {GRPAH_SELECTION_NODE_ID} from "/imports/ui/components/graph_view/graph_view.js";

export const SELECTED_OPTION_TARGET_ID = "selected_option_target_id";

Session.set(SELECTED_OPTION_TARGET_ID, null);

Template.guide_view.onCreated(function () {
    let self = Template.instance();
    self.graphId = Template.instance().data.graphId;
    self.nodeMap = new ReactiveVar(null);
    self.errorLoadingGraph = new ReactiveVar(false);
    self.currentNode = new ReactiveVar(null);

    self.jsPlumbToolkit = jsPlumbToolkit.newInstance({
        idFunction: function (data) {
            return data["_id"];
        }
    });
    getGraph.call(self.graphId, function (err, graph) {
        if (err || !graph) {
            self.errorLoadingGraph.set(true);
        } else {
            self.nodeMap.set(getNodeEdgeMap(graph));
            Tracker.autorun(function () {
                updateCurrentNode(self);
            });
        }
    });
});

function updateCurrentNode(tmpl) {
    let nodeId = Session.get(GRPAH_SELECTION_NODE_ID);
    if (nodeId) {
        tmpl.currentNode.set(tmpl.nodeMap.get()[nodeId][NODE_MAP_NODE]);
    } else {
        tmpl.currentNode.set(null);
    }
}

Template.guide_view.helpers({
    nodeSelected: function () {
        return Session.get(GRPAH_SELECTION_NODE_ID) != null
    },
    currentNode: function () {
        return Template.instance().currentNode.get();
    },
    options: function () {
        let self = Template.instance();
        return self.nodeMap.get()[self.currentNode.get()[Graphs.NODE_ID]][NODE_MAP_OUTGOING_EDGES];
    },
    haveResources: function () {
        return Template.instance().currentNode.get()[Graphs.NODE_RESOURCES].length > 0;
    },
    plusOne: function (n) {
        return n + 1;
    }
});

Template.guide_view.events({
    "click .guide-option-button": function (evt) {
        evt.preventDefault();
        Session.set(SELECTED_OPTION_TARGET_ID, evt.target.getAttribute("value"));
    }
});
