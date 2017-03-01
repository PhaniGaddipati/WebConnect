import "./invalid_graph_modal.html";

Template.invalid_graph_modal.events({
    "click #continueEditingBtn": function () {
        $("#invalidGraphModal").modal("hide");
    }
});