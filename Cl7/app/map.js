/* global mapboxgl */


mapboxgl.accessToken = 'pk.eyJ1Ijoia3NhYXZlZHJhIiwiYSI6ImNpam45bG1lbDAwZWx2YWx4aHVjOXZwMTEifQ.Xt258Ze2kA28j8wnC8LtLg' // CHANGE TO YOUR ACCESS Token =)
var filterGroup = document.getElementById('filter-group');
var pdx_taxlot = {}
var filters = document.getElementById('filters')

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
    center: [-122.6782433, 45.5252814], // starting position [lng, lat]
    zoom: 12, // starting zoom
    minzoom: 8,
    maxzoom: 15,
    pitch: 85,
    bearing: 45
})

map.on('load', function() {
  map.addSource("SFR", {
    "type": "geojson",
    "data": './SFR.geojson'
  });
  map.addSource("AGR", {
    "type": "geojson",
    "data": './AGR.geojson'
  });
  map.addSource("COM", {
    "type": "geojson",
    "data": './COM.geojson'
  });
  map.addSource("MFR", {
    "type": "geojson",
    "data": './MFR.geojson'
  });
  map.addSource("VAC", {
    "type": "geojson",
    "data": './VAC.geojson'
  });
  map.addSource("IND", {
    "type": "geojson",
    "data": './IND.geojson'
  });
  map.addSource("RUR", {
    "type": "geojson",
    "data": './RUR.geojson'
  });
  map.addLayer({
    "id" : "Agricultural",
    "type" : "fill-extrusion",
    "source": "AGR",
    'paint': {
      'fill-extrusion-color': '#4CFF33',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  })
  map.addLayer({
    "id" : "Industrial",
    "type" : "fill-extrusion",
    "source": "IND",
    'paint': {
      'fill-extrusion-color': 'purple',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  })
  map.addLayer({
    "id" : "Single Family Residential",
    "type" : "fill-extrusion",
    "source": "SFR",
    'paint': {
      'fill-extrusion-color': 'yellow',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  })
  map.addLayer({
    "id" : "Commercial",
    "type" : "fill-extrusion",
    "source": "COM",
    'paint': {
      'fill-extrusion-color': 'red',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  })
  map.addLayer({
    "id" : "Multi-family Residential",
    "type" : "fill-extrusion",
    "source": "MFR",
    'paint': {
      'fill-extrusion-color': 'orange',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  })
  map.addLayer({
    "id" : "Vacant",
    "type" : "fill-extrusion",
    "source": "VAC",
    'paint': {
      'fill-extrusion-color': 'black',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  }) 
  map.addLayer({
    "id" : "Park",
    "type" : "fill-extrusion",
    "source": "RUR",
    'paint': {
      'fill-extrusion-color': 'green',
      'fill-extrusion-height': {
          'type': 'identity',
          'property': 'EXVALUE'
      },
      'fill-extrusion-opacity': .6
    }
  })    

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', function (e) {
       var features = map.queryRenderedFeatures(e.point, {layers: toggleableLayerIds}) 
       if (!features.length){
         return
       }
       var feature = features[0]
       new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<h3>${feature.properties.SITEADDR}</h3><p>Taxable Value: ${"$"+feature.properties.TOTALVAL.formatMoney(2, '.', ',')}`)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', function (e) {
      var features = map.queryRenderedFeatures(e.point, {layers: toggleableLayerIds})  
      map.getCanvas().style.cursor = (features.length) ? 'pointer':'';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', function (e) {
        var features = map.queryRenderedFeatures(e.point, {layers: toggleableLayerIds})  
        map.getCanvas().style.cursor = '';
    });



})

var toggleableLayerIds = [ 'Commercial', 
                           'Single Family Residential', 
                           'Multi-family Residential', 
                           'Agricultural',
                           'Industrial',
                           'Vacant', 
                           'Park' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

   
  
    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
