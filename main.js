// Variáveis globais
let stars = [];
let starObjects = {};

// 1️⃣ Carregar stars.json
fetch('data/stars.json')
  .then(res => res.json())
  .then(data => {
    // Filtra apenas estrelas com magnitude <= 12 para performance
    stars = data.filter(star => star.mag <= 12);

    // Preencher dropdowns
    populateDropdowns();

    // Adicionar estrelas na cena Three.js
    addStarsToScene();
  });

// 2️⃣ Funções dependentes das estrelas
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
