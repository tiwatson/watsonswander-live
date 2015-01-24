
var monthlies = function (data) {

  mc_data = data.monthlies;

var margin = {top: 20, right: 20, bottom: 40, left: 20},
width = 730 - margin.left - margin.right,
height = 250 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%m-%Y").parse,
bisectDate = d3.bisector(function(d) { return d.date; }).left,
formatValue = d3.format(",.0f"),
formatCurrency = function(d) { return "$" + formatValue(d); };

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var line = d3.svg.line().interpolate('monotone')
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.cost); });


var svg = d3.select("#info-monthly-cost-graph").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

mc_data.forEach(function(d) {
  d.date = parseDate(d.date);
  d.cost = +d.cost;
});

mc_data.sort(function(a, b) {
  return a.date - b.date;
});

x.domain([mc_data[0].date, mc_data[mc_data.length - 1].date]);
y.domain(d3.extent(mc_data, function(d) { return d.cost; }));

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);

// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//   .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", ".71em")
//     .style("text-anchor", "end")
//     .text("Price ($)");

svg.append("path")
.datum(mc_data)
.attr("class", "line")
.attr("d", line);

svg.selectAll(".dot")
.data(mc_data)
.enter().append("circle")
.attr("class", "dot")
.attr("cx", line.x())
.attr("cy", line.y())
.attr("r", 3.5);

var area = d3.svg.area().interpolate('monotone')
.x(function(d) { return x(d.date); })
.y0(height)
.y1(function(d) { return y(d.cost); });

svg.append("path")
.datum(mc_data)
.attr("class", "area")
.attr("d", area);


var focus = svg.append("g")
.attr("class", "focus")
.style("display", "none");

focus.append("circle")
.attr("r", 4.5);

focus.append("text")
.attr("x", 9)
.attr("dy", ".35em");

svg.append("rect")
.attr("class", "overlay")
.attr("width", width)
.attr("height", height)
.on("mouseover", function() { focus.style("display", null); })
.on("mouseout", function() { focus.style("display", "none"); })
.on("mousemove", mousemove);

function mousemove() {
  var x0 = x.invert(d3.mouse(this)[0]),
  i = bisectDate(mc_data, x0, 1),
  d0 = mc_data[i - 1],
  d1 = mc_data[i],
  d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  focus.attr("transform", "translate(" + x(d.date) + "," + y(d.cost) + ")");
  focus.select("text").text(formatCurrency(d.cost));
}

};


// });
