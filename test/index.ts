import KrakenClient from '../kraken';
var kraken = new KrakenClient('', '', undefined);

/*
// Display user's balance
kraken.api('Balance', null, function(error, data) {
    if(error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
*/

// Get Ticker Info
kraken.api('Ticker', {"pair": 'XXBTZEUR'}, function(error, data) {
    if(error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
