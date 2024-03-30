// Create the map object
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get the earthquake data from USGS
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function(data) {
  // Create a function to determine the marker size based on the magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }

  // Create a function to determine the marker color based on the depth
  function markerColor(depth) {
    return depth > 90 ? "#ea2c2c" :
           depth > 70 ? "#ea822c" :
           depth > 50 ? "#ee9c00" :
           depth > 30 ? "#eecc00" :
           depth > 10 ? "#d4ee00" :
                        "#98ee00";
  }

  // Create a GeoJSON layer containing the features array
  L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  }).addTo(myMap);

  // Create a legend
  let legend = L.control({position: "bottomright"});

  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "legend");
    
    div.innerHTML += "<h4>Depth</h4>";
    
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += `
        <i style="background: ${colors[i]}"></i>
        ${grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : '+'}
      `;
    }

    return div;
  };

  legend.addTo(myMap);
});
