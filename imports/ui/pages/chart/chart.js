import "meteor/reactive-var";
import "meteor/session";
import "./chart.html";
import "/imports/ui/components/modals/message_modal";
import {getUserName} from "/imports/api/users/methods.js";
import * as Charts from "/imports/api/charts/charts.js";
import {canCurrentUserEditChart, getChart, updateChartDescription} from "/imports/api/charts/methods.js";
import "/imports/ui/pages/graph_guide/graph_guide.js";
import {DATA_CHART_ID, DATA_READ_ONLY} from "/imports/ui/components/graph_view/graph_view.js";

export const DATA_SHOW_GRAPH = "showGraph";

Template.chart.onCreated(function () {
    let self          = Template.instance();
    self.chartId      = self.data[DATA_CHART_ID];
    self.showGraph    = self.data[DATA_SHOW_GRAPH];
    self.readOnly     = self.data[DATA_READ_ONLY];
    self.chartLoading = new ReactiveVar(true);
    self.chart        = new ReactiveVar(null);
    self.chartDesc    = new ReactiveVar(null);
    self.canEdit      = new ReactiveVar(false);
    self.editingDesc  = new ReactiveVar(false);
    canCurrentUserEditChart.call({chartId: this.chartId}, function (err, res) {
        if (err) {
            console.log(err);
        }
        self.canEdit.set(!err && res);
    });
    getChart.call(this.chartId, function (err, chart) {
        self.chart.set(chart);
        self.chartDesc.set(chart[Charts.DESCRIPTION]);
        self.chartLoading.set(false);
    });
});

Template.chart.events({
    "click #editDesc": function (evt, self) {
        evt.preventDefault();
        self.editingDesc.set(true);
    },
    "click #saveDescBtn": function (evt, self) {
        evt.preventDefault();
        self.find("#saveDescBtn").disabled = true;
        desc                               = self.find("#editDescTextArea").value;
        saveDescription(self, desc);
    }
});

function saveDescription(self, desc) {
    updateChartDescription.call({chartId: self.chartId, description: desc}, function (err, res) {
        if (res) {
            self.find("#saveDescBtn").disabled = false;
            self.editingDesc.set(false);
            self.chartDesc.set(desc);
        } else {
            if (err) {
                console.log(err);
            }
            Modal.show("message_modal", {
                title: TAPi18n.__("error_save_description"),
                message: TAPi18n.__("error_save_description_msg")
            });
        }
    });
}

Template.chart.helpers({
    chartLoading: function () {
        return !Template.instance().chart.get()
            || Template.instance().chartLoading.get();
    },
    chartName: function () {
        return Template.instance().chart.get()[Charts.NAME];
    },
    chartDescription: function () {
        return Template.instance().chartDesc.get();
    },
    chartLastUpdated: function () {
        return moment(Template.instance().chart.get()[Charts.UPDATED_DATE])
            .locale(TAPi18n.getLanguage()).format("MMMM DD, YYYY");
    },
    chartAuthor: function () {
        let owner = Template.instance().chart.get()[Charts.OWNER];
        return getUserName.call({userId: owner});
    },
    graphParams: function () {
        return Template.instance().data;
    },
    showGraph: function () {
        return Template.instance().showGraph;
    },
    readOnly: function () {
        return Template.instance().readOnly;
    },
    canEdit: function () {
        return Template.instance().canEdit.get();
    },
    editUrl: function () {
        return FlowRouter.current().path + "/edit";
    },
    viewUrl: function () {
        return FlowRouter.current().path + "/view";
    },
    inCatalog: function () {
        return Template.instance().chart.get()[Charts.IN_CATALOG];
    },
    downloads: function () {
        return Template.instance().chart.get()[Charts.DOWNLOADS];
    },
    editingDesc: function () {
        return Template.instance().editingDesc.get();
    }
});