//= require_tree .


var data; // a global

d3.json("http://wl-api-maps.dev/api/v1/maps/1/infographic.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  state_bar(data);

  d3.select('#number_days').text(data.num_nights);
  d3.select('#number_places').text(data.num_places);
  d3.select('#number_states').text(data.num_states);

});
