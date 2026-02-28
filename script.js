const world = Globe()
  (document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // রিয়েল টেক্সচার
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')   // পাহাড়ি উঁচু-নিচু ভাব
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')   // মহাকাশ ব্যাকগ্রাউন্ড
  .lineHoverPrecision(0)
  .polygonsData([]) // ডাটা পরে লোড হবে

// দেশের বর্ডার লোড করা
fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
  .then(res => res.json())
  .then(countries => {
    world.polygonsData(countries.features)
      .polygonCapColor(() => 'rgba(200, 200, 200, 0.01)') // স্বচ্ছ বর্ডার
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel(({ properties: d }) => `<b>${d.NAME}</b>`) // হোভার করলে নাম দেখাবে
      .onPolygonClick(({ properties: d }) => {
          fetchData(d.NAME); // ক্লিক করলে ডাটা আনবে
      });
  });

// API থেকে তথ্য আনা
async function fetchData(countryName) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        const [data] = await res.json();

        document.getElementById('country-name').innerText = data.name.common;
        document.getElementById('country-flag').src = data.flags.png;
        document.getElementById('lang').innerText = Object.values(data.languages).join(', ');
        document.getElementById('pop').innerText = data.population.toLocaleString();
        document.getElementById('tz').innerText = data.timezones[0];
        document.getElementById('capital').innerText = data.capital ? data.capital[0] : 'N/A';
        document.getElementById('currency').innerText = Object.values(data.currencies)[0].name;

        document.getElementById('info-card').classList.remove('hidden');
    } catch (err) {
        console.log("Error fetching data", err);
    }
}

// ক্লোজ বাটন
document.getElementById('close-btn').onclick = () => {
    document.getElementById('info-card').classList.add('hidden');
};

// অটো রোটেট এবং কন্ট্রোল
world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.5;
            
