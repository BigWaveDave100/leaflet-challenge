const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with options centered in the US, default to streetMap
let myMap = L.map("map", {
    center: [39.8283, -98.5795],  // Centered on the US
    zoom: 2,
    layers: [streetMap]  // Default layer is streetMap
}); 

// Define baseMaps to allow switching between Street and Topography layers
let baseMaps = {
    "Street Map": streetMap,
};
  
let earthquake = new L.LayerGroup();

let overlay = { "Earthquakes": earthquake };

L.control.layers(baseMaps, overlay).addTo(myMap);

function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2])
    };
}

function chooseColor(depth) {
    if (depth <= 10) return "yellow";
    else if (depth > 10 && depth <= 20) return "green";
    else if (depth > 20 && depth <= 30) return "orange";
    else if (depth > 30 && depth <= 40) return "red";
    else if (depth > 40 && depth <= 50) return "blue";
    else if (depth > 50 && depth <= 60) return "purple";
    else return "black";
}

function chooseRadius(magnitude) {
    return magnitude * 5;
}

d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon).bindPopup(feature.id);
        },
        style: styleInfo
    }).addTo(earthquake);
    earthquake.addTo(myMap);
}).catch(function (error) {
    console.error('Error fetching data:', error);
});

let legend = L.control({ position: "bottomright" });
legend.onAdd = function (myMap) {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML += "<h4>Depth Color Legend</h4>";
    div.innerHTML += '<i style="background: yellow"></i><span>(Yellow = Depth < 10)</span><br>';
    div.innerHTML += '<i style="background: green"></i><span>(Green = 10 < Depth <= 20)</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>(Orange = 20 < Depth <= 30)</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>(Red = 30 < Depth <= 40)</span><br>';
    div.innerHTML += '<i style="background: blue"></i><span>(Blue = 40 < Depth <= 50)</span><br>';
    div.innerHTML += '<i style="background: purple"></i><span>(Purple = 50 < Depth <= 60)</span><br>';
    div.innerHTML += '<i style="background: black"></i><span>(Black = Depth > 60)</span><br>';
    return div;
};
legend.addTo(myMap);
