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

map
.addCartoLayer(baseLayer)
.addCartoLayer(towns)
.addCartoLayer(churches);


