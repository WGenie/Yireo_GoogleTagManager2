define([
    'jquery',
    'yireoGoogleTagManagerPush'
], function ($, pusher) {
    'use strict';

    const enabled = window.YIREO_GOOGLETAGMANAGER2_ENABLED;
    if (enabled === null || enabled === undefined) {
        return function (targetWidget) {
            return $.mage.catalogAddToCart;
        };
    }

    var mixin = {
        submitForm: function (form) {
            const formData = Object.fromEntries(new FormData(form[0]).entries());
            const productId = formData.product;

            let debugClicks = false;
            if (typeof YIREO_GOOGLETAGMANAGER2_DEBUG_CLICKS !== 'undefined') {
                debugClicks = YIREO_GOOGLETAGMANAGER2_DEBUG_CLICKS;
            }

            const productData = window['YIREO_GOOGLETAGMANAGER2_PRODUCT_DATA_ID_' + productId] || {};
            productData.quantity = formData.qty || 1;

            const eventData = {
                'event': 'add_to_cart',
                'ecommerce': {
                    'items': [productData]
                }
            };

            if (debugClicks && confirm("Press to continue with add-to-cart") === false) {
                return;
            }

            pusher(eventData, 'push [catalog-add-to-cart-mixin.js]');
            return this._super(form);
        }
    };

    return function (targetWidget) {
        $.widget('mage.catalogAddToCart', targetWidget, mixin);
        return $.mage.catalogAddToCart;
    };
});
