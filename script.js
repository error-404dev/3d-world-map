const nightMap = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const dayMap = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

let isNight = true;

const world = Globe()
  (document.getElementById('globeViz'))
  .globeImageUrl(nightMap)
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
  .showAtmosphere(true) // Cloud/Atmosphere Layer
  .atmosphereColor('lightskyblue')
  .atmosphereAltitude(0.15);

// Countries Data
fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
  .then(res => res.json())
  .then(countries => {
    world.polygonsData(countries.features)
      .polygonCapColor(() => 'rgba(0, 150, 255, 0.1)')
      .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.3)')
      .onPolygonClick(({ properties: d }) => {
          world.pointOfView({ lat: d.LABEL_Y, lng: d.LABEL_X, altitude: 2 }, 1000); // Auto-focus
          getCountryFullInfo(d.NAME);
      });
  });

// 1. Search Functionality
document.getElementById('search-btn').onclick = () => {
    const query = document.getElementById('search-input').value;
    if(query) getCountryFullInfo(query, true);
};

async function getCountryFullInfo(countryName, isSearch = false) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        const [data] = await res.json();

        // UI Update
        document.getElementById('name').innerText = data.name.common;
        document.getElementById('flag').src = data.flags.png;
        document.getElementById('capital').innerText = data.capital?.[0] || 'N/A';
        document.getElementById('pop').innerText = data.population.toLocaleString();
        document.getElementById('curr').innerText = Object.values(data.currencies)[0].name;

        // 2. Weather API (Using a dummy temp if no API key, replace with OpenWeather)
        document.getElementById('temp').innerText = Math.floor(Math.random() * 15 + 15); 
        document.getElementById('weather-desc').innerText = "Clear Sky";

        document.getElementById('info-card').classList.remove('hidden');

        if(isSearch) {
            const [lat, lng] = data.latlng;
            world.pointOfView({ lat, lng, altitude: 1.5 }, 2000);
        }
    } catch (e) { alert("Country not found!"); }
}

// 3. Auto-detect User Location
fetch('https://ipapi.co/json/').then(res => res.json()).then(loc => {
    world.pointOfView({ lat: loc.latitude, lng: loc.longitude, altitude: 2 }, 3000);
});

// Mode Toggle
document.getElementById('mode-toggle').onclick = () => {
    isNight = !isNight;
    world.globeImageUrl(isNight ? nightMap : dayMap);
    document.getElementById('mode-toggle').innerText = isNight ? "☀️ Day Mode" : "🌙 Night Mode";
};

document.getElementById('close-btn').onclick = () => document.getElementById('info-card').classList.add('hidden');

world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.5;
          
