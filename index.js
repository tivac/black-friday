/*jshint node:true */

"use strict";

var fs      = require("fs"),
    argv    = require("optimist")
                .usage("Scrape Amaazon Black Friday countdown deals.\nUsage: $0 -c [customer ID] [deal ID] [deal ID] ... [deal ID]")
                .options(require("./args.json"))
                .argv,
    request = require("request"),
    async   = require("async"),
    jar, _purchase;

//console.log(argv);

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

fs.readFileSync(argv.cookie, { encoding : "utf8" }).split("\n").forEach(function(cookie) {
    if(!cookie.length) {
        return;
    }
    
    jar.add(request.cookie(cookie));
});

// add item to cart
_purchase = function(deal, details, done) {
    request.post({
        url : "http://www.amazon.com/gp/deal/ajax/redeemDeal.html/ref=gb1h_atc_c-3_0482_" + deal,
        qs  : {
            "marketplaceID" : argv.marketplace,
            "dealID"        : details.legacyDealID,
            "asin"          : details.teaserAsin || details.reviewAsin,
            "sessionID"     : argv.session,
            "nocache"       : Date.now()
        },
        json : true,
        jar  : jar
    }, function(err, http, body) {
        debugger;
        
        if(err) {
            console.error(err);
            
            return done(err);
        }
        
        if(body.redeemed) {
            console.log("Added deal: " + deal + " (" + details.title + ")");
            
            return done();
        }
        
        if(details.retry) {
            console.log("Failed adding:" + deal + " (" + details.title + ")");
            
            return done();
        }
        
        details.retry = 1;
        
        _purchase(deal, details, done);
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
                dealID  : id,
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
        
        async.each(
            Object.keys(body.dealStatus),
            function(deal, done) {
                var details, delay;
                
                details = body.dealDetails[deal];
                delay   = body.dealStatus[deal].msToStart > argv.delay ?
                            body.dealStatus[deal].msToStart - Math.floor(argv.delay / 2) :
                            0;
                
                if(delay) {
                    console.log("Waiting " + Math.floor(delay / 1000) + "s to add " + deal + " (" + details.title + ")");
                }
                
                setTimeout(
                    function() {
                        console.log("Adding deal: " + deal + " (" + details.title + ")");
                        _purchase(deal, details, done);
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
