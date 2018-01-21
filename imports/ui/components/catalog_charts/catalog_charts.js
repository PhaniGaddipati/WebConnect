import "./catalog_charts.html";
import "/imports/ui/components/app_loading/app_loading.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChartsInCatalog} from "/imports/api/charts/methods.js";

const MAX_DESC_LEN = 250;

Template.catalog_charts.onCreated(function () {
    this.subscribe("catalogCharts");
});

Template.catalog_charts.helpers({
    catalogCharts: function () {
        return getChartsInCatalog.call();
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
    getChartDownloads: function (chart) {
        return chart[Charts.DOWNLOADS];
    }
});