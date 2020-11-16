
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var earthquakes = new L.LayerGroup();

// Tile Layers
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// Base Layers
var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
};

// Overlay 
var overlayMaps = {
    "Earthquakes": earthquakes,
};

// Create Map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [satelliteMap, earthquakes]
});

// Layer Control
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// data
d3.json(earthquakesURL, function(earthquakeData) {
    // Size of Marker 
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }
    // Style of Marker Based 
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
    // Color of Marker 
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#581845";
        case magnitude > 4:
            return "#900C3F";
        case magnitude > 3:
            return "#C70039";
        case magnitude > 2:
            return "#FF5733";
        case magnitude > 1:
            return "#FFC300";
        default:
            return "#DAF7A6";
        }
    }
    // GeoJSON Layer 
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    // Add earthquakeData 
    }).addTo(earthquakes);
    // Add earthquakes Layer 
    earthquakes.addTo(myMap);

    // Set Up Legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function(magnitude) {
            var div = L.DomUtil.create("div", "info legend"), 
            magnitudeLevels = [0, 1, 2, 3, 4, 5];
    
            div.innerHTML += "<h3>Magnitude</h3>"
    
            for (var i = 0; i < magnitudeLevels.length; i++) {
                div.innerHTML +=
                    '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                    magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
            }
            return div;
        };
        // Add Legend 
        legend.addTo(myMap);
    });
  