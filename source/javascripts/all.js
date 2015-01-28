//= require_tree .


var data; // a global

var parseDate = d3.time.format("%d-%m-%Y").parse,
bisectDate = d3.bisector(function(d) { return d.date; }).left,
formatValue = d3.format(",.0f"),
costWithCents = d3.format("$,.2f"),
formatCurrency = function(d) { return "$" + formatValue(d); };

d3.json("http://wl-api-maps.dev/api/v1/maps/1/infographic.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  state_bubbles(data);

  state_bar(data);
  state_map(data);
  categories(data);
  monthlies(data);
  costs(data);

  d3.select('#number_days').text(data.num_nights);
  d3.select('#number_places').text(data.num_places);
  d3.select('#number_states').text(data.num_states);

  d3.select('#miles_towed').text(data.miles_towed);
  d3.select('#longest_drive').text(data.longest_arrival_distance.title);

});
