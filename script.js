// ১. সীন (Scene), ক্যামেরা (Camera) এবং রেন্ডারার (Renderer) সেটআপ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('map-container').appendChild(renderer.domElement);

// ২. গ্লোব বা পৃথিবী (Sphere) তৈরি করা
const geometry = new THREE.SphereGeometry(5, 32, 32);
const textureLoader = new THREE.TextureLoader();

// পৃথিবীর ম্যাপের একটি ইমেজ টেক্সচার (ইন্টারনেট থেকে লোড হবে)
const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
const material = new THREE.MeshPhongMaterial({ map: earthTexture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// ৩. লাইট (Lighting) যোগ করা যাতে গ্লোব দেখা যায়
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

camera.position.z = 12;

// ৪. মাউস দিয়ে ঘোরানোর কন্ট্রোল (যদি তমি চাও)
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaMove = { x: e.offsetX - previousMousePosition.x, y: e.offsetY - previousMousePosition.y };
        globe.rotation.y += deltaMove.x * 0.01;
        globe.rotation.x += deltaMove.y * 0.01;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
});

// ৫. ক্লিক করলে দেশের তথ্য আনা (Raycaster ব্যবহার করে)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([globe]);

    if (intersects.length > 0) {
        // এখানে আমরা একটি ডামি দেশের ডাটা দেখাচ্ছি (যেহেতু ৩ডি পয়েন্ট থেকে দেশ বের করা একটু জটিল)
        // আসল প্রজেক্টে তুমি "Bangladesh" বা যেকোনো দেশের নাম দিয়ে API কল করতে পারো।
        fetchCountryData("Bangladesh"); 
    }
});

// ৬. REST Countries API থেকে তথ্য আনা
async function fetchCountryData(countryName) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();
        const country = data[0];

        // UI আপডেট করা
        document.getElementById('info-box').classList.remove('hidden');
        document.getElementById('country-name').innerText = country.name.common;
        document.getElementById('country-flag').src = country.flags.png;
        document.getElementById('lang').innerText = Object.values(country.languages).join(', ');
        document.getElementById('pop').innerText = country.population.toLocaleString();
        document.getElementById('tz').innerText = country.timezones[0];
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// ক্লোজ বাটন ফাংশনালিটি
document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('info-box').classList.add('hidden');
});

// ৭. এনিমেশন লুপ (Render Loop)
function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) globe.rotation.y += 0.002; // অটোমেটিক ঘুরবে
    renderer.render(scene, camera);
}
animate();

// উইন্ডো রিসাইজ হ্যান্ডেল করা
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
                        
