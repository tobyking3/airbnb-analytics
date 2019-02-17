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

// const h = 250;
// const w = 700;
// const padding = 20;

// function getDate(d){
//   var strDate = new String(d);
//   var year = strDate.substr(0, 4);
//   var month = strDate.substr(4, 2)-1; //zero based index
//   var day = strDate.substr(6, 2);

//   return new Date(year, month, day);
// }

// function updateLine(ds){

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

//   var yAxisGen = d3.axisLeft(yScale)
//                     .ticks(4);

//   var xAxisGen = d3.axisBottom(xScale)
//                     .tickFormat(d3.timeFormat("%b"))
//                     .ticks(ds.monthlySales.length-1);

//   //==============================================================

//   var externalLine = d3.line()
//     .x(function(d) {return xScale(getDate(d.month));})
//     .y(function(d) {return yScale(d.sales);})

//   var svg = d3.select(".JSONChart").select("#svg-" + ds.category);

//   var yAxis = svg.selectAll("g.y-axis").call(yAxisGen);

//   var xAxis = svg.selectAll("g.x-axis").call(xAxisGen);

//   var viz = svg.selectAll(".path-" + ds.category)
//   .transition()
//   .duration(2000)
//   .ease(d3.easeBounce)
//   .attrs({
//     d: externalLine(ds.monthlySales),
//   })
// }

// function buildLine(ds){

//   var xMin = d3.min(ds.monthlySales, function(d){return d.month;});
//   var xMax = d3.max(ds.monthlySales, function(d){return d.month;});
//   var yMin = 0;
//   var yMax = d3.max(ds.monthlySales, function(d){return d.sales;});

//   var minDate = getDate(ds.monthlySales[0]['month']);
//   var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);

//   //==============================================================

//   var tooltip = d3.select(".JSONChart").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

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
//     .attr("height", h)
//     .attr("id", "svg-" + ds.category);

//   var yAxis = svg.append("g").call(yAxisGen)
//     .attrs({
//       "class": "y-axis",
//       "transform": "translate(" + padding + ", 0)"
//     })

//   var xAxis = svg.append("g").call(xAxisGen)
//     .attrs({
//       "class": "x-axis",
//       "transform": "translate(0, " + (h - padding) + ")"
//     })

//   var viz = svg.append("path")
//   .attrs({
//     d: externalLine(ds.monthlySales),
//     "stroke": "purple",
//     "stroke-width": 2,
//     "fill": "none",
//     "class": "path-" + ds.category
//   })

//   var dots = svg.selectAll("circle")
//     .data(ds.monthlySales)
//     .enter()
//     .append("circle")
//     .attrs({
//       cx: function(d) {return xScale(getDate(d.month));},
//       cy: function(d) {return yScale(d.sales);},
//       r: 3,
//       "fill": "blue",
//       "class": "circle-" + ds.category
//     })
//     .on("mouseover", function(d){
//       tooltip.transition()
//         .duration(500)
//         .style("opacity", 0.85);

//       tooltip.html("<strong>Sales $" + d.sales + "K</strong>")
//         .style("left", (d3.event.pageX) + "px")
//         .style("top", (d3.event.pageY - 28) + "px")
//     })
//     .on("mouseout", function(d){
//       tooltip.transition()
//         .duration(300)
//         .style("opacity", 0);
//     })

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

//   //add event listener
//   d3.select("select")
//     .on("change", function(d, i){
//       var sel=d3.select("#date-option").node().value;

//       var decodedData = JSON.parse(window.atob(data.content));
      
//       decodedData.contents.forEach(function(ds){
//         //filter array based on selection
//         ds.monthlySales.splice(0,ds.monthlySales.length-sel)
//         //update line
//         updateLine(ds);
//       })
//     })
// })

//========================================================================================================================

// const w2 = 350;
// const h2 = 400;

