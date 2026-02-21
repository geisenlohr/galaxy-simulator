// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, 600);
document.getElementById('galaxy').appendChild(renderer.domElement);

// OrbitControls para zoom e rotação
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;

// Variáveis globais
let stars = [];
let starObjects = {};

// Função para converter magnitude em cor
function magnitudeToColor(mag) {
  if(mag < 2) return 0xffffff;      // branco para mais brilhantes
  if(mag < 5) return 0xffddaa;      // amarelo
  if(mag < 8) return 0xffaa55;      // laranja
  if(mag < 12) return 0xff7755;     // vermelho claro
  return 0xff5555;                   // vermelho escuro para fracas
}

// Carregar estrelas
fetch('data/stars.json')
  .then(res => res.json())
  .then(data => {
    stars = data;
    populateDropdowns();
    addStarsToScene();
  });

// Preencher dropdowns
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
  });
}

// Adicionar estrelas à cena com cores
function addStarsToScene() {
  stars.forEach(star => {
    const geometry = new THREE.SphereGeometry(0.15, 10, 10);
    const material = new THREE.MeshBasicMaterial({color: magnitudeToColor(star.magnitude)});
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(star.x, star.y, star.z);
    scene.add(sphere);
    starObjects[star.name] = star;
  });
}

// Calcular distância
function distance(star1, star2) {
  const dx = star2.x - star1.x;
  const dy = star2.y - star1.y;
  const dz = star2.z - star1.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz).toFixed(2);
}

// Botão de cálculo
document.getElementById('calcBtn').addEventListener('click', () => {
  const name1 = document.getElementById('star1').value;
  const name2 = document.getElementById('star2').value;
  const star1 = starObjects[name1];
  const star2 = starObjects[name2];
  const dist = distance(star1, star2);
  document.getElementById('result').textContent = `Distância: ${dist} anos-luz`;
});

// Animate Three.js
camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Necessário para OrbitControls
  renderer.render(scene, camera);
}
animate();

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / 600;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, 600);
});
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / 600;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, 600);
});
