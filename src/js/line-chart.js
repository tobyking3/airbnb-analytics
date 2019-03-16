import * as d3 from 'd3';
import calendar_data from '../data/calendar.json';

//===========================Format Data=====================================================

// var newArray = [];
// var newObj = {};

// for (var borough in calendar_data) {
//   newObj[borough] = [];
//   for (var date in calendar_data[borough]) {
//     var formattedDate = parseInt(date.replace(/-/g,"") , 10);
//     newObj[borough].push(
//       {
//         "date":formattedDate,
//         "booked":calendar_data[borough][date]
//       }
//     );
//   }
// }

// console.log(JSON.stringify(newObj));

//======================Create Borough List===================================================

var newArray = [];
var arrayCount = 0;

for (var borough in calendar_data) {
  newArray.push(
      borough
    );
}

//=========================Select==============================================================

var selectBox = document.getElementById('calendar-borough-select');

for(var i = 0, l = newArray.length; i < l; i++){
  var borough = newArray[i];
  selectBox.options.add( new Option(borough, borough) );
}

//======================CHART==================================================================

const h = 320;
const w = 900;
const padding = 40;

d3.json("calendar-array.json").then(function(data) {
  buildLine(data['Barking and Dagenham']);

  d3.select("#calendar-borough-select").on("change", function(d, i){
    var sel = d3.select("#calendar-borough-select").node().value;
    updateLine(data[sel]);
  })
})

function getDate(d){
  var strDate = new String(d);
  var year = strDate.substr(0, 4);
  var month = strDate.substr(4, 2)-1;
  var day = strDate.substr(6, 2);

  return new Date(year, month, day);
}

function buildLine(ds){
  var xMin = d3.min(ds, function(d){return d.date;});
  var xMax = d3.max(ds, function(d){return d.date;});

  var yMin = d3.min(ds, function(d){return d.booked;});
  var yMax = d3.max(ds, function(d){return d.booked;});

  var minDate = getDate(ds[0]['date']);
  var maxDate = getDate(ds[ds.length - 1]['date']);

  //==============================================================

  var xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  var yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h-padding, 0]);

  //==============================================================

  var yAxisGen = d3.axisLeft(yScale).ticks(20);
  var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  //==============================================================

  var externalLine = d3.line()
    .x(function(d) {return xScale(getDate(d.date));})
    .y(function(d) {return yScale(d.booked);})

  var svg = d3.select(".line-chart").append("svg")
    .attrs({
      "preserveAspectRatio": "xMinYMin meet",
      "viewBox": "0 0 " + w + " " + h,
      "id": "svg-bookings"
    });

  var yAxis = svg.append("g").call(yAxisGen)
    .attrs({
      "font-family": "GilroyLight",
      "class": "y-axis",
      "transform": "translate(" + padding + ", 0)"
    })

  var xAxis = svg.append("g").call(xAxisGen)
    .attrs({
      "font-family": "GilroyBold",
      "class": "x-axis",
      "transform": "translate(0, " + (h - padding) + ")"
    })

  var viz = svg.append("path")
  .attrs({
    d: externalLine(ds),
    "class": "path-bookings"
  })
}

//==================================================================

function updateLine(ds){

  var yMin = d3.min(ds, function(d){return d.booked;});
  var yMax = d3.max(ds, function(d){return d.booked;});

  var minDate = getDate(ds[0]['date']);
  var maxDate = getDate(ds[ds.length - 1]['date']);

  //==============================================================

  var xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  var yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h-padding, 0]);

  //==============================================================

  var yAxisGen = d3.axisLeft(yScale).ticks(20);

  //==============================================================

  var externalLine = d3.line()
    .x(function(d) {return xScale(getDate(d.date));})
    .y(function(d) {return yScale(d.booked);})

  var svg = d3.select(".line-chart").select("#svg-bookings");

  var yAxis = svg.selectAll("g.y-axis").call(yAxisGen);

  var viz = svg.selectAll(".path-bookings")
  .transition()
  .duration(1000)
  .ease(d3.easeBounce)
  .attrs({
    d: externalLine(ds),
  })
}
