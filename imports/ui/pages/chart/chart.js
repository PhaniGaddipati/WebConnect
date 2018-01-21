import "meteor/reactive-var";
import "meteor/session";
import "./chart.html";
import {getUserName} from "/imports/api/users/methods.js";
import * as Charts from "/imports/api/charts/charts.js";
import {canCurrentUserEditChart, getChart} from "/imports/api/charts/methods.js";
import "/imports/ui/pages/graph_guide/graph_guide.js";
import {DATA_CHART_ID, DATA_READ_ONLY} from "/imports/ui/components/graph_view/graph_view.js";

Template.chart.onCreated(function () {
    let self          = Template.instance();
    self.chartId      = self.data[DATA_CHART_ID];
    self.readOnly     = self.data[DATA_READ_ONLY];
    self.chartLoading = new ReactiveVar(true);
    self.chart        = new ReactiveVar(null);
    self.canEdit = new ReactiveVar(false);
    canCurrentUserEditChart.call({chartId: this.chartId}, function (err, res) {
        if (err) {
            console.log(err);
        }
        self.canEdit.set(!err && res);
    });
    getChart.call(this.chartId, function (err, chart) {
        self.chart.set(chart);
        self.chartLoading.set(false);
    });
});

Template.chart.helpers({
    chartLoading: function () {
        return !Template.instance().chart.get()
            || Template.instance().chartLoading.get();
    },
    chartName: function () {
        return Template.instance().chart.get()[Charts.NAME];
    },
    chartDescription: function () {
        return Template.instance().chart.get()[Charts.DESCRIPTION];
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
    readOnly: function () {
        return Template.instance().readOnly;
    },
    canEdit: function () {
        return Template.instance().canEdit.get();
    },
    editUrl: function () {
        return FlowRouter.current().path + "/edit";
    },
    inCatalog: function () {
        return Template.instance().chart.get()[Charts.IN_CATALOG]
    }
});