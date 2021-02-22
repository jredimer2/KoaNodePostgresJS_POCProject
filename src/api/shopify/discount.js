"use strict";

const axios = require('axios');

let createPriceRule = async ({shop, access_token, price_rule_data={}}) => {
    return new Promise( async (resolve, reject)  => {
        try {

            console.log('>>>>>>> createPriceRule   TP-1   access_token =', access_token)
            var data = {
                "price_rule": {
                  "title": "NEWPR1",
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
    
            console.log('>>>>>>> createPriceRule   TP-2')
            var config = {
                method: 'post',
                url: `https://${shop}/admin/api/2020-10/price_rules.json`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': access_token
                },
                data: data
            };
    
            console.log('>>>>>>> createPriceRule   TP-3')
            let newPriceRule = await axios(config);
            console.log('>>>>>>> createPriceRule   TP-4')
            newPriceRule = newPriceRule.data;
            console.log('>>>>>>> createPriceRule   TP-5')
            console.log({newPriceRule});
            console.log('>>>>>>> createPriceRule   TP-6')
            resolve(newPriceRule);
            console.log('>>>>>>> createPriceRule   TP-7')
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
    
}


let createDiscountCode = async ({shop, access_token, price_rule_id, code}) => {
    return new Promise( async (resolve, reject)  => {
        
        if(!(shop && access_token && price_rule_id && code)) {
            return reject("shop, access_token, price_rule_id and code are required");
        }

        try {
            var data = {
                "discount_code": {
                  "code": code
                }
            };
    
            var config = {
                method: 'post',
                url: `https://${shop}/admin/api/2020-10/price_rules/${price_rule_id}/discount_codes.json`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': access_token
                },
                data: data
            };
    
            let discount = await axios(config);
            discount = discount.data;   
            console.log({discount});
            resolve(discount);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
    
}


module.exports = {
    createDiscountCode,
    createPriceRule
}