
var width = 350,
height = 350,
radius = Math.min(width, height) / 2;

var arc = d3.svg.arc()
.outerRadius(radius - 5)
.innerRadius(radius - 60);

var pie = d3.layout.pie()
.sort(null)
.value(function(d) { return d.percent; });

var category_svg = d3.select("#info-category_counts").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//GROUP FOR CENTER TEXT
var center_group = category_svg.append("svg:g")
.attr("class", "center_group")
.attr("transform", "translate(0,0)");

var center_image = center_group.append("svg:image")
.attr('x',-50)
.attr('y',-50)
.attr('width', 100)
.attr('height', 100)
.attr("xlink:href", '/images/tent1.png');

// "TOTAL" LABEL
var totalLabel = center_group.append("svg:text")
.attr("class", "category-label")
.attr("dy", -20)
.attr("text-anchor", "middle") // text-align: right
.text("");

var totalLabelCount = center_group.append("svg:text")
.attr("class", "category-label-count")
.attr("dy", 30)
.attr("text-anchor", "middle") // text-align: right
.text("");

var categories = function(data) {
  category_counts = data.categories.sort(function(a,b) { return b.percent - a.percent; });

  var color = d3.scale.linear().domain([0,data.categories.length]).range([0, 1]);

  var g = category_svg.selectAll(".arc")
  .data(pie(category_counts))
  .enter().append("g")
  .attr("class", "arc")
  .attr('id', function(d) { return d.data.key; })
  .on("mouseover", function (d) { centerDisplayOver(d.data.key, d.data.title, d.data.percent); })
  .on("mouseout", function (d) { centerDisplayOut(); });

  g.append("path")
  .attr("d", arc)
  .style("fill", function(d, i) { return "rgba(43, 84, 126, " + (1 - color(i)) + ")"; });

  var html = ich.categorylist({categories: category_counts.slice(0,10) });
  d3.select('#category-counts-list').html(html);

  d3.selectAll('li.category-list-item')
  .on("mouseover", function (d) {
    c = d3.event.currentTarget.dataset;
    centerDisplayOver(c.key, c.title, c.percent);
  })
  .on("mouseout", function (d) {
    centerDisplayOut();
  });

};

function centerDisplayOver(cid, name, value) {
  d3.select('#' + cid).attr('class', 'arc_hover');
  center_image.style('display', 'none');
  totalLabel.text(name);
  totalLabelCount.text(value + '%');
}

function centerDisplayOut() {
  d3.selectAll('.arc_hover').classed('arc_hover', false);
  center_image.style('display', 'block');
  totalLabel.text('');
  totalLabelCount.text('');
}
