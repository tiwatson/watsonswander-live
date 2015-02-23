var Elevation = (function() {

  function Elevation(data) {
    elevation_lowest = data.map_places.sort(function(a,b) { return a.elevation - b.elevation; })[0]
    elevation_highest = data.map_places.sort(function(a,b) { return b.elevation - a.elevation; })[0]

    d3.select('#elevation_lowest').text(formatComma(elevation_lowest.elevation) + "'");
    d3.select('#elevation_lowest_where').html(where(elevation_lowest));
    d3.select('#elevation_highest').text(formatComma(elevation_highest.elevation) + "'");
    d3.select('#elevation_highest_where').html(where(elevation_highest));

    icon();
  }


  function icon(){
    var elevation_icon = d3.select('#elevation_icon')
      .append('svg')
      .attr('width', 226)
      .attr('height', 132)
      .attr('viewBox','7 28 86 42')
      .append("g");

    var paths = [
      'M76.546,73.604H31.05c-1.555,0-2.822-0.65-3.479-1.785c-0.653-1.135-0.584-2.557,0.193-3.902l22.748-39.4     c0.778-1.346,1.975-2.119,3.285-2.119c1.309,0,2.506,0.773,3.284,2.119l22.747,39.4c0.777,1.348,0.848,2.77,0.193,3.902     C79.368,72.953,78.101,73.604,76.546,73.604z M31.11,69.775h45.375L53.798,30.479L31.11,69.775z',
      'M36.216,73.604H11.794c-1.557,0-2.822-0.65-3.479-1.785c-0.653-1.135-0.584-2.557,0.193-3.902l14.795-25.623     c0.775-1.348,1.975-2.119,3.283-2.119s2.506,0.771,3.283,2.119l8.002,13.857l-3.314,1.912l-7.971-13.805l-14.734,25.52h24.362     L36.216,73.604L36.216,73.604z',
      'M88.207,73.604H72.323v-3.826h15.824l-9.166-15.875l-3.797,6.576l-3.313-1.914l3.827-6.627     c0.777-1.348,1.975-2.119,3.283-2.119c1.31,0,2.508,0.771,3.283,2.119l9.227,15.979c0.777,1.348,0.848,2.77,0.193,3.902     C91.028,72.953,89.763,73.604,88.207,73.604z',
      'M47.413,54.385c-0.587,0-1.174-0.158-1.688-0.49l-5.561-3.607l2.081-3.211l5.041,3.27l4.733-5.729     c1.049-1.27,2.94-1.455,4.217-0.412l4.609,3.768l3.1-3.383l2.822,2.584l-3.588,3.918c-1.096,1.193-2.938,1.328-4.195,0.303     l-4.535-3.709l-4.607,5.576C49.235,53.994,48.327,54.385,47.413,54.385z'
    ];

    paths.forEach( function(p) {
      elevation_icon.append('path')
        .attr("class", "elevation_icon")
        .attr('d', p);
    });
  }

  return Elevation;
})();
