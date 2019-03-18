import listingsCleansed from '../data/listings-cleansed.json';

var neighbourhoods = ["Kingston upon Thames","Croydon","Bromley","Hounslow","Ealing","Havering","Hillingdon","Harrow","Brent","Barnet","Enfield","Waltham Forest","Redbridge","Sutton","Lambeth","Southwark","Lewisham","Greenwich","Bexley","Richmond upon Thames","Merton","Wandsworth","Hammersmith and Fulham","Kensington and Chelsea","City of London","Westminster","Camden","Tower Hamlets","Islington","Hackney","Haringey","Newham","Barking and Dagenham"];

var sortedListings = [];

neighbourhoods.forEach(function(nItem, nIndex){
  sortedListings[nItem] = [];
    listingsCleansed.forEach(function(item, index){
        if(item['neighbourhood_cleansed'] === nItem){
          sortedListings[nItem].push(item);
        }
    });
});

//console.log(sortedListings);

var accommodates = neighbourhoods;

Object.keys(sortedListings).forEach(function(key) {

    var obj = {};

    sortedListings[key].forEach(function(nItem, nIndex){
        var format = nItem.price.substr(1);
        var price = parseFloat(format);

        if(!(nItem.accommodates in obj)){
            obj[nItem.accommodates] = price;
        } else {
            obj[nItem.accommodates] = obj[nItem.accommodates] + price;
        }
    })

    console.log(obj);
})

