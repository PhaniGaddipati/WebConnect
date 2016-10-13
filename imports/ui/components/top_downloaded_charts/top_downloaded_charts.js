/**
 * Created by Phani on 9/15/2016.
 */

import "./top_downloaded_charts.html";
import "/imports/ui/components/app_loading/app_loading.js";
import * as Charts from "/imports/api/charts/charts.js";

const NUM_TOP_CHARTS = 10;

Template.top_downloaded_charts.onCreated(function () {
    this.subscribe("topCharts", NUM_TOP_CHARTS);
});

Template.top_downloaded_charts.helpers({
    topCharts: function () {
        // Would use findMostDownloadedCharts but it's really slow
        // for some reason, breaking login flow. Not sure why.
        // Maybe returning the cursor to the client?
        // return findMostDownloadedCharts.call(NUM_TOP_CHARTS).fetch();
        let sortParam               = {};
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
        return chart[Charts.DESCRIPTION];
    },
    getChartDownloads: function (chart) {
        return chart[Charts.DOWNLOADS];
    }
});