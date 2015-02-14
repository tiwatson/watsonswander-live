//= require_tree .


var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

var data; // a global

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

  elevation_lowest = data.map_places.sort(function(a,b) { return a.elevation - b.elevation; })[0]
  elevation_highest = data.map_places.sort(function(a,b) { return b.elevation - a.elevation; })[0]

  d3.select('#elevation_lowest').text(formatComma(elevation_lowest.elevation) + "'");
  d3.select('#elevation_lowest_where').html(where(elevation_lowest));
  d3.select('#elevation_highest').text(formatComma(elevation_highest.elevation) + "'");
  d3.select('#elevation_highest_where').html(where(elevation_highest));



  d3.select('#number_days').text(data.num_nights);
  d3.select('#number_places').text(data.num_places);
  d3.select('#number_states').text(data.num_states);

  d3.select('#percentage_free_nights').text(formatPercent(data.percentage_free_nights));
  d3.select('#walmart_count').text(data.walmart_count);
  d3.select('#consecutive_free').text(data.consecutive_free);
  data.states.filter( function(d) { return d.cost == 0; }).sort(function(a,b) { return a.state > b.state; }).forEach( function(s) {
    d3.select('#freeStateItems').append('span').attr('class', 'state-icon').html(state_face[s.state]);
  });

  d3.select('#miles_towed').text(data.miles_towed);
  d3.select('#average_towed').text(formatValue1(data.average_towed));
  d3.select('#longest_drive').text(data.longest_arrival_distance.arrival_distance);
  d3.select('#longest_drive_to').text(data.longest_arrival_distance.title);
  d3.select('#longest_drive_to_more').text(data.longest_arrival_distance.city + ", " + data.longest_arrival_distance.state_short);
  d3.select('#longest_drive_date').text(data.longest_arrival_distance.arrived);

  d3.select('#shortest_drive').text(data.shortest_arrival_distance.arrival_distance);
  d3.select('#shortest_drive_to').text(data.shortest_arrival_distance.title);
  d3.select('#shortest_drive_to_more').text(data.shortest_arrival_distance.city + ", " + data.shortest_arrival_distance.state_short);
  d3.select('#shortest_drive_date').text(data.shortest_arrival_distance.arrived);

  if (stateInterval) {
    clearInterval(stateInterval);
  }

  d3.select('#loading').classed('hidden', true);
  d3.select('#content').classed('hidden', false);

  var elevation_icon = d3.select('#elevation_icon')
    .append('svg')
    .attr('width', 226)
    .attr('height', 132)
    .attr('viewBox','7 28 86 42')
    .append("g");
  
  var paths = [
  //  'M37.056,40.094l-3.103-3.103c-0.195-0.195-0.195-0.512,0-0.707s0.512-0.195,0.707,0l2.396,2.396l3.206-3.204l3.182,3.182   l3.182-3.181l3.196,3.198l2.495-2.496c0.195-0.195,0.512-0.195,0.707,0s0.195,0.512,0,0.707l-3.202,3.204l-3.196-3.199   l-3.182,3.181l-3.182-3.182L37.056,40.094z',
  //  'M69.667,47.161l-2.654-2.654c-0.195-0.195-0.195-0.512,0-0.707s0.512-0.195,0.707,0l1.947,1.947l2.697-2.698l2.681,2.681   l2.677-2.677l2.689,2.691l1.972-1.969c0.195-0.194,0.512-0.195,0.707,0c0.195,0.196,0.195,0.512,0,0.708l-2.679,2.675l-2.689-2.691   l-2.677,2.677l-2.681-2.681L69.667,47.161z',
  //  'M14.842,51.372l-1.48-1.48c-0.195-0.195-0.195-0.512,0-0.707s0.512-0.195,0.707,0l0.773,0.773l1.804-1.804l1.792,1.791   l1.788-1.792l1.799,1.8l0.881-0.88c0.195-0.195,0.512-0.195,0.707,0s0.195,0.512,0,0.707l-1.588,1.587l-1.799-1.799l-1.787,1.791   l-1.793-1.791L14.842,51.372z',
  //  'M18.433,62.039c-0.09,0-0.181-0.024-0.263-0.075c-0.234-0.146-0.307-0.454-0.161-0.688l25.487-41.074l25.374,41.075   c0.145,0.234,0.072,0.543-0.163,0.688c-0.234,0.142-0.543,0.073-0.688-0.163L43.494,22.101L18.858,61.803   C18.763,61.955,18.6,62.039,18.433,62.039z',
  //  'M94.125,62.336c-0.167,0-0.33-0.084-0.425-0.236L75.024,32L62.714,51.84c-0.146,0.235-0.455,0.306-0.688,0.161   c-0.234-0.146-0.307-0.454-0.161-0.688l13.16-21.208L94.55,61.572c0.146,0.234,0.073,0.543-0.161,0.688   C94.307,62.312,94.216,62.336,94.125,62.336z',
  //  'M5.776,62.039c-0.09,0-0.181-0.024-0.263-0.075c-0.234-0.146-0.307-0.454-0.161-0.688l13.156-21.201l6.688,10.781   c0.146,0.234,0.073,0.543-0.161,0.688c-0.235,0.146-0.543,0.072-0.688-0.161l-5.839-9.412L6.201,61.803   C6.106,61.955,5.943,62.039,5.776,62.039z'
  
'M76.546,73.604H31.05c-1.555,0-2.822-0.65-3.479-1.785c-0.653-1.135-0.584-2.557,0.193-3.902l22.748-39.4     c0.778-1.346,1.975-2.119,3.285-2.119c1.309,0,2.506,0.773,3.284,2.119l22.747,39.4c0.777,1.348,0.848,2.77,0.193,3.902     C79.368,72.953,78.101,73.604,76.546,73.604z M31.11,69.775h45.375L53.798,30.479L31.11,69.775z',
'M36.216,73.604H11.794c-1.557,0-2.822-0.65-3.479-1.785c-0.653-1.135-0.584-2.557,0.193-3.902l14.795-25.623     c0.775-1.348,1.975-2.119,3.283-2.119s2.506,0.771,3.283,2.119l8.002,13.857l-3.314,1.912l-7.971-13.805l-14.734,25.52h24.362     L36.216,73.604L36.216,73.604z',
'M88.207,73.604H72.323v-3.826h15.824l-9.166-15.875l-3.797,6.576l-3.313-1.914l3.827-6.627     c0.777-1.348,1.975-2.119,3.283-2.119c1.31,0,2.508,0.771,3.283,2.119l9.227,15.979c0.777,1.348,0.848,2.77,0.193,3.902     C91.028,72.953,89.763,73.604,88.207,73.604z',
'M47.413,54.385c-0.587,0-1.174-0.158-1.688-0.49l-5.561-3.607l2.081-3.211l5.041,3.27l4.733-5.729     c1.049-1.27,2.94-1.455,4.217-0.412l4.609,3.768l3.1-3.383l2.822,2.584l-3.588,3.918c-1.096,1.193-2.938,1.328-4.195,0.303     l-4.535-3.709l-4.607,5.576C49.235,53.994,48.327,54.385,47.413,54.385z'
 ];

  paths.forEach( function(p) {
    elevation_icon.append('path')
      .attr("class", "elevation_icon")
      .attr('d', p);
      ;

  });

});