// const monthlySales = [
//     {"month":10, "sales":100},
//     {"month":20, "sales":130},
//     {"month":30, "sales":250},
//     {"month":40, "sales":300},
//     {"month":50, "sales":265},
//     {"month":60, "sales":225},
//     {"month":70, "sales":180},
//     {"month":80, "sales":120},
//     {"month":90, "sales":145},
//     {"month":100, "sales":130}
//   ];

// function salesKPI(d){
//   if (d>=250) { return "#33CC66" }
//   else if (d<250) { return "#666666"}
// }

// function showMinMax(ds, col, val, type){
//   var max = d3.max(ds, function(d){ return d[col]; });
//   var min = d3.min(ds, function(d){ return d[col]; });

//   if (type == 'minmax' && (val == max || val == min)) {
//     return val;
//   } else {
//     if (type == 'all') {
//       return val;
//     }
//   }
// }

// var svg3 = d3.select(".scatterChart").append("svg")
//               .attr("width", w2)
//               .attr("height", h2)

// var labels = svg3.selectAll("circle")
//     .data(monthlySales)
//     .enter()
//     .append("circle")
//     .attrs({
//       cx: function(d){return d.month*3},
//       cy: function (d){return h2-d.sales;},
//       r: 5,
//       "fill": function(d) {return salesKPI(d.sales)}
//     });

// var labels = svg3.selectAll("text")
//     .data(monthlySales)
//     .enter()
//     .append("text")
//     .text(function (d) {return showMinMax(monthlySales, 'sales', d.sales, 'all');})
//     .attrs({
//       x: function(d){return d.month*3 - 30;},
//       y: function (d){return h2-d.sales;},
//       "text-anchor": "start",
//       "font-family": "sans-serif",
//       "font-size": 12,
//       "fill": "orange",
//       "dy": ".35em"
//     });

// d3.select("select")
//   .on("change", function(d){
//     var sel=d3.select("#label-option").node().value;
//     svg3.selectAll("text")
//       .data(monthlySales)
//       .text(function(d){ return showMinMax(monthlySales, 'sales', d.sales, sel);})
//   })

//==========================================BAR CHART TOOLTIP==============================================

// const w = 300;
// const h = 120;
// const padding = 2;
// const dataset = [5, 10, 15, 20, 25, 5, 20, 13, 10, 22];
// const svg = d3.select(".barChart").append("svg")
//               .attr("width", w)
//               .attr("height", h)

// function colorPicker(v){
//   if (v<=20) { return "#666666";}
//   else if (v>20){ return "#FF0033";}
// }

// svg.selectAll("rect")
//     .data(dataset)
//     .enter()
//     .append("rect")
//   .attrs({
//         x: function(d, i) {return i * (w / dataset.length);},
//         y: function(d) {return h - (d*4);},
//         width: w / dataset.length - padding,
//         height: function(d) {return d*4;},
//         fill: function(d) {return colorPicker(d);}
//       })
//   .on("mouseover", function(d){
//     svg.append("text")
//     .text(d)
//     .attrs({
//       "text-anchor": "middle",
//       x: parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width")/2),
//       y: parseFloat(d3.select(this).attr("y")) + 12,
//       "font-family": "sans-serif",
//       "font-size": 12,
//       "fill": "#ffffff",
//       "id": "tooltip"
//     });
//   })
//   .on("mouseout", function(d){
//     d3.select("#tooltip").remove();
//   })

//==========================================MAP============================================

// var wMap = 1400;
// var hMap = 700;
// var svgMap = d3.select("div#container").append("svg").attr("preserveAspectRatio", "xMinYMin meet").style("background-color","#c9e8fd")
// .attr("viewBox", "0 0 " + wMap + " " + hMap)
// .classed("svg-content", true);
// var projection = d3.geoMercator().translate([wMap/2, hMap/2]).scale(2200).center([0,40]);
// var path = d3.geoPath().projection(projection);
        
