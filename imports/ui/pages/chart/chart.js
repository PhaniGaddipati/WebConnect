import "meteor/reactive-var";
import "meteor/session";
import "./chart.html";
import {getUserName} from "/imports/api/users/methods.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChart} from "/imports/api/charts/methods.js";
import "/imports/ui/components/graph_view/graph_view.js";
import "/imports/ui/components/guide_view/guide_view.js";

Template.chart.onCreated(function () {
    var self = Template.instance();
    self.chartId = Template.instance().data.chartId;
    self.chartLoading = new ReactiveVar(true);
    self.chart = new ReactiveVar(null);
    getChart.call(this.chartId, function (err, chart) {
        self.chart.set(chart);
        self.chartLoading = new ReactiveVar(false);
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
    graphViewParams: function () {
        return {
            graphId: Template.instance().chart.get()[Charts.GRAPH_ID]
        };
    },
    guideViewParams: function () {
        return {
            graphId: Template.instance().chart.get()[Charts.GRAPH_ID]
        };
    }
});