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

const w = 600;
const h = 100;
let ds;
let salesTotal = 0.0;
let salesAvg = 0.0;
let metrics = [];

function buildLine(){
  var externalLine = d3.line()
    .x(function(d) {return ((d.month-20130001) / 3.25)})
    .y(function(d) {return h-d.sales; })

  var svg = d3.select(".JSONChart").append("svg")
    .attr("width", w)
    .attr("height", h);

  var viz = svg.append("path")
  .attrs({
    d: externalLine(ds.monthlySales),
    "stroke": "purple",
    "stroke-width": 2,
    "fill": "none"
  })
}

function showHeader(){
  d3.select(".JSONChart").append("h2")
    .text(ds.category + "Sales (2013)");
}

d3.json("MonthlySalesbyCategory.json").then(function(data) {
  ds = data;
  showHeader();
  buildLine();
})








