var neighbourhoodList =
["Kingston upon Thames",
"Croydon",
"Bromley",
"Hounslow",
"Ealing",
"Havering",
"Hillingdon",
"Harrow",
"Brent",
"Barnet",
"Enfield",
"Waltham Forest",
"Redbridge",
"Sutton",
"Lambeth",
"Southwark",
"Lewisham",
"Greenwich",
"Bexley",
"Richmond upon Thames",
"Merton",
"Wandsworth",
"Hammersmith and Fulham",
"Kensington and Chelsea",
"City of London",
"Westminster",
"Camden",
"Tower Hamlets",
"Islington",
"Hackney",
"Haringey",
"Newham",
"Barking and Dagenham"];

export default function sortedData(dListings) {
    neighbourhoodList.forEach(function(nItem, nIndex){
      newDataSet[nItem] = [];
        rawData.forEach(function(item, index){
            if(item['neighbourhood'] === nItem){
              newDataSet[nItem].push(item);
            }
        });
    })
}