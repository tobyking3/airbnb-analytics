var chai = require('chai');
var expect = chai.expect;

let Averages = require('../src/js/averages');

let fixtureMap = 
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
}

describe("Borough List", function(){
    it("Creates a array of boroughs", function (){
        
        let arrayList = Averages.createBoroughList(fixtureMap);
        let expectedArrayList = ["Kingston upon Thames","Croydon","Bromley"];

        expect(arrayList).is.eql(expectedArrayList);

    });
});