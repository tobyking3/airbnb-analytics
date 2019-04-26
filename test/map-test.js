const chai = require('chai');
const expect = chai.expect;

import app from '../src/js/averages';

const fixtureMap = 
{
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "MultiPolygon",
                coordinates: []
            },
            "properties": {
                neighbourhood: "Kingston upon Thames",
                neighbourhood_group: null
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "MultiPolygon",
                coordinates: []
            },
            "properties": {
                neighbourhood: "Croydon",
                neighbourhood_group: null
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "MultiPolygon",
                coordinates: []
            },
            "properties": {
                neighbourhood: "Bromley",
                neighbourhood_group: null
            }
        }
    ]
};

const boroughList = ["Kingston upon Thames","Croydon","Bromley"];

describe("createList()", function(){

    let createListResult = app.createList(fixtureMap);

    it("Returns an array", function (){
        expect(createListResult).to.be.an('array');
    });

    it("Includes a list of boroughs", function (){
        expect(createListResult).is.eql(boroughList);
    });
});

const fixtureListings =
[
  {
    name: "Cozy, 3 minutes to Piccadilly Line",
    neighbourhood: "Kingston upon Thames",
    room_type: "Private room",
    price: 35,
  },
  {
    name: "The Sanctuary",
    neighbourhood: "Kingston upon Thames",
    room_type: "Private room",
    price: 70,
  },
  {
    name: "Holiday London DB Room Let-on going",
    neighbourhood: "Croydon",
    room_type: "Private room",
    price: 65,
  },
  {
    name: "Superb 3-Bed/2 Bath & Wifi: Trendy W1",
    neighbourhood: "Kingston upon Thames",
    room_type: "Entire home/apt",
    price: 300,
  },
  {
    name: "Battersea 2 bedroom house & parking",
    neighbourhood: "Croydon",
    room_type: "Entire home/apt",
    price: 150,
  },
  {
    name: "The Sanctuary",
    neighbourhood: "Bromley",
    room_type: "Private room",
    price: 70,
  }
];

describe("sortListings()", function(){

    let sortListingsResult = app.sortListings(fixtureListings, boroughList);

    it("Returns an object", function (){
        expect(sortListingsResult).to.be.an('object');
    });

    it("Sets the neighbourhoods as the object keys", function (){
        expect(sortListingsResult).to.contain.keys('Bromley', 'Kingston upon Thames', 'Croydon');
    });

    it("Is an array", function (){
        expect(sortListingsResult["Kingston upon Thames"]).to.be.an('array');
    });

    it("Has a length of 3", function (){
        expect(sortListingsResult["Kingston upon Thames"].length).to.equal(3);
    });
});

const fixtureSortedListings = 

{ 'Kingston upon Thames':
   [ { name: 'Cozy, 3 minutes to Piccadilly Line',
       neighbourhood: 'Kingston upon Thames',
       room_type: 'Private room',
       price: 20 },
     { name: 'The Sanctuary',
       neighbourhood: 'Kingston upon Thames',
       room_type: 'Private room',
       price: 100 },
     { name: 'Superb 3-Bed/2 Bath & Wifi: Trendy W1',
       neighbourhood: 'Kingston upon Thames',
       room_type: 'Entire home/apt',
       price: 120 },
       { name: 'Something',
       neighbourhood: 'Kingston upon Thames',
       room_type: 'Shared room',
       price: 70 } ],
  Croydon:
   [ { name: 'Holiday London DB Room Let-on going',
       neighbourhood: 'Croydon',
       room_type: 'Private room',
       price: 70 },
     { name: 'Battersea 2 bedroom house & parking',
       neighbourhood: 'Croydon',
       room_type: 'Entire home/apt',
       price: 150 },
       { name: 'This',
       neighbourhood: 'Croyden',
       room_type: 'Shared room',
       price: 70 } ],
  Bromley:
   [ { name: 'The Sanctuary',
       neighbourhood: 'Bromley',
       room_type: 'Private room',
       price: 70 },
       { name: 'Other',
       neighbourhood: 'Bromley',
       room_type: 'Shared room',
       price: 70 } ] 
};

describe("calculateAverages()", function(){

    let calculateAveragesResult = app.calculateAverages(fixtureSortedListings);
    
    it("Returns an object", function (){
        expect(calculateAveragesResult).to.be.an('object');
    });

    it("Returns an object", function (){
        expect(calculateAveragesResult['Kingston upon Thames']).to.be.an('object');
    });

    it("Calculates the total number of properties", function (){
        expect(calculateAveragesResult['Kingston upon Thames']['totalNumProperties']).to.equal(4);
    });

    it("Counts the number of property types", function (){
        expect(calculateAveragesResult['Kingston upon Thames']['entireNumProperties']).to.equal(1);
        expect(calculateAveragesResult['Kingston upon Thames']['privateNumProperties']).to.equal(2);
        expect(calculateAveragesResult['Kingston upon Thames']['sharedNumProperties']).to.equal(1);
    });

    it("Calculates the percentage of each property type", function (){
        expect(calculateAveragesResult['Kingston upon Thames']['entireAveragePrice']).to.equal(120);
        expect(calculateAveragesResult['Kingston upon Thames']['privateAveragePrice']).to.equal(60);
        expect(calculateAveragesResult['Kingston upon Thames']['sharedAveragePrice']).to.equal(70);
    });

    it("Calculates the average prices", function (){
        expect(calculateAveragesResult['Kingston upon Thames']['entirePercentage']).to.equal(0.25);
        expect(calculateAveragesResult['Kingston upon Thames']['privatePercentage']).to.equal(0.5);
        expect(calculateAveragesResult['Kingston upon Thames']['sharedPercentage']).to.equal(0.25);
    });
    
});

const fixtureAverages = 

{ "Kingston upon Thames":
   { totalNumProperties: 4,
     entireAveragePrice: 120,
     entireNumProperties: 1,
     entirePercentage: 0.25,
     privateAveragePrice: 60,
     privateNumProperties: 2,
     privatePercentage: 0.5,
     sharedAveragePrice: 70,
     sharedNumProperties: 1,
     sharedPercentage: 0.25,
     propertiesComparison: [] },
  Croydon:
   { totalNumProperties: 3,
     entireAveragePrice: 150,
     entireNumProperties: 1,
     entirePercentage: 0.3333333333333333,
     privateAveragePrice: 70,
     privateNumProperties: 1,
     privatePercentage: 0.3333333333333333,
     sharedAveragePrice: 70,
     sharedNumProperties: 1,
     sharedPercentage: 0.3333333333333333,
     propertiesComparison: [] },
  Bromley:
   { totalNumProperties: 2,
     entireAveragePrice: NaN,
     entireNumProperties: 0,
     entirePercentage: 0,
     privateAveragePrice: 70,
     privateNumProperties: 1,
     privatePercentage: 0.5,
     sharedAveragePrice: 70,
     sharedNumProperties: 1,
     sharedPercentage: 0.5,
     propertiesComparison: [] }
 };

describe("combineData()", function(){

    let finalDataset = app.combineData(fixtureMap, fixtureAverages);
    
    it("It merges the averages data with the map data", function (){
        expect(finalDataset['features'][0]['properties']).to.contain.keys('stats');
    });

});
