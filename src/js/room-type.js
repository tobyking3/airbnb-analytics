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

Object.keys(accommodatesArr).forEach(function(key) {

    var boroughArray = accommodatesArr[key];
    boroughArray.sort(compare);

    listingsByBorough[key].forEach(function(listing, nIndex){

        var listingPriceStr = listing.price.substr(1);
        var listingPrice = parseFloat(listingPriceStr);
        var listingAccommodates = listing.accommodates;

        for(var i = 0; i < boroughArray.length; i++){
            if(listingAccommodates === accommodatesArr[key][i]["accommodates"]){

                if(!("totalPrice" in accommodatesArr[key][i])){
                    accommodatesArr[key][i]["totalPrice"] = listingPrice;
                } else {
                    accommodatesArr[key][i]["totalPrice"] = accommodatesArr[key][i]["totalPrice"] + listingPrice;
                }

                if(!("count" in accommodatesArr[key][i])){
                    accommodatesArr[key][i]["count"] = 1;
                } else {
                    accommodatesArr[key][i]["count"] = accommodatesArr[key][i]["count"] + 1;
                }

                accommodatesArr[key][i]["average"] = accommodatesArr[key][i]["totalPrice"] / accommodatesArr[key][i]["count"];
            }
        }
    })
})

function compare(a,b) {
  if (a.accommodates < b.accommodates)
    return -1;
  if (a.accommodates > b.accommodates)
    return 1;
  return 0;
}

console.log(JSON.stringify(accommodatesArr));
