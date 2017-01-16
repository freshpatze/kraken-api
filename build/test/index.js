"use strict";
var KrakenClient = require('../kraken');
var kraken = new KrakenClient('', '');
kraken.api('Ticker', { "pair": 'XXBTZEUR' }, function (error, data) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
