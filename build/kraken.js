"use strict";
var request = require('request');
var crypto = require('crypto');
var querystring = require('qs');
var KrakenClient = (function () {
    function KrakenClient(key, secret, otp) {
        if (key === void 0) { key = ''; }
        if (secret === void 0) { secret = ''; }
        this.config = {
            url: 'https://api.kraken.com',
            version: '0',
            key: key,
            secret: secret,
            otp: otp,
            timeoutMS: 5000
        };
    }
    KrakenClient.prototype.api = function (method, params, callback) {
        var methods = {
            public: ['Time', 'Assets', 'AssetPairs', 'Ticker', 'Depth', 'Trades', 'Spread', 'OHLC'],
            private: ['Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders', 'QueryOrders', 'TradesHistory', 'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers', 'TradeVolume', 'AddOrder', 'CancelOrder']
        };
        if (methods.public.indexOf(method) !== -1) {
            return this.publicMethod(method, params, callback);
        }
        else if (methods.private.indexOf(method) !== -1) {
            return this.privateMethod(method, params, callback);
        }
        else {
            throw new Error(method + ' is not a valid API method.');
        }
    };
    KrakenClient.prototype.publicMethod = function (method, params, callback) {
        params = params || {};
        var path = '/' + this.config.version + '/public/' + method;
        var url = this.config.url + path;
        return this.rawRequest(url, {}, params, callback);
    };
    KrakenClient.prototype.privateMethod = function (method, params, callback) {
        params = params || {};
        var path = '/' + this.config.version + '/private/' + method;
        var url = this.config.url + path;
        params.nonce = +new Date() * 1000;
        if (this.config.otp !== undefined) {
            params.otp = this.config.otp;
        }
        var signature = this.getMessageSignature(path, params, params.nonce);
        var headers = {
            'API-Key': this.config.key,
            'API-Sign': signature
        };
        return this.rawRequest(url, headers, params, callback);
    };
    KrakenClient.prototype.getMessageSignature = function (path, request, nonce) {
        var message = querystring.stringify(request, { encodeValuesOnly: true });
        var secret = new Buffer(this.config.secret, 'base64');
        var hash = crypto.createHash('sha256');
        var hmac = crypto.createHmac('sha512', secret);
        var hash_digest = hash.update(nonce + message).digest('latin1');
        var hmac_digest = hmac.update(path + hash_digest, 'latin1').digest('base64');
        return hmac_digest;
    };
    KrakenClient.prototype.rawRequest = function (url, headers, params, callback) {
        headers['User-Agent'] = 'Kraken Javascript API Client';
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            form: params,
            timeout: this.config.timeoutMS
        };
        var req = request.post(options, function (error, response, body) {
            if (typeof callback === 'function') {
                var data;
                if (error) {
                    callback(new Error('Error in server response: ' + JSON.stringify(error)), null);
                    return;
                }
                try {
                    data = JSON.parse(body);
                }
                catch (e) {
                    callback(new Error('Could not understand response from server: ' + body), null);
                    return;
                }
                if (data.error && data.error.length) {
                    callback(data.error, null);
                }
                else {
                    callback(null, data);
                }
            }
        });
        return req;
    };
    return KrakenClient;
}());
module.exports = KrakenClient;
