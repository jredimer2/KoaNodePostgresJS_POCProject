"use strict";

const axios = require('axios');

/**
 * 
 * call this whenever the customer installs the app
 * address can be something like: https://next-react-koa-node/webhooks/app-uninstalled"
 *
 */
let registerShopUninstallWebhook = async ({shop, access_token, address}) => {
    return new Promise( async (resolve, reject)  => {
        try {
            let data = {
                "webhook": {
                  "topic": "app/uninstalled",
                  "address": address,
                  "format": "json"
                }
            }
    
            let config = {
                method: 'post',
                url: `https://${shop}/admin/api/2020-10/webhooks.json`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': access_token
                },
                data: data
            };
    
            let webhookRegistered = await axios(config);
            webhookRegistered = webhookRegistered.data;
            console.log({webhookRegistered});
            resolve(webhookRegistered);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
    
}


/**
 * 
 * This endpoint will be called by Shopify
 */
let appUninstalled = async ({shop, access_token}) => {
    console.log("appUninstalled:start");

    return new Promise( async (resolve, reject)  => {
        try {
            let app_uninstalled = false;
            try {
        
                // it is possible that the webhook receive can be wrong or someone hit the URL directly somehow
                // so, we will verify if the token is valid or not by calling an API
        
                let config = {
                    method: 'get',
                    url: `https://${shop}/admin/api/2020-10/shop.json`,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': access_token
                    }
                };
        
                let webhookRegistered = await axios(config);
                // API call was successful, that means the token is still valid and app has not been uninstallled
                console.log('API call was successful, that means the token is still valid and app has not been uninstallled');
            } catch (error) {
                console.error(error);
                // customer has uninstalled the app
        
                app_uninstalled = true;
            }
        
            if(app_uninstalled) {
                try {
                    await setStoreInactive(shop);
                } catch (error) {
                    console.error(error);
                    return reject(error);
                }
            }
        
            resolve(app_uninstalled);
            
        } catch (error) {
            reject(error);
        }
    });
}


let setStoreInactive = (shop) => {
    console.log('setStoreInactive:start');
    return new Promise( async (resolve, reject)  => {
        try {
            // find the shop in the database
            // let shopObj = await Shop.findOne({where: {shop: shop} });
            let shopObj= {} // database object for example
    
            shopObj.uninstalled = true;
            shopObj.uninstalled_at = new Date();
            shopObj.access_token = null;
            // await shopObj.save(); // save the shop

            resolve(shopObj);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

module.exports = {
    registerShopUninstallWebhook,
    appUninstalled
}