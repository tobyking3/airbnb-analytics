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
const w = 700;
const h = 400;

const padding = 40;

// Load data, call initial chart render and set listener on borough select

d3.json("calendar-array.json").then(data => {

  buildLine(data['City of London']);

  d3.select("#line-chart-borough-select").on("change", (d, i) => {

    let sel = d3.select("#line-chart-borough-select").node().value;

    updateLine(data[sel]);

  })

})

// get unix time stamp from string

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

  // min and max dates are relevant to order

  let minDate = getDate(ds[0]['date']);
  let maxDate = getDate(ds[ds.length - 1]['date']);

  let xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  let yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([h-padding, 0]);

  // Generate the axis

  let yAxisGen = d3.axisLeft(yScale)
    .ticks(14)
    .tickSize(-(w - 80));

  let xAxisGen = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b"));

  let externalLine = d3.line()
    .x(d => xScale(getDate(d.date)))
    .y(d => yScale(d.booked));

  // Define the chart container

  let svg = d3.select(".line-chart").append("svg")
    .attrs({
      "preserveAspectRatio": "xMinYMin meet",
      "viewBox": "0 0 " + w + " " + h,
      "id": "svg-bookings"
    });

  // Value labels

  let yAxis = svg.append("g").call(yAxisGen)
    .attrs({
      "font-family": "GilroyLight",
      "class": "y-axis",
      "transform": "translate(" + padding + ", 0)"
    })

  let xAxis = svg.append("g").call(xAxisGen)
    .attrs({
      "font-family": "GilroyLight",
      "class": "x-axis",
      "transform": "translate(0, " + (h - padding) + ")"
    })

  // Axis label

  xAxis.append('text')
        .attrs({
            'y': 35,
            'x': w / 2,
            'class': 'chart-x-label'
        })
        .text('Number of bookings made per day during 2018')
        .style('fill', 'black')
        .style('font-family', 'GilroyBold');

  let viz = svg.append("path")
  .attrs({
    d: externalLine(ds),
    "class": "path-bookings"
  })
}

// Called when a click event is registered on the select element

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
    .ticks(14)
    .tickSize(-(w - 80));

  // update the line

  let externalLine = d3.line()
    .x(d => xScale(getDate(d.date)))
    .y(d => yScale(d.booked));

  let svg = d3.select(".line-chart")
    .select("#svg-bookings");

  let yAxis = svg.selectAll("g.y-axis")
    .call(yAxisGen);

  // set the animation on change

  let viz = svg.selectAll(".path-bookings")
    .transition()
    .duration(1000)
    .ease(d3.easeBounce)
    .attrs({
      d: externalLine(ds),
    })
}
