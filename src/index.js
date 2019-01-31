import _ from 'lodash';
import printMe from './print.js';
import './styles.css';
import * as d3 from 'd3';
import 'd3-selection-multi';

/*This can be especially helpful when implementing some sort of data visualization using a tool like d3.
Instead of making an ajax request and parsing the data at runtime you can load it into your module during
the build process so that the parsed data is ready to go as soon as the module hits the browser.*/

console.log("HELLO RELOAD");

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

//========================================================
const w = 300;
const h = 120;
const padding = 2;
const dataset = [5, 10, 15, 20, 25, 5, 20, 13, 10, 22];
const svg = d3.select(".barChart").append("svg")
              .attr("width", w)
              .attr("height", h)

function colorPicker(v){
  if (v<=20) { return "#666666";}
  else if (v>20){ return "#FF0033";}
}

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
  .attrs({
        x: function(d, i) {return i * (w / dataset.length);},
        y: function(d) {return h - (d*4);},
        width: w / dataset.length - padding,
        height: function(d) {return d*4;},
        fill: function(d) {return colorPicker(d);}
      });

  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {return d;})
    .attrs({
      "text-anchor": "middle",
      x: function(d, i){return i * (w / dataset.length) + (w / dataset.length - padding) / 2;},
      y: function (d) {return h - (d*4) + 14;},
      "font-family": "sans-serif",
      "font-size": 12,
      "fill": "#ffffff"
    });

//When key has dash in it, it needs to be wrapped in speech marks//

//=======================================================================

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

console.log(monthlySales);

var lineFun = d3.line()
    .x(function(d) {return d.month*3;})
    .y(function(d) {return h2-d.sales;})
    .curve(d3.curveLinear);
    //.curve() defaults to linear if not declared

var svg2 = d3.select(".lineChart").append("svg")
              .attr("width", w2)
              .attr("height", h2)

var viz = svg2.append("path")
  .attrs({
    d: lineFun(monthlySales),
    "stroke": "purple",
    "stroke-width": 2,
    "fill": "none"
  })

var labels = svg2.selectAll("text")
    .data(monthlySales)
    .enter()
    .append("text")
    .text(function (d) {return d.sales;})
    .attrs({
      x: function(d){return d.month*3 - 25;},
      y: function (d){return h2-d.sales;},
      "text-anchor": "start",
      "font-family": "sans-serif",
      "font-size": 12,
      "fill": "orange",
      "dy": ".35em",
      "font-weight": function(d,i) {
        if (i == 0 || i == (monthlySales.length-1)){return "bold"} 
        else {return "normal"}
      }
    });

//========================================================================

//KPI

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
    .text(function (d) {return showMinMax(monthlySales, 'sales', d.sales, 'minmax');})
    .attrs({
      x: function(d){return d.month*3 - 30;},
      y: function (d){return h2-d.sales;},
      "text-anchor": "start",
      "font-family": "sans-serif",
      "font-size": 12,
      "fill": "orange",
      "dy": ".35em"
    });