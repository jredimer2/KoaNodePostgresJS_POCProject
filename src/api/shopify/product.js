"use strict";

const axios = require('axios');

let getCollectionsList = async ({shop, access_token}) => {
    return new Promise( async (resolve, reject)  => {
        try {

            console.log('>>>>>>> getCollectionsList   TP-1   access_token =', access_token)

            /*
            var data = {
                "price_rule": {
                  "title": "SUMMERSALE10OFF",
                  "target_type": "line_item",
                  "target_selection": "all",
                  "allocation_method": "across",
                  "value_type": "percentage",
                  "value": "-10.0",
                  "customer_selection": "all",
                  "starts_at": "2017-01-19T17:59:10Z",
                  ...price_rule_data
                }
            };
            */
    
           //url: `https://${shop}/admin/api/2021-01/collections/{collection_id}.json`,
           console.log('>>>>>>> getCollectionsList   TP-2')
            var config = {
                method: 'get',
                url: `https://${shop}/admin/api/2021-01/custom_collections.json`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': access_token
                },
                data: null
            };
    
            console.log('>>>>>>> getCollectionsList   TP-3')
            let collectionsList = await axios(config).then(response => response.data);

            console.log('>>>>>>>>>>> getCollectionsList  ', collectionsList)
            resolve(collectionsList)

            /*
            console.log('>>>>>>> createPriceRule   TP-4')
            newPriceRule = newPriceRule.data;
            console.log('>>>>>>> createPriceRule   TP-5')
            console.log({newPriceRule});
            console.log('>>>>>>> createPriceRule   TP-6')
            resolve(newPriceRule);
            console.log('>>>>>>> createPriceRule   TP-7')
            */
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
    
}

module.exports = {
    getCollectionsList
}