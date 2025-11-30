let map = L.map('map').setView([35, 51], 5);

// لایه OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19}).addTo(map);

// مدیریت کاربران و رنگ
let currentUser = null;
let userColor = "#ff0000";

// مناطق ذخیره شده (برای دمو روی مرورگر)
let regions = JSON.parse(localStorage.getItem('regions') || "[]");

// دکمه‌ها
const loginDiv = document.getElementById('login');
const loginForm = document.getElementById('login-form');
const logoutDiv = document.getElementById('logout');
const usernameSpan = document.getElementById('username');

document.getElementById('login-btn').addEventListener('click', ()=>{
  let name = document.getElementById('user').value.trim();
  if(!name) return alert("نام کاربری را وارد کنید");
  currentUser = name;
  userColor = document.getElementById('color').value;
  loginForm.style.display = "none";
  logoutDiv.style.display = "block";
  usernameSpan.textContent = currentUser;
});

document.getElementById('logout-btn').addEventListener('click', ()=>{
  currentUser = null;
  loginForm.style.display = "block";
  logoutDiv.style.display = "none";
});

// رسم منطقه
let drawing = false;
let latlngs = [];
let tempLine = null;

map.on('mousedown touchstart', e=>{
  if(!currentUser) return;
  drawing = true;
  latlngs = [e.latlng];
  if(tempLine) map.removeLayer(tempLine);
});

map.on('mousemove touchmove', e=>{
  if(!drawing) return;
  latlngs.push(e.latlng);
  if(tempLine) map.removeLayer(tempLine);
  tempLine = L.polyline(latlngs, {color:userColor}).addTo(map);
});

map.on('mouseup touchend', e=>{
  if(!drawing) return;
  drawing = false;

  // بستن شکل
  latlngs.push(latlngs[0]);
  if(tempLine) map.removeLayer(tempLine);
  
  let poly = L.polygon(latlngs, {color:userColor, fillColor:userColor, fillOpacity:0.5}).addTo(map);
  
  // متن وسط منطقه
  let center = poly.getBounds().getCenter();
  L.marker(center, {
    icon: L.divIcon({
      className:'user-label',
      html:`<b style="color:${userColor}">${currentUser}</b>`,
      iconSize: [50,20]
    })
  }).addTo(map);
  
  // ذخیره در LocalStorage
  regions.push({user: currentUser, color:userColor, latlngs});
  localStorage.setItem('regions', JSON.stringify(regions));
});
