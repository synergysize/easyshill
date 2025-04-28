/**
 * 3D Moon Implementation using Three.js
 * Features:
 * - Fixed position at the center (no orbiting)
 * - Rotates only around Y-axis (like Earth's rotation)
 * - Complete one full rotation every 20 seconds
 * - "SHILL ALL" text mapped directly on the moon surface
 * - Realistic moon texture
 */

class Moon3D {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.moon = null;
    this.rotationSpeed = (Math.PI * 2) / 20; // Complete rotation in 20 seconds (2π radians)
    this.textCanvas = null;
    this.textContext = null;
    this.moonTexture = null;
    this.animationId = null;
    
    // Initialize the scene
    this.init();
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera with perspective
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      45, // Field of view
      containerWidth / containerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    this.camera.position.z = 300;
    
    // Create WebGL renderer with transparency
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,  // Transparent background
      antialias: true // Smoother edges
    });
    this.renderer.setSize(containerWidth, containerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Create moon texture with "SHILL ALL" text
    this.createMoonTexture();
    
    // Make the scene responsive
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation loop
    this.animate();
  }
  
  // Create a texture with "SHILL ALL" text embedded
  createMoonTexture() {
    // Create canvas for text
    this.textCanvas = document.createElement('canvas');
    this.textCanvas.width = 1024;
    this.textCanvas.height = 512;
    this.textContext = this.textCanvas.getContext('2d');
    
    // Load the moon texture image
    const moonImg = new Image();
    moonImg.crossOrigin = "Anonymous";
    moonImg.src = '/home/computeruse/.anthropic/easyshill/moon.png';
    
    moonImg.onload = () => {
      // Draw the moon texture
      this.textContext.drawImage(moonImg, 0, 0, this.textCanvas.width, this.textCanvas.height);
      
      // Draw "SHILL ALL" text
      this.textContext.save();
      
      // Front text
      this.drawShillAllText(this.textCanvas.width / 2, this.textCanvas.height / 2);
      
      // Back side text (center of the texture on the other side)
      this.drawShillAllText(this.textCanvas.width / 2, this.textCanvas.height / 2 - 30);
      
      this.textContext.restore();
      
      // Create texture from canvas
      this.moonTexture = new THREE.CanvasTexture(this.textCanvas);
      
      // Create the moon with the texture
      this.createMoon();
    };
  }
  
  // Draw "SHILL ALL" text with glow effect
  drawShillAllText(x, y) {
    const text = 'SHILL ALL';
    
    this.textContext.font = 'bold 60px Orbitron, sans-serif';
    this.textContext.textAlign = 'center';
    this.textContext.textBaseline = 'middle';
    
    // Create glow effect
    this.textContext.shadowColor = '#0ff5e5';
    this.textContext.shadowBlur = 15;
    this.textContext.fillStyle = '#FFF';
    this.textContext.fillText(text, x, y);
    
    // Add second glow layer
    this.textContext.shadowColor = '#bf00ff';
    this.textContext.shadowBlur = 20;
    this.textContext.fillText(text, x, y);
    
    // Final bright outline
    this.textContext.shadowColor = 'rgba(0, 255, 229, 1)';
    this.textContext.shadowBlur = 30;
    this.textContext.fillText(text, x, y);
    
    // Clear shadow for next drawing
    this.textContext.shadowBlur = 0;
  }
  
  // Create the 3D moon with texture
  createMoon() {
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(90, 64, 64);
    
    // Create material with the custom texture
    const material = new THREE.MeshStandardMaterial({
      map: this.moonTexture,
      bumpMap: this.moonTexture,
      bumpScale: 2,
      roughness: 0.8,
      metalness: 0.1
    });
    
    // Create mesh
    this.moon = new THREE.Mesh(geometry, material);
    
    // Position at center (0,0,0)
    this.moon.position.set(0, 0, 0);
    
    // Add the moon to the scene
    this.scene.add(this.moon);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    this.scene.add(directionalLight);
  }
  
  // Handle window resizing
  onWindowResize() {
    // Update container dimensions
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;
    
    // Update camera aspect ratio
    this.camera.aspect = containerWidth / containerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(containerWidth, containerHeight);
  }
  
  // Animation loop
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Only animate if the moon is created
    if (this.moon) {
      // Rotate moon around Y-axis only
      this.moon.rotation.y += this.rotationSpeed / 60; // Adjust for 60fps
    }
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  // Update rotation speed (in seconds for a full rotation)
  setRotationSpeed(seconds) {
    this.rotationSpeed = (Math.PI * 2) / seconds;
  }
  
  // Clean up resources when done
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Remove the renderer from DOM
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    
    // Dispose of Three.js resources
    if (this.moon) {
      this.scene.remove(this.moon);
      this.moon.geometry.dispose();
      this.moon.material.dispose();
      if (this.moonTexture) {
        this.moonTexture.dispose();
      }
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.moon = null;
  }
}