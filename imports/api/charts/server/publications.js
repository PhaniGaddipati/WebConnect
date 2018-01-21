/**
 * Created by Phani on 7/24/2016.
 */
/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {findChartsInCatalog, findCurrentUserCharts, findMostDownloadedCharts} from "/imports/api/charts/methods.js";

Meteor.publish("topCharts", function (n) {
    findMostDownloadedCharts.validate(n);
    return findMostDownloadedCharts.run(n);
});

Meteor.publish("catalogCharts", function () {
    findChartsInCatalog.validate();
    return findChartsInCatalog.run();
});

Meteor.publish("userCharts", function () {
    findCurrentUserCharts.validate();
    return findCurrentUserCharts.run();
});