import mapData from '../data/map-before.json';
import listingsData from '../data/listings.json'

//Create list of neighborhoods
var neighbourhoodList = [];

mapData.features.forEach(function(borough, boroughIndex){
    neighbourhoodList.push(borough.properties.neighbourhood);
});

// console.log(JSON.stringify(neighbourhoodList));

//Sort listings by borough
var sortedListings = [];

neighbourhoodList.forEach(function(nItem, nIndex){
  //For each neighborhood add a borough key to the new array
  sortedListings[nItem] = [];
  //Push each item in the listing data to the array if the neighborhood matches the key 
    listingsData.forEach(function(item, index){
        if(item['neighbourhood'] === nItem){
          sortedListings[nItem].push(item);
        }
    });
});

// console.log(sortedListings);



var dAverages = {};

Object.keys(sortedListings).forEach(function(key) {
  var totalEntirePrice = 0;
  var totalPrivatePrice = 0;
  var totalSharedPrice = 0;

  var numberOfEntireProperties = 0;
  var numberOfPrivateProperties = 0;
  var numberOfSharedProperties = 0;

  var entireAverage = 0;
  var privateAverage = 0;
  var sharedAverage = 0;

  var entireUpper = 0;
  var privateUpper = 0;
  var sharedUpper = 0;

  var entireLower = 0;
  var privateLower = 0;
  var sharedLower = 0;

  sortedListings[key].forEach(function(nItem, nIndex){
    if(nItem["room_type"] === "Entire home/apt"){
      numberOfEntireProperties++;
      totalEntirePrice = totalEntirePrice + nItem["price"];
    }
    if(nItem["room_type"] === "Private room"){
      numberOfPrivateProperties++;
      totalPrivatePrice = totalPrivatePrice + nItem["price"];
    }
    if(nItem["room_type"] === "Shared room"){
      numberOfSharedProperties++;
      totalSharedPrice = totalSharedPrice + nItem["price"];
    }
  })

  entireAverage = totalEntirePrice / numberOfEntireProperties;
  privateAverage = totalPrivatePrice / numberOfPrivateProperties;
  sharedAverage = totalSharedPrice / numberOfSharedProperties;

  dAverages[key] = {
    "totalNumProperties": sortedListings[key].length,
    "entireAveragePrice": entireAverage,
    "entireNumProperties": numberOfEntireProperties,
    "entirePercentage": numberOfEntireProperties / sortedListings[key].length,
    "privateAveragePrice": privateAverage,
    "privateNumProperties": numberOfPrivateProperties,
    "privatePercentage": numberOfPrivateProperties / sortedListings[key].length,
    "sharedAveragePrice": sharedAverage,
    "sharedNumProperties": numberOfSharedProperties,
    "sharedPercentage": numberOfSharedProperties / sortedListings[key].length,
    "propertiesComparison": [
      {"propertyType":"Entire home/apt", "numberOfProperties":numberOfEntireProperties}, 
      {"propertyType":"Private room", "numberOfProperties":numberOfPrivateProperties}, 
      {"propertyType":"Shared room", "numberOfProperties":numberOfSharedProperties}
    ]
  };
});

mapData["features"].forEach(function(featuresItem){
  var neighbourhood = featuresItem["properties"]["neighbourhood"];
  featuresItem["properties"]["stats"] = dAverages[neighbourhood];
})

console.log(JSON.stringify(mapData));