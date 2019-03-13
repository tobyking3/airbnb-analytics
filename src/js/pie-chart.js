import * as d3 from 'd3';

//https://bl.ocks.org/rshaker/225c6df494811f46f6ea53eba63da817

var width = 200, height = 200, radius = Math.min(width, height) / 2;

var ColorEntire = "#DC2B61";
var ColorPrivate = "#FFBA01";
var ColorShared = "#57DEE3";

var startValues = [
  {"propertyType":"Entire home/apt","numberOfProperties":1},
  {"propertyType":"Private room","numberOfProperties":1},
  {"propertyType":"Shared room","numberOfProperties":1}
]

//setup svg
var svg = d3.select(".panel-pie-chart")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//create segments group
svg.append("g").attr("class", "segments");

//create pie chart
var pie = d3.pie()
  .sort(null)
  .value(function(d) {return d.numberOfProperties;});

//define arc
var arc = d3.arc()
  .outerRadius(radius)
  .innerRadius(0);

//create key
var key = function(d) { return d.data.propertyType; };

//create colour scale
var segmentColor = d3
.scaleOrdinal()
.range([ColorEntire, ColorPrivate, ColorShared])
.domain(["Entire home/apt", "Private room", "Shared room"]);

//initialize pie chart
update(startValues);

function mergeWithFirstEqualZero(first, second){
  var secondSet = d3.set();
  second.forEach(function(d) { secondSet.add(d.propertyType); });

  var onlyFirst = first
  .filter(function(d){ return !secondSet.has(d.propertyType) })
  .map(function(d) { return {propertyType: d.propertyType, numberOfProperties: 0}; });

  var sortedMerge = d3.merge([ second, onlyFirst ])
  .sort(function(a, b) {
    return d3.ascending(a.propertyType, b.propertyType);
  });

  return sortedMerge;
}

  function update(data) {

    var duration = 500;

    var oldData = svg
    .select(".segments")
    .selectAll("path")
    .data()
    .map(function(d) { return d.data });

    if (oldData.length == 0) oldData = data;

    var was = mergeWithFirstEqualZero(data, oldData);
    var is = mergeWithFirstEqualZero(oldData, data);

    var segment = svg.select(".segments")
    .selectAll("path")
    .data(pie(was), key);

    segment.enter()
    .insert("path")
    .attr("class", "segment")
    .style("fill", function(d) { return segmentColor(d.data.propertyType); })
    .each(function(d) {this._current = d;});

    segment = svg.select(".segments")
    .selectAll("path")
    .data(pie(is), key);

    segment.transition()
    .duration(duration)
    .attrTween("d", function(d) {
      var interpolate = d3.interpolate(this._current, d);
      var _this = this;
      return function(t) {
        _this._current = interpolate(t);
        return arc(_this._current);
      };
    });

    segment = svg.select(".segments")
    .selectAll("path")
    .data(pie(data), key);

    segment.exit()
    .transition()
    .delay(duration)
    .duration(0)
    .remove();
  };

export default function createPieChart(data, i) {
  var _data = data.properties.stats.propertiesComparison
  update(_data);
}