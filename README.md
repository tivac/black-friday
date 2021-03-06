black-friday
=============

Utility to automatically purchase amazon black friday deals

## Install ##

1.  Install NodeJS from http://nodejs.org/
2.  [Download ZIP](https://github.com/tivac/black-friday/archive/master.zip) of the source
3.  Unzip to a folder
4.  Open shell inside that folder
5.  Run `npm install`
6.  Follow [Instructions](#instructions)

## Instructions ##

1.  Launch Chrome
2.  Open the Amazon black friday deals page
3.  Press `F12` to open the developer tools
4.  Select the `Console` tab
5.  Inject the [Bookmarklet](#bookmarklet)
6.  Click through every page of the upcoming deals section to ensure all the data has been loaded
7.  Type `blackfriday()` into the Chrome console and hit `enter`
8.  Copy the command shown to a shell inside the `black-friday` folder
9.  Save the `Cookie Data` string to a `cookie.txt` file inside the `black-friday` folder
10. Make note of the deal IDs you are interested in
11. Append those deal IDs to the end of the command you copied in step 7
12. Hit `enter` in your shell.


Note: you can pass multiple deal IDs.

    node . --customer=<customerID> --session=<sessionID> <dealID> <dealID> <dealID>

## Usage ##

    Scrape Amaazon Black Friday countdown deals.
    Usage: node C:\Users\Tivac\Documents\Programming\black-friday -c [customer ID] [deal ID] [deal ID] ... [deal ID]

    Options:
      --marketplace, -m  Amazon.com marketplace ID                            [default: "ATVPDKIKX0DER"]
      --customer, -i     Amazon.com customer ID                               [required]
      --session, -s      Amazon.com session ID                                [required]
      --delay, -d        Average roundtrip time for you to Amazon in seconds  [default: 1]
      --cookie, -c       Where to find the file containing your cookie data   [default: "./cookie.txt"]
      
## Bookmarklet ##

Save this as a bookmark & click it on the Amazon Black Friday page.

    javascript:(function%20()%20%7Bvar%20script%20=%20document.createElement(%22script%22);script.src%20=%20%22https://rawgithub.com/tivac/black-friday/master/bookmarklet.js%22;document.getElementsByTagName(%22head%22)[0].appendChild(script);%7D());
    
Or you can open chrome dev tools and paste the following into the `Console` tab then hit `enter`.

    (function () {var script = document.createElement("script");script.src = "https://rawgithub.com/tivac/black-friday/master/bookmarklet.js";document.getElementsByTagName("head")[0].appendChild(script);}());

After injecting the code simply type `blackfriday()` into the console to get a list of all the loaded upcoming dealIDs & their name.
    
    Black Friday Info
    
    Command
    node . --customer=<customerID> --session=<sessionID>
    
    Cookie data
    (save to cookie.txt inside the black-friday folder)
    ...
    ...
    ...
    ...
    
    Deal Details
    bd149c0a : Stunt Puppy Stunt Runner Hands-Free Dog Leash
    8dafcfe0 : Wahl Professional Animal Kennel Pro Heavy-Duty Home Pet Grooming Kit
