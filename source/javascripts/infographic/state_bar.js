var StateBar = (function(){
  var us_states = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
    CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii',
    ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
    ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
    NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
    PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
    TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
    WI: 'Wisconsin', WY: 'Wyoming'
  };


  function StateBar(data) {

    d3.select('.current_length_count').text(data.current_state_stay);
    d3.select('#current_state_text').text( us_states[data.location_current.state_short] );

    var x = d3.scale.linear()
    .domain([0, d3.max(data.states, function(d) { return d.days; })])
    .range([70, 340]);

    d3.select("#info-states-bar")
    .selectAll("div")
    .data( data.states.sort(function(a,b) { return b.days - a.days; }).slice(0,7) )
    .enter().append("div")
    .attr("class", function(d) { return 'stateface stateface-' + d.state.toLowerCase(); } )
    .style("width", function(d) { return x(d.days) + "px"; })
    .html(function(d) { return us_states[d.state] + '<span style="left:' + (x(d.days) + 5) + 'px;">' + d.days + '</span>'; });

  }

  return StateBar;

})();
