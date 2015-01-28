
var costs = function(data) {
  d3.select('#price_last').text( costWithCents(data.location_current.price) );
  d3.select('#per_night_fee').text( costWithCents(data.per_night_fee) );
  d3.select('#per_month_fee').text( costWithCents(data.per_night_fee * 30) );
};
