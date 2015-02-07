var state_map_id = 'stateMap';
width = '738';
height = '435';
var twidth = (width/2) - 12;
var theight = (height/2) + 8;
var trans = [twidth,theight];

var projection = d3.geo.albers().scale(900).translate(trans);
var path = d3.geo.path().projection(projection);
var state_text;

var track_on = true;

d3.select("#d3StateMap").append('div').attr('id', state_map_id).style('position', 'relative');
state_map_div = d3.select("#d3StateMap").select("#" + state_map_id);

var svg = state_map_div.append("svg")
.attr("width", width)
.attr("height", height)
.attr("style", 'display: block; margin-bottom: 0px;');

states = svg.append("svg:g").attr("id", "states");
track = svg.append("svg:g").attr("id", "track");
points = svg.append("svg:g").attr("id", "points");

d3.json("/states.json", function(json) {
  states.selectAll("path")
  .data(json.features)
  .enter().append("path")
  .attr("d", path)
  .style('fill', "rgba(204, 204, 204, 1)")
  .attr("class", function(d) { return 'states state-' + d.properties.abr.toLowerCase(); });
});

function trackPlay() {

  d3.selectAll('.states')
  .transition().duration(1000)
  .style("fill-opacity", function(d) {
    if (typeof d.properties.days !== 'undefined') {
      return 0.5;
    }
    else {
      return 1;
    }
  });

  var totalLength = track.selectAll("path").node().getTotalLength();

  track.selectAll("path")
  .style('opacity', 1)
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .attr("stroke-dashoffset", totalLength)
  .delay(0)
  .duration(0);

  svg.selectAll("text").style("opacity", 1).transition().style("opacity", 0).duration(2500);

  track.selectAll("path")
  .transition()
  .attr("stroke-dashoffset", 0)
  .ease('linear')
  .delay(1000)
  .duration(25000);

// d3.select(points.selectAll(".point")[0][100]).style('fill-opacity', 0.5).style('stroke-opacity', 1)

// points.selectAll(".point").transition().ease('linear')
//   .delay(1000)
//   .duration(25000).tween("nil", function(d,i) {
//     var ii = d3.interpolateRound(0, 100);
//     console.log(i,ii);
//   d3.select(points.selectAll(".point")[0][i]).style('fill-opacity', 0.5).style('stroke-opacity', 1)
// });

}

d3.select('.replayBox').on('click', function() {
  trackPlay();
  d3.event.stopPropagation();
});

d3.select('.buttonTrack').on('click', function() {
  d3.selectAll('.btn').classed('active', false);
  d3.select(this).classed('active', true);

  d3.selectAll('.stateMapButtonContent').classed('hidden', true);
  d3.select('.contentTrack').classed('hidden', false);

  points.selectAll(".point").transition().style('fill-opacity', 0).style('stroke-opacity', 0).duration(1000);
  trackPlay();
  d3.event.stopPropagation();


});

d3.select('.buttonPoints').on('click', function() {
  d3.selectAll('.btn').classed('active', false);
  d3.select(this).classed('active', true);

  d3.selectAll('.stateMapButtonContent').classed('hidden', true);
  d3.select('.contentDays').classed('hidden', false);

  track.selectAll("path").transition().duration(1000).style('opacity', 0.15).attr("stroke-dashoffset", 0);
  points.selectAll(".point").transition().style('fill-opacity', 0.5).style('stroke-opacity', 1).duration(1000);
  d3.event.stopPropagation();
});


var state_map = function (data) {

  path_data = [{"type":"Feature","id":"01","properties":{"name":"Linestring"},"geometry":{"type":"LineString","coordinates": data.path }}];

  track.selectAll("path")
  .data(path_data)
  .enter().append("path")
  .attr("d", path).attr("class", "line");

  var totalLength = track.selectAll("path").node().getTotalLength();

  track.selectAll("path")
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength);

  state_text = svg.selectAll("text")
  .data([data.location_first, data.location_current])
  .enter();

  state_text.append("text").attr("class", "stateText")
  .text(function(d) { return d.city + ", " + d.state_short; })
  .attr("x", function(d, i) { return projection([d.longitude, d.latitude])[0] + 3; })
  .attr("y", function(d, i) { return projection([d.longitude, d.latitude])[1]; });

  state_text.append("text").attr("class", "stateText")
  .text(function(d) { return d.arrived; })
  .attr("x", function(d, i) { return projection([d.longitude, d.latitude])[0] + 3; })
  .attr("y", function(d, i) { return projection([d.longitude, d.latitude])[1] + 12; });

  var stayLengthMin = d3.min(data.map_places.map( function(d) { return d.stay_length; }));
  var stayLengthMax = d3.max(data.map_places.map( function(d) { return d.stay_length; }));
  var stayLengthScale = d3.scale.linear().domain([stayLengthMin,stayLengthMax]).range([4,25]);

  map_places = [];
  data.map_places.forEach( function(place) {
    map_places.push({
      type: "Feature",
      properties: {
        title: place.title,
        city_state: place.city + ", " + place.state_short,
        stay_length: place.stay_length
      },
      geometry: {
        type: "Point",
        coordinates: [
          place.longitude,
          place.latitude
        ]
      }
    });
  });

  points.selectAll("circle")
    .data(map_places.sort(function(a, b) { return b.properties.stay_length - a.properties.stay_length; }))
    .enter().append("circle")
    .attr("d", path)
    .attr("stroke", "black")
    .attr('class', 'point')
    .attr("cx", function(d, i) { return projection(d.geometry.coordinates)[0]; })
    .attr("cy", function(d, i) { return projection(d.geometry.coordinates)[1]; })
    .attr("r", function(d, i) { return stayLengthScale(d.properties.stay_length); })
    .append("title")
      .text(function(d) {
        return d.properties.title + "\n" + d.properties.city_state + "\n" + d.properties.stay_length + " Nights";
      });

  trackPlay();

};
