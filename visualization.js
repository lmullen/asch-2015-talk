map = d3.carto.map();

d3.select("#map").call(map);
map.centerOn([-71.668006, 42.239650], "latlong").setScale(8);

var baseLayer = d3.carto.layer.tile();

baseLayer.path("lmullen.ke033le7").tileType("mapbox").label("Base");

var towns = d3.carto.layer.topojson();

towns
.path("towns.topojson")
.label("Towns")
.renderMode("svg")
.cssClass("town")
.clickableFeatures(true);

churches = d3.carto.layer.csv();

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
.addCartoLayer(towns)
.addCartoLayer(churches);

function scaleChurchCircles() {
  memberScale = d3.scale.linear().domain([0,800]).range([3,15]).clamp(true);
  churches.g().selectAll("circle").attr("r", function(d) {
    if(d.members > 0) {
      return memberScale(d.members);
    } else {
      return 3;
    }
      
  })

}
