/**
 * Created by Phani on 9/15/2016.
 */
import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {Random} from "meteor/random";

try {
    if (!Graphs.Graphs.findOne({_id: "JE4J3395986B3A8F7"}))
        Graphs.Graphs.insert({
            "_id": "JE4J3395986B3A8F7",
            "owner": "GLbCxAz7NaagyH8ZH",
            "firstNode": "2G772HG2B2FGB3E9D",
            "nodes": [
                {
                    "_id": "96AJDEEAC72AEFHFD",
                    "name": "Replace the fuse with one of as many specifcation matches as possible. If not, make a temporary replacement fuse.",
                    "details": "Amperage: Replace with lower amperage NOT higher amperage. Voltage: A higher voltage can replace a lower voltage fuse. A lower voltage fuse CANNOT replace a higher voltage fuse. Type: Fast acting can replace a slow acting fuse. Slow acting CANNOT replace fast acting. NEVER substitute a fuse with foil, iron nail, coin or other metal.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/res/fuse_substitution.pdf"
                    ]
                },
                {
                    "_id": "9E733JEJ738DA63A7",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "7855J6E57FAJ8CJ2H",
                    "name": "Troubleshoot the transformer fuse. Use a voltmeter to check if the fuse shorts.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/res/identifying_blown_fuse.pdf"
                    ]
                },
                {
                    "_id": "HE5673C5DGG8676E4",
                    "name": "Replace the wall transformer.",
                    "details": ""
                },
                {
                    "_id": "2CAHJF69H7CG68A96",
                    "name": "Do the voltage and current measurements match the wall transformer's specifications?",
                    "details": ""
                },
                {
                    "_id": "2G772HG2B2FGB3E9D",
                    "name": "Look at the transformer specifications and make sure it is correct for the desired input and output voltages.",
                    "details": ""
                },
                {
                    "_id": "22GJBE7F8AA2H85JG",
                    "name": "Using a voltmeter, check the output voltage. Does the measured voltage match transformer specifications?",
                    "details": ""
                },
                {
                    "_id": "5BCGG9AHCE6388A33",
                    "name": "Can a fuse be found with the exact correct specifications?",
                    "details": ""
                },
                {
                    "_id": "EAE42E3B54EDB5734",
                    "name": "Make sure the input voltage is entering into the correct side of the transformer.",
                    "details": ""
                },
                {
                    "_id": "4H25846E28EH9A39G",
                    "name": "Identify the fuse amperage, voltage, and type (should be printed on the fuse or device).",
                    "details": "If not, make an educated guess by comparing with fuses of known specifications, and use knowledge of the device.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/res/fuse_substitution.pdf"
                    ]
                },
                {
                    "_id": "ECG647D56CEJECGH3",
                    "name": "Does the transformer fuse short?",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/res/identifying_blown_fuse.pdf"
                    ]
                },
                {
                    "_id": "35C8E4HHF3B2JB652",
                    "name": "Is this a wall transformer (AC/DC adapter)?",
                    "details": ""
                },
                {
                    "_id": "A8JA74FG83G2DG388",
                    "name": "Is the output voltage zero?",
                    "details": ""
                },
                {
                    "_id": "2JGJ723EGJ6ADDJBD",
                    "name": "Plug in the transformer. Using a voltmeter, measure the ouput voltage and current of the transformer. Place one voltmeter probe on the inside DC output connector, and one on the outside of the connector.",
                    "details": ""
                },
                {
                    "_id": "BCJD2HC85FED37A6H",
                    "name": "Using a voltmeter, make sure that the wall outlet is outputting the proper voltage. Then plug in the wall transformer.",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/imgs/transformer_outlet_voltmeter.jpg"
                    ]
                },
                {
                    "_id": "AB58H6B2E35F7DAJ3",
                    "name": "The transformer is working properly.",
                    "details": ""
                },
                {
                    "_id": "FE7DF4H3G4F976C48",
                    "name": "Check the resistance of coils, between coils, and between coils and frames, then recoil the transformer.",
                    "details": "Unwind the old transformer while counting the turns of wire, then rewire with the exact same number of turns of a coated wire of same size.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/res/diagnosing_transformer_that_needs_rewinding.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/imgs/transformer_primary_coil.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/imgs/transformer_secondary_coil.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/imgs/transformer_between_primary_secondary_coil.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/transformer/imgs/transformer_secondary_coil.jpg"
                    ]
                },
                {
                    "_id": "5D4G43GAFF6A7D9HC",
                    "name": "Replace the fuse.",
                    "details": ""
                }
            ],
            "edges": [
                {
                    "_id": "HEBJ4694D544H3ECH",
                    "name": "Next",
                    "source": "96AJDEEAC72AEFHFD",
                    "target": "2G772HG2B2FGB3E9D"
                },
                {
                    "_id": "F38DEH852J47293DG",
                    "name": "No",
                    "source": "2CAHJF69H7CG68A96",
                    "target": "HE5673C5DGG8676E4"
                },
                {
                    "_id": "F2DDFFE55943J9E9J",
                    "name": "Yes",
                    "source": "2CAHJF69H7CG68A96",
                    "target": "AB58H6B2E35F7DAJ3"
                },
                {
                    "_id": "J56BJ786GJAJD2AB4",
                    "name": "Done",
                    "source": "HE5673C5DGG8676E4",
                    "target": "9E733JEJ738DA63A7"
                },
                {
                    "_id": "F23CJB7D6EBFDBFA9",
                    "name": "Next",
                    "source": "2G772HG2B2FGB3E9D",
                    "target": "35C8E4HHF3B2JB652"
                },
                {
                    "_id": "FFEDD5HHGJEJH26JE",
                    "name": "Yes",
                    "source": "A8JA74FG83G2DG388",
                    "target": "7855J6E57FAJ8CJ2H"
                },
                {
                    "_id": "22DC77HBGD9BDAAG2",
                    "name": "Next",
                    "source": "BCJD2HC85FED37A6H",
                    "target": "2JGJ723EGJ6ADDJBD"
                },
                {
                    "_id": "437HGE7CDGCE4G946",
                    "name": "Yes",
                    "source": "ECG647D56CEJECGH3",
                    "target": "HE5673C5DGG8676E4"
                },
                {
                    "_id": "CA44AED4932HG777D",
                    "name": "No",
                    "source": "ECG647D56CEJECGH3",
                    "target": "4H25846E28EH9A39G"
                },
                {
                    "_id": "F9ABH3HBF2G8J6C39",
                    "name": "Yes",
                    "source": "22GJBE7F8AA2H85JG",
                    "target": "AB58H6B2E35F7DAJ3"
                },
                {
                    "_id": "J5C6F4A7C6CEEHB35",
                    "name": "No",
                    "source": "22GJBE7F8AA2H85JG",
                    "target": "A8JA74FG83G2DG388"
                },
                {
                    "_id": "JB8953E4626A9A599",
                    "name": "Next",
                    "source": "7855J6E57FAJ8CJ2H",
                    "target": "ECG647D56CEJECGH3"
                },
                {
                    "_id": "94E7G5G2B6H7DE6DE",
                    "name": "Next",
                    "source": "4H25846E28EH9A39G",
                    "target": "5BCGG9AHCE6388A33"
                },
                {
                    "_id": "B272F9CG9BFJJ78AC",
                    "name": "No",
                    "source": "A8JA74FG83G2DG388",
                    "target": "FE7DF4H3G4F976C48"
                },
                {
                    "_id": "99H3545B69HBF9FJ7",
                    "name": "Next",
                    "source": "2JGJ723EGJ6ADDJBD",
                    "target": "2CAHJF69H7CG68A96"
                },
                {
                    "_id": "BJFE9JD8E6EAG2DH2",
                    "name": "Yes",
                    "source": "35C8E4HHF3B2JB652",
                    "target": "BCJD2HC85FED37A6H"
                },
                {
                    "_id": "273F7FCH7HDG9E282",
                    "name": "Next",
                    "source": "FE7DF4H3G4F976C48",
                    "target": "EAE42E3B54EDB5734"
                },
                {
                    "_id": "J63D269HC3CC8B2FG",
                    "name": "Next",
                    "source": "5D4G43GAFF6A7D9HC",
                    "target": "2G772HG2B2FGB3E9D"
                },
                {
                    "_id": "8D4CE2J8J72BBGCAD",
                    "name": "Next",
                    "source": "EAE42E3B54EDB5734",
                    "target": "22GJBE7F8AA2H85JG"
                },
                {
                    "_id": "CB3CEG95GJ626HG59",
                    "name": "No",
                    "source": "5BCGG9AHCE6388A33",
                    "target": "96AJDEEAC72AEFHFD"
                },
                {
                    "_id": "HFH93CJHDEB825HB5",
                    "name": "No",
                    "source": "35C8E4HHF3B2JB652",
                    "target": "EAE42E3B54EDB5734"
                },
                {
                    "_id": "C2EC56GCH5AB3F56J",
                    "name": "Yes",
                    "source": "5BCGG9AHCE6388A33",
                    "target": "5D4G43GAFF6A7D9HC"
                },
                {
                    "_id": "96A8BF92EEEGD5B22",
                    "name": "Done",
                    "source": "AB58H6B2E35F7DAJ3",
                    "target": "9E733JEJ738DA63A7"
                }
            ]
        });
    if (!Graphs.Graphs.findOne({_id: "3BC7AHDEJ32HE6687"}))
        Graphs.Graphs.insert({
            "_id": "3BC7AHDEJ32HE6687",
            "owner": "GLbCxAz7NaagyH8ZH",
            "firstNode": "EA3G8E3GG8B3648C8",
            "nodes": [
                {
                    "_id": "65EH5C3C94B9GFE96",
                    "name": "Are there any damaged parts, including anything disconnected or anything burned or melted? Does anything smell burned?",
                    "details": ""
                },
                {
                    "_id": "D34DBCE8B88J33AJ7",
                    "name": "Does the plug pin configuration fit into the wall socket?",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/imgs/outlet_types.jpg"
                    ]
                },
                {
                    "_id": "EA3G8E3GG8B3648C8",
                    "name": "Disconnect the main power. Carefully take off the outlet faceplate and look for circuitry damage.",
                    "details": "Wear insulated globes and use insulated equipment when handling high voltage outputs. Practice safety, lock out tag out. Shut off the branch circuit and lock out the power box before troubleshooting."
                },
                {
                    "_id": "AEG876FEDJ5DH2CH9",
                    "name": "Is the outlet wired properly and grounded?",
                    "details": ""
                },
                {
                    "_id": "G99DF7HCJC4D4J7E7",
                    "name": "Can you change the set input power of the device?",
                    "details": ""
                },
                {
                    "_id": "J88AB4JG5B32DGF9B",
                    "name": "The outlet and plug are working.",
                    "details": ""
                },
                {
                    "_id": "7C5B23ACC7DJAB785",
                    "name": "Use a transformer of the correct input and output voltages.",
                    "details": ""
                },
                {
                    "_id": "GCB9EJ6HBCFC7B5EF",
                    "name": "Disconnect the main power. Carefully rewire the outlet. Add a ground connection if necessary.",
                    "details": "Consider using an electrician to perform any ground work to make sure facility ground remains intact and you do not create ground loops which may cause problems with other equipment.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/adding_proper_grounding.pdf"
                    ]
                },
                {
                    "_id": "758DC99BCCJBB2235",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "JD33A5493G5F79743",
                    "name": "Is the device set to accept the appropriate wall power?",
                    "details": ""
                },
                {
                    "_id": "79ADGAG5BHE48DJB6",
                    "name": "Is the plug in good condition?",
                    "details": "The pins shouldn’t wiggle, be bent or rusted. You can check the plug socket with a plug tension gauge to make sure your plug stays in the outlet and will not fallout"
                },
                {
                    "_id": "F5BEC52DG34F7G75F",
                    "name": "Troubleshoot the transformer to make sure it's working properly.",
                    "details": ""
                },
                {
                    "_id": "E5654EFAJG8CG2DGA",
                    "name": "Fix or replace the plug and cable.",
                    "details": "Tighten pins that wiggle. Straighten any bent pins with pliers. Remove rust with sandpaper.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/fabricating_power_cords.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/lose_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/pin_replacement.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/cleaning_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/broken_wires_within_cables.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/electrical_tape.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/continuity_tester.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/desoldering.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/soldering.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/cleaning_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/"
                    ]
                },
                {
                    "_id": "66258A45B966E8CEC",
                    "name": "Use a voltmeter to check output voltage and current. Check that the live, neutral, and ground wires are correct.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/adding_proper_grounding.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/outlet_and_plug_variations.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/imgs/transformer_outlet_voltmeter.jpg"
                    ]
                },
                {
                    "_id": "H58869CC29JEB5D3F",
                    "name": "Replace the plug type, or use a pin type adapter.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/outlet_plug/res/outlet_and_plug_variations.pdf"
                    ]
                },
                {
                    "_id": "39BB6272CJ5FD6444",
                    "name": "Carefully remove, replace, or reconnect any non- functioning parts.",
                    "details": ""
                }
            ],
            "edges": [
                {
                    "_id": "JJ8CG3H6JHC7EGG5G",
                    "name": "Yes",
                    "source": "79ADGAG5BHE48DJB6",
                    "target": "J88AB4JG5B32DGF9B"
                },
                {
                    "_id": "6AF4A44CB59EBCA8H",
                    "name": "Next",
                    "source": "39BB6272CJ5FD6444",
                    "target": "66258A45B966E8CEC"
                },
                {
                    "_id": "A57G96F2JED48CED2",
                    "name": "Done",
                    "source": "J88AB4JG5B32DGF9B",
                    "target": "758DC99BCCJBB2235"
                },
                {
                    "_id": "3F2DCE6HGJB8FH2G6",
                    "name": "Yes",
                    "source": "65EH5C3C94B9GFE96",
                    "target": "39BB6272CJ5FD6444"
                },
                {
                    "_id": "BA5D3AED5JAD6EJ64",
                    "name": "No",
                    "source": "JD33A5493G5F79743",
                    "target": "G99DF7HCJC4D4J7E7"
                },
                {
                    "_id": "G2A9FH8B448FA7EBC",
                    "name": "Next",
                    "source": "EA3G8E3GG8B3648C8",
                    "target": "65EH5C3C94B9GFE96"
                },
                {
                    "_id": "54JGHEH678DF297B8",
                    "name": "Next",
                    "source": "7C5B23ACC7DJAB785",
                    "target": "F5BEC52DG34F7G75F"
                },
                {
                    "_id": "GFEHE472HG523B2A4",
                    "name": "Yes",
                    "source": "AEG876FEDJ5DH2CH9",
                    "target": "JD33A5493G5F79743"
                },
                {
                    "_id": "ED8C77C7564D5EJJE",
                    "name": "Yes",
                    "source": "JD33A5493G5F79743",
                    "target": "D34DBCE8B88J33AJ7"
                },
                {
                    "_id": "8HBFEG9448CJGE3FH",
                    "name": "Next",
                    "source": "GCB9EJ6HBCFC7B5EF",
                    "target": "JD33A5493G5F79743"
                },
                {
                    "_id": "3DDEBDD563E6DJ6DH",
                    "name": "No",
                    "source": "65EH5C3C94B9GFE96",
                    "target": "66258A45B966E8CEC"
                },
                {
                    "_id": "4F9H8EDGC653DG987",
                    "name": "Done",
                    "source": "F5BEC52DG34F7G75F",
                    "target": "758DC99BCCJBB2235"
                },
                {
                    "_id": "HCD65DAC58E22753H",
                    "name": "Next",
                    "source": "66258A45B966E8CEC",
                    "target": "AEG876FEDJ5DH2CH9"
                },
                {
                    "_id": "CECHDBAEDE38EF57H",
                    "name": "No",
                    "source": "79ADGAG5BHE48DJB6",
                    "target": "E5654EFAJG8CG2DGA"
                },
                {
                    "_id": "5JG2BA529JD76FBAB",
                    "name": "Next",
                    "source": "E5654EFAJG8CG2DGA",
                    "target": "79ADGAG5BHE48DJB6"
                },
                {
                    "_id": "5D462288BB7D8C4E5",
                    "name": "No",
                    "source": "G99DF7HCJC4D4J7E7",
                    "target": "7C5B23ACC7DJAB785"
                },
                {
                    "_id": "DGB7CA48J2D254835",
                    "name": "Yes",
                    "source": "G99DF7HCJC4D4J7E7",
                    "target": "JD33A5493G5F79743"
                },
                {
                    "_id": "HDH2H49JFHH56F3B6",
                    "name": "No",
                    "source": "D34DBCE8B88J33AJ7",
                    "target": "H58869CC29JEB5D3F"
                },
                {
                    "_id": "654F9D6A235C3HDGG",
                    "name": "No",
                    "source": "AEG876FEDJ5DH2CH9",
                    "target": "GCB9EJ6HBCFC7B5EF"
                },
                {
                    "_id": "8BG7DH589BB9E5D7B",
                    "name": "Yes",
                    "source": "D34DBCE8B88J33AJ7",
                    "target": "79ADGAG5BHE48DJB6"
                },
                {
                    "_id": "FDFC2B3C5D6438576",
                    "name": "Next",
                    "source": "H58869CC29JEB5D3F",
                    "target": "D34DBCE8B88J33AJ7"
                }
            ]
        });
    if (!Graphs.Graphs.findOne({_id: "E375BJ628B635B54J"}))
        Graphs.Graphs.insert({
            "_id": "E375BJ628B635B54J",
            "owner": "GLbCxAz7NaagyH8ZH",
            "firstNode": "DBADB388ADHHB38JA",
            "nodes": [
                {
                    "_id": "2FFGCJ97ACD7HFB86",
                    "name": "Return to traditional device troubleshooting",
                    "details": "Determine if the device works with the new battery/power supply"
                },
                {
                    "_id": "6ED2A3G6H4EAJC777",
                    "name": "Use a voltmeter to measure battery output voltage",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/imgs/battery_voltmeter.jpg"
                    ]
                },
                {
                    "_id": "FBDEGF4C4B84DG7BF",
                    "name": "The battery is working. Return to traditional device troubleshooting",
                    "details": ""
                },
                {
                    "_id": "6C4G9GE79GJ79G7GE",
                    "name": "Return to traditional device troubleshooting",
                    "details": "Determine if the device works with the new battery/power supply"
                },
                {
                    "_id": "H745B7GEH7BHDEG4E",
                    "name": "Are the batteries rechargeable?",
                    "details": "NiCd, Lead Acid, NiMH, Li-ion batteries are common chargeable batteries. Lithium or carbon-zinc are not rechargeable."
                },
                {
                    "_id": "268E7G8BC645649D5",
                    "name": "Replace the battery with a rechargeable battery of the same type, voltage, and capacity. If not, use a battery of the same type and voltage, but larger capacity",
                    "details": ""
                },
                {
                    "_id": "3342CHHAGA83624H9",
                    "name": "Replace the batteries with a 'battery pack' by adding batteries in series or in parallel to equal the wanted total voltage and/or capacity ratings",
                    "details": "-In parallel: Maintains voltage, Adds Capacities\n-In series: Adds voltages, Maintains Capacities",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/res/substituting_primary_batteries.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/imgs/battery_series_parallel.jpg"
                    ]
                },
                {
                    "_id": "4835D6D369EC26H7A",
                    "name": "Charge batteries",
                    "details": ""
                },
                {
                    "_id": "6BEEDEEJ83JAAEFG7",
                    "name": "Is the measured voltage 70 - 100% of the battery's rated value?",
                    "details": ""
                },
                {
                    "_id": "6238C5GHABJ3F44GA",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "ADDDD56A58CBF9H3D",
                    "name": "The battery is working. Return to traditional device troubleshooting.",
                    "details": ""
                },
                {
                    "_id": "GA97GH3GC3JE33J36",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "DBADB388ADHHB38JA",
                    "name": "Discard and replace batteries if they are leaking, rusted, corroding, or over two years old.",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/imgs/battery_corroded.jpg"
                    ]
                },
                {
                    "_id": "AH8D3GFAB223AHF4D",
                    "name": "Is a working charger available?",
                    "details": "Do so by checking the voltage output of the charger and check for proper polarity"
                },
                {
                    "_id": "F9HAC929GBC5G674E",
                    "name": "Replace the battery with a rechargeable battery of the same type, voltage, and capacity. If not, use a battery of the same type and voltage, but larger capacity",
                    "details": ""
                },
                {
                    "_id": "7DJ3CE4ADG6FGED5D",
                    "name": "Can the batteries be replaced appropriately?",
                    "details": "Exact replacements may or may not be realistic or available"
                },
                {
                    "_id": "42CA27DJJDE8FBF56",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "J39G8A96HBA9E6F8D",
                    "name": "Use a Voltmeter to test battery voltage. Do the batteries reach specified voltage?",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/imgs/battery_voltmeter.jpg"
                    ]
                },
                {
                    "_id": "CBEDAGG55F6CBD65J",
                    "name": "Make a charger using a power supply and resistor",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/res/battery_charger.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/imgs/battery_charging_circuit_diagram.jpg"
                    ]
                },
                {
                    "_id": "C8DJB7D4G7CJ8FDE2",
                    "name": "Is the final voltage at least 70% of the starting voltage",
                    "details": ""
                },
                {
                    "_id": "39F952AJ3HBGJG6AE",
                    "name": "Can the batteries be replaced appropriately?",
                    "details": "Exact replacements may not be realistic or available"
                },
                {
                    "_id": "C6BJFJC76H9254F23",
                    "name": "Leave the battery out overnight (not connected to anything). Then measure the voltage again.",
                    "details": ""
                },
                {
                    "_id": "E2BEDF7H6H2J6A698",
                    "name": "Replace batteries with a wall transformer if they cannot be replaced",
                    "details": "Other alternatives include:\n1. NiCd for NiMH of the same voltage and capacity, matching voltage takes priority\n2. NiMH for NiCd of the same voltage and capacity,matching voltage takes priority\n\nThe only downside is that NiCd have lower capacities and operate for shorter periods of time before needing to be charged.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/res/replacing_batteries_with_wall_transformer.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/battery/res/substituting_rechargeable_batteries.pdf"
                    ]
                }
            ],
            "edges": [
                {
                    "_id": "A292G7E59HHHC3DFJ",
                    "name": "Yes",
                    "source": "AH8D3GFAB223AHF4D",
                    "target": "4835D6D369EC26H7A"
                },
                {
                    "_id": "73BD9553E6DGH3G5G",
                    "name": "Yes",
                    "source": "6BEEDEEJ83JAAEFG7",
                    "target": "ADDDD56A58CBF9H3D"
                },
                {
                    "_id": "5979H899G924JC2D8",
                    "name": "No",
                    "source": "6BEEDEEJ83JAAEFG7",
                    "target": "268E7G8BC645649D5"
                },
                {
                    "_id": "75DF2F32H7DFC6E9J",
                    "name": "Next",
                    "source": "C6BJFJC76H9254F23",
                    "target": "C8DJB7D4G7CJ8FDE2"
                },
                {
                    "_id": "AEA4GDH64C8FFA88A",
                    "name": "No",
                    "source": "H745B7GEH7BHDEG4E",
                    "target": "6ED2A3G6H4EAJC777"
                },
                {
                    "_id": "C59D445DA48B49278",
                    "name": "No",
                    "source": "AH8D3GFAB223AHF4D",
                    "target": "CBEDAGG55F6CBD65J"
                },
                {
                    "_id": "3FEG52FFJFG55ECFH",
                    "name": "Yes",
                    "source": "J39G8A96HBA9E6F8D",
                    "target": "C6BJFJC76H9254F23"
                },
                {
                    "_id": "346A3AJA48H99794G",
                    "name": "No",
                    "source": "J39G8A96HBA9E6F8D",
                    "target": "F9HAC929GBC5G674E"
                },
                {
                    "_id": "G3E8G8CF8E82HG643",
                    "name": "Yes",
                    "source": "C8DJB7D4G7CJ8FDE2",
                    "target": "FBDEGF4C4B84DG7BF"
                },
                {
                    "_id": "78GF59J9C5B72AGDC",
                    "name": "Next",
                    "source": "6ED2A3G6H4EAJC777",
                    "target": "6BEEDEEJ83JAAEFG7"
                },
                {
                    "_id": "EG7963E3DB8C6EAE8",
                    "name": "No",
                    "source": "C8DJB7D4G7CJ8FDE2",
                    "target": "F9HAC929GBC5G674E"
                },
                {
                    "_id": "H23C9G56F774J63D3",
                    "name": "Yes",
                    "source": "7DJ3CE4ADG6FGED5D",
                    "target": "6C4G9GE79GJ79G7GE"
                },
                {
                    "_id": "3JD8495B4F369HHD9",
                    "name": "Next",
                    "source": "F9HAC929GBC5G674E",
                    "target": "7DJ3CE4ADG6FGED5D"
                },
                {
                    "_id": "5HF3E6CC78C48F9FD",
                    "name": "Yes",
                    "source": "H745B7GEH7BHDEG4E",
                    "target": "AH8D3GFAB223AHF4D"
                },
                {
                    "_id": "E57J5F227H89G684J",
                    "name": "Next",
                    "source": "3342CHHAGA83624H9",
                    "target": "2FFGCJ97ACD7HFB86"
                },
                {
                    "_id": "DHG3JAF42F3E792F4",
                    "name": "Done",
                    "source": "6C4G9GE79GJ79G7GE",
                    "target": "42CA27DJJDE8FBF56"
                },
                {
                    "_id": "97FFA9A2736A497HH",
                    "name": "No",
                    "source": "39F952AJ3HBGJG6AE",
                    "target": "3342CHHAGA83624H9"
                },
                {
                    "_id": "399F34C3GG4CGG239",
                    "name": "Next",
                    "source": "DBADB388ADHHB38JA",
                    "target": "H745B7GEH7BHDEG4E"
                },
                {
                    "_id": "2CD53AC956736CC56",
                    "name": "Next",
                    "source": "CBEDAGG55F6CBD65J",
                    "target": "4835D6D369EC26H7A"
                },
                {
                    "_id": "DH6AFGJ3AGHDF5236",
                    "name": "Next",
                    "source": "E2BEDF7H6H2J6A698",
                    "target": "6C4G9GE79GJ79G7GE"
                },
                {
                    "_id": "E6JFD6HE5H3947EBD",
                    "name": "Yes",
                    "source": "39F952AJ3HBGJG6AE",
                    "target": "2FFGCJ97ACD7HFB86"
                },
                {
                    "_id": "A5JHJF6958GA6E44J",
                    "name": "Done",
                    "source": "ADDDD56A58CBF9H3D",
                    "target": "GA97GH3GC3JE33J36"
                },
                {
                    "_id": "9EF64682B3AFCC6BH",
                    "name": "Next",
                    "source": "4835D6D369EC26H7A",
                    "target": "J39G8A96HBA9E6F8D"
                },
                {
                    "_id": "DAGFCD92JCBGEEB39",
                    "name": "No",
                    "source": "7DJ3CE4ADG6FGED5D",
                    "target": "E2BEDF7H6H2J6A698"
                },
                {
                    "_id": "GBC6E732AC9888F5J",
                    "name": "Done",
                    "source": "FBDEGF4C4B84DG7BF",
                    "target": "42CA27DJJDE8FBF56"
                },
                {
                    "_id": "G7AJG92JH5H78JB9B",
                    "name": "Done",
                    "source": "2FFGCJ97ACD7HFB86",
                    "target": "6238C5GHABJ3F44GA"
                },
                {
                    "_id": "J3C3ACB3BC59A7DC6",
                    "name": "Next",
                    "source": "268E7G8BC645649D5",
                    "target": "39F952AJ3HBGJG6AE"
                }
            ]
        });
    if (!Graphs.Graphs.findOne({_id: "F994G52C9H22CGAAD"}))
        Graphs.Graphs.insert({
            "_id": "F994G52C9H22CGAAD",
            "owner": "GLbCxAz7NaagyH8ZH",
            "firstNode": "J8A252C89A4C5C46H",
            "nodes": [
                {
                    "_id": "22F38349AF4C585D8",
                    "name": "Something",
                    "graphId": "97B52EA53H39GDHFB"
                },
                {
                    "_id": "ACFF86J28842448JD",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "8668FBHC59EA5A7B4",
                    "name": "Something",
                    "graphId": "AG48FFB9624DJE232"
                },
                {
                    "_id": "J8A252C89A4C5C46H",
                    "name": "Power supply troubleshooting required. How is the device powered?",
                    "details": ""
                },
                {
                    "_id": "BE66JAJ89GDCH473E",
                    "name": "Something",
                    "graphId": "557E4HFF36CCD2H9C"
                }
            ],
            "edges": [
                {
                    "_id": "39GJ7A84C2F894HAC",
                    "name": "Battery",
                    "source": "J8A252C89A4C5C46H",
                    "target": "22F38349AF4C585D8"
                },
                {
                    "_id": "F6FD4C59353C9D3E7",
                    "name": "Done",
                    "source": "8668FBHC59EA5A7B4",
                    "target": "ACFF86J28842448JD"
                },
                {
                    "_id": "JHC2BFJ8736D7JGDC",
                    "name": "Done",
                    "source": "22F38349AF4C585D8",
                    "target": "ACFF86J28842448JD"
                },
                {
                    "_id": "BC865JHC9A425A64G",
                    "name": "Outlet and Plug",
                    "source": "J8A252C89A4C5C46H",
                    "target": "BE66JAJ89GDCH473E"
                },
                {
                    "_id": "HEB2JH87H65E58BBG",
                    "name": "External Transformer",
                    "source": "J8A252C89A4C5C46H",
                    "target": "8668FBHC59EA5A7B4"
                },
                {
                    "_id": "3ECEC877688769A58",
                    "name": "Done",
                    "source": "BE66JAJ89GDCH473E",
                    "target": "ACFF86J28842448JD"
                }
            ]
        });
    if (!Graphs.Graphs.findOne({_id: "HGE9F8GEH453C9F5B"}))
        Graphs.Graphs.insert({
            "_id": "HGE9F8GEH453C9F5B",
            "owner": "GLbCxAz7NaagyH8ZH",
            "firstNode": "762C2H7F2398C6437",
            "nodes": [
                {
                    "_id": "3D97D9G63C79GBB3A",
                    "name": "Try to aspirate water droplets with suction machine.",
                    "details": "Use the machine to aspirate water from another container. Place the tubing end just at the surface of the water. The pump might not aspirate if the tubing end is submerged beneath the water’s surface."
                },
                {
                    "_id": "GF75ACA5AECHB8JH7",
                    "name": "Place thumb over suction tip.",
                    "details": "Occlude the end of the tubing that goes in the patient."
                },
                {
                    "_id": "6BH93E447GJ29JA99",
                    "name": "High pressure gauge reading when \"on\"?",
                    "details": "Most suctions pumps have a pressure gauge. When the machine is first turned on, does the gauge give a high reading?"
                },
                {
                    "_id": "FBH92G65G8D9538CH",
                    "name": "Empty collection bottle.",
                    "details": "Clean and empty the bottle."
                },
                {
                    "_id": "BF72B2C83GCAG9B6C",
                    "name": "Does motor run?",
                    "details": "After each attempt to repair the motor, test to see if it works."
                },
                {
                    "_id": "A3E73GFE8675ED34F",
                    "name": "Disconnect pump-side tube from bottle lid.",
                    "details": "Two tubes connect to the lid of the collection bottle. Disconnect the tube to the pump."
                },
                {
                    "_id": "EEE7HCH5E775E5FDE",
                    "name": "Machine is working properly.",
                    "details": "Return the machine to service via the appropriate clinical personnel."
                },
                {
                    "_id": "A8BG2259A7H94EECC",
                    "name": "Create airtight seal on fluid trap lid.",
                    "details": "See BTA skills on plumbing seals. Duct tape may help seal leaks between the collection bottle and lid.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Seals/Plumbing-Seals-SuctionLidsJars v9.pdf"
                    ]
                },
                {
                    "_id": "2EBEE842EH88ECA37",
                    "name": "Place thumb over pump-side tube.",
                    "details": "Occlude the end of the tubing that used to connect to the lid of the collection bottle."
                },
                {
                    "_id": "947A8F2DFHF8FG859",
                    "name": "Is power reaching the pump?",
                    "details": "Use a multimeter to determine if proper voltage is reaching the wires.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/00343.png"
                    ]
                },
                {
                    "_id": "3BE59GBB65G7D4E6F",
                    "name": "Empty fluid trap.",
                    "details": "Clean and empty fluid trap. Make sure ball moves freely.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/CategoryMain-FluidManagement.jpeg"
                    ]
                },
                {
                    "_id": "8EJ5CEGA7B6JCGF4E",
                    "name": "Lubricate and clean motor.",
                    "details": "See BTA skills on cleaning / lubricating motor",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Motors_CleaningAndLubrication/Motors-CleaningLubrication-Lubricant v6.pdf"
                    ]
                },
                {
                    "_id": "24GBE4A7HGGGGAJCC",
                    "name": "Clean/replace bacteria filter.",
                    "details": "Replace the bacteria filter with another filter of 3 micron size. The machine can run for a short time without this filter, but the motor will eventually fail if there is no filter."
                },
                {
                    "_id": "HD6HF2JAH52A57G2A",
                    "name": "Machine can aspirate water droplets?",
                    "details": "Does the collection bottle gradually fill with water?"
                },
                {
                    "_id": "82F4ADCD89DHGGA87",
                    "name": "Clean diaphragm (if applicable)",
                    "details": "The diaphragm of a diaphragm or membrane pump should be cleaned.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/pneumatic_diaphragm.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/screenshot1.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/screenshot2.jpg"
                    ]
                },
                {
                    "_id": "FHBE93C2EHFDC685E",
                    "name": "High pressure gauge reading when \"on\"?",
                    "details": "Most suction pumps have a pressure gauge. When the machine is first turned on, does the gauge give a high reading? If there is no pressure gauge, examine the strength of the suction at different points in the pneumatic circuit, then look for leaks and blockages. \n\nTo check pressure reading following image above and do the following calculation: Pressure (mmHg) = (Height of Water (in inches) ∗ 25.4 (mm/in))/(13.6 (mmH20/mmHg))",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/pressure.png"
                    ]
                },
                {
                    "_id": "3F9JJEF2BCD6EBAD5",
                    "name": "Remove any blockages/kinks in patient- side tubing, or replace patient-side tubing.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Blockage/Plumbing-Blockage-Cleaning v5.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Mechanical_Cleaning/Mechanical-Cleaning-Inside v8.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/0705152315a.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/SS 300 Tubing Replacement (01).JPG"
                    ]
                },
                {
                    "_id": "AA4677CHCB6765G58",
                    "name": "Create an airtight seal on bottle lid.",
                    "details": "See BTA skills on plumbing seals. Duct tape may help seal leaks between the collection bottle and lid. It may be necessary to replace the collection bottle with another airtight container and lid.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Seals/Plumbing-Seals-SuctionLidsJars v9.pdf"
                    ]
                },
                {
                    "_id": "FCDC6ECG357FJ42AH",
                    "name": "Insure patient-side tubes do not leak.",
                    "details": "See BTA skills on plumbing leaks.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-CuttingTubes v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Epoxy v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/plumbing-leaking-holes v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-MeltingTube v6.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/plumbing-leaking-rubberpatches v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Superglue v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Tape v8.pdf"
                    ]
                },
                {
                    "_id": "J2G37C2CF7F7ECE57",
                    "name": "Clean air intake vents/filter.",
                    "details": "The pump's air intake vent or filter should be cleaned.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/filter.jpg"
                    ]
                },
                {
                    "_id": "35C4FHBE22G96C77H",
                    "name": "Consider replacing the motor for the pump or the entire unit.",
                    "details": "If the motor can't be repaired, it is time to replace the motor or the entire unit."
                },
                {
                    "_id": "95626BA88D73277H7",
                    "name": "Does pressure reading increase significantly?",
                    "details": "If the machine is working properly, the pressure gauge should rapidly increase to a higher reading when the end is occluded.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/5800-psi-guage.png"
                    ]
                },
                {
                    "_id": "JHBB45E46762GD8F4",
                    "name": "Disconnect pump-side tube from bottle lid.",
                    "details": "Two tubes connect to the lid of the collection bottle. Disconnect the tube to the pump."
                },
                {
                    "_id": "5E7JJD65E95CF5CCB",
                    "name": "High pressure gauge reading when \"on\"?",
                    "details": "Most suctions pumps have a pressure gauge. When the machine is first turned on, does the gauge give a high reading?"
                },
                {
                    "_id": "8E6G8D6G3GGGJB459",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "6C93B994C48696FD2",
                    "name": "Clean inside of motor.",
                    "details": "The motor may be clogged with dust, dried blood, or other obstructions. See BTA skills on motor cleaning and clean inside pump.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Mechanical_Cleaning/Mechanical-Cleaning-Rust v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/"
                    ]
                },
                {
                    "_id": "33J9HGE8JB4C728A2",
                    "name": "Ensure connections between tubes and bottle lid do not leak.",
                    "details": "See BTA skills on plumbing connections. Try a larger diameter of tubing.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Connections/Plumbing-Connections-Clamps v6.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Connections/Plumbing-Connections-FittingAdapters v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Connections/Plumbing-Connections-HoseBarbwithClamp v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Connections/Plumbing-Connections-ThreadedPipeConnectors v6.pdf"
                    ]
                },
                {
                    "_id": "762C2H7F2398C6437",
                    "name": "Does the pump make noise when turned on?",
                    "details": "The motor or pump makes noise when the device is turned on.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/pump.png"
                    ]
                },
                {
                    "_id": "2G9F826B9CBHEEGED",
                    "name": "Does pressure reading increase significantly?",
                    "details": "If the machine is working properly, the pressure gauge should increase to a higher reading when the tubing end is occluded."
                },
                {
                    "_id": "FBF94D6H6AED9CG76",
                    "name": "Change vanes (if applicable).",
                    "details": "The vanes on rotary vane pumps may wear out. The vanes may be replaced, but the vanes are often expensive and difficult to find.",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/20150304221053_9531.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/screenshot3.jpg"
                    ]
                },
                {
                    "_id": "8H57J5G53JF99GDC8",
                    "name": "Clean brushes.",
                    "details": "See BTA skills on motor brushes",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Motors_CleaningAndLubrication/Motors-CleaningLube-BrushFrozen v10.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/Dremel Carbon Motor Brush 90827 (EN) r20017v15.jpg"
                    ]
                },
                {
                    "_id": "7FJ56H6H46J29788H",
                    "graphId": "F994G52C9H22CGAAD",
                    "name": "Something"
                },
                {
                    "_id": "E57G8FE42A7HA6CH7",
                    "name": "Ensure connections between tubes, pump, and fluid trap do not leak.",
                    "details": "See BTA skills on plumbing connections. Try a larger diameter of tubing.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-CuttingTubes v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Epoxy v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/plumbing-leaking-holes v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-MeltingTube v6.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/plumbing-leaking-rubberpatches v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Superglue v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Tape v8.pdf"
                    ]
                },
                {
                    "_id": "288C6AJEDG8EF5EGC",
                    "name": "Remove any blockages/kinks in tubing between collection bottle and pump.",
                    "details": "See BTA skills on plumbing blockages.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Blockage/Plumbing-Blockage-Cleaning v5.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Mechanical_Cleaning/Mechanical-Cleaning-Inside v8.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/0705152315a.jpg",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/suction/img/SS 300 Tubing Replacement (01).JPG"
                    ]
                },
                {
                    "_id": "J68JGA3HCA27DJH87",
                    "name": "Insure pump-side tubes do not leak.",
                    "details": "See BTA skills on plumbing leaks.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-CuttingTubes v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Epoxy v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/plumbing-leaking-holes v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-MeltingTube v6.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/plumbing-leaking-rubberpatches v8.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Superglue v7.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/BTASkills/BTASkills_Plumbing_Leakages/Plumbing-Leaking-Tape v8.pdf"
                    ]
                },
                {
                    "_id": "E47G2G5JHJB28EFDJ",
                    "name": "Disconnect all tubing from pump and gauge.",
                    "details": "Remove the tubing and/or fluid trap that connects directly to the pump."
                }
            ],
            "edges": [
                {
                    "_id": "725FAC5A3G33C9J4C",
                    "name": "Continue",
                    "source": "J68JGA3HCA27DJH87",
                    "target": "762C2H7F2398C6437"
                },
                {
                    "_id": "F3ECF4E7JJ74956EH",
                    "name": "Continue",
                    "source": "JHBB45E46762GD8F4",
                    "target": "5E7JJD65E95CF5CCB"
                },
                {
                    "_id": "34GD9DFJ54F9D4G97",
                    "name": "Continue",
                    "source": "3BE59GBB65G7D4E6F",
                    "target": "288C6AJEDG8EF5EGC"
                },
                {
                    "_id": "B5H3F656HB393GD43",
                    "name": "Yes",
                    "source": "FHBE93C2EHFDC685E",
                    "target": "JHBB45E46762GD8F4"
                },
                {
                    "_id": "7DFFJG9C8B3537H85",
                    "name": "Continue",
                    "source": "288C6AJEDG8EF5EGC",
                    "target": "24GBE4A7HGGGGAJCC"
                },
                {
                    "_id": "98A684C6GFC85FJ8G",
                    "name": "Continue",
                    "source": "2EBEE842EH88ECA37",
                    "target": "95626BA88D73277H7"
                },
                {
                    "_id": "BDDE3229DE6BG2B2H",
                    "name": "Continue",
                    "source": "6C93B994C48696FD2",
                    "target": "J2G37C2CF7F7ECE57"
                },
                {
                    "_id": "BAC7G6HHC92DA6C75",
                    "name": "Continue",
                    "source": "3F9JJEF2BCD6EBAD5",
                    "target": "FHBE93C2EHFDC685E"
                },
                {
                    "_id": "CGA83H37AB6G7EE27",
                    "name": "Continue",
                    "source": "GF75ACA5AECHB8JH7",
                    "target": "2G9F826B9CBHEEGED"
                },
                {
                    "_id": "BF4FFB7FH36CH9GFG",
                    "name": "Continue",
                    "source": "35C4FHBE22G96C77H",
                    "target": "762C2H7F2398C6437"
                },
                {
                    "_id": "B2H4CGECJJDJ9BFDA",
                    "name": "Continue",
                    "source": "AA4677CHCB6765G58",
                    "target": "33J9HGE8JB4C728A2"
                },
                {
                    "_id": "348AE6D93A6DAAA35",
                    "name": "Yes",
                    "source": "762C2H7F2398C6437",
                    "target": "FHBE93C2EHFDC685E"
                },
                {
                    "_id": "E86CCBAF3B5HGCBD4",
                    "name": "No",
                    "source": "HD6HF2JAH52A57G2A",
                    "target": "J2G37C2CF7F7ECE57"
                },
                {
                    "_id": "D8CCB87D5EHAE8766",
                    "name": "Continue",
                    "source": "3D97D9G63C79GBB3A",
                    "target": "HD6HF2JAH52A57G2A"
                },
                {
                    "_id": "4FH2533D9DF9F23F7",
                    "name": "Continue",
                    "source": "J2G37C2CF7F7ECE57",
                    "target": "8EJ5CEGA7B6JCGF4E"
                },
                {
                    "_id": "HJB5H76B696BE7J28",
                    "name": "Continue",
                    "source": "FBF94D6H6AED9CG76",
                    "target": "BF72B2C83GCAG9B6C"
                },
                {
                    "_id": "3A583763E7G5GJ7AF",
                    "name": "Continue",
                    "source": "A3E73GFE8675ED34F",
                    "target": "2EBEE842EH88ECA37"
                },
                {
                    "_id": "5F35ACH9AJGAH6H35",
                    "name": "No",
                    "source": "95626BA88D73277H7",
                    "target": "A8BG2259A7H94EECC"
                },
                {
                    "_id": "4GJ4J875FCF47D85E",
                    "name": "Done",
                    "source": "EEE7HCH5E775E5FDE",
                    "target": "8E6G8D6G3GGGJB459"
                },
                {
                    "_id": "6DC9HB645AJCBGED5",
                    "name": "No",
                    "source": "FHBE93C2EHFDC685E",
                    "target": "GF75ACA5AECHB8JH7"
                },
                {
                    "_id": "FAJC58A387AC6HA92",
                    "name": "Yes",
                    "source": "6BH93E447GJ29JA99",
                    "target": "6C93B994C48696FD2"
                },
                {
                    "_id": "6E4BE4CAJAJEBG253",
                    "name": "Continue",
                    "source": "E47G2G5JHJB28EFDJ",
                    "target": "6BH93E447GJ29JA99"
                },
                {
                    "_id": "77GF77ADEC4B9B3CE",
                    "name": "No",
                    "source": "2G9F826B9CBHEEGED",
                    "target": "A3E73GFE8675ED34F"
                },
                {
                    "_id": "6H8427CCH7GGHG247",
                    "name": "Continue",
                    "source": "82F4ADCD89DHGGA87",
                    "target": "8H57J5G53JF99GDC8"
                },
                {
                    "_id": "57B4935J5FGD82FHC",
                    "name": "Continue",
                    "source": "33J9HGE8JB4C728A2",
                    "target": "FCDC6ECG357FJ42AH"
                },
                {
                    "_id": "32J34DH8F8JAB32EC",
                    "name": "Continue",
                    "source": "A8BG2259A7H94EECC",
                    "target": "E57G8FE42A7HA6CH7"
                },
                {
                    "_id": "JE6GFGH88C6JJJHA7",
                    "name": "Continue",
                    "source": "FBH92G65G8D9538CH",
                    "target": "3F9JJEF2BCD6EBAD5"
                },
                {
                    "_id": "GCFB5G22A452476D2",
                    "name": "Continue",
                    "source": "24GBE4A7HGGGGAJCC",
                    "target": "FHBE93C2EHFDC685E"
                },
                {
                    "_id": "5H89C68F8D98C57A9",
                    "name": "Yes",
                    "source": "BF72B2C83GCAG9B6C",
                    "target": "762C2H7F2398C6437"
                },
                {
                    "_id": "DG43B8E5D42D639E8",
                    "name": "Continue",
                    "source": "7FJ56H6H46J29788H",
                    "target": "762C2H7F2398C6437"
                },
                {
                    "_id": "HE8AFAB3B5C56G59B",
                    "name": "No",
                    "source": "947A8F2DFHF8FG859",
                    "target": "7FJ56H6H46J29788H"
                },
                {
                    "_id": "GEGG4DAA42AJ76B6H",
                    "name": "Continue",
                    "source": "8H57J5G53JF99GDC8",
                    "target": "FBF94D6H6AED9CG76"
                },
                {
                    "_id": "4EJ8HCE58JF9BEDGH",
                    "name": "Yes",
                    "source": "HD6HF2JAH52A57G2A",
                    "target": "EEE7HCH5E775E5FDE"
                },
                {
                    "_id": "BG22GEBJED473GED5",
                    "name": "Continue",
                    "source": "8EJ5CEGA7B6JCGF4E",
                    "target": "82F4ADCD89DHGGA87"
                },
                {
                    "_id": "448FG7H6HF3GJ7E5J",
                    "name": "Yes",
                    "source": "5E7JJD65E95CF5CCB",
                    "target": "E47G2G5JHJB28EFDJ"
                },
                {
                    "_id": "5GBDJF9B8GE2723DA",
                    "name": "Yes",
                    "source": "95626BA88D73277H7",
                    "target": "AA4677CHCB6765G58"
                },
                {
                    "_id": "CEAE63AG5H4427H55",
                    "name": "Continue",
                    "source": "FCDC6ECG357FJ42AH",
                    "target": "762C2H7F2398C6437"
                },
                {
                    "_id": "JBF7B9JAED95H3JGH",
                    "name": "No",
                    "source": "5E7JJD65E95CF5CCB",
                    "target": "FBH92G65G8D9538CH"
                },
                {
                    "_id": "96J5H2D2ABDJEA43C",
                    "name": "No",
                    "source": "762C2H7F2398C6437",
                    "target": "947A8F2DFHF8FG859"
                },
                {
                    "_id": "B4256BBJE5F65H4JB",
                    "name": "Yes",
                    "source": "2G9F826B9CBHEEGED",
                    "target": "3D97D9G63C79GBB3A"
                },
                {
                    "_id": "F32G4EB8D9DD8GB4F",
                    "name": "No",
                    "source": "BF72B2C83GCAG9B6C",
                    "target": "35C4FHBE22G96C77H"
                },
                {
                    "_id": "8GHG69E6JH4A2642D",
                    "name": "No",
                    "source": "6BH93E447GJ29JA99",
                    "target": "3BE59GBB65G7D4E6F"
                },
                {
                    "_id": "JC9658E32C8AG3G25",
                    "name": "Continue",
                    "source": "E57G8FE42A7HA6CH7",
                    "target": "J68JGA3HCA27DJH87"
                },
                {
                    "_id": "G2F49GH5577F9CE2F",
                    "name": "Yes",
                    "source": "947A8F2DFHF8FG859",
                    "target": "J2G37C2CF7F7ECE57"
                }
            ]
        });
    if (!Graphs.Graphs.findOne({_id: "J93HD3FCJ9JBA95A3"}))
        Graphs.Graphs.insert({
            "_id": "J93HD3FCJ9JBA95A3",
            "owner": "GLbCxAz7NaagyH8ZH",
            "firstNode": "F6A59C8F2J5FABHG8",
            "nodes": [
                {
                    "_id": "522C4EEE34DF49H8E",
                    "name": "Is the steam supply working?",
                    "details": ""
                },
                {
                    "_id": "G67BH563B2376JG9E",
                    "name": "Take gauge out of autoclave. Mimic rising pressure and see if needle moves",
                    "details": ""
                },
                {
                    "_id": "4522A8G9873BE4HBH",
                    "name": "Does the heating element warm up?",
                    "details": ""
                },
                {
                    "_id": "B854ED6FGE7C4G488",
                    "name": "Remove any blocks in exhaust tubing by running distilled water through the tube.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_valves_and_tubes.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/routing_blockage.pdf"
                    ]
                },
                {
                    "_id": "6DH56ACB9AEBCEEH2",
                    "name": "Lubricate seal",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/sealing_autoclave_doors.pdf"
                    ]
                },
                {
                    "_id": "444J2HA53D97278GH",
                    "name": "Clear the gauge vent. Rinse vent with distilled water. Keep gauge dry.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_filters.pdf"
                    ]
                },
                {
                    "_id": "2E56G25HC974BJ657",
                    "name": "If you have autoclave tape, run a test cycle using the tape. You can also use biological indicators",
                    "details": ""
                },
                {
                    "_id": "3JAGAB7DGCA8C36CE",
                    "name": "Is there an indicator lamp?",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_display_on.jpg"
                    ]
                },
                {
                    "_id": "GAFJ5F8CJ4J286A3F",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "GBCB87F9D4HD8GAFE",
                    "name": "Check the timing circuit for broken or damaged connections and components",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/lose_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/selecting_wire.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/desoldering.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/heat_shrink_tubing.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/electrical_tape.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/pin_replacement.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/soldering.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/wire_nuts.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/continuity_tester.pdf"
                    ]
                },
                {
                    "_id": "GA82AG4DEJEDGCB83",
                    "name": "Steam coming out of the autoclave means there is a leak. Look for leaks and fix if you can.",
                    "details": ""
                },
                {
                    "_id": "67F595G99G3G794C6",
                    "name": "What type of seal is around the autoclave door/lid?",
                    "details": ""
                },
                {
                    "_id": "93C6HD3952JAJE367",
                    "name": "Steam should come out of open valves. If not, remove any blocks in valves by running distilled water through them",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_valves_and_tubes.pdf"
                    ]
                },
                {
                    "_id": "944ECG6268FBH62G5",
                    "name": "Are temperature and pressure maintained for the right amount of time?",
                    "details": "INSERT CHART HERE!"
                },
                {
                    "_id": "3EFBG2E3CJCDF7BH9",
                    "name": "Autoclave is functioning properly.",
                    "details": ""
                },
                {
                    "_id": "4H3CF6FHCBB66278D",
                    "name": "Check inlet/outlet tubing for leaks and fix if necessary.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_valves_and_tubes.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/finding_holes_in_tubes.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/rubber_patches_for_tube_repair.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/melting_to_repair_tubes.pdf"
                    ]
                },
                {
                    "_id": "FJDG95646JGFJ4BG5",
                    "name": "Is sterilization confirmed with the tape or biological indicators?",
                    "details": ""
                },
                {
                    "_id": "BBJ9D7HEC76D366B7",
                    "name": "Make sure the time controls are set correctly. Adjust if necessary",
                    "details": "INSERT CHART HERE!"
                },
                {
                    "_id": "78HFG49D83JBB6C28",
                    "name": "Is the resistance less than 20 Ohms?",
                    "details": ""
                },
                {
                    "_id": "CEBJA4H4E88AE8B2F",
                    "name": "Does gauge needle move?",
                    "details": ""
                },
                {
                    "_id": "GCF9F2A42H9F656G5",
                    "name": "Look for blocks/clogs in inlet and outlet filters. Clean or replace filters if necessary.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_filters.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/filter_substitution.pdf"
                    ]
                },
                {
                    "_id": "F6A59C8F2J5FABHG8",
                    "name": "What type of steam supply does this autoclave use?",
                    "details": ""
                },
                {
                    "_id": "GGAJ8C6AHD66C8697",
                    "name": "Is the voltage equal to expected (standard wall) voltage?",
                    "details": ""
                },
                {
                    "_id": "627E9CC3224C6FJ4B",
                    "name": "Use a multimeter to test the voltage across the heating element",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_heating_element.jpg"
                    ]
                },
                {
                    "_id": "J7AG53JBGDJJDFAF9",
                    "name": "The autoclave may need to be replaced. Stop using the autoclave and refer to a specialist",
                    "details": ""
                },
                {
                    "_id": "ECG9ADJ4GG23E3D6C",
                    "name": "Run an autoclave cycle. Do temperature AND pressure gauge needles move?",
                    "details": ""
                },
                {
                    "_id": "895CC93H8EH53883F",
                    "name": "Remove any blocks in exhaust tubing by running distilled water through the tube",
                    "details": "Note: Users should always check chamber drain between cycles for debris. Ensure autoclave staff are aware of this.",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_valves_and_tubes.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/routing_blockage.pdf"
                    ]
                },
                {
                    "_id": "7794B4CG44EGB3938",
                    "name": "Replace the gasket if it is dry of cracked",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/gaskets.pdf"
                    ]
                },
                {
                    "_id": "CD82EDCJAG2J84F82",
                    "name": "Contact facility manager to check steam line to autoclave",
                    "details": ""
                },
                {
                    "_id": "659BFF8B38DHG2CH4",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "CF3FC24JF2244B447",
                    "name": "Check the seals where valves connect to autoclave and fix if necessary.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/sealing_autoclave_doors.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_valve.jpg"
                    ]
                },
                {
                    "_id": "DG5D44JGDDFDBAEEA",
                    "name": "Look at heating element connections. Clean/mend any rusted or cracked connections.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_connectors.pdf"
                    ]
                },
                {
                    "_id": "84E825HBJC52858EF",
                    "name": "After cycle is complete, do temperature and pressure values decrease?",
                    "details": ""
                },
                {
                    "_id": "8FGB6B4DADH84A89B",
                    "name": "Does the lamp light up?",
                    "details": ""
                },
                {
                    "_id": "HHJ36CAEH7H425HCD",
                    "name": "Check that valves open and close smoothly. Clean if necessary.",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_valve.jpg"
                    ]
                },
                {
                    "_id": "86H37FB4EFBH77J6C",
                    "name": "Done",
                    "details": ""
                },
                {
                    "_id": "A2G6JF4J4A3423JFA",
                    "graphId": "F994G52C9H22CGAAD",
                    "name": "Something"
                },
                {
                    "_id": "F926AF7J55C3775AA",
                    "name": "Replace the heating element",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/replacing_heating_elements.pdf"
                    ]
                },
                {
                    "_id": "H839DHAFBE8JBJJF6",
                    "name": "Use a multimeter to test the voltage across the wires leading to the heating element",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_heating_element.jpg"
                    ]
                },
                {
                    "_id": "4FE4524569B966BHD",
                    "name": "Check the timing circuit for broken or damaged connections and components",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/lose_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/selecting_wire.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_connectors.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/desoldering.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/heat_shrink_tubing.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/electrical_tape.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/pin_replacement.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/soldering.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/wire_nuts.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/continuity_tester.pdf"
                    ]
                },
                {
                    "_id": "BAJED7GG8CG752B68",
                    "name": "The gauge needs to be replaced.",
                    "details": ""
                },
                {
                    "_id": "68952B95HE3GFAG5F",
                    "name": "Do temperature and pressure reach required values?",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_pressure_temp_vs_time_chart.jpg"
                    ]
                },
                {
                    "_id": "46794ACGCG8633CAJ",
                    "name": "Check closed valves for leaks and fix if necessary.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_valves_and_tubes.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/finding_holes_in_tubes.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/rubber_patches_for_tube_repair.pdf",
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/melting_to_repair_tubes.pdf"
                    ]
                },
                {
                    "_id": "B99EHH357GG9EF66A",
                    "name": "Clear the gauge vent. Rinse vent with distilled water. Keep gauge dry.",
                    "details": ""
                },
                {
                    "_id": "DJ46FG563H7D89A5B",
                    "name": "Check the control circuit settings",
                    "details": "",
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_voltage.jpg"
                    ]
                },
                {
                    "_id": "FACCAJ729HC7F57C3",
                    "name": "Remove any blocks in valves by running distilled water through them.",
                    "details": "",
                    "resources": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/res/cleaning_valves_and_tubes.pdf"
                    ],
                    "images": [
                        "http://tech-connect-database.s3-website-us-west-2.amazonaws.com/resources/autoclave/imgs/autoclave_safety_valve.jpg"
                    ]
                },
                {
                    "_id": "94J2JAE8CJGD5BFH3",
                    "name": "Take gauge out of autoclave. Mimic rising pressure and see if needle moves",
                    "details": ""
                }
            ],
            "edges": [
                {
                    "_id": "C3299DGB5329DGFFB",
                    "name": "Done",
                    "source": "CD82EDCJAG2J84F82",
                    "target": "GAFJ5F8CJ4J286A3F"
                },
                {
                    "_id": "GFBC4B54DB66GJF9F",
                    "name": "Next",
                    "source": "7794B4CG44EGB3938",
                    "target": "4H3CF6FHCBB66278D"
                },
                {
                    "_id": "EA9H6D52DJ5C46GF7",
                    "name": "Next",
                    "source": "2E56G25HC974BJ657",
                    "target": "FJDG95646JGFJ4BG5"
                },
                {
                    "_id": "67HAF8J9DAA84JF94",
                    "name": "Yes",
                    "source": "CEBJA4H4E88AE8B2F",
                    "target": "ECG9ADJ4GG23E3D6C"
                },
                {
                    "_id": "8F37C8J7HJ53CG947",
                    "name": "Next",
                    "source": "444J2HA53D97278GH",
                    "target": "G67BH563B2376JG9E"
                },
                {
                    "_id": "A382DB5E8BB9E34E2",
                    "name": "Next",
                    "source": "4H3CF6FHCBB66278D",
                    "target": "68952B95HE3GFAG5F"
                },
                {
                    "_id": "733EJ2B833CJG72H7",
                    "name": "Yes",
                    "source": "68952B95HE3GFAG5F",
                    "target": "944ECG6268FBH62G5"
                },
                {
                    "_id": "HA6D2FBJD56925B72",
                    "name": "Next",
                    "source": "94J2JAE8CJGD5BFH3",
                    "target": "CEBJA4H4E88AE8B2F"
                },
                {
                    "_id": "499D2CDJD6A55AE4F",
                    "name": "Next",
                    "source": "GCF9F2A42H9F656G5",
                    "target": "68952B95HE3GFAG5F"
                },
                {
                    "_id": "E6EA9AHH5GB8436GC",
                    "name": "Next",
                    "source": "6DH56ACB9AEBCEEH2",
                    "target": "4H3CF6FHCBB66278D"
                },
                {
                    "_id": "G5FG68HEDJFG6CB8H",
                    "name": "No",
                    "source": "78HFG49D83JBB6C28",
                    "target": "F926AF7J55C3775AA"
                },
                {
                    "_id": "EGB3EEHC9D88CBE4A",
                    "name": "No",
                    "source": "FJDG95646JGFJ4BG5",
                    "target": "J7AG53JBGDJJDFAF9"
                },
                {
                    "_id": "72FB5HCCAD652J3J9",
                    "name": "No: Values are too low",
                    "source": "68952B95HE3GFAG5F",
                    "target": "46794ACGCG8633CAJ"
                },
                {
                    "_id": "5CFF6CC5J82GFA3G3",
                    "name": "No",
                    "source": "CEBJA4H4E88AE8B2F",
                    "target": "BAJED7GG8CG752B68"
                },
                {
                    "_id": "2A8AHA3H27F3D3JGC",
                    "name": "Next",
                    "source": "DG5D44JGDDFDBAEEA",
                    "target": "627E9CC3224C6FJ4B"
                },
                {
                    "_id": "8BECBG53867EH7J3E",
                    "name": "Next",
                    "source": "HHJ36CAEH7H425HCD",
                    "target": "CF3FC24JF2244B447"
                },
                {
                    "_id": "46B2E7G9EH42EGB2G",
                    "name": "Next",
                    "source": "G67BH563B2376JG9E",
                    "target": "GA82AG4DEJEDGCB83"
                },
                {
                    "_id": "B7F7D6HG83DG292FF",
                    "name": "Next",
                    "source": "627E9CC3224C6FJ4B",
                    "target": "78HFG49D83JBB6C28"
                },
                {
                    "_id": "9H7E3EAGHEF2ADJE2",
                    "name": "Yes",
                    "source": "8FGB6B4DADH84A89B",
                    "target": "H839DHAFBE8JBJJF6"
                },
                {
                    "_id": "H9267729C9E26EF93",
                    "name": "Next",
                    "source": "46794ACGCG8633CAJ",
                    "target": "HHJ36CAEH7H425HCD"
                },
                {
                    "_id": "J36GJ529B27823JEJ",
                    "name": "Next",
                    "source": "GA82AG4DEJEDGCB83",
                    "target": "CEBJA4H4E88AE8B2F"
                },
                {
                    "_id": "GDG5C64DHJDH3HBHD",
                    "name": "Next",
                    "source": "FACCAJ729HC7F57C3",
                    "target": "B854ED6FGE7C4G488"
                },
                {
                    "_id": "G5B9GH2GJ288BJ7G8",
                    "name": "Internal Boiler",
                    "source": "F6A59C8F2J5FABHG8",
                    "target": "3JAGAB7DGCA8C36CE"
                },
                {
                    "_id": "BEAAG3HFDC5C22F94",
                    "name": "Checking the power supply to heating element",
                    "source": "A2G6JF4J4A3423JFA",
                    "target": "GGAJ8C6AHD66C8697"
                },
                {
                    "_id": "E8E6EGBBHE3HEAAF5",
                    "name": "Next",
                    "source": "B854ED6FGE7C4G488",
                    "target": "GCF9F2A42H9F656G5"
                },
                {
                    "_id": "7DE29FJ9973GH9AAH",
                    "name": "Gasket Seal",
                    "source": "67F595G99G3G794C6",
                    "target": "7794B4CG44EGB3938"
                },
                {
                    "_id": "67D5F4696BB2F4D3J",
                    "name": "Yes",
                    "source": "4522A8G9873BE4HBH",
                    "target": "ECG9ADJ4GG23E3D6C"
                },
                {
                    "_id": "2D4HBH33A6A83487E",
                    "name": "Next",
                    "source": "895CC93H8EH53883F",
                    "target": "GBCB87F9D4HD8GAFE"
                },
                {
                    "_id": "J6H4924C46B67C6FA",
                    "name": "Checking the lamp light",
                    "source": "A2G6JF4J4A3423JFA",
                    "target": "8FGB6B4DADH84A89B"
                },
                {
                    "_id": "3C56E7JBD8B422HHJ",
                    "name": "Yes",
                    "source": "FJDG95646JGFJ4BG5",
                    "target": "3EFBG2E3CJCDF7BH9"
                },
                {
                    "_id": "EB5955AHDEH7B245H",
                    "name": "Next",
                    "source": "B99EHH357GG9EF66A",
                    "target": "94J2JAE8CJGD5BFH3"
                },
                {
                    "_id": "82GJC2A4GG9GD5623",
                    "name": "Yes",
                    "source": "84E825HBJC52858EF",
                    "target": "2E56G25HC974BJ657"
                },
                {
                    "_id": "G54682DJGGC6B9A8C",
                    "name": "Next",
                    "source": "CF3FC24JF2244B447",
                    "target": "67F595G99G3G794C6"
                },
                {
                    "_id": "339JA6FEJ989HH2EB",
                    "name": "Yes",
                    "source": "3JAGAB7DGCA8C36CE",
                    "target": "8FGB6B4DADH84A89B"
                },
                {
                    "_id": "C5CCF66257HGHGCDE",
                    "name": "External boiler",
                    "source": "F6A59C8F2J5FABHG8",
                    "target": "3JAGAB7DGCA8C36CE"
                },
                {
                    "_id": "AH5F7G74GBD8C68CC",
                    "name": "Next",
                    "source": "F926AF7J55C3775AA",
                    "target": "3JAGAB7DGCA8C36CE"
                },
                {
                    "_id": "HJ7A62H7GD2889669",
                    "name": "No",
                    "source": "4522A8G9873BE4HBH",
                    "target": "DG5D44JGDDFDBAEEA"
                },
                {
                    "_id": "F2GJ9A5J8G5JD2C2E",
                    "name": "No",
                    "source": "944ECG6268FBH62G5",
                    "target": "BBJ9D7HEC76D366B7"
                },
                {
                    "_id": "4AC624EJ82DHH5DF8",
                    "name": "No",
                    "source": "8FGB6B4DADH84A89B",
                    "target": "A2G6JF4J4A3423JFA"
                },
                {
                    "_id": "49J7CCC9BD276JHE8",
                    "name": "Next",
                    "source": "DJ46FG563H7D89A5B",
                    "target": "A2G6JF4J4A3423JFA"
                },
                {
                    "_id": "57DHE7E2AJB9EJHF8",
                    "name": "Next",
                    "source": "GBCB87F9D4HD8GAFE",
                    "target": "84E825HBJC52858EF"
                },
                {
                    "_id": "FB6F2D84JED76FJ77",
                    "name": "Yes",
                    "source": "GGAJ8C6AHD66C8697",
                    "target": "4522A8G9873BE4HBH"
                },
                {
                    "_id": "AHHBJJ8GHFH6C733D",
                    "name": "External steam supply",
                    "source": "F6A59C8F2J5FABHG8",
                    "target": "522C4EEE34DF49H8E"
                },
                {
                    "_id": "E7HH685DE8H3246J3",
                    "name": "Yes",
                    "source": "ECG9ADJ4GG23E3D6C",
                    "target": "68952B95HE3GFAG5F"
                },
                {
                    "_id": "D3EE6EBD22F34H42G",
                    "name": "Metal-on-metal seal",
                    "source": "67F595G99G3G794C6",
                    "target": "6DH56ACB9AEBCEEH2"
                },
                {
                    "_id": "7J86D6CJEJ7JBD7CD",
                    "name": "Yes",
                    "source": "78HFG49D83JBB6C28",
                    "target": "3JAGAB7DGCA8C36CE"
                },
                {
                    "_id": "AFCF2J5JED7EJ5FHJ",
                    "name": "Yes",
                    "source": "522C4EEE34DF49H8E",
                    "target": "3JAGAB7DGCA8C36CE"
                },
                {
                    "_id": "7D4JDE7F9AG4A4GH5",
                    "name": "No: Values are too high",
                    "source": "68952B95HE3GFAG5F",
                    "target": "FACCAJ729HC7F57C3"
                },
                {
                    "_id": "98EHG6288DE946D29",
                    "name": "No",
                    "source": "84E825HBJC52858EF",
                    "target": "93C6HD3952JAJE367"
                },
                {
                    "_id": "66HJF9JCC76J5FF49",
                    "name": "No",
                    "source": "522C4EEE34DF49H8E",
                    "target": "CD82EDCJAG2J84F82"
                },
                {
                    "_id": "2D5FJCEJJHG2DAF2B",
                    "name": "No, temperature gauge stays at 0.",
                    "source": "ECG9ADJ4GG23E3D6C",
                    "target": "B99EHH357GG9EF66A"
                },
                {
                    "_id": "9H248D3JJD5JDDDJC",
                    "name": "Done",
                    "source": "3EFBG2E3CJCDF7BH9",
                    "target": "659BFF8B38DHG2CH4"
                },
                {
                    "_id": "8H262J7CE48GB225G",
                    "name": "Next",
                    "source": "BBJ9D7HEC76D366B7",
                    "target": "4FE4524569B966BHD"
                },
                {
                    "_id": "A7HJ834248E56JFGJ",
                    "name": "Next",
                    "source": "4FE4524569B966BHD",
                    "target": "944ECG6268FBH62G5"
                },
                {
                    "_id": "D9CG425A76E27JF42",
                    "name": "Next",
                    "source": "H839DHAFBE8JBJJF6",
                    "target": "GGAJ8C6AHD66C8697"
                },
                {
                    "_id": "7EH77HB4D4574BJHA",
                    "name": "Next",
                    "source": "93C6HD3952JAJE367",
                    "target": "895CC93H8EH53883F"
                },
                {
                    "_id": "CB9697DA952B94ABE",
                    "name": "No",
                    "source": "3JAGAB7DGCA8C36CE",
                    "target": "H839DHAFBE8JBJJF6"
                },
                {
                    "_id": "AF63EF827BGE6E32B",
                    "name": "Yes",
                    "source": "944ECG6268FBH62G5",
                    "target": "84E825HBJC52858EF"
                },
                {
                    "_id": "G2F46535CF45EJCG5",
                    "name": "Done",
                    "source": "BAJED7GG8CG752B68",
                    "target": "86H37FB4EFBH77J6C"
                },
                {
                    "_id": "2B4J94DDD98G4CF24",
                    "name": "No",
                    "source": "GGAJ8C6AHD66C8697",
                    "target": "DJ46FG563H7D89A5B"
                },
                {
                    "_id": "A7H9B34669J29794A",
                    "name": "No, pressure gauge stays at 0.",
                    "source": "ECG9ADJ4GG23E3D6C",
                    "target": "444J2HA53D97278GH"
                }
            ]
        });

    if (!Charts.Charts.findOne({name: "Suction Machine"}))
        Charts.Charts.insert({
            "_id": "77D4EC29C5836CB59",
            "name": "Suction Machine",
            "description": ".",
            "createdDate": "2016-11-08T12:11:32.187-0500",
            "updatedDate": "2016-11-08T12:11:32.187-0500",
            "version": "VERSION 1.0",
            "owner": "GLbCxAz7NaagyH8ZH",
            "resources": [],
            "type": "device",
            "upvoted": [],
            "downvoted": [],
            "comments": [],
            "graph": "HGE9F8GEH453C9F5B"
        });
    if (!Charts.Charts.findOne({name: "Autoclave"}))
        Charts.Charts.insert({
            "_id": "8592A4G4E6D388BFJ",
            "name": "Autoclave",
            "description": ".",
            "createdDate": "2016-11-08T12:09:42.301-0500",
            "updatedDate": "2016-11-08T12:09:42.301-0500",
            "version": "VERSION 1.0",
            "owner": "GLbCxAz7NaagyH8ZH",
            "resources": [],
            "type": "device",
            "upvoted": [],
            "downvoted": [],
            "comments": [],
            "graph": "J93HD3FCJ9JBA95A3"
        });
}
catch (err) {
    // Just in case, this should never stop the server from starting
    console.log(err);
}