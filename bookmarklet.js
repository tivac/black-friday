/*jshint browser:true */
window.blackfriday = function() {
    "use strict";
    
    Object.keys(window.Deal.controller.deals).forEach(function(deal) {
        deal = window.Deal.controller.deals[deal];
        if (deal.dealState !== "upcoming") {
            return;
        }
        
        console.log(deal.dealID + " : " + deal.detail.title);
    });
};
