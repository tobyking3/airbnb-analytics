import * as d3 from 'd3';

/***************************************************************************************

  The bed count bar chart has been implemented following a tutorial found on Youtube.
  https://www.youtube.com/watch?v=NlBt-7PuaLk

  The code has been adapted and refactored to suit the needs of the application.

*    Title: Making a Bar Chart with D3.js and SVG [Reloaded]
*    Author: Curran Kelleher
*    Date: 2019
*    Code version: 2.0
*    Availability: https://vizhub.com/curran/dd44f8fcdc8346ff90bddd63572bf638

***************************************************************************************/

let width = 700;
let height = 400;
let margin = { top:20, right:20, bottom:40, left:50};
let innerWidth = width - margin.left - margin.right;
let innerHeight= height - margin.top - margin.bottom;
let sel;

let neighbourhoods = ["Kingston upon Thames","Croydon","Bromley","Hounslow","Ealing","Havering","Hillingdon","Harrow","Brent","Barnet","Enfield","Waltham Forest","Redbridge","Sutton","Lambeth","Southwark","Lewisham","Greenwich","Bexley","Richmond upon Thames","Merton","Wandsworth","Hammersmith and Fulham","Kensington and Chelsea","City of London","Westminster","Camden","Tower Hamlets","Islington","Hackney","Haringey","Newham","Barking and Dagenham"];

let selectBox = document.getElementById('accommodates-borough-select');

for(let i = 0, l = neighbourhoods.length; i < l; i++){
  let borough = neighbourhoods[i];
  selectBox.options.add( new Option(borough, borough) );
}

// create container svg scalable to window size

let barChartSVG = d3.select(".bar-chart")
.append("svg")
.attrs({
      "preserveAspectRatio": "xMinYMin meet",
      "viewBox": "0 0 " + width + " " + height,
      "id": "svg-accommodates"
    });

const render = data => {

    let xValue = d => d.average;
    let yValue = d => d.accommodates;

    let xMax = d3.max(data, xValue);

    let xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, innerWidth]);

    let yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    let yAxis = d3.axisLeft(yScale).tickFormat(function(d) {return d + ' bed'});

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d => '£ ' + d)
        .tickSize(-innerHeight);

    let g = barChartSVG.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    g.append('g').call(yAxis).selectAll('.domain, .tick line').remove();

    let xAxisGroup = g.append('g')
        .call(xAxis)
        .attrs({
            'transform': 'translate(0, ' + innerHeight + ')',
            'class': 'accommodates-x-axis'
        });

    xAxisGroup.selectAll('.domain').remove();

    xAxisGroup.append('text')
        .attrs({
            'y': 35,
            'x': innerWidth / 2,
            'class': 'chart-x-label'
        })
        .text(sel + ' - Average price per night')
        .style('fill', 'black')
        .style('font-family', 'GilroyBold');

    //d3 selection which contains all existing rectangles

    g.selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .attrs({
            'y': d => yScale(yValue(d)),
            'width': d => xScale(xValue(d)),
            'height': yScale.bandwidth()
        })
        .style("fill", "#FFBA01")
        .on('mouseenter', (actual, i) => {
            d3.select(this)
            .attr('opacity', 0.8);

            g.append('line')
            .attrs({
                'x1': d => xScale(xValue(actual)),
                'y1': 0,
                'x2': d => xScale(xValue(actual)),
                'y2': innerHeight,
                'id': 'accommodates-line-marker'
            })

            g.append('text')
            .text("£" + actual.average.toFixed(2))
            .attrs({
                'x': d => xScale(xValue(actual)) - 58,
                'y': d => yScale(yValue(actual)) + 13,
                'class': 'accommodates-price-text'
            });
        })
        .on('mouseleave', () => {
            d3.select(this).attr('opacity', 1);
            g.selectAll('#accommodates-line-marker').remove();
            g.selectAll('.accommodates-price-text').remove()
        });
}

// Called when borough is selected

const update = data => {

    let xValue = d => d.average;
    let yValue = d => d.accommodates;

    let xMax = d3.max(data, xValue);

    let xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, innerWidth]);

    let yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    let yAxis = d3.axisLeft(yScale).tickFormat(d => d + ' bed');
    let xAxis = d3.axisBottom(xScale).tickFormat(d => '£ ' + d).tickSize(-innerHeight);

    let g = barChartSVG.select('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    g.selectAll('.accommodates-x-axis').remove();
    g.select('g').call(yAxis).selectAll('.domain, .tick line').remove();

    let xAxisGroup = g.append('g')
        .call(xAxis)
        .attrs({
            'transform': 'translate(0, ' + innerHeight + ')',
            'class': 'accommodates-x-axis'
        });


    xAxisGroup.selectAll('.domain').remove();

    xAxisGroup.append('text')
        .attrs({
            'y': 35,
            'x': innerWidth / 2,
            'class': 'chart-x-label'
        })
        .text(sel + ' - Average price per night')
        .style('fill', 'black')
        .style('font-family', 'GilroyBold');

    let bars = g.selectAll("rect").remove().exit().data(data);

    g.selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .style("fill", "#FFBA01")
        .attrs({
            'y': d => yScale(yValue(d)),
            'height': yScale.bandwidth()
        })
        .on('mouseenter', updateHover)
        .on('mouseleave', updateLeave)
        .transition()
        .duration(1000)
        .attr('width', d => xScale(xValue(d)));

    function updateHover(actual, i) {
        d3.select(this).attr('opacity', 0.8);

        g.append('line')
        .attrs({
            'x1': d => xScale(xValue(actual)),
            'y1': 0,
            'x2': d => xScale(xValue(actual)),
            'y2': innerHeight,
            'id': 'accommodates-line-marker'
        })

        g.append('text')
        .text("£" + actual.average.toFixed(2))
        .attrs({
            'x': d => xScale(xValue(actual)) - 58,
            'y': d => yScale(yValue(actual)) + 13,
            'class': 'accommodates-price-text'
        });
    }

    function updateLeave() {
        d3.select(this).attr('opacity', 1);
        g.selectAll('#accommodates-line-marker').remove();
        g.selectAll('.accommodates-price-text').remove()
    }

}


d3.json("accommodates-averages.json").then(data => {
    sel = d3.select("#accommodates-borough-select").node().value;
    render(data["Barking and Dagenham"]);

    d3.select("#accommodates-borough-select").on("change", (d, i) => {
        sel = d3.select("#accommodates-borough-select").node().value;
        update(data[sel]);
    })
})