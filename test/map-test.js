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

const boroughList = ["Kingston upon Thames","Croydon","Bromley"];

describe("createList()", function(){
    it("Creates a array of boroughs", function (){
        let createListResult = app.createList(fixtureMap);
        expect(createListResult).is.eql(boroughList);
    });
});

describe("sortListings()", function(){

    let sortListingsResult = app.sortListings(fixtureListings, boroughList);

    it("Populates the array with listings", function (){
        expect(sortListingsResult).to.contain.keys('Bromley', 'Kingston upon Thames', 'Croydon');;
    });

    it("Other", function (){
        expect(sortListingsResult["Kingston upon Thames"].length).to.equal(3);
    });
});
