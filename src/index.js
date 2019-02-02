import _ from 'lodash';
import printMe from './print.js';
import './styles.css';
import * as d3 from 'd3';
import 'd3-selection-multi';
import DataJSON from './data/MonthlySales.json';
// import DataCSV from './MonthlySales.csv';

//====================================================================================

function component() {
  let element = document.createElement('div');
  var btn = document.createElement('button');

  element.innerHTML = _.join(['Airbnb', 'Analytics'], ' ');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

let element = component(); // Store the element to re-render on print.js changes
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    document.body.removeChild(element);
    element = component(); // Re-render the "component" to update the click handler
    document.body.appendChild(element);
  })
}

//======================JSON DATA=============================================================

// const h = 100;
// const w = 400;
// const padding = 20;

// function getDate(d){
//   var strDate = new String(d);
//   var year = strDate.substr(0, 4);
//   var month = strDate.substr(4, 2)-1; //zero based index
//   var day = strDate.substr(6, 2);

//   return new Date(year, month, day);
// }

// function buildLine(ds){

//   var xMin = d3.min(ds.monthlySales, function(d){return d.month;});
//   var xMax = d3.max(ds.monthlySales, function(d){return d.month;});
//   var yMin = 0;
//   var yMax = d3.max(ds.monthlySales, function(d){return d.sales;});

//   var minDate = getDate(ds.monthlySales[0]['month']);
//   var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);

//   //==============================================================

//   var xScale = d3.scaleTime()
//     .domain([minDate, maxDate])
//     .range([padding, w - padding]);

//   var yScale = d3.scaleLinear()
//     .domain([yMin, yMax])
//     .range([h-padding, 0]);

//   //==============================================================

//   var yAxisGen = d3.axisLeft(yScale).ticks(4);
//   var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

//   //==============================================================

//   var externalLine = d3.line()
//     .x(function(d) {return xScale(getDate(d.month));})
//     .y(function(d) {return yScale(d.sales);})

//   var svg = d3.select(".JSONChart").append("svg")
//     .attr("width", w)
//     .attr("height", h);

//   var yAxis = svg.append("g").call(yAxisGen)
//     .attrs({
//       "class": "axis",
//       "transform": "translate(" + padding + ", 0)"
//     })

//   var xAxis = svg.append("g").call(xAxisGen)
//     .attrs({
//       "class": "axis",
//       "transform": "translate(0, " + (h - padding) + ")"
//     })

//   var viz = svg.append("path")
//   .attrs({
//     d: externalLine(ds.monthlySales),
//     "stroke": "purple",
//     "stroke-width": 2,
//     "fill": "none"
//   })
// }

// //===============================================================

// function showHeader(ds){
//   d3.select(".JSONChart").append("h2")
//     .text(ds.category + "Sales (2013)");
// }

// //===============================================================

// d3.json("https://api.github.com/repos/tobyking3/airbnb-analytics/contents/src/data/MonthlySalesbyCategoryMultiple.json").then(function(data) {
//   var decodedData = JSON.parse(window.atob(data.content));
//   decodedData.contents.forEach(function(ds){
//     showHeader(ds);
//     buildLine(ds);
//   })
// })


const w2 = 350;
const h2 = 400;

const monthlySales = [
    {"month":10, "sales":100},
    {"month":20, "sales":130},
    {"month":30, "sales":250},
    {"month":40, "sales":300},
    {"month":50, "sales":265},
    {"month":60, "sales":225},
    {"month":70, "sales":180},
    {"month":80, "sales":120},
    {"month":90, "sales":145},
    {"month":100, "sales":130}
  ];

function salesKPI(d){
  if (d>=250) { return "#33CC66" }
  else if (d<250) { return "#666666"}
}

function showMinMax(ds, col, val, type){
  var max = d3.max(ds, function(d){ return d[col]; });
  var min = d3.min(ds, function(d){ return d[col]; });

  if (type == 'minmax' && (val == max || val == min)) {
    return val;
  } else {
    if (type == 'all') {
      return val;
    }
  }
}

var svg3 = d3.select(".scatterChart").append("svg")
              .attr("width", w2)
              .attr("height", h2)

var labels = svg3.selectAll("circle")
    .data(monthlySales)
    .enter()
    .append("circle")
    .attrs({
      cx: function(d){return d.month*3},
      cy: function (d){return h2-d.sales;},
      r: 5,
      "fill": function(d) {return salesKPI(d.sales)}
    });

var labels = svg3.selectAll("text")
    .data(monthlySales)
    .enter()
    .append("text")
    .text(function (d) {return showMinMax(monthlySales, 'sales', d.sales, 'all');})
    .attrs({
      x: function(d){return d.month*3 - 30;},
      y: function (d){return h2-d.sales;},
      "text-anchor": "start",
      "font-family": "sans-serif",
      "font-size": 12,
      "fill": "orange",
      "dy": ".35em"
    });

d3.select("select")
  .on("change", function(d){
    var sel=d3.select("#label-option").node().value;
    svg3.selectAll("text")
      .data(monthlySales)
      .text(function(d){ return showMinMax(monthlySales, 'sales', d.sales, sel);})
  })







