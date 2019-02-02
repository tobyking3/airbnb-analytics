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

const h = 100;
const w = 400;
const padding = 20;

function getDate(d){
  var strDate = new String(d);
  var year = strDate.substr(0, 4);
  var month = strDate.substr(4, 2)-1; //zero based index
  var day = strDate.substr(6, 2);

  return new Date(year, month, day);
}

function buildLine(ds){

  var xMin = d3.min(ds.monthlySales, function(d){return d.month;});
  var xMax = d3.max(ds.monthlySales, function(d){return d.month;});
  var yMin = 0;
  var yMax = d3.max(ds.monthlySales, function(d){return d.sales;});

  var minDate = getDate(ds.monthlySales[0]['month']);
  var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);

  console.log(minDate, maxDate);

  //==============================================================

  var xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  var yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h-padding, 0]);

  //==============================================================

  var yAxisGen = d3.axisLeft(yScale).ticks(4);
  var xAxisGen = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  //==============================================================

  var externalLine = d3.line()
    .x(function(d) {return xScale(getDate(d.month));})
    .y(function(d) {return yScale(d.sales);})

  var svg = d3.select(".JSONChart").append("svg")
    .attr("width", w)
    .attr("height", h);

  var yAxis = svg.append("g").call(yAxisGen)
    .attrs({
      "class": "axis",
      "transform": "translate(" + padding + ", 0)"
    })

  var xAxis = svg.append("g").call(xAxisGen)
    .attrs({
      "class": "axis",
      "transform": "translate(0, " + (h - padding) + ")"
    })

  var viz = svg.append("path")
  .attrs({
    d: externalLine(ds.monthlySales),
    "stroke": "purple",
    "stroke-width": 2,
    "fill": "none"
  })
}

//===============================================================

function showHeader(ds){
  d3.select(".JSONChart").append("h2")
    .text(ds.category + "Sales (2013)");
}

//===============================================================

d3.json("https://api.github.com/repos/tobyking3/airbnb-analytics/contents/src/data/MonthlySalesbyCategoryMultiple.json").then(function(data) {
  var decodedData = JSON.parse(window.atob(data.content));
  decodedData.contents.forEach(function(ds){
    showHeader(ds);
    buildLine(ds);
  })
})















