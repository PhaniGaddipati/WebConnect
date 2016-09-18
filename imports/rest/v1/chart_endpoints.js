/**
 * Created by Phani on 9/14/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChartsInCatalog, getChart, getCharts, incrementChartDownload} from "/imports/api/charts/methods.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";

/**
 * Returns the flowchart catalog.
 */
RestAPI.addRoute("catalog", {
    get: function () {
        console.log("GET v1/catalog");
        let rawChartsInCatalog = getChartsInCatalog.call();

        // For each chart in the array, convert to REST format and omit the graph field
        let charts = _.map(rawChartsInCatalog, function (chart) {
            return _.omit(RESTUtils.formatChartForREST(chart), RESTUtils.FLOWCHART_GRAPH);
        });
        return {
            flowcharts: charts
        }
    }
});

/**
 * Returns a flowchart by id.
 */
RestAPI.addRoute("chart/:id", {
    get: function () {
        let id = this.urlParams.id;
        console.log("GET v1/chart/" + id);

        let chart = getChart.call(id);
        if (!chart) {
            return {
                statusCode: 404,
                body: "No chart with id " + id + " found"
            };
        }
        // New chart download, increment download
        incrementChartDownload.call(id);
        return RESTUtils.formatChartForREST(chart);
    }
});

/**
 * Returns multiple flowcharts by id.
 */
RestAPI.addRoute("charts/:ids", {
    get: function () {
        let ids = this.urlParams.ids;
        console.log("GET v1/charts/" + ids);

        let charts = getCharts.call(ids.split(","));
        charts     = _.map(charts, function (chart) {
            // New chart download, increment download
            incrementChartDownload.call(chart[Charts.CHART_ID]);
            return RESTUtils.formatChartForREST(chart);
        });
        return {
            flowcharts: charts
        };
    }
});