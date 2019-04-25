import mapData from '../data/map-before.json';
import listingsData from '../data/listings.json'

let totalEntirePrice = 0;
let totalPrivatePrice = 0;
let totalSharedPrice = 0;

let numberOfEntireProperties = 0;
let numberOfPrivateProperties = 0;
let numberOfSharedProperties = 0;

let entireAverage = 0;
let privateAverage = 0;
let sharedAverage = 0;

class Polygon {

  constructor(dMap, dListings) {
    let dBoroughList = this.createList(dMap);
    let dSortedListings = this.sortListings(dListings, dBoroughList);
    let dAggregatedListings = this.calculateAverages(dSortedListings);
    let combineData = this.combineData(dMap, dAggregatedListings);
  }

  createList(dMap) {
    let boroughList = [];

    dMap.features.forEach(function(borough, boroughIndex){
      boroughList.push(borough.properties.neighbourhood);
    });

    return boroughList;
  }

  sortListings(dListings, boroughArray) {

    //*********HIGHLIGHTS ERROR - ARRAY INSTEAD OF OBJECT************

    var sortedListings = {};

    boroughArray.forEach(function(nItem, nIndex){

      sortedListings[nItem] = [];

      dListings.forEach(function(item, index){

        if(item['neighbourhood'] === nItem){

          sortedListings[nItem].push(item);

        }

      });
    });

    return sortedListings
  }

  calculateAverages(dListings){

    let dAverages = {};

    Object.keys(dListings).forEach(function(key) {

      dListings[key].forEach(function(nItem, nIndex){
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
        "totalNumProperties": dListings[key].length,
        "entireAveragePrice": entireAverage,
        "entireNumProperties": numberOfEntireProperties,
        "entirePercentage": numberOfEntireProperties / dListings[key].length,
        "privateAveragePrice": privateAverage,
        "privateNumProperties": numberOfPrivateProperties,
        "privatePercentage": numberOfPrivateProperties / dListings[key].length,
        "sharedAveragePrice": sharedAverage,
        "sharedNumProperties": numberOfSharedProperties,
        "sharedPercentage": numberOfSharedProperties / dListings[key].length,
        "propertiesComparison": [
          {"propertyType":"Entire home/apt", "numberOfProperties":numberOfEntireProperties}, 
          {"propertyType":"Private room", "numberOfProperties":numberOfPrivateProperties}, 
          {"propertyType":"Shared room", "numberOfProperties":numberOfSharedProperties}
        ]
      };

    });

    return dAverages;

  }

  combineData(dMap, dAverages){

    dMap["features"].forEach(function(featuresItem){

      var neighbourhood = featuresItem["properties"]["neighbourhood"];

      featuresItem["properties"]["stats"] = dAverages[neighbourhood];

    })

    return dMap;

  }

}

export default new Polygon(mapData, listingsData);