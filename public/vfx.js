/**
 * VTerm VFX Engine - The $10,000 UI Layer
 * Powered by Three.js & Anime.js
 */

let scene, camera, renderer, particles, lines;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const PARTICLE_COUNT = 150;
const MAX_DISTANCE = 150;

function initVFX() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = 'vfx-canvas';
    document.body.prepend(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

        velocities.push({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x3b82f6,
        size: 3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });

    const lineGeometry = new THREE.BufferGeometry();
    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);

    animate();

    // Subtle entrance animation with Anime.js
    anime({
        targets: renderer.domElement,
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeOutQuad'
    });
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // Ease camera to mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    const positions = particles.geometry.attributes.position.array;
    const linePositions = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Move particles
        // Simple Brownian-like motion
        positions[i * 3] += (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.5;

        // Bounding box
        if (Math.abs(positions[i * 3]) > 500) positions[i * 3] *= -0.9;
        if (Math.abs(positions[i * 3 + 1]) > 500) positions[i * 3 + 1] *= -0.9;
        if (Math.abs(positions[i * 3 + 2]) > 500) positions[i * 3 + 2] *= -0.9;

        // Check for line connections
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < MAX_DISTANCE) {
                linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lines.geometry = lineGeometry;

    renderer.render(scene, camera);
}

// Custom Styles for Canvas
const style = document.createElement('style');
style.textContent = `
    #vfx-canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        pointer-events: none;
        background: #0f172a;
    }
`;
document.head.appendChild(style);

// Export for use in HTML
window.initVFX = initVFX;
