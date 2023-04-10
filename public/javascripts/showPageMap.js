mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25})
        .setHTML(
            `<div><h6>${listing.title}</h6><p>${listing.location}</p></div>`
            )
    )
    .addTo(map)
