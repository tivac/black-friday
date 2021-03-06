/*jshint browser:true, devel:true */
window.blackfriday = function() {
    "use strict";
    
    var deals = [];
    
    console.log("%cBlack Friday Info", "font-size: x-large; font-weight: bold;");
    console.log("");
    
    console.log("%cCommand", "font-size: large");
    console.log("node . --customer=" + window.Deal.controller.dealServiceClients.DealContentService.customer_id + " --session=" + window.ue_sid);
    console.log("");
    
    console.log("%cCookie data", "font-size: large");
    console.log("(save to cookie.txt inside the black-friday folder)");
    console.log(document.cookie);
    console.log("");
    
    
    console.log("%cDeal Details", "font-size: x-large;");
    Object.keys(window.Deal.controller.deals).forEach(function(deal) {
        deal = window.Deal.controller.deals[deal];
        if (deal.dealState !== "upcoming") {
            return;
        }
        
        deals.push({ id : deal.dealID, title : deal.detail.title.trim() });
    });
    
    deals.sort(function(a, b) {
        return a.title.localeCompare(b.title);
    });
    
    deals.forEach(function(deal) {
        console.log(deal.id + " : " + deal.title);
    });
};
