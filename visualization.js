/**
 * Draw maps when slides are activated
 */
var mystack = stack().on("activate", activate).on("deactivate", deactivate);

function findIndex(selector) {
  var section = d3.selectAll("section");
  var node = d3.select(selector);
  var index = section[0].indexOf(node.node());
  return index;
}

var congregationalistsIndex = findIndex("#congregationalists");
var diachronicIndex = findIndex("#diachronic");
var gaustadIndex = findIndex("#gaustad-slide");

function activate(d, i) {
  switch(i) {
    case congregationalistsIndex:
      drawCongregationalists();
      break;
    case diachronicIndex:
      drawDiachronic();
      break;
    case gaustadIndex:
      drawGaustad();
      break;
  }
}

function deactivate(d, i) {
  switch(i) {
    case congregationalistsIndex:
      deleteCongregationalists();
      break;
    case diachronicIndex:
      deleteDiachronic();
      break;
    case gaustadIndex:
      deleteGaustad();
      break;
  }
}

function hideCommentary() {
  d3.selectAll("section aside").classed("hidden", true);
  d3.select("#commentary").classed("hidden", true);
}

/**
 * Map of Congregationalists in 1854
 */

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

function deleteCongregationalists() {
  d3.select("#congregationalists-map").selectAll("*").remove();
}

/**
 * Map of Congregationalist churches over time
 */

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

  var date = 1630;

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


function deleteDiachronic() {
  clearInterval(timer);
  d3.select("#diachronic-map").selectAll("*").remove();
}


/**
 * Imitation of Gaustad map
 */

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

function deleteGaustad() {
  d3.select("#gaustad-map").selectAll("*").remove();
}

