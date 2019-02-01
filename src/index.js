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

//======================CSV DATA=============================================================

const w = 600;
const h = 100;
let ds;
let salesTotal = 0.0;
let salesAvg = 0.0;
let metrics = [];

function buildLine(){
  var externalLine = d3.line()
    .x(function(d) { console.log(d); return ((d.Month-20190001) / 3.25)})
    .y(function(d) {return h-d.Sales; })

  var svg = d3.select(".externalLineChart").append("svg")
    .attr("width", w)
    .attr("height", h);

  var viz = svg.append("path")
  .attrs({
    d: externalLine(ds),
    "stroke": "purple",
    "stroke-width": 2,
    "fill": "none"
  })
}

function showTotals(){
  var t = d3.select(".externalLineChart").append("table");
  //get total
  for (var i = 0; i < ds.length; i++){
    salesTotal += ds[i]['Sales']*1;
  }

  salesAvg = salesTotal / ds.length;

  metrics.push("Sales Total: " + salesTotal);
  metrics.push("Sales Average: " + salesAvg.toFixed(2));

  var tr = t.selectAll("tr")
      .data(metrics)
      .enter()
      .append("tr")
      .append("td")
      .text(function(d){ return d; });

}

d3.csv("MonthlySales.csv").then(function(data) {
  ds = data;
  buildLine();
  showTotals();
})

//==========================JSON Data==========================================================

// const w = 600;
// const h = 100;

// let ds = DataJSON;

//   var externalLine = d3.line()
//     .x(function(d) { console.log(d); return ((d.Month-20190001) / 3.25)})
//     .y(function(d) {return h-d.Sales; })

//   var svg = d3.select(".externalLineChart").append("svg")
//     .attr("width", w)
//     .attr("height", h);

//   var viz = svg.append("path")
//   .attrs({
//     d: externalLine(ds),
//     "stroke": "purple",
//     "stroke-width": 2,
//     "fill": "none"
//   })








