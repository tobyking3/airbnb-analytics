import _ from 'lodash';
import printMe from './print.js';
import './styles.css';
import * as d3 from 'd3';
import 'd3-selection-multi';

// import DataCSV from './MonthlySales.csv';
// import DataJSON from './MonthlySales.json';

//==========================CSV Data==========================================================

// const w = 100;
// const h = 400;

// let ds;

// d3.csv("MonthlySales.csv").then(function(data) {
  
//   console.log(data);
//   ds = data;

//   var externalLine = d3.line()
//     .x(function(d) {return ((d.month-20190001) / 3.25)})
//     .y(function(d) {return h-d.sales; })
//     .curve(d3.curveLinear);

//   var svg = d3.select(".externalLineChart").append("svg")
//     .attr("width", w)
//     .attr("height", h);

//   var viz = svg.append("path")
//   .attrs({
//     d: externalLine(data),
//     "stroke": "purple",
//     "stroke-width": 2,
//     "fill": "none"
//   })

// });

const w = 100;
const h = 400;
let ds;

d3.csv("MonthlySales.csv", convert, init)

function convert(d) {
  return {
    date: new Date(d.date),
    value: +d.value         // convert string to number
  };
} 

function init(csv){
  // console.log(csv);
  ds = csv;

  var externalLine = d3.line()
    .x(function(d) {return ((d.month-20190001) / 3.25)})
    .y(function(d) {return h-d.sales; })
    .curve(d3.curveLinear);

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





d3.json("MonthlySales.json").then(function(data) {
  console.log(data);
});

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







