let earthquakeGeojson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

let past7d = L.map("earthquakePast7Days", {
    center: [39.8283, -98.5795], 
    zoom: 5
})

tile(past7d)



function tile(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}


let earthquakeMarker = [];

function markerSize(mag) {
    return Math.sqrt(mag) * 50000;
  }

  

d3.json(earthquakeGeojson).then(function(data){
    console.log(data["features"])

    let depthArray = []
   

    for(let i = 0; i < data.features.length; i++) {
        let earthquake = data.features[i];
        let earthquakeLat = earthquake.geometry.coordinates[1]
        let earthquakeLng = earthquake.geometry.coordinates[0]
        let earthquakeDepth = earthquake.geometry.coordinates[2]
        let earthquakeMag = earthquake.properties.mag
        // console.log(earthquakeLat)
        // console.log(earthquakeLng)
        // console.log(earthquakeDepth)
        // console.log(earthquakeMag)
        
        depthArray.push(earthquakeDepth)

        
        

        //markers
        L.circle([earthquakeLat, earthquakeLng], {
            fillOpacity: 0.75,
            color: null,
            fillColor: getColor(earthquakeDepth),
            radius: markerSize(earthquakeMag)
        }).bindPopup(`<h3>Magnitude: ${earthquakeMag}</h3><hr>Depth: ${earthquakeDepth}<br>Wildfires occurred natuarally: `).addTo(past7d);

    // //legend and layer controls
    // L.control.Legend({
    //     title: "Wildfires",
    //     position: "topright",
    //     opacity: 0.5,
    //     legends: [{label: "G class", layers: gWildfires,
    //             type: "image",
    //             url: "static/image/fire.svg",
    //             inactive: true
    //             }
    // ]
    // }).addTo(wildfireSeverity)

    }

    function getColor(depth) {
        if (depth < 10) {
            return "purple"; // Shallow earthquakes (less than 10 units)
        } else if (depth < 30) {
            return "blue"; 
        } else if (depth < 50) {
            return "green"; 
        } else if (depth < 70) {
            return "yellow"; 
        } else if (depth < 90) {
            return "ornage"; 
        } else {
            return "red"; // Deep earthquakes (greater than 90 units)
        }}
    

    // function getColor(depth) {
    //     if (depth < depthArray.length*0.05) {
    //         return "purple"; // Shallow earthquakes (less than 10 units)
    //     } else if (depth < depthArray.length*0.15) {
    //         return "blue"; // Moderate depth (between 10 and 50 units)
    //     } else if (depth < depthArray.length*0.5) {
    //         return "green"; // Moderate depth (between 10 and 50 units)
    //     } else if (depth < depthArray.length*0.6) {
    //         return "yellow"; // Moderate depth (between 10 and 50 units)
    //     } else if (depth < depthArray.length*0.8) {
    //         return "ornage"; // Moderate depth (between 10 and 50 units)
    //     } else {
    //         return "red"; // Deep earthquakes (greater than 50 units)
    //     }}

    

})