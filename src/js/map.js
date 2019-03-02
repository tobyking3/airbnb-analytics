import * as d3 from 'd3';

var mWidth = 400;
var mHeight = 300;
var mScale = 23000;

var ColorEntire = "#17c4ff"
var ColorPrivate = "#00688b"
var ColorShared = "#003445"

var active = d3.select(null);

var tooltipDiv = d3.select(".map-tooltip");
var tooltipPrice = d3.select(".map-tooltip_price");
var tooltipType = d3.select(".map-tooltip_type");
var tooltipDescription = d3.select(".map-tooltip_description");

var projection = d3.geoMercator();

var path = d3.geoPath().projection(projection);

var zoom = d3.zoom().scaleExtent([1, 4]).on("zoom", zoomed);

//Initialize Map
var svgMap = d3.select(".map")
  .append("svg")
  .attrs({
    "preserveAspectRatio": "xMinYMin meet",
    "viewBox": "0 0 " + mWidth + " " + mHeight
  });

d3.csv("listings.csv").then(function(csv){

  d3.json("map.geojson").then(function(json){

    projection.center([-0.330679,51.329011])
      .scale(mScale)
      .translate([mWidth/4, mHeight - 40]);

    svgMap.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attrs({
        "class": "map_borough-path",
        "d": path,
        "fill": "#a2e7ff"
      })
      .on("click", clicked);

    svgMap.selectAll('.property-label')
      .data(csv)
      .enter()
      .append('circle')
        .each(function(d) {
          d3.select(this)
            .attrs({
              "r": "0.4px",
              "cx": projection([parseFloat(d.longitude), parseFloat(d.latitude)])[0],
              "cy": projection([parseFloat(d.longitude), parseFloat(d.latitude)])[1],
              "fill": propertyTypeColor(d.room_type),
              "class": "points",
            })
            .style("opacity", 0.5)
            ;
        })        
        .on("mouseover", showPropertyDetails)
        .on("mouseout", hidePropertyDetails);

    svgMap.selectAll('.map_borough-point')
      .data(json.features)
      .enter().append('circle')
        .each(function(d) {
          d3.select(this)
            .attrs({
              "r": 2,
              "transform": function(d) { return "translate(" + path.centroid(d) + ")"; },
              "fill": "#008ab9",
              "stroke": "#005673",
              "class": "map_borough-point"
            });
        })
      .on("click", boroughStats)
      .on("mouseover", function(d) {
        d3.select(this)
        .transition()    
        .duration(200)
        .attrs({
          "r": 4,
          "stroke": "yellow"
        });
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .transition()    
        .duration(100)
        .attrs({
          "r": 2,
          "stroke": "#005673"
        });
      });

    svgMap.selectAll('.borough-label')
      .data(json.features)
      .enter()
      .append('text')
        .each(function(d) {
          d3.select(this)
            .text(function(d) { return d.properties.neighbourhood })
            .attrs({
              "transform": function(d) { return "translate(" + (path.centroid(d)[0] + 4) + "," + (path.centroid(d)[1] + 2) + ")"; },
              "class": "map_borough-label",
              "text-anchor": "left",
              "pointer-events": "none"
            })
        })
  });

});


function propertyTypeColor(type){
  if(type === "Entire home/apt"){
    return ColorEntire
  } else if (type === "Private room"){
    return ColorPrivate
  } else if (type === "Shared room"){
    return ColorShared
  }
}

function handleMouseOver(d, i) {
  d3.select(this).attr("fill", "#d0f3ff");
}

function handleMouseOut(d, i) {
  d3.select(this).attr("fill", "#00bfff");
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
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / mWidth, dy / mHeight))),
      translate = [mWidth / 4 - scale * 2, mHeight - 40 - scale * 2];

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

function boroughStats(d, i){
  d3.select(".borough-name").text(d.properties.neighbourhood);
  d3.select(".home-type-average").text("£" + Math.round(d.properties["Entire home/apt"]));
  d3.select(".private-type-average").text("£" + Math.round(d.properties["Private room"]));
  d3.select(".shared-type-average").text("£" + Math.round(d.properties["Shared room"]));
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
    .range([ColorEntire, ColorPrivate, ColorShared]);

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