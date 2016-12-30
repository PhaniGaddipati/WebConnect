import "meteor/reactive-var";
import "meteor/session";
import "./graph_guide.html";
import "/imports/ui/components/graph_view/graph_view.js";
import "/imports/ui/components/guide_view/guide_view.js";

Template.graph_guide.helpers({
    graphParams: function () {
        return {
            graphId: Template.instance().data.graphId
        };
    }
});