const map = L.map('map').setView([35,51], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19}).addTo(map);

navigator.geolocation.getCurrentPosition(pos=>{
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon],17);
    L.marker([lat,lon]).addTo(map).bindPopup("شما اینجا هستید").openPopup();
});
