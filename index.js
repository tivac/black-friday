/*jshint node:true */

"use strict";

var fs      = require("fs"),
    argv    = require("optimist")
                .usage("Scrape Amaazon Black Friday countdown deals.\nUsage: $0 -c [customer ID] [deal ID] [deal ID] ... [deal ID]")
                .options(require("./args.json"))
                .argv,
    request = require("request"),
    async   = require("async"),
    jar, _purchase, _desc;

// convert to MS
argv.delay = argv.delay * 1000;

if(!argv._.length) {
    console.error("You must specify some deal IDs.");
    
    process.exit(function() {
        process.exit(1);
    });
}

// set up cookie jar for purchase request
jar = request.jar();

fs.readFileSync(argv.cookie, { encoding : "utf8" }).split("; ").forEach(function(cookie) {
    if(!cookie.length) {
        return;
    }
    
    jar.add(request.cookie(cookie));
});

// describe a deal
_desc = function(deal) {
    return deal.dealID + " : " + deal.title;
};

// add item to cart
_purchase = function(deal, done) {
    // retry up to 5 times
    async.timesSeries(argv.retries, function(n, cb) {
        request.post({
            url : "http://www.amazon.com/gp/deal/ajax/redeemDeal.html/ref=gb1h_atc_c-3_0482_" + deal.dealID,
            qs  : {
                "marketplaceID" : argv.marketplace,
                "dealID"        : deal.legacyDealID,
                "asin"          : deal.teaserAsin || deal.reviewAsin,
                "sessionID"     : argv.session,
                "nocache"       : Date.now()
            },
            jar  : jar,
            json : true
        }, function(err, http, body) {
            if(err) {
                console.error(err);
                
                return cb();
            }
            
            if(body.redeemed) {
                console.log("Added deal: " + _desc(deal));
                
                // Bail early by sending back a fake error
                return cb("success");
            }
            
            cb();
        });
    }, function(err) {
        if(err && err !== "success") {
            console.log("Failed adding:" + _desc(deal));
        }
        
        done();
    });
};


// Go get deal details
request.post({
    url    : "http://www.amazon.com/xa/dealcontent/v2/GetDealStatus?nocache=" + Date.now(),
    json   : {
        "requestMetadata" : {
            "marketplaceID" : argv.marketplace,
            "clientID"      : "goldbox",
            "sessionID"     : argv.session,
            "customerID"    : argv.customer
        },
        
        "dealTargets" : argv._.map(function(id) {
            return {
                dealID  : String(id),
                itemIDs : null
            };
        }),
        
        "responseSize"     : "ALL",
        "itemResponseSize" : "NONE"
    }
}, function(err, res, body) {
        if(err) {
            console.error(err);
            
            return;
        }
        
        console.log("Deals:");
        
        Object.keys(body.dealStatus).forEach(function(deal) {
            console.log(_desc(body.dealDetails[deal]));
        });
        
        console.log("");
        
        console.log("Going to work...");
        async.each(
            Object.keys(body.dealStatus),
            function(deal, done) {
                var delay;
                
                deal  = body.dealDetails[deal];
                delay = body.dealStatus[deal.dealID].msToStart > argv.delay ?
                            body.dealStatus[deal.dealID].msToStart - Math.floor(argv.delay / 2) :
                            0;
                
                if(delay) {
                    console.log(_desc(deal) + "\n  Waiting " + Math.floor(delay / 1000) + "s to add");
                }
                
                setTimeout(
                    function() {
                        console.log(_desc(deal) + " Added to cart!");
                        _purchase(deal, done);
                    },
                    delay
                );
            },
            function(err) {
                console.log("Finished!");
                
                if(err) {
                    console.log(err);
                }
            }
        );
    }
);
