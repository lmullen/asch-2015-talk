map = d3.carto.map();

d3.select("#map").call(map);
map.centerOn([-71.668006, 42.239650], "latlong").setScale(8);

var baseLayer = d3.carto.layer.tile();

baseLayer.path("lmullen.ke033le7").tileType("mapbox").label("Base");

map.addCartoLayer(baseLayer);
