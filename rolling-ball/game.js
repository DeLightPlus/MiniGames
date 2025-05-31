import * as THREE from 'three';

class RollingBallGame {
    constructor() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Setup lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 20, 10);
        this.scene.add(light);
        
        // Create ball
        const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x10b981 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.scene.add(this.ball);
        
        // Create platform
        const platformGeometry = new THREE.BoxGeometry(20, 1, 20);
        const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x23232b });
        this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platform.position.y = -2;
        this.scene.add(this.platform);
        
        // Position camera
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
        
        // Start animation loop
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}