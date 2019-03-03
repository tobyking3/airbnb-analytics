import _ from 'lodash';
import printMe from './print.js';
import './scss/styles.scss';
import * as d3 from 'd3';
import 'd3-selection-multi';
import map from './js/map.js'
import showPanel from './js/panel.js'
import dListings from './data/listings.json'
import dMap from './data/mapRaw.json'

var dSortedListings = [];
var dAverages = {};

var neighbourhoodList =
["Kingston upon Thames",
"Croydon",
"Bromley",
"Hounslow",
"Ealing",
"Havering",
"Hillingdon",
"Harrow",
"Brent",
"Barnet",
"Enfield",
"Waltham Forest",
"Redbridge",
"Sutton",
"Lambeth",
"Southwark",
"Lewisham",
"Greenwich",
"Bexley",
"Richmond upon Thames",
"Merton",
"Wandsworth",
"Hammersmith and Fulham",
"Kensington and Chelsea",
"City of London",
"Westminster",
"Camden",
"Tower Hamlets",
"Islington",
"Hackney",
"Haringey",
"Newham",
"Barking and Dagenham"];

neighbourhoodList.forEach(function(nItem, nIndex){
  dSortedListings[nItem] = [];
    dListings.forEach(function(item, index){
        if(item['neighbourhood'] === nItem){
          dSortedListings[nItem].push(item);
        }
    });
});

Object.keys(dSortedListings).forEach(function(key) {
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

  dSortedListings[key].forEach(function(nItem, nIndex){
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
    "totalNumProperties": dSortedListings[key].length,
    "entireAveragePrice": entireAverage,
    "entireNumProperties": numberOfEntireProperties,
    "entirePercentage": numberOfEntireProperties / dSortedListings[key].length,
    "privateAveragePrice": privateAverage,
    "privateNumProperties": numberOfPrivateProperties,
    "privatePercentage": numberOfPrivateProperties / dSortedListings[key].length,
    "sharedAveragePrice": sharedAverage,
    "sharedNumProperties": numberOfSharedProperties,
    "sharedPercentage": numberOfSharedProperties / dSortedListings[key].length,
    "propertiesComparison": [
      {"propertyType":"Entire home/apt", "numberOfProperties":numberOfEntireProperties}, 
      {"propertyType":"Private room", "numberOfProperties":numberOfPrivateProperties}, 
      {"propertyType":"Shared room", "numberOfProperties":numberOfSharedProperties}
    ]
  };
});

// console.log(JSON.stringify(dAverages));
// console.log(JSON.stringify(dAverages["Barking and Dagenham"]["properties"]));

dMap["features"].forEach(function(featuresItem){
  delete featuresItem["properties"]["Entire home/apt"];
  delete featuresItem["properties"]["Private room"];
  delete featuresItem["properties"]["Shared room"];
  delete featuresItem["properties"]["neighbourhood_group"];

  var neighbourhood = featuresItem["properties"]["neighbourhood"];
  featuresItem["properties"]["stats"] = dAverages[neighbourhood];
})

// console.log(JSON.stringify(dMap));

//Initialize Panel
showPanel(0, "#17c4ff");