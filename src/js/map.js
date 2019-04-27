import * as d3 from 'd3';
import createPieChart from './pie-chart.js';

let color = {
  highlighted: "#3E67FF",
  unhighlighted: "#C6DAFB",
  entire: "#DC2B61",
  private: "#FFBA01",
  shared: "#57DEE3"
};

let mapWidth = 400;
let mapHeight = 250;
let mapScale = 20000;

let tooltip = {
  div: d3.select(".map-tooltip"),
  price: d3.select(".map-tooltip_price"),
  property_type: d3.select(".map-tooltip_type"),
  description: d3.select(".map-tooltip_description"),
  img: d3.select(".map-tooltip_img")
};

//================Initialize Map====================================

let active = d3.select(null);

let projection = d3.geoMercator().center([-0.330679,51.329011]).scale(mapScale).translate([mapWidth/4, mapHeight - 40]);

let path = d3.geoPath().projection(projection);

let zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

let svgMap = d3.select(".map").append("svg")
  .attrs({
    "preserveAspectRatio": "xMinYMin meet",
    "viewBox": "0 0 " + mapWidth + " " + mapHeight
  });

svgMap.append("rect")
  .attrs({
    "class": "background",
    "width": mapWidth,
    "height": mapHeight
  })
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("click", reset);

let g = svgMap.append("g");

svgMap.call(zoom);

d3.csv("listings-cleansed.csv").then(function(csv){
  d3.json("map.geojson").then(function(json){

    g.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attrs({
      "d": path,
      "class": "map_borough-path",
      "fill": color.unhighlighted,
    })
    .on("click", clicked)
    .on("mouseover", highlightBorough)
    .on("mouseout", unhighlightBorough);

    //append borough points on map
    g.selectAll('.map_borough-point')
    .data(json.features)
    .enter()
    .append('circle')
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
    .on("mouseover", highlightBoroughPoint)
    .on("mouseout", unhighlightBoroughPoint);

    //append borough labels on map
    g.selectAll('.borough-label')
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
        "pointer-events": "none",
        "font-family": "GilroyLight"
      })
    });

    //append property points on map
    g.selectAll('.property-label')
    .data(csv)
    .enter()
    .append('circle')
    .each(function(d) {
      d3.select(this)
      .attrs({
        "r": "0.3px",
        "cx": projection([parseFloat(d.longitude), parseFloat(d.latitude)])[0],
        "cy": projection([parseFloat(d.longitude), parseFloat(d.latitude)])[1],
        "fill": propertyTypeColor(d.room_type),
        "class": "point-" + d.neighbourhood_cleansed.replace(/\s+/g, '-')
      })
      .style("opacity", 0.8)
      .style("display", "none")
      ;
    })        
    .on("mouseover", showPropertyDetails)
    .on("mouseout", hidePropertyDetails);
  });

});

function propertyTypeColor(type){
  if(type === "Entire home/apt"){return color.entire}
  else if (type === "Private room"){return color.private}
  else if (type === "Shared room"){return color.shared}
}

function showPropertyDetails(d, i) {
  tooltip.div.transition().duration(200).style("opacity", 1);    
  tooltip.div.style("left", (d3.event.pageX + 15) + "px").style("top", (d3.event.pageY) + "px");
  tooltip.price.html("£" + d.price.substr(1)).style("background", propertyTypeColor(d.room_type));
  tooltip.property_type.html(d.room_type);
  tooltip.description.html(d.name);
  tooltip.img.attr("src",d.picture_url);
};

function hidePropertyDetails(){
  tooltip.div.transition().duration(500).style("opacity", 0);
}

// Borough Highlighting

function highlightBorough(d) {d3.select(this).attr("fill", color.highlighted)}

function unhighlightBorough(d) {d3.select(this).attr("fill", color.unhighlighted)}

function highlightBoroughPoint(d) {
  d3.select(this)
  .transition()    
  .duration(200)
  .attrs({
    "r": 4,
    "stroke": "yellow"
  });
}

function unhighlightBoroughPoint(d) {
  d3.select(this)
  .transition()    
  .duration(100)
  .attrs({
    "r": 2,
    "stroke": "#005673"
  });
}

// Handle the display of stats

d3.selectAll(".panel-value").style("display", "none");
d3.selectAll(".panel-average-value_entire").style("display", "block");
d3.selectAll(".panel-properties-value_entire").style("display", "block");

d3.select(".panel-select-type select")
.on("change", function(d, i){
  let select = d3.select("#panel-select-type-property").node().value;
  if(select === 'Entire home/apt'){
    d3.selectAll(".panel-value").style("display", "none");
    d3.selectAll(".panel-average-value_entire").style("display", "block");
    d3.selectAll(".panel-properties-value_entire").style("display", "block");
  };
  if(select === 'Private room'){
    d3.selectAll(".panel-value").style("display", "none");
    d3.selectAll(".panel-average-value_private").style("display", "block");
    d3.selectAll(".panel-properties-value_private").style("display", "block");
  };
  if(select === 'Shared room'){
    d3.selectAll(".panel-value").style("display", "none");
    d3.selectAll(".panel-average-value_shared").style("display", "block");
    d3.selectAll(".panel-properties-value_shared").style("display", "block");
  };
})

//===============================ZOOM========================================

function clicked(d, i) {
  //show property points

  //zoom out
  if (active.node() === this) {
    d3.selectAll(".point-" + d.properties.neighbourhood.replace(/\s+/g, '-')).style("display", "none");
    return reset()
  };

  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  d3.selectAll(".point-" + d.properties.neighbourhood.replace(/\s+/g, '-')).style("display", "block");

  let bounds = path.bounds(d),
      //          x-max          x-min
      // width  = bounds[1][0] - bounds[0][0];
      dx = bounds[1][0] - bounds[0][0],
      //          y-max          y-min
      // height = bounds[1][1] - bounds[0][1];
      dy = bounds[1][1] - bounds[0][1],
      //x-max + x-min
      x = (bounds[0][0] + bounds[1][0]) / 2,
      //y-max + y-min
      y = (bounds[0][1] + bounds[1][1]) / 2,

      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / mapWidth, dy / mapHeight))),
      translate = [mapWidth / 2 - scale * x, mapHeight / 2 - scale * y];

  svgMap.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );

  //update panel
  createPieChart(d, i);

  d3.select(".map-value-borough").text(d.properties.neighbourhood);
  d3.select(".map-value-properties").text(d.properties["stats"]["totalNumProperties"]);

  d3.select(".panel-average-value_entire").text("£" + Math.round(d.properties["stats"]["entireAveragePrice"]));
  d3.select(".panel-average-value_private").text("£" + Math.round(d.properties["stats"]["privateAveragePrice"]));
  d3.select(".panel-average-value_shared").text("£" + Math.round(d.properties["stats"]["sharedAveragePrice"]));

  d3.select(".panel-properties-value_entire").text(d.properties["stats"]["entireNumProperties"]);
  d3.select(".panel-properties-value_private").text(d.properties["stats"]["privateNumProperties"]);
  d3.select(".panel-properties-value_shared").text(d.properties["stats"]["sharedNumProperties"]);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);
  svgMap.transition().duration(750).call( zoom.transform, d3.zoomIdentity );
}

function zoomed() {
  g.attr("transform", d3.event.transform);
}

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}