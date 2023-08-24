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

function markerSize(mag) {
    return Math.sqrt(mag) * 50000;
}

let earthquakeMarker = [];

d3.json(earthquakeGeojson).then(function(data){
    console.log(data["features"])
    let depthArray = []

    for(let i = 0; i < data.features.length; i++) {
        let earthquake = data.features[i];
        let earthquakeLat = earthquake.geometry.coordinates[1]
        let earthquakeLng = earthquake.geometry.coordinates[0]
        let earthquakeDepth = earthquake.geometry.coordinates[2]
        let earthquakeMag = earthquake.properties.mag
        let date = Date(earthquake.properties.time);
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
        }).bindPopup(`<h3>Magnitude: ${earthquakeMag}<br>Depth: ${earthquakeDepth.toFixed(2)} km</h3>Location: ${earthquake.properties.place}<br>Time: ${date}`).addTo(past7d);

    

    }

    //legend and layer controls
    let legend = L.control({position: 'bottomleft'})
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let limits = [0, 10, 30, 50, 70, 90]; // Depth limits
        let colors = ["#009A87", "#008693", "#006982", "#004d6c", "#003253", "#051937"];

        div.innerHTML = "<div class='legend-header'>Earthquake Depth</div>";
        for (let i = 0; i < limits.length; i--) {
            div.innerHTML += '<div class="legend-item">' +
                '<i style="background:' + colors[i] + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
            }
        return div
        }
    legend.addTo(past7d)
    

    function getColor(depth) {
        let color = ["#051937", "#003253", "#004d6c", "#006982", "#008693", "#009A87"]
        if (depth < 10) {
            return color[5]; // Shallow earthquakes (less than 10 units)
        } else if (depth < 30) {
            return color[4]; 
        } else if (depth < 50) {
            return color[3]; 
        } else if (depth < 70) {
            return color[2]; 
        } else if (depth < 90) {
            return color[1]; 
        } else {
            return color[0]; // Deep earthquakes (greater than 90 units)
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