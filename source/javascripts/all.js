//= require_tree .


var data; // a global


d3.json("http://wl-api-maps.dev/api/v1/maps/1/infographic.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  state_bar(data);
  state_map(data);
  categories(data);
  monthlies(data);

  d3.select('#number_days').text(data.num_nights);
  d3.select('#number_places').text(data.num_places);
  d3.select('#number_states').text(data.num_states);

  d3.select('#miles_towed').text(data.miles_towed);
  d3.select('#longest_drive').text(data.longest_arrival_distance.title);

});
