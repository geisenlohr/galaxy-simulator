import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carregar estrelas
fetch('data/stars.json')
  .then(res => res.json())
  .then(stars => {
    stars.forEach(star => {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshBasicMaterial({color: 0xffff00});
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(star.x, star.y, star.z);
      scene.add(sphere);
    });
  });

camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
