import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VfxBackground = () => {
    const containerRef = useRef();

    useEffect(() => {
        let scene, camera, renderer, particles, lines;
        let mouseX = 0, mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        const PARTICLE_COUNT = 150;
        const MAX_DISTANCE = 150;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
            camera.position.z = 400;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current.appendChild(renderer.domElement);

            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(PARTICLE_COUNT * 3);

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 1000;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                color: 0x38bdf8,
                size: 3,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x38bdf8,
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
        };

        const onWindowResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onDocumentMouseMove = (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.1;
            mouseY = (event.clientY - windowHalfY) * 0.1;
        };

        const animate = () => {
            if (!renderer) return;
            requestAnimationFrame(animate);
            render();
        };

        const render = () => {
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            const positions = particles.geometry.attributes.position.array;
            const linePositions = [];

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                positions[i * 3] += (Math.random() - 0.5) * 0.5;
                positions[i * 3 + 1] += (Math.random() - 0.5) * 0.5;
                positions[i * 3 + 2] += (Math.random() - 0.5) * 0.5;

                if (Math.abs(positions[i * 3]) > 500) positions[i * 3] *= -0.9;
                if (Math.abs(positions[i * 3 + 1]) > 500) positions[i * 3 + 1] *= -0.9;
                if (Math.abs(positions[i * 3 + 2]) > 500) positions[i * 3 + 2] *= -0.9;

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
            lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

            renderer.render(scene, camera);
        };

        init();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
            if (renderer && renderer.domElement) {
                renderer.dispose();
                // eslint-disable-next-line react-hooks/exhaustive-deps
                if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                zIndex: -1, 
                background: '#0f172a',
                pointerEvents: 'none' 
            }} 
        />
    );
};

export default VfxBackground;
