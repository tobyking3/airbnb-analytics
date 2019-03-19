import data from '../data/listings-cleansed.json';

var neighbourhoods = ["Kingston upon Thames","Croydon","Bromley","Hounslow","Ealing","Havering","Hillingdon","Harrow","Brent","Barnet","Enfield","Waltham Forest","Redbridge","Sutton","Lambeth","Southwark","Lewisham","Greenwich","Bexley","Richmond upon Thames","Merton","Wandsworth","Hammersmith and Fulham","Kensington and Chelsea","City of London","Westminster","Camden","Tower Hamlets","Islington","Hackney","Haringey","Newham","Barking and Dagenham"];

var listingsByBorough = [];

neighbourhoods.forEach(function(nItem, nIndex){
  listingsByBorough[nItem] = [];
    data.forEach(function(item, index){
        if(item['neighbourhood_cleansed'] === nItem){
          listingsByBorough[nItem].push(item);
        }
    });
});

//===================================================================================================================

var accommodatesArr = {};

Object.keys(listingsByBorough).forEach(function(key) {
    accommodatesArr[key] = [];
    listingsByBorough[key].forEach(function(nItem, nIndex){
        var index = accommodatesArr[key].findIndex(x => x.accommodates==nItem.accommodates);
        if (index === -1){accommodatesArr[key].push({"accommodates": nItem.accommodates});}
    })
})

console.log(JSON.stringify(accommodatesArr));

//===================================================================================================================

var accommodates = {};

Object.keys(listingsByBorough).forEach(function(key) {

    accommodates[key] = {};

    listingsByBorough[key].forEach(function(nItem, nIndex){

        if(nItem.accommodates in accommodates[key]){
            accommodates[key][nItem.accommodates]["count"] = accommodates[key][nItem.accommodates]["count"] + 1;
        } else {
            accommodates[key][nItem.accommodates] = {"count": 1};
        }

        var priceStr = nItem.price.substr(1);
        var priceFlo = parseFloat(priceStr);

        Object.keys(accommodates[key]).forEach(function(newKey) {
            if(nItem.accommodates == newKey){
                if("total" in accommodates[key][nItem.accommodates]){
                    accommodates[key][nItem.accommodates]["total"] = accommodates[key][nItem.accommodates]["total"] + priceFlo;
                } else {
                    accommodates[key][nItem.accommodates]["total"] = priceFlo;
                }
            }
        })

        Object.keys(accommodates[key]).forEach(function(newKey) {
            accommodates[key][nItem.accommodates]["average"] = accommodates[key][nItem.accommodates]["total"] / accommodates[key][nItem.accommodates]["count"];
        })


    })
})

console.log(JSON.stringify(accommodates));
