//get data
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
//var geojson;

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  
  }
  function radiusSize(magnitude) {
    return magnitude * 4;
  }

  // Define function to set the circle color based on the magnitude
  function circleColor(magData) {
    if (magData <= 1) {
      return "#ccff33"
    }
    else if (magData <= 2) {
      return "#ffff33"
    }
    else if (magData <= 3) {
      return "#ffcc33"
    }
    else if (magData <= 4) {
      return "#ff9933"
    }
    else if (magData <= 5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return new L.circleMarker(latlng, {
        radius: radiusSize(feature.properties.mag),
        color: circleColor(feature.properties.mag),
          fillColor: circleColor(feature.properties.mag),
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        });
      },
      onEachFeature: onEachFeature
        });


    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

// Create legend
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers

  var baseMaps = {
    "Street Map": lightmap,
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
  var myMap = L.map("map", {
    center: [
      37.00, -130.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

////////////
//////choropleth
function getColor(i) {
  if (i <= 1) {
    return "#ccff33"
  }
  else if (i <= 2) {
    return "#ffff33"
  }
  else if (i <= 3) {
    return "#ffcc33"
  }
  else if (i <= 4) {
    return "#ff9933"
  }
  else if (i <= 5) {
    return "#ff6633"
  }
  else {
    return "#ff3333"
  }
  }
  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}
