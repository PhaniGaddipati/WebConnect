import "./user_charts.html";
import "/imports/ui/components/app_loading/app_loading.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getCurrentUserCharts} from "/imports/api/charts/methods.js";

const MAX_DESC_LEN = 500;

Template.user_charts.onCreated(function () {
    this.subscribe("userCharts");
});

Template.user_charts.helpers({
    hasCharts: function () {
        return getCurrentUserCharts.call().length > 0;
    },
    userCharts: function () {
        return getCurrentUserCharts.call();
    },
    getChartName: function (chart) {
        return chart[Charts.NAME];
    },
    getChartDescription: function (chart) {
        // Trim the string to max length of MAX_DESC_LEN, to the nearest word
        let desc = chart[Charts.DESCRIPTION];
        if (desc.length > MAX_DESC_LEN) {
            desc = desc.substring(0, MAX_DESC_LEN);
            desc = desc.substr(0, Math.min(desc.length, desc.lastIndexOf(" ")));
            desc = desc + "\xa0.\xa0.\xa0.";
        }
        return desc;
    },
    getChartInCatalog: function (chart) {
        return chart[Charts.IN_CATALOG];
    }
});