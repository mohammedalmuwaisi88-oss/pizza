// ==========================================================================
// 1. THREE.JS SCENE SETUP & 3D PIZZA GENERATOR (REALISTIC VERSION)
// ==========================================================================
const container = document.getElementById('pizza-canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xfff2e0, 1.1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffb347, 2.2);
dirLight.position.set(5, 6, 4);
scene.add(dirLight);

const warmFill = new THREE.PointLight(0xff9d42, 0.6, 15);
warmFill.position.set(-3, 2, 2);
scene.add(warmFill);

// Procedural 3D Pizza Model Assembly
const pizzaGroup = new THREE.Group();

// --- Dough base (عجينة فاتحة) ---
const doughGeo = new THREE.CylinderGeometry(1.9, 1.85, 0.18, 48);
const doughMat = new THREE.MeshStandardMaterial({ color: 0xe8c27a, roughness: 0.75 });
const dough = new THREE.Mesh(doughGeo, doughMat);
pizzaGroup.add(dough);

// --- Baked crust ring (الحافة المحمّصة) ---
const crustRingGeo = new THREE.TorusGeometry(1.85, 0.18, 16, 48);
crustRingGeo.rotateX(Math.PI / 2);
const crustRingMat = new THREE.MeshStandardMaterial({ color: 0xb9772f, roughness: 0.85 });
const crustRing = new THREE.Mesh(crustRingGeo, crustRingMat);
crustRing.position.y = 0.02;
pizzaGroup.add(crustRing);

// --- Tomato sauce layer (طبقة الصوص) ---
const sauceGeo = new THREE.CylinderGeometry(1.68, 1.68, 0.05, 48);
const sauceMat = new THREE.MeshStandardMaterial({ color: 0xb32d1c, roughness: 0.5 });
const sauce = new THREE.Mesh(sauceGeo, sauceMat);
sauce.position.y = 0.1;
pizzaGroup.add(sauce);

// --- Melted cheese layer with irregular surface (جبن ذائب غير منتظم) ---
const cheeseGeo = new THREE.CylinderGeometry(1.62, 1.62, 0.14, 48, 4);
const cheesePos = cheeseGeo.attributes.position;
for (let i = 0; i < cheesePos.count; i++) {
    const y = cheesePos.getY(i);
    if (y > 0.03) {
        const bump = (Math.random() - 0.5) * 0.06;
        cheesePos.setY(i, y + bump);
    }
}
cheeseGeo.computeVertexNormals();
const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffcf4d, roughness: 0.35, metalness: 0.05 });
const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
cheese.position.y = 0.13;
pizzaGroup.add(cheese);

// --- Pepperoni toppings, evenly spread & slightly curled (ببروني واقعي) ---
const pepperoniCount = 12;
for (let i = 0; i < pepperoniCount; i++) {
    // Base slice (dark charred edge)
    const outerGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.05, 20);
    const outerMat = new THREE.MeshStandardMaterial({ color: 0x7a1a12, roughness: 0.5 });
    const outer = new THREE.Mesh(outerGeo, outerMat);

    // Inner slice (redder center, slightly raised for "cupping" look)
    const innerGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.06, 20);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xc23b28, roughness: 0.4, metalness: 0.08 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.02;

    const pep = new THREE.Group();
    pep.add(outer);
    pep.add(inner);

    // Even spiral-ish distribution instead of pure random (avoids overlap)
    const angle = (i / pepperoniCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
    const radius = 0.55 + (i % 3) * 0.35 + Math.random() * 0.15;
    pep.position.set(Math.cos(angle) * radius, 0.19, Math.sin(angle) * radius);
    pep.rotation.y = Math.random() * Math.PI;
    pep.rotation.x = (Math.random() - 0.5) * 0.1;
    pep.rotation.z = (Math.random() - 0.5) * 0.1;

    pizzaGroup.add(pep);
}

// --- Basil leaf garnish (ورق الريحان) ---
for (let i = 0; i < 5; i++) {
    const leafGeo = new THREE.SphereGeometry(0.13, 8, 8);
    leafGeo.scale(1, 0.15, 0.55);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 1.3;
    leaf.position.set(Math.cos(angle) * radius, 0.22, Math.sin(angle) * radius);
    leaf.rotation.y = Math.random() * Math.PI;
    pizzaGroup.add(leaf);
}

pizzaGroup.rotation.x = 0.5;
pizzaGroup.rotation.z = -0.2;
scene.add(pizzaGroup);

// Animation Loop (دوران البيتزا التفاعلي)
function animate() {
    requestAnimationFrame(animate);
    pizzaGroup.rotation.y += 0.008;
    renderer.render(scene, camera);
}
animate();

// Handle Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
