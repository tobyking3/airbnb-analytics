import * as d3 from 'd3';
import calendar_data from '../data/calendar.json';

//======================Create Borough List===================================================

let newArray = [];
let arrayCount = 0;

for (let borough in calendar_data) {
  newArray.push(
      borough
    );
}

//=========================Select==============================================================

let selectBox = document.getElementById('line-chart-borough-select');

for(let i = 0, l = newArray.length; i < l; i++){
  let borough = newArray[i];
  selectBox.options.add( new Option(borough, borough) );
}

//======================CHART==================================================================

const h = 320;
const w = 900;
const padding = 40;

d3.json("calendar-array.json").then(data => {

  buildLine(data['Barking and Dagenham']);

  d3.select("#line-chart-borough-select").on("change", (d, i) => {

    let sel = d3.select("#line-chart-borough-select").node().value;

    updateLine(data[sel]);

  })

})

const getDate = d => {

  let strDate = new String(d);
  let year = strDate.substr(0, 4);
  let month = strDate.substr(4, 2)-1;
  let day = strDate.substr(6, 2);

  return new Date(year, month, day);
}

const buildLine = ds => {
  let xMin = d3.min(ds, d => d.date);
  let xMax = d3.max(ds, d => d.date);

  let yMin = d3.min(ds, d => d.booked);
  let yMax = d3.max(ds, d => d.booked);

  let minDate = getDate(ds[0]['date']);
  let maxDate = getDate(ds[ds.length - 1]['date']);

  let xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  let yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h-padding, 0]);

  let yAxisGen = d3.axisLeft(yScale)
    .ticks(20);

  let xAxisGen = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b"));

  let externalLine = d3.line()
    .x(d => xScale(getDate(d.date)))
    .y(d => yScale(d.booked));

  let svg = d3.select(".line-chart").append("svg")
    .attrs({
      "preserveAspectRatio": "xMinYMin meet",
      "viewBox": "0 0 " + w + " " + h,
      "id": "svg-bookings"
    });

  let yAxis = svg.append("g").call(yAxisGen)
    .attrs({
      "font-family": "GilroyLight",
      "class": "y-axis",
      "transform": "translate(" + padding + ", 0)"
    })

  let xAxis = svg.append("g").call(xAxisGen)
    .attrs({
      "font-family": "GilroyBold",
      "class": "x-axis",
      "transform": "translate(0, " + (h - padding) + ")"
    })

  let viz = svg.append("path")
  .attrs({
    d: externalLine(ds),
    "class": "path-bookings"
  })
}

const updateLine = ds => {

  let yMin = d3.min(ds, d => d.booked);
  let yMax = d3.max(ds, d => d.booked);

  let minDate = getDate(ds[0]['date']);
  let maxDate = getDate(ds[ds.length - 1]['date']);

  let xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  let yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h-padding, 0]);

  let yAxisGen = d3.axisLeft(yScale)
    .ticks(20);

  let externalLine = d3.line()
    .x(d => xScale(getDate(d.date)))
    .y(d => yScale(d.booked));

  let svg = d3.select(".line-chart")
    .select("#svg-bookings");

  let yAxis = svg.selectAll("g.y-axis")
    .call(yAxisGen);

  let viz = svg.selectAll(".path-bookings")
    .transition()
    .duration(1000)
    .ease(d3.easeBounce)
    .attrs({
      d: externalLine(ds),
    })
}