//   // load data  
// var worldmap = d3.json("countries.geojson");
// var cities = d3.csv("cities.csv");
   
// Promise.all([worldmap, cities]).then(function(values){    
//  // draw map
//     svgMap.selectAll("path")
//         .data(values[0].features)
//         .enter()
//         .append("path")
//         .attr("class","continent")
//         .attr("d", path),
//  // draw points
//     svgMap.selectAll("circle")
//         .data(values[1])
//         .enter()
//         .append("circle")
//     .attr("class","circles")
//         .attr("cx", function(d) {return projection([d.Longitude, d.Lattitude])[0];})
//         .attr("cy", function(d) {return projection([d.Longitude, d.Lattitude])[1];})
//         .attr("r", "1px"),
//  // add labels
//     svgMap.selectAll("text")
//         .data(values[1])
//         .enter()
//         .append("text")
//     .text(function(d) {
//             return d.City;
//          })
//     .attr("x", function(d) {return projection([d.Longitude, d.Lattitude])[0] + 5;})
//     .attr("y", function(d) {return projection([d.Longitude, d.Lattitude])[1] + 15;})
//     .attr("class","labels");
        
//     }); 

var wMap = 400;
var hMap = 300;
var scaleMap = 23000;
var active = d3.select(null);

var svgMap = d3.select(".map")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + wMap + " " + hMap);

var tooltipDiv = d3.select(".tooltipDiv")
  .style("opacity", 0);

var tooltipPrice = d3.select(".tooltip-price");

var tooltipType = d3.select(".tooltip-type");

var tooltipDescription = d3.select(".tooltip-description");

var projection = d3.geoMercator();

var path = d3.geoPath()
  .projection(projection);

var zoom = d3.zoom()
  .scaleExtent([1, 4])
  .on("zoom", zoomed);


d3.csv("listings.csv").then(function(csv){

  d3.json("map.geojson").then(function(json){

    projection.center([-0.330679,51.329011])
      .scale(scaleMap)
      .translate([wMap/4, hMap - 40]);

    svgMap.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("class","continent")
      .attr("d", path)
      .attr("fill", "#a2e7ff")
      .on("click", clicked);

    svgMap.selectAll('.property-label')
      .data(csv)
      .enter()
      .append('circle')
        .each(function(d) {
          d3.select(this)
            .attr("r", "0.4px")
            .attr("cx", projection([parseFloat(d.longitude), parseFloat(d.latitude)])[0])
            .attr("cy", projection([parseFloat(d.longitude), parseFloat(d.latitude)])[1])
            .attr("fill", function(d){
              if(d.room_type === "Entire home/apt"){
                return "#17c4ff"
              } else if (d.room_type === "Private room"){
                return "#00688b"
              } else if (d.room_type === "Shared room"){
                return "#003445"
              }
            })
            .attr("class","points")
            .style("opacity", 0.5)
            ;
        })        
        .on("mouseover", showPropertyDetails)
        .on("mouseout", hidePropertyDetails);

    svgMap.selectAll('.circle-icon')
      .data(json.features)
      .enter().append('circle')
        .each(function(d) {
          d3.select(this)
            .attr("r", 2)
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("fill", "#008ab9")
            .attr("stroke", "#005673")
            .attr("class","circle-icon");
        })
      .on("click", boroughStats)
      .on("mouseover", function(d) {
        d3.select(this)
        .transition()    
        .duration(200)
        .attr("r", 4)
        .attr("stroke", "yellow");
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .transition()    
        .duration(100)
        .attr("r", 2)
        .attr("stroke", "#005673");
      });

    svgMap.selectAll('.borough-label')
      .data(json.features)
      .enter()
      .append('text')
        .each(function(d) {
          d3.select(this)
            .attr("transform", function(d) { return "translate(" + (path.centroid(d)[0] + 4) + "," + (path.centroid(d)[1] + 2) + ")"; })
            .text(function(d) { return d.properties.neighbourhood })
            .attr("class","borough-labels")
            .attr("text-anchor", "left")
            .attr("pointer-events", "none");
        })
  });

});

