//= require_tree .


var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

var data; // a global

var parseDate = d3.time.format("%d-%m-%Y").parse,
bisectDate = d3.bisector(function(d) { return d.date; }).left,
formatValue = d3.format(",.0f"),
costWithCents = d3.format("$,.2f"),
formatCurrency = function(d) { return "$" + formatValue(d); },
formatPercent = function(d) { return formatValue(d) + "%"; };

var state_face = {
  VA: "s",
  ND: "b",
  NY: "h",
  AL: "B",
  RI: "m",
  NE: "c",
  MN: "W",
  MD: "T",
  HI: "K",
  DE: "H",
  CO: "F",
  WY: "x",
  MO: "X",
  ME: "U",
  IA: "L",
  OR: "k",
  OH: "i",
  KY: "Q",
  IL: "N",
  AZ: "D",
  TX: "q",
  TN: "p",
  NH: "d",
  GA: "J",
  SC: "n",
  IN: "O",
  ID: "M",
  SD: "o",
  PA: "l",
  OK: "j",
  NJ: "e",
  MS: "Y",
  MI: "V",
  FL: "I",
  CT: "G",
  AR: "C",
  WI: "v",
  MT: "Z",
  US: "z",
  VT: "t",
  NV: "g",
  KS: "P",
  CA: "E",
  WV: "w",
  UT: "r",
  NM: "f",
  MA: "S",
  DC: "y",
  WA: "u",
  NC: "a",
  LA: "R",
  AK: "A",
  PR: "3"
}

var loadingState = function() {
  d3.select('#loading-state').html( possible.charAt(Math.floor(Math.random() * possible.length)) );
}
var stateInterval = setInterval(loadingState, 100);

//d3.timer(loadingState, 1000, 10000);
loadingState();

d3.json("http://wl-api-maps.dev/api/v1/maps/1/infographic.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  //state_bubbles(data);

  state_bar(data);
  state_map(data);
  categories(data);
  monthlies(data);
  costs(data);

  d3.select('#number_days').text(data.num_nights);
  d3.select('#number_places').text(data.num_places);
  d3.select('#number_states').text(data.num_states);

  d3.select('#percentage_free_nights').text(formatPercent(data.percentage_free_nights));
  d3.select('#walmart_count').text(data.walmart_count);

  d3.select('#miles_towed').text(data.miles_towed);
  d3.select('#longest_drive').text(data.longest_arrival_distance.arrival_distance);
  d3.select('#longest_drive_to').text(data.longest_arrival_distance.title);
  d3.select('#longest_drive_to_more').text(data.longest_arrival_distance.city + ", " + data.longest_arrival_distance.state_short);
  d3.select('#longest_drive_date').text(data.longest_arrival_distance.arrived);

  d3.select('#shortest_drive').text(data.shortest_arrival_distance.arrival_distance);
  d3.select('#shortest_drive_to').text(data.shortest_arrival_distance.title);
  d3.select('#shortest_drive_to_more').text(data.shortest_arrival_distance.city + ", " + data.shortest_arrival_distance.state_short);
  d3.select('#shortest_drive_date').text(data.shortest_arrival_distance.arrived);

  data.states.filter( function(d) { return d.cost == 0; }).sort(function(a,b) { return a.state > b.state; }).forEach( function(s) {
    d3.select('#freeStateItems').append('span').attr('class', 'state-icon').html(state_face[s.state]);
  });

  if (stateInterval) {
    clearInterval(stateInterval);
  }

  d3.select('#loading').classed('hidden', true);
  d3.select('#content').classed('hidden', false);

});
