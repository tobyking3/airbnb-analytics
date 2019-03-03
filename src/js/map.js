import * as d3 from 'd3';
import createPieChart from './pie-chart.js';

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
              "class": "point-" + d.neighbourhood,
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
  d3.select(".average-prices_total-properties").text(d.properties["stats"]["totalNumProperties"] + " properties");

  createPieChart(d, i);

  d3.select(".home-type-average").text("£" + Math.round(d.properties["stats"]["entireAveragePrice"]));
  d3.select(".home-type-properties").text(d.properties["stats"]["entireNumProperties"]);
  d3.select(".home-type-percentage").text((d.properties["stats"]["entirePercentage"] * 100).toFixed(2) + "%");

  d3.select(".private-type-average").text("£" + Math.round(d.properties["stats"]["privateAveragePrice"]));
  d3.select(".private-type-properties").text(d.properties["stats"]["privateNumProperties"]);
  d3.select(".private-type-percentage").text((d.properties["stats"]["privatePercentage"] * 100).toFixed(2) + "%");

  d3.select(".shared-type-average").text("£" + Math.round(d.properties["stats"]["sharedAveragePrice"]));
  d3.select(".shared-type-properties").text(d.properties["stats"]["sharedNumProperties"]);
  d3.select(".shared-type-percentage").text((d.properties["stats"]["sharedPercentage"] * 100).toFixed(2) + "%");
}
