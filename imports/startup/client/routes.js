/**
 * Created by Phani on 7/23/2016.
 */
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "../../ui/layouts/app_body.js";
import "../../ui/layouts/app_body_fluid.js";
import "../../ui/pages/home.js";
import "../../ui/pages/about/about.js";
import "../../ui/pages/account/account.js";
import "../../ui/pages/account/logout.js";
import "/imports/ui/pages/chart_view/chart_view.js";
import {incrementChartDownload} from "/imports/api/charts/methods.js";

//Routes
FlowRouter.route("/", {
    name: "App.home",
    action() {
        BlazeLayout.render("app_body", {main: "home"});
    },
});

FlowRouter.route("/about", {
    name: "App.about",
    action() {
        BlazeLayout.render("app_body", {main: "about"});
    },
});

FlowRouter.route("/account", {
    name: "App.account",
    action() {
        BlazeLayout.render("app_body", {main: "account"});
    },
});

FlowRouter.route("/logout", {
    name: "App.account",
    action() {
        BlazeLayout.render("app_body", {main: "logout"});
    },
});

FlowRouter.route("/chart/:chartId", {
    name: "App.chart",
    action(params) {
        incrementChartDownload.call(params.chartId);
        BlazeLayout.render("app_body_fluid",
            {
                main: "chart_view",
                dataContext: {chartId: params.chartId}
            }
        );
    },
});