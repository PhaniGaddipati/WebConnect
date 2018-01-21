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
import "/imports/ui/pages/chart/chart.js";
import {DATA_CHART_ID, DATA_READ_ONLY} from "/imports/ui/components/graph_view/graph_view.js";
import {DATA_SHOW_GRAPH} from "/imports/ui/pages/chart/chart.js"
import "/imports/ui/pages/graph_guide/graph_guide.js";
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
        let context              = {};
        context[DATA_CHART_ID]   = params.chartId;
        context[DATA_READ_ONLY]  = true;
        context[DATA_SHOW_GRAPH] = false;
        BlazeLayout.render("app_body_fluid",
            {
                main: "chart",
                dataContext: context
            }
        );
    },
});

FlowRouter.route("/chart/:chartId/edit", {
    name: "App.chart",
    action(params) {
        incrementChartDownload.call(params.chartId);
        let context              = {};
        context[DATA_CHART_ID]   = params.chartId;
        context[DATA_READ_ONLY]  = false;
        context[DATA_SHOW_GRAPH] = true;
        BlazeLayout.render("app_body_fluid",
            {
                main: "chart",
                dataContext: context
            }
        );
    },
});

FlowRouter.route("/chart/:chartId/view", {
    name: "App.chart",
    action(params) {
        incrementChartDownload.call(params.chartId);
        let context              = {};
        context[DATA_CHART_ID]   = params.chartId;
        context[DATA_READ_ONLY]  = true;
        context[DATA_SHOW_GRAPH] = true;
        BlazeLayout.render("app_body_fluid",
            {
                main: "chart",
                dataContext: context
            }
        );
    },
});