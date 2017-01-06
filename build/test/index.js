"use strict";
var kraken_1 = require("../kraken");
var kraken = new kraken_1.KrakenClient('', '', undefined);
kraken.api('Ticker', { "pair": 'XXBTZEUR' }, function (error, data) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
