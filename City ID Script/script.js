/* 
    Script that finds IDs for all cities, can be used again
    if IDs change. Could be optimized with separate async 
    searches for each connected component, but no practical usage
    for this since it still runs in a reasonable time (~20s locally)

    Essentially performs a BFS from each city with its destinations
    The cities form a graph with multiple connected components, meaning
    one city from each connected component is required in order to get all
    city IDs

    A list of cities that are all part of unique connected components can be 
    found in "uniqueCities.json" and will need to be manually updated in the 
    event that those cities change from Megabus's website.

    Interestingly, Worcester, MA seems to be a node (and the only one)
    with only one edge, and it is an undirected edge, meaning there 
    is a single, one-way bus route in Worcester, MA, and it only leaves to one 
    city: New York, NY
*/

async function getAllCityValues() {
    console.log("Testing");
    const cities = require("./initialCities.json");
    const uniqueCities = require("./uniqueCities.json");
    const fs = require("fs");
    let citiesRemaining = new Set(Object.keys(cities));
    let citiesToSearch = [];
    // initialize starting search according to uniqueCities.json
    for (let city in uniqueCities) {
        cities[city] = uniqueCities[city];
        citiesToSearch.push(city);
    }
    console.log("Beginning search, number of cities to find: " + citiesRemaining.size);
    while (citiesToSearch.length != 0) {
        console.log("Length: " + citiesToSearch.length);
        for (let i = 0; i < citiesToSearch.length; i++) {
            let city = citiesToSearch.shift();
            
            if (!citiesRemaining.has(city)) {
                continue;
            }
            let connections = await fetch(
                `https://us.megabus.com/journey-planner/api/destination-cities?originCityId=${cities[city]}`
            );
            connections = await connections.json();
            connections = connections["cities"];
            citiesRemaining.delete(city);
            console.log(
                "Found " +
                    connections.length +
                    " cities, looping through them now."
            );
            for (let connection of connections) {
                // city does not have its ID yet, set it and add it to queue
                if (cities[connection["name"]] == -1) {
                    cities[connection["name"]] = connection["id"];
                    citiesToSearch.push(connection["name"]);
                }
            }
            console.log(
                "Finished looping, new length of cities to search: " +
                    citiesToSearch.length
            );
        }
    }
    console.log(citiesRemaining);
    console.log(citiesRemaining.size);
    console.log("Final cities with IDs: ");
    console.log(cities);
    console.log("Saving to file \"cities.json\" in root directory...")
    const jsonString = JSON.stringify(cities, null, 2);
    fs.writeFileSync('./cities.json', jsonString)
    console.log("Finished!");
    console.log("These are the contents:");
    console.log(fs.readFileSync("./cities.json", "utf8"));
    
}

getAllCityValues();
