// ============================
// main.js completo
// ============================

// --- Variáveis globais ---
let stars = [];
let starObjects = {};

// ============================
// 1️⃣ Setup básico Three.js
// ============================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / 500, // largura / altura do div galaxy
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById('galaxy').appendChild(renderer.domElement);

// posição inicial da câmera
camera.position.z = 50;

// animação simples para rotacionar a galáxia
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

// ============================
// 2️⃣ Carregar stars.json
// ============================
fetch('data/stars.json')
  .then(res => res.json())
  .then(data => {
    // filtrar apenas estrelas brilhantes para performance
    stars = data.filter(star => star.mag <= 12);

    // popular dropdowns
    populateDropdowns();

    // adicionar estrelas na cena
    addStarsToScene();
  })
  .catch(err => console.error("Erro ao carregar stars.json:", err));

// ============================
// 3️⃣ Funções dependentes das estrelas
// ============================

// popular os dropdowns
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

// adicionar as estrelas na cena como Points
function addStarsToScene() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  stars.forEach(star => {
    positions.push(star.x, star.y, star.z);
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
}

// ============================
// 4️⃣ Função calcular distância
// ============================
function distance(star1, star2) {
  const dx = star2.x - star1.x;
  const dy = star2.y - star1.y;
  const dz = star2.z - star1.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz).toFixed(2);
}

// botão calcular distância
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
