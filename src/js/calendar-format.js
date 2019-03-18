import calendar_data from '../data/calendar.json';

//Format calendar data as array of objects

var newObj = {};

for (var borough in calendar_data) {
  newObj[borough] = [];
  for (var date in calendar_data[borough]) {
    var formattedDate = parseInt(date.replace(/-/g,"") , 10);
    newObj[borough].push(
      {
        "date":formattedDate,
        "booked":calendar_data[borough][date]
      }
    );
  }
}

console.log(JSON.stringify(newObj));