const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3001;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>{
 console.log(`Website backend and proxy listening on port ${port}!`)
});

// setup a request at /testing that will subsequently make an http GET request to
// the following URL: https://catfact.ninja/fact
app.get("/testing", (req, res) => {
    axios.get("https://catfact.ninja/fact").then((response) => {
        res.send(response.data);
    });
});

// setup a POST request at /proxy that will make an HTTP request according to the
// parameters passed in the body of the request
// a sample request looks like the following:
/*
{
    "url": "https://www.megabus.com/journey-planner/api/journeys",
    "method": "POST",
    "headers": {
        // enter headers here
    },
    "body": {
        // enter body of request here
    }
}
*/
app.post("/proxy", (req, res) => {
    // get the request query strings
    const queryStrings = req.query;
    if(queryStrings) {
        console.log("url:", req.body);
        console.log("Found query strings:\n", queryStrings)
        // add the query strings to the URL
        req.body.url += "?" + Object.keys(queryStrings).map((key) => {
            return key + "=" + queryStrings[key];
        }).join("&");
        console.log("Updated url:", req.body.url)
    }
    
    let request = {};
    request.url = req.body.url;
    request.method = req.body.method;
    if(req.body.body && Object.keys(req.body.body).length !== 0) {
        request.data = req.body.body;
    }
    if(req.body.headers && Object.keys(req.body.headers).length !== 0) {
        request.headers = req.body.headers;
    }
    
    axios(request).then((response) => {
        res.send(response.data);
    }).catch((error) => {
        console.error(error);
    });
   
});
