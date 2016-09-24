/**
 * Created by Phani on 9/15/2016.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getChart} from "/imports/api/charts/methods.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {Random} from "meteor/random";

let TEST_CHART = {
    _id: "testchart99999999",
    name: "Device Name",
    description: "A description of the device",
    owner: "wjQyQ6sGjzvNMDLiJ",
    graph: "testgraph99999999",
    type: "device"
};

let TEST_GRAPH = {
    _id: 'testgraph99999999',
    owner: 'wjQyQ6sGjzvNMDLiJ',
    firstNode: 'Y8DbqcrFSagPvp57H',
    nodes: [{
        _id: 'Y8DbqcrFSagPvp57H',
        name: 'Discard and replace batteries if they are leaking, rusted, corroding, or over two years old.',
        details: '',
        images: []
    },
        {
            _id: 'eyHevhbASDt2dZKwv',
            name: 'Are the batteries rechargeable?',
            details: 'NiCd, Lead Acid, NiMH, Li-ion batteries are common chargeable batteries. Lithium or carbon-zinc are not rechargeable.'
        },
        {
            _id: '5CAQKu753gPgdC8Yo',
            name: 'Is a working charger available?',
            details: 'Do so by checking the voltage output of the charger and check for proper polarity'
        },
        {
            _id: 'YZSEFsrkYNJTbL3Z5',
            name: 'Use a voltmeter to measure battery output voltage',
            details: '',
            images: []
        },
        {
            _id: 'nMwoydsQtfsnZz36y',
            name: 'Make a charger using a power supply and resistor',
            details: '',
            images: [],
            resources: []
        },
        {
            _id: '6Y9F9oaGik56T2yrz',
            name: 'Charge batteries',
            details: ''
        },
        {
            _id: 'sEMi9fZLepqdb345m',
            name: 'Is the measured voltage 70 - 100% of the battery\'s rated value?',
            details: ''
        },
        {
            _id: 'BdTG4Frh4FNuyMLfT',
            name: 'Use a Voltmeter to test battery voltage. Do the batteries reach specified voltage?',
            details: '',
            images: []
        },
        {
            _id: 'qFYLwiYscodQPjY3A',
            name: 'Leave the battery out overnight (not connected to anything). Then measure the voltage again.',
            details: ''
        },
        {
            _id: 'ZWBqH2kbkxYE5jZMx',
            name: 'Replace the battery with a rechargeable battery of the same type, voltage, and capacity. If not, use a battery of the same type and voltage, but larger capacity',
            details: ''
        },
        {
            _id: 'raG7jTdw2aejfDzzm',
            name: 'Can the batteries be replaced appropriately?',
            details: 'Exact replacements may or may not be realistic or available'
        },
        {
            _id: 'zp8mFriAbKuo9eX7J',
            name: 'Return to traditional device troubleshooting',
            details: 'Determine if the device works with the new battery/power supply'
        },
        {
            _id: 'dbeHrBLpQEEA3ZQjk',
            name: 'Replace the batteries with a \'battery pack\' by adding batteries in series or in parallel to equal the wanted total voltage and/or capacity ratings',
            details: '-In parallel: Maintains voltage, Adds Capacities\n-In series: Adds voltages, Maintains Capacities',
            images: [],
            resources: []
        },
        {
            _id: 'SHuoojesMFJJQC2uK',
            name: 'The battery is working. Return to traditional device troubleshooting',
            details: ''
        },
        {
            _id: 'ZFk67MoabKZjv2MT2',
            name: 'Is the final voltage at least 70% of the starting voltage',
            details: ''
        },
        {_id: 'Dq9aZdsd4hjgiY72Y', name: 'Done', details: ''},
        {
            _id: 'cyx2vdc4MDS9Wc4Pm',
            name: 'Replace batteries with a wall transformer if they cannot be replaced',
            details: 'Other alternatives include:\n1. NiCd for NiMH of the same voltage and capacity, matching voltage takes priority\n2. NiMH for NiCd of the same voltage and capacity,matching voltage takes priority\n\nThe only downside is that NiCd have lower capacities and operate for shorter periods of time before needing to be charged.',
            resources: []
        },
        {
            _id: 'JWQ4S9qipfhCh9AXG',
            name: 'Return to traditional device troubleshooting',
            details: 'Determine if the device works with the new battery/power supply'
        },
        {
            _id: 'eikKpJxkpF3H4nG28',
            name: 'The battery is working. Return to traditional device troubleshooting.',
            details: ''
        },
        {_id: 'tHBzmyGLD34ccWmCh', name: 'Done', details: ''},
        {
            _id: 'q4Y8nsiBvsBYHGyTw',
            name: 'Replace the battery with a rechargeable battery of the same type, voltage, and capacity. If not, use a battery of the same type and voltage, but larger capacity',
            details: ''
        },
        {_id: 'eTF4DfeJYfYzeZRQ7', name: 'Done', details: ''},
        {
            _id: 'PnQrpoH3PB7Emc4gg',
            name: 'Can the batteries be replaced appropriately?',
            details: 'Exact replacements may not be realistic or available'
        }],
    edges: [{
        _id: 'oEX24zYknXGvSpWJq',
        name: 'Next',
        target: 'q6z8MMyyvD8RxcHjx',
        source: 'enxxWgFJSqkbpmMjE'
    },
        {
            _id: 'dpvKRyi3nsNvphHST',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'gPzyDa5BdmDM77GBY'
        },
        {
            _id: '5hfA3XAdDjAfkt3Sa',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: '9tQcrwqYLytYtJc7F'
        },
        {
            _id: 'zmoumfLL69PEECvPz',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'BkY6nzoL6v5dLGCJx'
        },
        {
            _id: 'rqkm7t7uPJviB6Q66',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'b4XA2znLi8aoomE2d'
        },
        {
            _id: 'e2BZudoiqRCWDcswP',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'JS4icGCQqkxhfHmxX'
        },
        {
            _id: '72tW3KXKkpG5djvaG',
            name: 'Done',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'QsceqCXrpDvL2fLDp'
        },
        {
            _id: 'NPLZMxqAHzPfuMxRT',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'JS4icGCQqkxhfHmxX'
        },
        {
            _id: 'uKTLYKtnqJ8hvt55x',
            name: 'Done',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'hfji3A6cuxnepzPQ4'
        },
        {
            _id: 'NNW9kR9EnwMwzs2h6',
            name: 'Done',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'QsceqCXrpDvL2fLDp'
        },
        {
            _id: 'TmEDjNJ2Rio48oaMT',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'yRzEiLXTFJNbNMgWW'
        },
        {
            _id: 'LQTsnoz38KxEmcnQF',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'q6z8MMyyvD8RxcHjx'
        },
        {
            _id: '4hLrhpRkFekPpCXrE',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'Bdh5Ndybd6bzXSMvz'
        },
        {
            _id: '87GD6XTqy9kmNWHTW',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'HDSzP6YqA29xhStyA'
        },
        {
            _id: 'rRatDZEsJuNGzyyKo',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'FWAJSoDng8xyYKMn9'
        },
        {
            _id: 'bYab4RosN5DudA9Qh',
            name: 'Done',
            target: 'q6z8MMyyvD8RxcHjx',
            source: '9jyPTwie4P24NjTio'
        },
        {
            _id: 'Km69usbTZjkGqbpQj',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'HDSzP6YqA29xhStyA'
        },
        {
            _id: 'DyT2ujN4ZuwugoeqM',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'oCwY8ANHKWJDT2Mgp'
        },
        {
            _id: 'WA3xSMmKpNKdEp3ou',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'gwu2SwSGxY28nEfTw'
        },
        {
            _id: 'qNfaD7H84RcJMKxzT',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'QGKDEcQhMDXXs3htF'
        },
        {
            _id: 'ad5Dd9Q3ktZpQpK5W',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'EC9jozemhGzHNppGf'
        },
        {
            _id: 'EMpF4hMG3h9QchDWF',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: '5WXEFBQpjooTZqiyt'
        },
        {
            _id: '5gS4DfBYp4FzSJLxu',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'EC9jozemhGzHNppGf'
        },
        {
            _id: 'wKdHK6e26qDDNHzFF',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'ofFRAYts6rMjhvwdA'
        },
        {
            _id: 'X6SwuB9jKsDLCND44',
            name: 'Next',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'sWYQiCuGTksjYcohm'
        },
        {
            _id: 'vRYFx7QQXBq8dF55o',
            name: 'Yes',
            target: 'q6z8MMyyvD8RxcHjx',
            source: 'kjgY4nKTTPCqAveqh'
        },
        {
            _id: '6KJcXcZ6CNZ4j2YR5',
            name: 'No',
            target: 'q6z8MMyyvD8RxcHjx',
            source: '9tQcrwqYLytYtJc7F'
        }]
};

if (!getGraph.call(TEST_GRAPH[Graphs.GRAPH_ID])) {
    Graphs.Graphs.insert(TEST_GRAPH);
    console.log("Added TEST_GRAPH");
}
if (!getChart.call(TEST_CHART[Charts.CHART_ID])) {
    Charts.Charts.insert(TEST_CHART);
    console.log("Added TEST_CHART");
}
