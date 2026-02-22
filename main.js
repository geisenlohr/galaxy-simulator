// ============================
// main.js aprimorado
// ============================

// Variáveis globais
let stars = [];
let starObjects = {};

// === Setup Three.js ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 500,
  0.1,
  1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById('galaxy').appendChild(renderer.domElement);

// luz ambiente suave
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// animação
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0005;
  camera.position.z = 50 + Math.sin(Date.now() * 0.0005) * 2; // leve zoom dinâmico
  renderer.render(scene, camera);
}
animate();

// === Carregar stars.json ===
fetch('data/stars.json')
  .then(res => res.json())
  .then(data => {
    stars = data.filter(star => star.mag <= 12);
    populateDropdowns();
    addStarsToScene();
  })
  .catch(err => console.error("Erro ao carregar stars.json:", err));

// === Dropdowns ===
function populateDropdowns() {
  const star1Select = document.getElementById('star1');
  const star2Select = document.getElementById('star2');

  stars.forEach(star => {
    const option1 = document.createElement('option');
    option1.value = star.name;
    option1.textContent = star.name;
    star1Select.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = star.name;
    option2.textContent = star.name;
    star2Select.appendChild(option2);

    starObjects[star.name] = star;
  });
}

// === Adicionar estrelas com cores e tamanhos variados ===
function addStarsToScene() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];

  stars.forEach(star => {
    positions.push(star.x, star.y, star.z);

    // cores: mais brilhante = mais clara
    const brightness = 1 - (star.mag / 12); // 0 (fraco) a 1 (brilhante)
    colors.push(brightness, brightness, brightness);

    // tamanhos: estrelas brilhantes maiores
    sizes.push(0.02 + 0.08 * brightness);
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.05,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
}

// === Cálculo de distância ===
function distance(star1, star2) {
  const dx = star2.x - star1.x;
  const dy = star2.y - star1.y;
  const dz = star2.z - star1.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz).toFixed(2);
}

document.getElementById('calcBtn').addEventListener('click', () => {
  const name1 = document.getElementById('star1').value;
  const name2 = document.getElementById('star2').value;
  const star1 = starObjects[name1];
  const star2 = starObjects[name2];
  if(star1 && star2){
    const dist = distance(star1, star2);
    document.getElementById('result').textContent = `Distância: ${dist} anos-luz`;
  }
});
