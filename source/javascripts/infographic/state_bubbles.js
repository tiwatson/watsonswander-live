var state_bubbles = function (data) {
  var root = {};
  root.name = "Interactions";
  root.children = [];

  data.states.forEach(function(state) {
    root.children.push(state); //({ state: state.state, value: state.days});
  });

  var width = 730;
  var height = 400;

  var pack = d3.layout.pack().sort(function comparator(a, b) {
    var m = 22;
    return Math.floor(Math.random() * m) - Math.floor(Math.random() * m);
  }).size([400,400]).padding(5)
  .value(function(d) { return d.days; });

  var svg = d3.select("#state-bubbles")
    .append("svg")
    .attr("width",400)
    .attr("height", 400)
    .attr("class","bubble");

    var node = svg.datum(root).selectAll(".node")
    .data(pack.nodes)
    .enter()
    .append("g");

  // var node = svg.selectAll(".node")
  //   .data(pack.nodes(root))
  //   //.filter(function(d){ return !d.children;}))
  //   .enter()
  //   .append("g")
  //   .attr("class","node")
  //   .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    // var circle = node.append("circle")
    // .attr("r", function(d) { return d.r; })
    // .attr('class', "circle")
    // .style("fill", function(d) { return !d.children ? "tan" : "beige"; });

    var circles = node.append("circle")
    .attr("stroke", "black")
    .style("fill", function(d) { return !d.children ? "tan" : "beige"; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; });

  var titles = node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .text(function(d) { return d.state; });

  // var titles = node.append("text")
  // .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
  // .attr("dy", ".35em")
  // .text(function(d) { return d.state; });

    updateVis();

    function updateVis() {
      pack.value(function(d) { return d.cost_per_day; });

      pack.nodes(root);

      titles.transition()
      .duration(5000)
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });

        // titles.attr("x", function(d) { return d.x; })
        // .attr("y", function(d) { return d.y; })
        // .text(function(d) { return d.cost_per_day; });
        //

          circles.transition()
          .duration(5000)
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.r; });
        }

};
