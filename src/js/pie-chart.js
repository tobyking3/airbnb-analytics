import * as d3 from 'd3';

/***************************************************************************************

  The pie chart update and transition animations have been implemented following a Blocks tutorial.

  The code has been adapted to suit the needs of the application.

*    Title: Update and transition of pie chart
*    Author: Shaker, R
*    Date: 2019
*    Code version: 1.0
*    Availability: https://bl.ocks.org/rshaker/225c6df494811f46f6ea53eba63da817
*
***************************************************************************************/

const width = 200, height = 200, radius = Math.min(width, height) / 2;

const ColorEntire = "#DC2B61";
const ColorPrivate = "#FFBA01";
const ColorShared = "#57DEE3";

const duration = 500;

let startValues = [
  {"propertyType":"Entire home/apt","numberOfProperties":1},
  {"propertyType":"Private room","numberOfProperties":1},
  {"propertyType":"Shared room","numberOfProperties":1}
]

//setup svg
let svg = d3.select(".panel-pie-chart")
  .append("svg")
  .attrs({
    "width": width,
    "height": height
  })
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//create segments group
svg.append("g").attr("class", "segments");

//create pie chart
let pie = d3.pie()
  .sort(null)
  .value(d => d.numberOfProperties);

//define arc
let arc = d3.arc()
  .outerRadius(radius)
  .innerRadius(0);

//create key
let key = d => d.data.propertyType;

//create colour scale
let segmentColor = d3
  .scaleOrdinal()
  .range([ColorEntire, ColorPrivate, ColorShared])
  .domain(["Entire home/apt", "Private room", "Shared room"]);

//initialize pie chart
update(startValues);

function mergeWithFirstEqualZero(first, second){
  let secondSet = d3.set();
  
  second.forEach(d => secondSet.add(d.propertyType));

  let onlyFirst = first
    .filter(d => !secondSet.has(d.propertyType) )
    .map(d => { return {propertyType: d.propertyType, numberOfProperties: 0} });

  let sortedMerge = d3.merge([ second, onlyFirst ])
    .sort((a, b) => d3.ascending(a.propertyType, b.propertyType));

  return sortedMerge;
}

  function update(data) {

    let oldData = svg.select(".segments")
      .selectAll("path")
      .data()
      .map(d => d.data);

    if (oldData.length == 0) oldData = data;

    let was = mergeWithFirstEqualZero(data, oldData);
    let is = mergeWithFirstEqualZero(oldData, data);

    let segment = svg.select(".segments")
      .selectAll("path")
      .data(pie(was), key);

    segment.enter()
      .insert("path")
      .attr("class", "segment")
      .style("fill", d => segmentColor(d.data.propertyType))
      .each(function(d) {this._current = d;});

    segment = svg.select(".segments")
      .selectAll("path")
      .data(pie(is), key);

    segment.transition()
      .duration(duration)
      .attrTween("d", function(d) {

        let interpolate = d3.interpolate(this._current, d);
        let _this = this;

        return t => {
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
  let _data = data.properties.stats.propertiesComparison
  update(_data);
}