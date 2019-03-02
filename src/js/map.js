import * as d3 from 'd3';

var mWidth = 400;
var mHeight = 300;
var mScale = 23000;
var active = d3.select(null);

//Initialize Map
var svgMap = d3.select(".map")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + mWidth + " " + mHeight);

var tooltipDiv = d3.select(".tooltipDiv")
  .style("opacity", 0);

var tooltipPrice = d3.select(".tooltip-price");

var tooltipType = d3.select(".tooltip-type");

var tooltipDescription = d3.select(".tooltip-description");

var projection = d3.geoMercator();

var path = d3.geoPath()
  .projection(projection);

var zoom = d3.zoom()
  .scaleExtent([1, 4])
  .on("zoom", zoomed);


d3.csv("listings.csv").then(function(csv){

  d3.json("map.geojson").then(function(json){

    projection.center([-0.330679,51.329011])
      .scale(mScale)
      .translate([mWidth/4, mHeight - 40]);

    svgMap.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("class","continent")
      .attr("d", path)
      .attr("fill", "#a2e7ff")
      .on("click", clicked);

    svgMap.selectAll('.property-label')
      .data(csv)
      .enter()
      .append('circle')
        .each(function(d) {
          d3.select(this)
            .attr("r", "0.4px")
            .attr("cx", projection([parseFloat(d.longitude), parseFloat(d.latitude)])[0])
            .attr("cy", projection([parseFloat(d.longitude), parseFloat(d.latitude)])[1])
            .attr("fill", function(d){
              if(d.room_type === "Entire home/apt"){
                return "#17c4ff"
              } else if (d.room_type === "Private room"){
                return "#00688b"
              } else if (d.room_type === "Shared room"){
                return "#003445"
              }
            })
            .attr("class","points")
            .style("opacity", 0.5)
            ;
        })        
        .on("mouseover", showPropertyDetails)
        .on("mouseout", hidePropertyDetails);

    svgMap.selectAll('.circle-icon')
      .data(json.features)
      .enter().append('circle')
        .each(function(d) {
          d3.select(this)
            .attr("r", 2)
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("fill", "#008ab9")
            .attr("stroke", "#005673")
            .attr("class","circle-icon");
        })
      .on("click", boroughStats)
      .on("mouseover", function(d) {
        d3.select(this)
        .transition()    
        .duration(200)
        .attr("r", 4)
        .attr("stroke", "yellow");
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .transition()    
        .duration(100)
        .attr("r", 2)
        .attr("stroke", "#005673");
      });

    svgMap.selectAll('.borough-label')
      .data(json.features)
      .enter()
      .append('text')
        .each(function(d) {
          d3.select(this)
            .attr("transform", function(d) { return "translate(" + (path.centroid(d)[0] + 4) + "," + (path.centroid(d)[1] + 2) + ")"; })
            .text(function(d) { return d.properties.neighbourhood })
            .attr("class","borough-labels")
            .attr("text-anchor", "left")
            .attr("pointer-events", "none");
        })
  });

});

//=============================BOUNDING BOX==================================//

function handleMouseOver(d, i) {
  d3.select(this)
    .attr("fill", "#d0f3ff");
}
function handleMouseOut(d, i) {
  d3.select(this)
    .attr("fill", "#00bfff");
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

//=======================Panel=============================//

var typeButtons = document.querySelectorAll(".propertyTypeContainer .propertyTypeMenu button");
var typePanels = document.querySelectorAll(".propertyTypeContainer .propertyType");

var typeHome = document.querySelector("#typeHome");
var typePrivate = document.querySelector("#typePrivate");
var typeShared = document.querySelector("#typeShared");
var typeMenuContainer = document.querySelector(".propertyTypeMenu");

//Initial panel state
showPanel(0, "#17c4ff");

typeHome.addEventListener("click", function(){showPanel(0, "#17c4ff");}, false);
typePrivate.addEventListener("click", function(){showPanel(1, "#00688b");}, false);
typeShared.addEventListener("click", function(){showPanel(2, "#003445");}, false);

function showPanel(panelIndex, colorCode){
  typeButtons.forEach(function(node){
    node.style.backgroundColor="white";
    node.style.color=""
  })
  typeButtons[panelIndex].style.backgroundColor= colorCode;
  typeMenuContainer.style.borderColor= colorCode;
  typeButtons[panelIndex].style.color= "white";

  typePanels.forEach(function(node){
    node.style.display="none";
  })
  typePanels[panelIndex].style.display="block";
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
    .range(["#17c4ff", "#00688b", "#003445"]);

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