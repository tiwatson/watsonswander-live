
var monthlies = function (data) {

  mc_data = data.monthlies;

  var margin = {top: 20, right: 20, bottom: 40, left: 20},
  width = 730 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

  var tipFormat = d3.time.format("%B %Y");

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

  var circle = svg.selectAll(".dot")
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

  var startX = d3.min(x.domain()),
  endX = d3.max(x.domain()),
  lineY = (data.per_night_fee * 30);
  var lines = [{x1: startX, x2: endX, y1: lineY, y2: lineY}];

  svg.append("g").selectAll(".grid-line")
  .data(lines).enter()
  .append("line")
  .attr("class", "grid-line")
  .attr("x1", function(d){ return x(d.x1); })
  .attr("x2", function(d){ return x(d.x2); })
  .attr("y1", function(d){ return y(d.y1); })
  .attr("y2", function(d){ return y(d.y2); });

  svg.append("text").attr("class", "avgText")
  .text('Avg: ' + formatCurrency(lineY))
  .attr("x", 30)
  .attr("y", 105);

  tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) { return tipFormat(d.date) + "<br/>" + formatCurrency(d.cost); });
  svg.call(tip);

  svg.append("rect")
  .attr("class", "overlay")
  .attr("width", width)
  .attr("height", height)
  // .on("mouseover", mousemove )
  .on("mouseout", mouseout )
  .on("mousemove", mousemove );

  var current_tip;

  function mouseout() {
    var pos = d3.mouse(this);
    if ((pos[0] < 0) || (pos[0] > width) || (pos[1] < 0) || (pos[1] > height)) {
      tip.hide();
      current_tip = null;
    }
  }

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
    i = bisectDate(mc_data, x0, 1),
    d0 = mc_data[i - 1],
    d1 = mc_data[i],
    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    var new_tip = mc_data.indexOf(d);
    if (current_tip != new_tip) {
      current_tip = new_tip;
      tip.show(d, circle[0][current_tip]);
    }
  }

};
