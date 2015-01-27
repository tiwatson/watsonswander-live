var state_bubbles = function (data) {
  var root = {};
  root.name = "Interactions";
  root.children = [];

  data.states.forEach(function(state) {
    root.children.push({ state: state.state, value: state.days});
  });

  var width = 730;
  var height = 400;

  var bubble = d3.layout.pack().sort(null).size([400,400]).padding(1.5);

  var svg = d3.select("#state-bubbles")
    .append("svg")
    .attr("width",400)
    .attr("height", 400)
    .attr("class","bubble");

  var node = svg.selectAll(".node")
    .data(bubble.nodes(root)
    .filter(function(d){ return !d.children;}))
    .enter()
    .append("g")
    .attr("class","node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
    .attr("r", function(d) { return d.r; })
    .attr('class', "circle");

  node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.state; });

};
