// Type definitions for kraken-exchange-api 0.2.0
// Project: kraken-api
// Definitions by: Ruben Callewaert https://github.com/5an1ty

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = KrakenClient;

/*~ Write your module's methods and properties in this class */
declare class KrakenClient {
    constructor(key?: string, secret?: string, otp?: string);

    api(method: string, params: any, callback: Function): any;
}
