const chai = require('chai');
const expect = chai.expect;

import app from '../src/js/room-type';

const fixtureListings = [
  {
    neighbourhood_cleansed: "Haringey",
    accommodates: 2,
    price: "$35.00"
  },
  {
    neighbourhood_cleansed: "Haringey",
    accommodates: 2,
    price: "$65.00"
  },
  {
    neighbourhood_cleansed: "Haringey",
    accommodates: 1,
    price: "$100.00"
  },
  {
    neighbourhood_cleansed: "Westminster",
    accommodates: 6,
    price: "$300.00"
  }
];

const fixtureNeighborhoods = ["Haringey", "Westminster"];

describe("createList()", function(){

    let createListResult = app.createList(fixtureListings, fixtureNeighborhoods);

    it("Returns an object", function (){
        expect(createListResult).to.be.an('object');
    });

    it("Returns an array", function (){
        expect(createListResult['Haringey']).to.be.an('array');
    });

    it("Includes a list of boroughs", function (){
        expect(createListResult).to.contain.keys('Haringey', 'Westminster');
    });

});

const fixtureSortedListings = 
{ Haringey:
   [ { neighbourhood_cleansed: 'Haringey',
       accommodates: 2,
       price: '$35.00' },
     { neighbourhood_cleansed: 'Haringey',
       accommodates: 2,
       price: '$65.00' },
     { neighbourhood_cleansed: 'Haringey',
       accommodates: 1,
       price: '$100.00' } ],
  Westminster:
   [ { neighbourhood_cleansed: 'Westminster',
       accommodates: 6,
       price: '$300.00' } ] 
};

describe("categorize()", function(){

    let categorizeResult = app.categorize(fixtureSortedListings);

    it("Returns an object", function (){
        expect(categorizeResult).to.be.an('object');
    });

    it("Identifies unique categories of accommodation number", function (){
        expect(categorizeResult['Haringey']).is.eql([{ accommodates: 2 }, { accommodates: 1 }])
    });

});

const fixtureBoroughs = 
{ 
    Haringey: [ 
        { accommodates: 2 },
        { accommodates: 1 } 
    ],
    Westminster: [ 
        { accommodates: 6 }
    ] 
};

describe("sort()", function(){

    let sortResult = app.sort(fixtureBoroughs, fixtureSortedListings);
    console.log(sortResult);

    it("Returns an object", function (){
        expect(sortResult).to.be.an('object');
    });

    it("Counts the properties with the same number of accommodates", function (){
        expect(sortResult['Haringey'][0]['count']).to.equal(1);
        expect(sortResult['Haringey'][1]['count']).to.equal(2);
    });

    it("Converts the price into an float", function (){
        expect(sortResult['Haringey'][0]['totalPrice']).to.be.an('number');
    });

    it("Calculates the average price", function (){
        expect(sortResult['Haringey'][1]['average']).to.equal(50);
    });

});
