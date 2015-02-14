
var calendar_costs = function(data) {

var width = 738,
    height = 100,
    cellSize = 13; // cell size

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

var svg = d3.select("#calendarCosts").selectAll("svg")
    .data(d3.range(2012, 2016))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

    // var calendar_data = d3.nest()
    //     .key(function(d) { return d.arrived; })
    //     .rollup(function(d) { return d[0].price; })
    //     .map(data.map_places);

    var calendar_data = {};
    data.map_places.forEach( function(place) {
      calendar_data[place.arrived] = place.price;
      for (var i = place.stay_length - 1; i >= 0; i--) {
        var next_date = new Date(place.arrived + " EST");
        next_date.setDate(next_date.getDate() + i);
        console.log(format(next_date));
        calendar_data[format(next_date)] = place.price;
      };
    });


    var priceMin = d3.min(data.map_places.map( function(d) { return d.price; }));
    var priceMax = d3.max(data.map_places.map( function(d) { return d.price; }));
    var priceScale = d3.scale.linear().domain([priceMin,priceMax]).range([0.1,1]);


    rect.filter(function(d) { return d in calendar_data; })
      .style("fill", function(d) { return "rgba(43, 84, 126, " + priceScale(calendar_data[d]) + ")"; })
      .select("title")
      .text(function(d) { return d + ": " + priceScale(calendar_data[d]); });


function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

d3.select(self.frameElement).style("height", "2910px");



}
