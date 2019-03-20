import * as d3 from 'd3';

var width = 700;
var height = 400;
var margin = { top:20, right:20, bottom:40, left:50};
var innerWidth = width - margin.left - margin.right;
var innerHeight= height - margin.top - margin.bottom;
var sel;

//===========================================================

var neighbourhoods = ["Kingston upon Thames","Croydon","Bromley","Hounslow","Ealing","Havering","Hillingdon","Harrow","Brent","Barnet","Enfield","Waltham Forest","Redbridge","Sutton","Lambeth","Southwark","Lewisham","Greenwich","Bexley","Richmond upon Thames","Merton","Wandsworth","Hammersmith and Fulham","Kensington and Chelsea","City of London","Westminster","Camden","Tower Hamlets","Islington","Hackney","Haringey","Newham","Barking and Dagenham"];

var selectBox = document.getElementById('accommodates-borough-select');

for(var i = 0, l = neighbourhoods.length; i < l; i++){
  var borough = neighbourhoods[i];
  selectBox.options.add( new Option(borough, borough) );
}

//===========================================================

var barChartSVG = d3.select(".bar-chart")
.append("svg")
.attrs({
      "preserveAspectRatio": "xMinYMin meet",
      "viewBox": "0 0 " + width + " " + height,
      "id": "svg-accommodates"
    });

function render(data){

    var xValue = d => d.average;
    var yValue = d => d.accommodates;

    var xMax = d3.max(data, xValue);

    var xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, innerWidth]);

    var yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    var yAxis = d3.axisLeft(yScale).tickFormat(function(d) {return d + ' bed'});
    var xAxis = d3.axisBottom(xScale)
        .tickFormat(function(d) {return '£ ' + d})
        .tickSize(-innerHeight);

    var g = barChartSVG.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    g.append('g').call(yAxis).selectAll('.domain, .tick line').remove();

    var xAxisG = g.append('g').call(xAxis).attr('transform', 'translate(0, ' + innerHeight + ')').attr("class", "accommodates-x-axis");

    xAxisG.selectAll('.domain').remove();

    xAxisG.append('text')
        .attr('y', 35)
        .attr('x', innerWidth / 2)
        .text(sel + ' - Average price per night')
        .attr('class', 'chart-x-label')
        .style('fill', 'black')
        .style('font-family', 'GilroyBold');

    //d3 selection which contains all existing rectangles
    g.selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .attr('y', function(d) {return yScale(yValue(d))})
        .attr('width', function(d) {return xScale(xValue(d))})
        .attr('height', yScale.bandwidth())
        .style("fill", "#DC2B61")
        .on('mouseenter', function (actual, i) {
            d3.select(this)
            .attr('opacity', 0.8);

            g.append('line')
            .attr('x1', function(d) {return xScale(xValue(actual))})
            .attr('y1', 0)
            .attr('x2', function(d) {return xScale(xValue(actual))})
            .attr('y2', innerHeight)
            .attr('id', 'accommodates-line-marker');

            // var parentHeight = d3.select(this.parentNode).attr("height");
            // console.log(parentHeight);

            g.append('text')
            .text("£" + actual.average.toFixed(2))
            .attr('x', function(d) {return xScale(xValue(actual)) - 58})
            .attr('y', function(d) {return yScale(yValue(actual)) + 13})
            .attr('class', 'accommodates-price-text');
        })
        .on('mouseleave', function () {
            d3.select(this)
            .attr('opacity', 1);
            g.selectAll('#accommodates-line-marker').remove();
            g.selectAll('.accommodates-price-text').remove()
        });
}

//====================================================================

function update(data){

    var xValue = d => d.average;
    var yValue = d => d.accommodates;

    var xMax = d3.max(data, xValue);

    var xScale = d3.scaleLinear()
    .domain([0, xMax])
    .range([0, innerWidth]);

    var yScale = d3.scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

    var yAxis = d3.axisLeft(yScale).tickFormat(function(d) {return d + ' bed'});
    var xAxis = d3.axisBottom(xScale).tickFormat(function(d) {return '£ ' + d}).tickSize(-innerHeight);

    var g = barChartSVG.select('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    g.selectAll('.accommodates-x-axis').remove();
    g.select('g').call(yAxis).selectAll('.domain, .tick line').remove();

    var xAxisG = g.append('g').call(xAxis).attr('transform', 'translate(0, ' + innerHeight + ')').attr("class", "accommodates-x-axis");
    xAxisG.selectAll('.domain').remove();
    xAxisG.append('text')
        .attr('y', 35)
        .attr('x', innerWidth / 2)
        .text(sel + ' - Average price per night')
        .attr('class', 'chart-x-label')
        .style('fill', 'black')
        .style('font-family', 'GilroyBold');

    var bars = g.selectAll("rect").remove().exit().data(data);

    g.selectAll("rect")
    .data(data)
    .enter()
    .append('rect')
    .style("fill", "#DC2B61")
    .attr('y', function(d) {return yScale(yValue(d))})
    .attr('height', yScale.bandwidth())
    .transition()
    .duration(1000)
    .attr('width', function(d) {return xScale(xValue(d))})
    .on('mouseenter', function (actual, i) {
        
        d3.select(this).attr('opacity', 0.8);

        g.append('line')
        .attr('x1', function(d) {return xScale(xValue(actual))})
        .attr('y1', 0)
        .attr('x2', function(d) {return xScale(xValue(actual))})
        .attr('y2', innerHeight)
        .attr('id', 'accommodates-line-marker');

        g.append('text')
        .text("£" + actual.average.toFixed(2))
        .attr('x', function(d) {return xScale(xValue(actual)) - 58})
        .attr('y', function(d) {return yScale(yValue(actual)) + 13})
        .attr('class', 'accommodates-price-text');
    })
    .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1);
        g.selectAll('#accommodates-line-marker').remove();
        g.selectAll('.accommodates-price-text').remove()
    });
}

//====================================================================

d3.json("accommodates-averages.json").then(function(data) {
    sel = d3.select("#accommodates-borough-select").node().value;
    render(data["Barking and Dagenham"])

    d3.select("#accommodates-borough-select").on("change", function(d, i){
        sel = d3.select("#accommodates-borough-select").node().value;
        update(data[sel]);
    })

    // d3.select("#changeBtn").on("click", function(d, i){
    //     console.log("clicked");
    //     update(data["Camden"]);
    // })
})