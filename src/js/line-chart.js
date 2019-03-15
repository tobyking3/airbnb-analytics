import * as d3 from 'd3';
import calendar_data from '../data/calendar.json';

// var newArray = [];
// var newObj = {};

// for (var borough in calendar_data) {
//   newObj[borough] = [];
//   for (var date in calendar_data[borough]) {
//     var formattedDate = date.replace(/-/g,"");
//     newObj[borough].push(
//       {
//         "date":formattedDate,
//         "booked":calendar_data[borough][date]
//       }
//     );
//   }
// }

// console.log(JSON.stringify(newObj));

//======================JSON DATA=============================================================

const h = 500;
const w = 900;
const padding = 20;

d3.json("calendar-array.json").then(function(data) {
  buildLine(data['Barking and Dagenham'])
  // d3.select("select").on("change", function(d, i){
  //   var sel=d3.select("#date-option").node().value;
  //       data.splice(0,data.length-sel)
  //       updateLine(data);
  // })
})

function getDate(d){
  var strDate = new String(d);
  var year = strDate.substr(0, 4);
  var month = strDate.substr(5, 2)-1; //zero based index
  var day = strDate.substr(8, 2);

  return new Date(year, month, day);
}

function buildLine(ds){
  console.log(ds);
  var xMin = d3.min(ds, function(d){return d.date;});
  var xMax = d3.max(ds, function(d){return d.date;});

  var yMin = (d3.min(ds, function(d){return d.booked;}));
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

  var yAxisGen = d3.axisLeft(yScale).ticks(10);
  var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  //==============================================================

  var externalLine = d3.line()
    .x(function(d) {return xScale(getDate(d.date));})
    .y(function(d) {return yScale(d.booked);})

  var svg = d3.select(".line-chart").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "svg-bookings");

  var yAxis = svg.append("g").call(yAxisGen)
    .attrs({
      "class": "y-axis",
      "transform": "translate(" + padding + ", 0)"
    })

  var xAxis = svg.append("g").call(xAxisGen)
    .attrs({
      "class": "x-axis",
      "transform": "translate(0, " + (h - padding) + ")"
    })

  var viz = svg.append("path")
  .attrs({
    d: externalLine(ds),
    "stroke": "purple",
    "stroke-width": 1,
    "fill": "none",
    "class": "path-bookings"
  })
}

//==================================================================

function updateLine(ds){

  var yMin = (d3.min(ds, function(d){return d.booked;}) - 500 );
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

  var yAxisGen = d3.axisLeft(yScale)
                    .ticks(4);

  var xAxisGen = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%b"))
                    .ticks(ds.length-1);

  //==============================================================

  var externalLine = d3.line()
    .x(function(d) {return xScale(getDate(d.date));})
    .y(function(d) {return yScale(d.booked);})

  var svg = d3.select(".lineChart").select("#svg-bookings");

  var yAxis = svg.selectAll("g.y-axis").call(yAxisGen);

  var xAxis = svg.selectAll("g.x-axis").call(xAxisGen);

  var viz = svg.selectAll(".path-bookings")
  .transition()
  .duration(2000)
  .ease(d3.easeBounce)
  .attrs({
    d: externalLine(ds),
  })
}
