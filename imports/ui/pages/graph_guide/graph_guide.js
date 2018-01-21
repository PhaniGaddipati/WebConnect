import "meteor/reactive-var";
import "meteor/session";
import "./graph_guide.html";
import "/imports/ui/components/graph_view/graph_view.js";
import "/imports/ui/components/guide_view/guide_view.js";
import {DATA_READ_ONLY} from "../../components/graph_view/graph_view";

Template.graph_guide.onCreated(function () {
    let self       = Template.instance();
    self.showGraph = new ReactiveVar(!self.data[DATA_READ_ONLY]);
});

Template.graph_guide.helpers({
    graphParams: function () {
        return Template.instance().data;
    },
    showGraph: function () {
        return Template.instance().showGraph.get();
    }
});

Template.graph_guide.events({
    "click #toggle_flowchart": function (evt, self) {
        evt.preventDefault();
        self.showGraph.set(!self.showGraph.get());
    }
});