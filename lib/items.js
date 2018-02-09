"use strict";

var containers = {
    "cont1": {},
    "cont2": {}
};

var items = {
    "item1": {
        "container": "cont1",
        "name": "Skruvar",
        "properties": [{
            id: "101",
            type: "Status",
            value: 1
        }]
    },
    "item2": {
        "container": "cont1",
        "name": "Hammare",
        "properties": [{
            id: "100",
            type: "Antal",
            value: 5
        }]
    },
    "osc": {
        "container": "cont2",
        "name": "Oscilloskåp",
        "properties": [{
            id: "124",
            type: "Senast kalibreringsdatum",
            value: new Date().toISOString()
        }, {
            id: "121",
            type: "Programvara version",
            value: "21.0.3"
        }]
    }
};