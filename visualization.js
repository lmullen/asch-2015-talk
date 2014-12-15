var mystack = stack()
.on("activate", activate)
.on("deactivate", deactivate);

function drawCongregationalists() {
  congregationalistsMap = d3.carto.map();
  d3.select("#congregationalists-map").call(congregationalistsMap);
  congregationalistsMap
  .centerOn([-71.668006, 42.239650], "latlong")
  .setScale(8);


  baseLayer = d3.carto.layer.tile();
  baseLayer
  .path("terrain-background")
  .tileType("stamen")
  .label("Base");

  churches = d3.carto.layer.csv();

  churches
  .path("congregationalists.csv")
  .label("Churches")
  .cssClass("church")
  .renderMode("svg")
  .x("lon")
  .y("lat")
  .markerSize(0)
  .clickableFeatures(false)
  .on("load", scaleChurchCircles);

  congregationalistsMap
  .addCartoLayer(baseLayer)
  .addCartoLayer(churches)
  .zoomable(false);

}


function drawDiachronic() {
  diachronicMap = d3.carto.map();
  d3.select("#diachronic-map").call(diachronicMap);
  diachronicMap
  .centerOn([-71.668006, 42.239650], "latlong")
  .setScale(8);


  baseLayer = d3.carto.layer.tile();
  baseLayer
  .path("terrain-background")
  .tileType("stamen")
  .label("Base");

  churchesDiachronic = d3.carto.layer.csv();

  churchesDiachronic
  .path("congregationalists.csv")
  .label("Churches")
  .cssClass("church")
  .renderMode("svg")
  .x("lon")
  .y("lat")
  .markerSize(0)
  .clickableFeatures(false)
  .on("load", churchesOverTime);

  diachronicMap
  .addCartoLayer(baseLayer)
  .addCartoLayer(churchesDiachronic)
  .zoomable(false);

}

function churchesOverTime() {

  var date = 1620;

  timer = setInterval(function() {

    churchesDiachronic.g().selectAll("circle")
    .transition()
    .attr("r", function(d) {
      if(+d.organized <= date)
        return 5;
      else
        return 0;
    })
    .duration(250)
    .ease("linear");

    date++;
    d3.select("#diachronic-date").text(date);

    if(date >= 1854) clearInterval(timer);

  }, 250)
}

function scaleChurchCircles() {
  var memberScale = d3.scale.sqrt().domain([0,800]).range([0,15]).clamp(true);
  churches.g().selectAll("circle")
  .transition()
  .attr("r", function(d) {
    if(d.members > 0) {
      return memberScale(d.members);
    } else {
      return 1;
    }
  })
  .duration(2500)
  .delay(function(d, i) { return i / 500 * 2500; });

}

function drawGaustad() {
  gaustadMap = d3.carto.map();
  d3.select("#gaustad-map").call(gaustadMap);

  census = d3.carto.layer.topojson();
  census
  .path("census.topojson")
  .label("Census")
  .renderMode("svg")
  .cssClass("county")
  .clickableFeatures(false)
  .on("load", choroplethCensus);

  gaustadMap.addCartoLayer(census);

  gaustadMap.zoomTo([[-99.32, 25.68], [-69.75, 47.51]], "latlong", 0.55);

}

function choroplethCensus() {
  console.log("hello")
  // census.g().append("path")
  // .datum(topojson.meshArcs(census.features(), function(a, b) {
  //   console.log(a.properties.s !== b.properties.s);
  //   return a.properties.s !== b.properties.s;
  // }))
  // .attr("class", "states")
  // .attr("d", path)

  censusScale = d3.scale.threshold()
  .domain([1, 5, 15, 26])
  .range(["#ffffff", "#dfc27d", "#bf812d", "#8c510a", "#543005"])

  census.g().selectAll("path.county").style("fill", function(d) {
    return censusScale(d.properties.cong);
  }).style("fill-opacity", 1);

  // var albers = d3.geo.albersUsa()
  // .scale(1000)
  // .translate(gaustadMap.zoom().translate());

  // gaustadMap.mode("projection").projection(albers).refresh();


}

function deleteCongregationalists() {
  d3.select("#congregationalists-map").selectAll("*").remove();
}

function deleteDiachronic() {
  clearInterval(timer);
  d3.select("#diachronic-map").selectAll("*").remove();
}

function deleteGaustad() {
  d3.select("#gaustad-map").selectAll("*").remove();
}

var section = d3.selectAll("section"),
congregationalistsNode = d3.select("#congregationalists"),
congregationalistsIndex = section[0].indexOf(congregationalistsNode.node());
diachronicNode = d3.select("#diachronic"),
diachronicIndex = section[0].indexOf(diachronicNode.node());
gaustadNode = d3.select("#gaustad-slide"),
gaustadIndex = section[0].indexOf(gaustadNode.node());

function refollow() {
  followAnchor.style("top", (followIndex + (1 - mystack.scrollRatio()) / 2 - d3.event.offset) * 100 + "%");
}

function activate(d, i) {
  if (i === congregationalistsIndex) drawCongregationalists();
  if (i === diachronicIndex) drawDiachronic();
  if (i === gaustadIndex) drawGaustad();
}

function deactivate(d, i) {
  if (i === congregationalistsIndex) deleteCongregationalists();
  if (i === diachronicIndex) deleteDiachronic();
  if (i === gaustadIndex) deleteGaustad();
}

function hideCommentary() {
  d3.selectAll("section aside").classed("hidden", true);
  d3.select("#commentary").classed("hidden", true);
}
