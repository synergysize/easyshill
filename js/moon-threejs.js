/**
 * 3D Moon Implementation using Three.js - Simpler version
 * Features:
 * - Fixed position at the center (no orbiting)
 * - Rotates only around Y-axis (like Earth's rotation)
 * - Complete one full rotation every 20 seconds
 * - "SHILL ALL" text mapped directly on the moon surface
 */

// Moon class
class Moon3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.moon = null;
    this.rotationSpeed = 2 * Math.PI / 20; // 20 seconds per rotation
    
    this.init();
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 300;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Create simple moon with text texture
    this.createMoon();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    this.scene.add(directionalLight);
    
    // Start animation loop
    this.animate();
    
    // Add resize handler
    window.addEventListener('resize', () => this.onResize());
  }
  
  // Create a texture with text
  createTextTexture() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill background with gray
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add texture pattern for moon surface
    ctx.fillStyle = '#999999';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 30 + 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw dark craters
    ctx.fillStyle = '#777777';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 50 + 10;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // SHILL text positioning (stacked vertically above ALL)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20; // Slight adjustment for stacking
    
    // Draw "SHILL" text on front of moon
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    // Set the EXACT SpaceX font from /bont/ folder
    ctx.font = 'bold 100px BlockyFont';
    
    // NEON MAGENTA with SEAFOAM GREEN glow for SHILL (no circle outline)
    ctx.shadowColor = '#39ffd4'; // SEAFOAM GREEN
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw the main text in NEON MAGENTA (direct text without circular outline)
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff00ff'; // NEON MAGENTA
    ctx.fillText('SHILL', centerX, centerY);
    
    // Draw "ALL" text below SHILL
    const allY = centerY + 80; // Position below SHILL
    
    // SEAFOAM GREEN glow for ALL (no circle outline)
    ctx.shadowColor = '#39ffd4';
    ctx.shadowBlur = 20;
    
    // Draw the main text in NEON MAGENTA (direct text without circular outline)
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff00ff'; // NEON MAGENTA
    ctx.fillText('ALL', centerX, allY);
    
    // Add small "(Click Here)" text below ALL
    const clickHereY = allY + 40; // Position below ALL
    ctx.font = 'bold 30px BlockyFont'; // Smaller font size
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ff00ff'; // NEON MAGENTA
    ctx.fillText('(Click Here)', centerX, clickHereY);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    return texture;
  }
  
  // Create moon sphere
  createMoon() {
    const texture = this.createTextTexture();
    const geometry = new THREE.SphereGeometry(90, 64, 32);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1,
    });
    
    this.moon = new THREE.Mesh(geometry, material);
    this.moon.position.set(0, 0, 0);
    this.scene.add(this.moon);
  }
  
  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.moon) {
      // Rotate the moon around Y axis only
      this.moon.rotation.y += this.rotationSpeed / 60;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  // Handle window resize
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  // Update rotation speed (in seconds for full rotation)
  setRotationSpeed(seconds) {
    this.rotationSpeed = 2 * Math.PI / seconds;
  }
}