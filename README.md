
# README


## Description

Serves as a backend server for [my website.](https://www.rohanchugh.com/) Runs using Express.js in Node.js, and serves as a semi-proxy server for the Megabus API and other requests that the website may need to make from a non-browser origin to avoid CORS on public APIs. This server is hosted on Railway, and the website is hosted on Netlify. Plans to expand this into a database API endpoint for other projects in the future.

## Usage
Use by running the node script with the following command:
```bash
node app.js
```
Move into "./City ID Script" and run the following in order to update the city ID list in case of an update or changes from Megabus:
```bash
cd ./City\ ID\ Script
node script.js
```

**Note:** The city ID list is updated automatically, but this is contingent on **manual updating of the uniqueCities.json file**. You can find the file in the "./City ID Script" directory. Find the city IDs for those three listed cities by going to the Network tab of Chrome or preferred browser on Megabus's website when searching for a trip. Enter the cities as the "From" city, and you can either check the request made to find destinations after typing in that city, or put a random city and check the URL for the query string "originId". The city ID is the number after "originId=". Once that is done, run the script as noted above and it will update cities.json in the root directory.
## API Spec
The main API call that will act as the proxy will take in a body will the following format:
```json
{
    "url": "https://www.megabus.com/journey-planner/api/journeys", // REQUIRED
    "method": "GET", // REQUIRED
    "headers": {
        // enter headers here, optional
    },
    "body": {
        // enter body of request here, optional
    }
}
```
The server will also add any query strings that are in the /proxy URL to the request URL. For example, if the request is made to /proxy?test=1 with a URL of https://www.testurl.com/api, the request will be made to https://www.testurl.com/api?test=1. 

Ensure that you only put query strings in **one location**, either in the **/proxy URL** or added to the  the **'url' section** of the request. If you put it in both, the request will fail.
