black-friday
=============

Utility to automatically purchase amazon black friday deals

## Install ##

    Copy

## Usage ##

    Scrape Amaazon Black Friday countdown deals.
    Usage: node C:\Users\Tivac\Documents\Programming\black-friday -c [customer ID] [deal ID] [deal ID] ... [deal ID]

    Options:
      --marketplace, -m  Amazon.com marketplace ID                            [default: "ATVPDKIKX0DER"]
      --customer, -i     Amazon.com customer ID                               [required]
      --session, -s      Amazon.com session ID                                [required]
      --delay, -d        Average roundtrip time for you to Amazon in seconds  [default: 1]
      --cookie, -c       Where to find the file containing your cookie data   [default: "./cookie.txt"]

## Instructions ##

1.  Launch Chrome
2.  Press `F12` to open the developer tools
3.  Select the `Network` tab
4.  Filter to just `XHR`
5.  Watch for a `GetDealStatus` request, & select it
6.  Look at the `Form Data` section & make note of the `sessionID` & `customerID` values
7.  Look at the `Request Headers` section & copy the `Cookie:` item's value (everything after `Cookie: ), save this to a txt file
8.  Find the deals you want to purchase, right-click their countdown timer, and choose `Inspect Element`
9.  Double-click the `id` attribute of the selected `<span>` element, it should look like: `<span id="6f295c55_starts_in_timer"`
10. Copy everything prior to `_starts_in_timer` from that, that is your deal ID
11. Launch the application like this: `node . --customer=<customerID> --session=<sessionID> <dealID>` where `customerID` & `sessionID` are the values from step 6 and `dealID` is the value from step 9.

Note: you can pass multiple deal IDs.

    node . --customer=<customerID> --session=<sessionID> <dealID> <dealID> <dealID>
