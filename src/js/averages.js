import mapData from '../data/map-before.json';
import listingsData from '../data/listings.json'

let totalEntirePrice;
let totalPrivatePrice;
let totalSharedPrice;

let numberOfEntireProperties;
let numberOfPrivateProperties;
let numberOfSharedProperties;

let entireAverage;
let privateAverage;
let sharedAverage;

class Aggregate {

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

    let sortedListings = {};

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

      totalEntirePrice = 0;
      totalPrivatePrice = 0;
      totalSharedPrice = 0;

      numberOfEntireProperties = 0;
      numberOfPrivateProperties = 0;
      numberOfSharedProperties = 0;

      entireAverage = 0;
      privateAverage = 0;
      sharedAverage = 0;

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

      // format new object to be added to GeoJSON

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

export default new Aggregate(mapData, listingsData);