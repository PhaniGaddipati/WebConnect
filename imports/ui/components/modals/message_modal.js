import "./message_modal.html";

Template.message_modal.helpers({
    "title": function () {
        return Template.instance().data.title;
    },
    "message": function () {
        return Template.instance().data.message;
    }
});