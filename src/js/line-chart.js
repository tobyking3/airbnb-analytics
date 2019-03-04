import * as d3 from 'd3';

//======================JSON DATA=============================================================

const h = 500;
const w = 900;
const padding = 20;

function getDate(d){
  var strDate = new String(d);
  var year = strDate.substr(0, 4);
  var month = strDate.substr(4, 2)-1; //zero based index
  var day = strDate.substr(6, 2);

  return new Date(year, month, day);
}

function updateLine(ds){

  var yMin = 0;
  var yMax = d3.max(ds.monthlySales, function(d){return d.sales;});

  var minDate = getDate(ds.monthlySales[0]['month']);
  var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);

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
                    .ticks(ds.monthlySales.length-1);

  //==============================================================

  var externalLine = d3.line()
    .x(function(d) {return xScale(getDate(d.month));})
    .y(function(d) {return yScale(d.sales);})

  var svg = d3.select(".lineChart").select("#svg-" + ds.category);

  var yAxis = svg.selectAll("g.y-axis").call(yAxisGen);

  var xAxis = svg.selectAll("g.x-axis").call(xAxisGen);

  var viz = svg.selectAll(".path-" + ds.category)
  .transition()
  .duration(2000)
  .ease(d3.easeBounce)
  .attrs({
    d: externalLine(ds.monthlySales),
  })
}

function buildLine(ds){

  var xMin = d3.min(ds.monthlySales, function(d){return d.month;});
  var xMax = d3.max(ds.monthlySales, function(d){return d.month;});
  var yMin = 0;
  var yMax = d3.max(ds.monthlySales, function(d){return d.sales;});

  var minDate = getDate(ds.monthlySales[0]['month']);
  var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);

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

  var svg = d3.select(".lineChart").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "svg-" + ds.category);

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
    d: externalLine(ds.monthlySales),
    "stroke": "purple",
    "stroke-width": 2,
    "fill": "none",
    "class": "path-" + ds.category
  })
}

//===============================================================

function showHeader(ds){
  d3.select(".lineChart").append("h2")
    .text(ds.category + "Sales (2013)");
}

//===============================================================

d3.json("MonthlySalesbyCategoryMultiple.json").then(function(data) {
  data.contents.forEach(function(ds){
    showHeader(ds);
    buildLine(ds);
  })

  //add event listener
  d3.select("select")
  .on("change", function(d, i){
    console.log("hello");
    var sel=d3.select("#date-option").node().value;
    data.contents.forEach(function(ds){
        //filter array based on selection
        ds.monthlySales.splice(0,ds.monthlySales.length-sel)
        //update line
        updateLine(ds);
      })
  })
})
















































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

//   var svg = d3.select(".lineChart").select("#svg-" + ds.category);

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

//   var tooltip = d3.select(".lineChart").append("div")
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

//   var svg = d3.select(".lineChart").append("svg")
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
//   d3.select(".lineChart").append("h2")
//     .text(ds.category + "Sales (2013)");
// }

// //===============================================================

// d3.json("MonthlySalesbyCategoryMultiple.json").then(function(data) {
//   data.contents.forEach(function(ds){
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