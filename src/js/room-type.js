import listingsData from '../data/listings-cleansed.json';
var neighbourhoods = ["Kingston upon Thames","Croydon","Bromley","Hounslow","Ealing","Havering","Hillingdon","Harrow","Brent","Barnet","Enfield","Waltham Forest","Redbridge","Sutton","Lambeth","Southwark","Lewisham","Greenwich","Bexley","Richmond upon Thames","Merton","Wandsworth","Hammersmith and Fulham","Kensington and Chelsea","City of London","Westminster","Camden","Tower Hamlets","Islington","Hackney","Haringey","Newham","Barking and Dagenham"];

class RoomType {

    constructor(dListings) {
        let dSortedListings = this.createList(dListings, neighbourhoods);
        let dListingCategories = this.categorize(dSortedListings);
        let dFinalDataset = this.sort(dListingCategories, dSortedListings);
    }

    createList(dListings, dNeighbourhoods) {

        let boroughList = {};

        dNeighbourhoods.forEach(function(nItem, nIndex){
            boroughList[nItem] = [];
            dListings.forEach(function(item, index){
                if(item['neighbourhood_cleansed'] === nItem){
                    boroughList[nItem].push(item);
                }
            });
        });

        return boroughList;
    }

    categorize(dListings) {

        let accommodatesObj = {};

        Object.keys(dListings).forEach(function(key) {
            accommodatesObj[key] = [];
            dListings[key].forEach(function(nItem, nIndex){
                let index = accommodatesObj[key].findIndex(x => x.accommodates==nItem.accommodates);
                if (index === -1){accommodatesObj[key].push({"accommodates": nItem.accommodates});}
            })
        })

        return accommodatesObj;
    }

    sort(dListings, dBoroughs) {

        Object.keys(dListings).forEach(function(key) {

            let boroughArray = dListings[key];
            boroughArray.sort(compare);

            dBoroughs[key].forEach(function(listing, nIndex){

                let listingPriceStr = listing.price.substr(1);
                let listingPrice = parseFloat(listingPriceStr);
                let listingAccommodates = listing.accommodates;

                for(let i = 0; i < boroughArray.length; i++){

                    if(listingAccommodates === dListings[key][i]["accommodates"]){

                        if(!("totalPrice" in dListings[key][i])){

                            dListings[key][i]["totalPrice"] = listingPrice;

                        } else {

                            dListings[key][i]["totalPrice"] = dListings[key][i]["totalPrice"] + listingPrice;

                        }

                        if(!("count" in dListings[key][i])){

                            dListings[key][i]["count"] = 1;

                        } else {

                            dListings[key][i]["count"] = dListings[key][i]["count"] + 1;

                        }

                        dListings[key][i]["average"] = dListings[key][i]["totalPrice"] / dListings[key][i]["count"];
                    }
                }
            })
        })

        return dListings;

    }

}

const compare = (a, b) => {
    if (a.accommodates < b.accommodates)
        return -1;
    if (a.accommodates > b.accommodates)
        return 1;
    return 0;
}

export default new RoomType(listingsData);
