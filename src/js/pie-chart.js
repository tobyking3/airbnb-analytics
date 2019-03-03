import * as d3 from 'd3';

var ColorEntire = "#17c4ff";
var ColorPrivate = "#00688b";
var ColorShared = "#003445";

var pieChartHeight = 200;
var pieChartWidth = 200;
var pieChartRadius = 100;

export default function createPieChart(data, i) {

  var propertiesData = data.properties.stats.propertiesComparison;

  var pieChartColors = d3.scaleOrdinal()
  .domain(["Entire home/apt", "Private room", "Shared room"])
  .range([ColorEntire, ColorPrivate, ColorShared]);

  var arc = d3.arc()
  .outerRadius(pieChartRadius)
  .innerRadius(0);

  var labelArc = d3.arc()
  .outerRadius(pieChartRadius - 50)
  .innerRadius(pieChartRadius - 50);

  var pie = d3.pie()
  .value(function(d) { return d.numberOfProperties; });

  var svgPieChart = d3.select(".panel-piechart-comparison")
  .append("svg")
  .attr("width", pieChartWidth)
  .attr("height", pieChartHeight)
  .append("g")
  .attr("transform", "translate(" + pieChartWidth / 2 + "," + pieChartHeight / 2 + ")");

  var g = svgPieChart.selectAll(".arc")
  .data(pie(propertiesData))
  .enter().append("g")
  .attr("class", "arc");

  g.append("path")
  .attr("d", arc)
  .style("fill", function(d) { return pieChartColors(d.data.propertyType)});

  g.append("text")
  .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .text(function(d) { return d.data.numberOfProperties; });
}