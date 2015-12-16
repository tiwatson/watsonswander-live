//= require_tree .

var apiUrl = '/data.json';

// // Uglifier will remove
// if (typeof DEVMODE === "undefined") {
//     DEVMODE = true;
// }
// if (DEVMODE) {
//   apiUrl = 'http://wl-api-maps.dev/api/v1/maps/1/infographic.json'
// }

var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

var parseDate = d3.time.format("%d-%m-%Y").parse,
bisectDate = d3.bisector(function(d) { return d.date; }).left,
formatValue = d3.format(",.0f"),
formatValue1 = d3.format(",.1f"),
costWithCents = d3.format("$,.2f"),
formatComma = d3.format("0,000"),
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

function where(map_place) {
  return map_place.title + "<br/>" + map_place.city + ", " + map_place.state_short + "<br/>" + map_place.arrived;
}

var loadingState = function() {
  d3.select('#loading-state').html( possible.charAt(Math.floor(Math.random() * possible.length)) );
}
var stateInterval = setInterval(loadingState, 100);
loadingState();

d3.json(apiUrl, function(error, data) {
  if (error) return console.warn(error);

  new StateMap(data);
  new Categories(data);
  new StateBar(data);
  new Elevation(data);

  new Costs(data);
  new Monthlies(data);
  new Towing(data);


  d3.select('#number_days').text(data.num_nights);
  d3.select('#number_places').text(data.num_places);
  d3.select('#number_states').text(data.num_states);

  if (stateInterval) {
    clearInterval(stateInterval);
  }

  d3.select('#loading').classed('hidden', true);
  d3.select('#content').classed('hidden', false);

});
