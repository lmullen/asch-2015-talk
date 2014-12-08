map = d3.carto.map();

d3.select("#map").call(map);
map.centerOn([-71.668006, 42.239650], "latlong").setScale(8);

var baseLayer = d3.carto.layer.tile();

baseLayer
.path("lmullen.ke033le7")
.tileType("mapbox")
.label("Base")
.visibility(false);

var census = d3.carto.layer.topojson();

census
.path("census.topojson")
.label("Census")
.renderMode("svg")
.cssClass("census")
.clickableFeatures(true)
.on("load", choroplethCensus);

var churches = d3.carto.layer.csv();

churches
.path("congregationalists.csv")
.label("Churches")
.cssClass("church")
.renderMode("svg")
.markerSize(3)
.x("lon")
.y("lat")
.clickableFeatures(true)
.on("load", scaleChurchCircles);

map
.addCartoLayer(baseLayer)
.addCartoLayer(census)
.addCartoLayer(churches);

d3.select("body")
.append("div")
.classed("animate-control", true)
.text("Animate all churches")
.on("click", animateCircles);

function scaleChurchCircles() {
  var memberScale = d3.scale.linear().domain([0,800]).range([3,15]).clamp(true);
  churches.g().selectAll("circle").attr("r", function(d) {
    return 0;
    //    if(d.members > 0) {
    //      return memberScale(d.members);
    //    } else {
    //      return 3;
    //    }
  })

}

function animateCircles() {

  census.g().selectAll("path")
  .transition().style("fill-opacity", "0").duration(3000);

  churches.g().selectAll("circle").attr("r", 0);

  var memberScale = d3.scale.linear().domain([0,800]).range([3,15]).clamp(true);

  churches.g().selectAll("circle").transition().attr("r", function(d) {
    if(d.members > 0) {
      return memberScale(d.members);
    } else {
      return 3;
    }
  }).duration(5000)
  .delay(function(d, i) { return i / 500 * 5000; });

  choroplethCensus();

}

function choroplethCensus() {
  var censusScale = d3.scale.linear().domain([0, 75]).range(["white", "red"]);
  census.g().selectAll("path").style("fill", function(d) {
    return censusScale(d.properties.cong);
  }).style("fill-opacity", 1);
}
