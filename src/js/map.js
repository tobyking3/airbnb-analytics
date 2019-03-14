import * as d3 from 'd3';
import createPieChart from './pie-chart.js';

var mWidth = 400;
var mHeight = 250;
var mScale = 20000;

var ColorHighlighted = "#3E67FF";
var ColorUnhighlighted = "#C6DAFB";

var ColorEntire = "#DC2B61";
var ColorPrivate = "#FFBA01";
var ColorShared = "#57DEE3";

var active = d3.select(null);

var tooltipDiv = d3.select(".map-tooltip");
var tooltipPrice = d3.select(".map-tooltip_price");
var tooltipType = d3.select(".map-tooltip_type");
var tooltipDescription = d3.select(".map-tooltip_description");

var projection = d3.geoMercator();

var path = d3.geoPath().projection(projection);

var zoom = d3.zoom().scaleExtent([1, 4]).on("zoom", zoomed);

//==============================================================

function highlightBorough(d) {
  d3.select(this)
  .attrs({
    "fill": ColorHighlighted // add striped fill
  });
}

function unhighlightBorough(d) {
  d3.select(this)
  .attrs({
    "fill": ColorUnhighlighted // add striped fill
  });
}

function clicked(d) {

  d3.selectAll(".point-" + d.properties.neighbourhood.replace(/\s+/g, '-'))
    .style("display", "block");

  d3.select(".map-value-borough").text(d.properties.neighbourhood);

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

//==============================================================

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
        "fill": ColorUnhighlighted,
      })
      .on("click", clicked)
      .on("mouseover", highlightBorough)
      .on("mouseout", unhighlightBorough);

    svgMap.selectAll('.property-label')
      .data(csv)
      .enter()
      .append('circle')
        .each(function(d) {
          d3.select(this)
            .attrs({
              "r": "0.2px",
              "cx": projection([parseFloat(d.longitude), parseFloat(d.latitude)])[0],
              "cy": projection([parseFloat(d.longitude), parseFloat(d.latitude)])[1],
              "fill": propertyTypeColor(d.room_type),
              "class": "point-" + d.neighbourhood.replace(/\s+/g, '-')
            })
            .style("opacity", 0.5)
            .style("display", "none")
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
              "fill": "#3E67FF",
              "stroke": "#082783",
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

// Print the Stats

function boroughStats(d, i){
  createPieChart(d, i);

  d3.select(".map-value-borough").text(d.properties.neighbourhood);
  d3.select(".map-value-properties").text(d.properties["stats"]["totalNumProperties"]);

  d3.select(".panel-average-value_entire").text("£" + Math.round(d.properties["stats"]["entireAveragePrice"]));
  d3.select(".panel-properties-value_entire").text(d.properties["stats"]["entireNumProperties"]);

  d3.select(".panel-average-value_private").text("£" + Math.round(d.properties["stats"]["privateAveragePrice"]));
  d3.select(".panel-properties-value_private").text(d.properties["stats"]["privateNumProperties"]);

  d3.select(".panel-average-value_shared").text("£" + Math.round(d.properties["stats"]["sharedAveragePrice"]));
  d3.select(".panel-properties-value_shared").text(d.properties["stats"]["sharedNumProperties"]);
}

// Handle the display of stats

d3.selectAll(".panel-average-value").style("display", "none");
d3.selectAll(".panel-properties-value").style("display", "none");
d3.selectAll(".panel-average-value_entire").style("display", "block");
d3.selectAll(".panel-properties-value_entire").style("display", "block");

d3.select(".panel-select-type select")
.on("change", function(d, i){
  var select = d3.select("#panel-select-type-property").node().value;
  if(select === 'Entire home/apt'){
    d3.selectAll(".panel-average-value").style("display", "none");
    d3.selectAll(".panel-properties-value").style("display", "none");
    d3.selectAll(".panel-average-value_entire").style("display", "block");
    d3.selectAll(".panel-properties-value_entire").style("display", "block");
  };
  if(select === 'Private room'){
    d3.selectAll(".panel-average-value").style("display", "none");
    d3.selectAll(".panel-properties-value").style("display", "none");
    d3.selectAll(".panel-average-value_private").style("display", "block");
    d3.selectAll(".panel-properties-value_private").style("display", "block");
  };
  if(select === 'Shared room'){
    d3.selectAll(".panel-average-value").style("display", "none");
    d3.selectAll(".panel-properties-value").style("display", "none");
    d3.selectAll(".panel-average-value_shared").style("display", "block");
    d3.selectAll(".panel-properties-value_shared").style("display", "block");
  };
  
})