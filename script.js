// ==========================================================================
// 1. THREE.JS SCENE SETUP & 3D PIZZA GENERATOR
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
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffb800, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Procedural 3D Pizza Model Assembly
const pizzaGroup = new THREE.Group();

// Pizza Crust (عجينة البيتزا)
const crustGeo = new THREE.CylinderGeometry(2, 1.9, 0.2, 32);
const crustMat = new THREE.MeshStandardMaterial({ color: 0xd29034, roughness: 0.6 });
const crust = new THREE.Mesh(crustGeo, crustMat);
pizzaGroup.add(crust);

// Cheese Layer (طبقة الجبن الذائب)
const cheeseGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.22, 32);
const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffd043, roughness: 0.3 });
const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
pizzaGroup.add(cheese);

// Pepperoni Toppings (قطع الببروني)
for (let i = 0; i < 12; i++) {
    const pepGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.24, 16);
    const pepMat = new THREE.MeshStandardMaterial({ color: 0xa81c1c, roughness: 0.4 });
    const pep = new THREE.Mesh(pepGeo, pepMat);
    
    const angle = (i / 12) * Math.PI * 2;
    const radius = 0.6 + Math.random() * 0.9;
    pep.position.set(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius);
    pep.rotation.y = Math.random() * Math.PI;
    pizzaGroup.add(pep);
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

// ==========================================================================
// 2. INTERACTIVE ORDER CART & WHATSAPP INTEGRATION
// ==========================================================================
let orderItems = [];
let totalPrice = 0;

function addToOrder(itemName, price) {
    orderItems.push({ name: itemName, price: price });
    totalPrice += price;
    
    document.getElementById('total-price').textContent = totalPrice.toFixed(3) + ' ر.ع.';
    document.getElementById('cart-bar').style.display = 'flex';

    // GSAP Bounce Effect on Cart Bar
    gsap.fromTo("#cart-bar", { scale: 0.9 }, { scale: 1, duration: 0.2 });
}

function sendWhatsAppOrder() {
    if (orderItems.length === 0) return;
    
    let message = "مرحباً ملك البيتزا صحم، أرغب بتسجيل طلب جديد:\n\n";
    orderItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.price.toFixed(3)} ر.ع.)\n`;
    });
    message += `\n*الإجمالي: ${totalPrice.toFixed(3)} ر.ع.*`;

    const whatsappUrl = `https://wa.me/96871733223?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ==========================================================================
// 3. BACKGROUND MUSIC CONTROLLER
// ==========================================================================
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

// ضبط الصوت ليكون هادئاً جداً في الخلفية
bgMusic.volume = 0.25;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
        isPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            isPlaying = true;
        }).catch(error => {
            console.log("تفاعل المستخدم مطلوب أولاً:", error);
        });
    }
}

// تشغيل الصوت تلقائياً مع أول ضغطة للمستخدم في الشاشة
document.addEventListener('click', function autoPlayMusicOnInteraction() {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            isPlaying = true;
        }).catch(() => {});
    }
}, { once: true });
