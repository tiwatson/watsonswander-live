var Towing = (function() {

  function Towing(data) {
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
  }

  return Towing;
})();
