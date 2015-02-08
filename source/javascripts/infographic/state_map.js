var state_map_id = 'stateMap';
width = '738';
height = '455';
var twidth = (width/2) - 12;
var theight = (height/2) + 8;
var trans = [twidth,theight];

var track_duration = 25000;
var track_delay = 1000;

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
  var totalLength = track.selectAll("path").node().getTotalLength();

  track.selectAll("path")
    .style('opacity', 1)
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .attr("stroke-dashoffset", totalLength)
    .delay(0)
    .duration(0);

  track.selectAll("path")
    .transition()
    .attr("stroke-dashoffset", 0)
    .ease('linear')
    .delay(track_delay)
    .duration(track_duration);

  svg.selectAll(".stateText").style("opacity", 0);

  svg.selectAll(".stateText-0")
    .transition()
      .ease('linear')
      .style("opacity", 1)
      .duration(track_delay)
    .transition()
      .ease('linear')
      .style("opacity", 0)
      .delay(track_duration / 5)
      .duration(track_delay);

  svg.selectAll(".stateText-1")
    .transition()
      .ease('linear')
      .style("opacity", 1)
      .delay(track_duration + track_delay)
      .duration(track_delay);

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

  points.selectAll(".point").transition().style('fill-opacity', 0).style('stroke-opacity', 0).duration(track_delay);
  trackPlay();
  d3.event.stopPropagation();


});

d3.select('.buttonPoints').on('click', function() {
  d3.selectAll('.btn').classed('active', false);
  d3.select(this).classed('active', true);

  d3.selectAll('.stateMapButtonContent').classed('hidden', true);
  d3.selectAll('.contentPoints').classed('hidden', false);

  svg.selectAll(".stateText").transition().duration(track_delay).style("opacity", 0);

  track.selectAll("path").transition().duration(track_delay).style('opacity', 0.15).attr("stroke-dashoffset", 0);
  points.selectAll(".point").transition().style('fill-opacity', 0.5).style('stroke-opacity', 1).duration(track_delay);
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

  state_text.append("text")
    .attr("class", function(d,i) { return "stateText stateText-" + i%2; })
    .style("opacity", 0)
    .text(function(d) { return d.city + ", " + d.state_short; })
    .attr("x", function(d, i) { return projection([d.longitude, d.latitude])[0] + 3; })
    .attr("y", function(d, i) { return projection([d.longitude, d.latitude])[1]; });

  state_text.append("text")
    .attr("class", function(d,i) { return "stateText stateText-" + i%2; })
    .style("opacity", 0)
    .text(function(d) { return d.arrived; })
    .attr("x", function(d, i) { return projection([d.longitude, d.latitude])[0] + 3; })
    .attr("y", function(d, i) { return projection([d.longitude, d.latitude])[1] + 12; });

  // var stayLengthMin = d3.min(data.map_places.map( function(d) { return d.stay_length; }));
  // var stayLengthMax = d3.max(data.map_places.map( function(d) { return d.stay_length; }));
  // var stayLengthScale = d3.scale.linear().domain([stayLengthMin,stayLengthMax]).range([4,25]);

  var stayLengthMin = d3.min(data.map_places.map( function(d) { return d.price; }));
  var stayLengthMax = d3.max(data.map_places.map( function(d) { return d.price; }));
  var stayLengthScale = d3.scale.linear().domain([stayLengthMin,stayLengthMax]).range([4,25]);


  map_places = [];
  data.map_places.forEach( function(place) {
    map_places.push({
      type: "Feature",
      properties: {
        title: place.title,
        city_state: place.city + ", " + place.state_short,
        stay_length: place.stay_length,
        price: place.price
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
    .data(map_places.sort(function(a, b) { return b.properties.price - a.properties.price; }))
    .enter().append("circle")
    .attr("d", path)
    .attr("stroke", "black")
    .attr('class', 'point')
    .attr("cx", function(d, i) { return projection(d.geometry.coordinates)[0]; })
    .attr("cy", function(d, i) { return projection(d.geometry.coordinates)[1]; })
    .attr("r", function(d, i) { return stayLengthScale(d.properties.price); })
    .append("title")
      .text(function(d) {
        return d.properties.title + "\n" + d.properties.city_state + "\n" + d.properties.stay_length + " Nights";
      });

  trackPlay();


  var legend = svg.append("g")
      .attr("class", "stateMapButtonContent contentPoints hidden")
      .attr("transform", "translate(40,450)")
    .selectAll("g")
      .data([stayLengthMin,stayLengthMax/2,stayLengthMax])
    .enter().append("g");

  legend.append("circle")
    .attr("cy", function(d) { return -stayLengthScale(d); })
    .attr("r",  function(d) { return stayLengthScale(d); });

  legend.append("text")
    .attr("y", function(d) { return (-2 * stayLengthScale(d)) - 5; })
    .attr("x", 52)
    .attr("dy", "1.3em")
    .text(function (d) { return "" + d + " nights" });

};
