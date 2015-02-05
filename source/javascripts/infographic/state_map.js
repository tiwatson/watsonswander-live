var state_map_id = 'stateMap';
width = '738';
height = '435';
var twidth = (width/2) - 12;
var theight = (height/2) + 8;
var trans = [twidth,theight];

var projection = d3.geo.albers().scale(900).translate(trans);
var path = d3.geo.path().projection(projection);
var state_text;

d3.select("#d3StateMap").append('div').attr('id', state_map_id).style('position', 'relative');
state_map_div = d3.select("#d3StateMap").select("#" + state_map_id);

var svg = state_map_div.append("svg")
.attr("width", width)
.attr("height", height)
.attr("style", 'display: block; margin-bottom: 0px;');

states = svg.append("svg:g").attr("id", "states");
track = svg.append("svg:g").attr("id", "track");

d3.json("/states.json", function(json) {
  states.selectAll("path")
  .data(json.features)
  .enter().append("path")
  .attr("d", path)
  .attr('fill', "rgba(204, 204, 204, 1)")
  .attr("class", function(d) { return 'states state-' + d.properties.abr.toLowerCase(); });
});

function trackPlay() {
  var totalLength = track.selectAll("path").node().getTotalLength();

  track.selectAll("path")
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
  .delay(100)
  .duration(25000);

}

d3.select('.replayBox').on('click', function() {
  trackPlay();
  d3.event.stopPropagation();
});

d3.select('.buttonDays').on('click', function() {
  d3.selectAll('.states').transition().duration(2000).style("fill", function(d) { return "rgba(43, 84, 126, " + d.properties.days + ")"; });
  d3.event.stopPropagation();
});

d3.select('.buttonCostPerDay').on('click', function() {
  d3.selectAll('.states')
    .transition().duration(2000)
    .style("fill", function(d) { return "rgba(43, 84, 126, " + d.properties.cost_per_day + ")"; });
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

  //trackPlay();

  var costPerDayMin = d3.min(data.states.map( function(d) { return d.cost_per_day; }));
  var costPerDayMax = d3.max(data.states.map( function(d) { return d.cost_per_day; }));
  var costPerDayScale = d3.scale.linear().domain([costPerDayMin,costPerDayMax]).range([0.1,0.99]);

  var daysMin = d3.min(data.states.map( function(d) { return d.days; }));
  var daysMax = d3.max(data.states.map( function(d) { return d.days; }));
  var daysScale = d3.scale.linear().domain([daysMin,daysMax]).range([0.1,0.99]);


  data.states.forEach(function(s) {
    d3.select(".state-" + s.state.toLowerCase() ).data()[0].properties.cost_per_day = costPerDayScale(s.cost_per_day);
    d3.select(".state-" + s.state.toLowerCase() ).data()[0].properties.days = daysScale(s.days);
  });

};
