
//creating map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

//adding tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);
  
// Using this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  
// Getting the GeoJSON data
d3.json(link).then(function (data) {
    // send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData){ 
// Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p> Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}`);
}
 // Function to determine the color based on depth
 function getColor(depth) {
    if (depth > 90) {
      return "red";
    } else if (depth > 70) {
      return "orange";
    } else if (depth > 50) {
      return "yellow";
    } else if (depth > 30) {
      return "blue";
    } else {
      return "green";
    }
  };
  let earthquakeMarkers = []

  // Loop through features, and create the earthquake markers.
  for (let i = 0; i < earthquakeData.length; i++) {
    let feature = earthquakeData[i]
    // Setting the marker radius for the state by passing population into the markerSize function
    earthquakeMarkers.push(
    L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.5,
        color: "green",
        fillColor: getColor(feature.geometry.coordinates[2]),
        radius: feature.properties.mag*10000
 }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p> Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}`)
 //bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
);
}

   // Create a layer group made from the earthquake markers array, and pass it to the map.
   L.layerGroup(earthquakeMarkers).addTo(myMap);
};
// Setting up the legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [0, 30, 50, 70, 90];
    let colors = ["green", "blue", "yellow", "orange", "red"];
    let labels = [];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

//Adding legend to map
legend.addTo(myMap);