//=============================BOUNDING BOX==================================//

function handleMouseOver(d, i) {
  d3.select(this)
    .attr("fill", "#d0f3ff");
}
function handleMouseOut(d, i) {
  d3.select(this)
    .attr("fill", "#00bfff");
}
function showPropertyDetails(d, i) {
  tooltipDiv.transition()    
    .duration(200)    
    .style("opacity", .9);    
  tooltipDiv
    .style("left", (d3.event.pageX + 15) + "px")   
    .style("top", (d3.event.pageY) + "px");

  tooltipPrice.html("£" + d.price);
  tooltipType.html(d.room_type);
  tooltipDescription.html(d.name);
};

function boroughStats(d, i){
  d3.select(".borough-name").text(d.properties.neighbourhood);
}

function hidePropertyDetails(){
  tooltipDiv.transition()    
    .duration(500)    
    .style("opacity", 0);
}

function clicked(d) {
  if (active.node() === this) return reset();

  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / wMap, dy / hMap))),
      translate = [wMap / 4 - scale * 2, hMap - 40 - scale * 2];

  svgMap.transition()
      .duration(1000)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
}

function zoomed() {
  svgMap.attr("transform", d3.event.transform);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svgMap.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity );
}


//=======================Panel=============================//

var typeButtons = document.querySelectorAll(".propertyTypeContainer .propertyTypeMenu button");
var typePanels = document.querySelectorAll(".propertyTypeContainer .propertyType");

var typeHome = document.querySelector("#typeHome");
var typePrivate = document.querySelector("#typePrivate");
var typeShared = document.querySelector("#typeShared");
var typeMenuContainer = document.querySelector(".propertyTypeMenu");

//Initial panel state
showPanel(0, "#17c4ff");

typeHome.addEventListener("click", function(){showPanel(0, "#17c4ff");}, false);
typePrivate.addEventListener("click", function(){showPanel(1, "#00688b");}, false);
typeShared.addEventListener("click", function(){showPanel(2, "#003445");}, false);

function showPanel(panelIndex, colorCode){
  typeButtons.forEach(function(node){
    node.style.backgroundColor="white";
    node.style.color=""
  })
  typeButtons[panelIndex].style.backgroundColor= colorCode;
  typeMenuContainer.style.borderColor= colorCode;
  typeButtons[panelIndex].style.color= "white";

  typePanels.forEach(function(node){
    node.style.display="none";
  })
  typePanels[panelIndex].style.display="block";
}


//======================PIE CHART=========================//


var pieChartData = [
  {
    "type":"Entire home/apt",
    "value":20
  }, 
  {
    "type":"Shared room",
    "value":50
  }, 
  {
    "type":"Private room",
    "value":30
  }
];

var pieChartHeight = 200;
var pieChartWidth = 200;
var pieChartRadius = 100;

var pieChartColors = d3.scaleOrdinal()
    .domain(["Entire home/apt", "Private room", "Shared room"])
    .range(["#17c4ff", "#00688b", "#003445"]);

var arc = d3.arc()
    .outerRadius(pieChartRadius)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(pieChartRadius - 50)
    .innerRadius(pieChartRadius - 50);

var pie = d3.pie()
    .value(function(d) { return d.value; });

var svgPieChart = d3.select(".panel-piechart-comparison")
  .append("svg")
  .attr("width", pieChartWidth)
  .attr("height", pieChartHeight)
  .append("g")
  .attr("transform", "translate(" + pieChartWidth / 2 + "," + pieChartHeight / 2 + ")");

  var g = svgPieChart.selectAll(".arc")
      .data(pie(pieChartData))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return pieChartColors(d.data.type)});

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.value; });













