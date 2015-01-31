var state_map_id = 'info-states-map-map';
width = '482';
height = '280';
var twidth = (width/2) - 12;
var theight = (height/2) + 8;
var trans_2 = [twidth,theight];

var projection_2 = d3.geo.albers().scale(600).translate(trans_2);
var path_2 = d3.geo.path().projection(projection_2);

d3.select("#info-states-map").append('div').attr('id', state_map_id).style('position', 'relative');
state_map_div_2 = d3.select("#info-states-map").select("#" + state_map_id);

var svg = state_map_div_2.append("svg")
.attr("width", width)
.attr("height", height)
.attr("style", 'display: block; margin-bottom: 0px;');

states_2 = svg.append("svg:g").attr("id", "states");
track_2 = svg.append("svg:g").attr("id", "track");

d3.json("/states.json", function(json) {
  states_2.selectAll("path")
  .data(json.features)
  .enter().append("path")
  .attr("d", path_2).attr("class", function(d) { return 'states info-state-map-' + d.properties.abr.toLowerCase(); });
});


var state_map_2 = function(data) {
  //debugger;

  var newScaledData = [];
  var minDataPoint = d3.min(data.states.map( function(d) { return d.cost_per_day; }));
  var maxDataPoint = d3.max(data.states.map( function(d) { return d.cost_per_day; }));

  var linearScale = d3.scale.linear()
                             .domain([minDataPoint,maxDataPoint])
                             .range([0.1,1]);

                             //debugger;

  data.states.forEach(function(s) {
    d3.select(".info-state-map-" + s.state.toLowerCase() ).style("fill", "rgba(43, 84, 126, " + linearScale(s.cost_per_day) + ")");
    //debugger;
  });


};
