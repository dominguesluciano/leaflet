//get data
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
//var geojson;

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + feature.properties.MHI2016);
  
  }
  function radiusSize(magnitude) {
    return magnitude * 4;
  }

  // Define function to set the circle color based on the magnitude
  function circleColor(magData) {
    if (magData < 1) {
      return 'rgb(183,243,77)'
    }
    else if (magData < 2) {
      return 'rgb(225,243,77)'
    }
    else if (magData < 3) {
      return 'rgb(243,219,77)'
    }
    else if (magData < 4) {
      return 'rgb(243,186,77)'
    }
    else if (magData < 5) {
      return 'rgb(240,167,107)'
    }
    else {
      return 'rgb(240,107,107)'
    }
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
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

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -130.71
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

}
// Define lightmap layer
////////////
 ///////choropleth
//  function choroplethThing(data){
//  geojson = L.choropleth(data, {

//   // Define what  property in the features to use
//   valueProperty: "MHI2016",

//   // Set color scale
//   scale: ["#ffffb2", "#b10026"],

//   // Number of breaks in step range
//   steps: 10,

//   // q for quartile, e for equidistant, k for k-means
//   mode: "q",
//   style: {
//     // Border color
//     color: "#fff",
//     weight: 1,
//     fillOpacity: 0.8
//   }

//   // Binding a pop-up to each layer
//   // onEachFeature: function(feature, layer) {
//   //   layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//   //     "$" + feature.properties.MHI2016);
//   // }
// }).addTo(map);


//  };
// ///////
function getColor(i) {
  return i > 5 ? '#F30' :
  i > 4  ? '#F60' :
  i > 3  ? '#F90' :
  i > 2  ? '#FC0' :
  i > 1   ? '#FF0' :
            '#9F3';
  }