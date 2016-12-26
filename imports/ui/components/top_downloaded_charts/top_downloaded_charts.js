import "./top_downloaded_charts.html";
import "/imports/ui/components/app_loading/app_loading.js";
import * as Charts from "/imports/api/charts/charts.js";

const NUM_TOP_CHARTS = 5;
const MAX_DESC_LEN = 100;

Template.top_downloaded_charts.onCreated(function () {
    this.subscribe("topCharts", NUM_TOP_CHARTS);
});

Template.top_downloaded_charts.helpers({
    topCharts: function () {
        // Would use findMostDownloadedCharts but it's really slow
        // for some reason, breaking login flow. Not sure why.
        // Maybe returning the cursor to the client?
        // return findMostDownloadedCharts.call(NUM_TOP_CHARTS).fetch();
        let sortParam = {};
        sortParam[Charts.DOWNLOADS] = -1;
        return Charts.Charts.find({},
            {
                sort: sortParam,
                limit: NUM_TOP_CHARTS
            }
        ).fetch();
    },
    getChartName: function (chart) {
        return chart[Charts.NAME];
    },
    getChartDescription: function (chart) {
        // Trim the string to max length of MAX_DESC_LEN, to the nearest word
        let desc = chart[Charts.DESCRIPTION];
        desc = desc.length > MAX_DESC_LEN ? (desc.substring(0, MAX_DESC_LEN)) : desc;
        desc = desc.substr(0, Math.min(desc.length, desc.lastIndexOf(" ")));
        if (desc.length < chart[Charts.DESCRIPTION].length) {
            desc = desc + "\xa0.\xa0.\xa0.";
        }
        return desc;
    },
    getChartDownloads: function (chart) {
        return chart[Charts.DOWNLOADS];
    }
});