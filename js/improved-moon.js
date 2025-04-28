/**
 * Enhanced 3D Moon Implementation with Realistic Details
 * Features:
 * - High-resolution realistic moon texture with craters, maria, and surface details
 * - Normal/bump mapping for 3D surface texture effect
 * - Enhanced lighting and shadow for depth
 * - "SHILL ALL" text with neon magenta color (#ff00ff) and seafoam green glow (#39ffd4)
 * - Fixed position at center with rotation only around Y-axis
 * - Complete rotation every 20 seconds
 */

class EnhancedMoon3D {
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
    this.moonNormalMap = null;
    this.animationId = null;
    this.moonSize = 30; // Default size reduced to fit inside the smallest inner ring
    
    // Initialize the scene
    this.init();
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera with perspective
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
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
    
    // Load textures and create moon
    this.loadTextures();
    
    // Make the scene responsive
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  // Load texture and normal map
  loadTextures() {
    // Create a texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Load the moon texture
    textureLoader.load('assets/moonmap2k.jpg', (texture) => {
      this.moonTexture = texture;
      
      // Once the texture is loaded, create a canvas for the text overlay
      this.createTextOverlay();
    });
    
    // If texture loading fails, fallback to generating a texture
    setTimeout(() => {
      if (!this.moonTexture) {
        console.log("Texture loading failed, using fallback");
        this.createFallbackTexture();
      }
    }, 2000);
  }
  
  // Create fallback texture when loading fails
  createFallbackTexture() {
    // Create canvas for moon texture
    this.textCanvas = document.createElement('canvas');
    this.textCanvas.width = 2048; // High resolution
    this.textCanvas.height = 1024;
    this.textContext = this.textCanvas.getContext('2d');
    
    // Draw a gradient background for the moon
    const gradient = this.textContext.createRadialGradient(
      this.textCanvas.width/2, this.textCanvas.height/2, 0,
      this.textCanvas.width/2, this.textCanvas.height/2, this.textCanvas.width/2
    );
    gradient.addColorStop(0, '#d0d0d0');
    gradient.addColorStop(1, '#a0a0a0');
    
    this.textContext.fillStyle = gradient;
    this.textContext.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);
    
    // Add realistic moon features
    // Draw dark maria (dark patches)
    this.textContext.fillStyle = '#808080';
    
    // Left side maria
    this.drawElipse(400, 400, 250, 200, 0.8);
    this.drawElipse(300, 700, 180, 120, 0.7);
    
    // Center maria
    this.drawElipse(1024, 512, 300, 200, 0.7);
    
    // Right side maria
    this.drawElipse(1700, 300, 220, 170, 0.8);
    this.drawElipse(1600, 600, 250, 190, 0.7);
    
    // Add craters
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * this.textCanvas.width;
      const y = Math.random() * this.textCanvas.height;
      const size = Math.random() * 50 + 10;
      const shade = Math.random() * 40 + 20;
      this.drawCrater(x, y, size, `rgb(${128+shade}, ${128+shade}, ${128+shade})`);
    }
    
    // Add "SHILL ALL" text overlay
    this.drawShillAllText();
    
    // Create texture from canvas
    this.moonTextureWithText = new THREE.CanvasTexture(this.textCanvas);
    
    // Generate a normal map from the texture for bump effect
    this.generateNormalMap();
    
    // Create the moon with textures
    this.createMoon();
    
    // Start animation loop
    this.animate();
  }
  
  // Helper to draw elipse
  drawElipse(x, y, radiusX, radiusY, opacity) {
    this.textContext.save();
    this.textContext.globalAlpha = opacity;
    this.textContext.beginPath();
    this.textContext.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    this.textContext.fill();
    this.textContext.restore();
  }
  
  // Helper to draw crater
  drawCrater(x, y, radius, color) {
    this.textContext.save();
    
    // Crater rim highlight (top-left)
    this.textContext.fillStyle = '#ffffff';
    this.textContext.globalAlpha = 0.7;
    this.textContext.beginPath();
    this.textContext.arc(x - radius * 0.2, y - radius * 0.2, radius * 0.9, 0, Math.PI * 0.8);
    this.textContext.fill();
    
    // Crater main shadow (bottom-right)
    this.textContext.fillStyle = '#505050';
    this.textContext.globalAlpha = 0.8;
    this.textContext.beginPath();
    this.textContext.arc(x + radius * 0.1, y + radius * 0.1, radius, Math.PI * 0.8, Math.PI * 2);
    this.textContext.fill();
    
    // Crater center
    this.textContext.fillStyle = color;
    this.textContext.globalAlpha = 1;
    this.textContext.beginPath();
    this.textContext.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    this.textContext.fill();
    
    this.textContext.restore();
  }
  
  // Create text overlay on moon texture
  createTextOverlay() {
    // Create canvas for text overlay
    this.textCanvas = document.createElement('canvas');
    this.textCanvas.width = 2048; // Match the texture size
    this.textCanvas.height = 1024;
    this.textContext = this.textCanvas.getContext('2d');
    
    // Draw the base moon texture first
    const moonImg = new Image();
    moonImg.crossOrigin = "Anonymous";
    moonImg.src = 'assets/moonmap2k.jpg';
    
    moonImg.onload = () => {
      // Draw the moon texture
      this.textContext.drawImage(moonImg, 0, 0, this.textCanvas.width, this.textCanvas.height);
      
      // Add "SHILL ALL" text overlay
      this.drawShillAllText();
      
      // Create texture from canvas
      this.moonTextureWithText = new THREE.CanvasTexture(this.textCanvas);
      
      // Generate a normal map from the texture for bump effect
      this.generateNormalMap();
      
      // Create the moon with textures
      this.createMoon();
      
      // Start animation loop
      this.animate();
    };
    
    // Handle image loading error
    moonImg.onerror = () => {
      console.error('Error loading moon texture, using fallback');
      this.createFallbackTexture();
    };
  }
  
  // Generate a normal map from the texture for bump effect
  generateNormalMap() {
    // Create a normals canvas
    const normalsCanvas = document.createElement('canvas');
    normalsCanvas.width = this.textCanvas.width;
    normalsCanvas.height = this.textCanvas.height;
    const normalsContext = normalsCanvas.getContext('2d');
    
    // Draw the original texture to get pixel data
    normalsContext.drawImage(this.textCanvas, 0, 0);
    
    // Get image data for height map calculation
    const imgData = normalsContext.getImageData(0, 0, normalsCanvas.width, normalsCanvas.height);
    const pixels = imgData.data;
    
    // Create normal map data
    const normalData = new Uint8ClampedArray(pixels.length);
    
    // Calculate normal map from grayscale texture
    for (let y = 1; y < normalsCanvas.height - 1; y++) {
      for (let x = 1; x < normalsCanvas.width - 1; x++) {
        // Get position in array
        const pos = (y * normalsCanvas.width + x) * 4;
        const posUp = ((y - 1) * normalsCanvas.width + x) * 4;
        const posDown = ((y + 1) * normalsCanvas.width + x) * 4;
        const posLeft = (y * normalsCanvas.width + (x - 1)) * 4;
        const posRight = (y * normalsCanvas.width + (x + 1)) * 4;
        
        // Calculate grayscale value (simple average) for each position
        const grayCenter = (pixels[pos] + pixels[pos + 1] + pixels[pos + 2]) / 3;
        const grayUp = (pixels[posUp] + pixels[posUp + 1] + pixels[posUp + 2]) / 3;
        const grayDown = (pixels[posDown] + pixels[posDown + 1] + pixels[posDown + 2]) / 3;
        const grayLeft = (pixels[posLeft] + pixels[posLeft + 1] + pixels[posLeft + 2]) / 3;
        const grayRight = (pixels[posRight] + pixels[posRight + 1] + pixels[posRight + 2]) / 3;
        
        // Calculate normal vector (simplified)
        // X normal from horizontal gradient (red channel)
        normalData[pos] = 128 + (grayRight - grayLeft) * 2;
        // Y normal from vertical gradient (green channel)
        normalData[pos + 1] = 128 + (grayDown - grayUp) * 2;
        // Z normal is always positive (blue channel)
        normalData[pos + 2] = 255;
        // Alpha
        normalData[pos + 3] = 255;
      }
    }
    
    // Create the normal map imageData
    const normalImgData = new ImageData(normalData, normalsCanvas.width, normalsCanvas.height);
    
    // Put the normal map data onto the canvas
    normalsContext.putImageData(normalImgData, 0, 0);
    
    // Create texture from normal map canvas
    this.moonNormalMap = new THREE.CanvasTexture(normalsCanvas);
  }
  
  // Draw "SHILL ALL" text with neon effects
  drawShillAllText() {
    // Define text positioning for the visible side of the moon
    const centerX = this.textCanvas.width / 2;
    const centerY = this.textCanvas.height / 2;
    
    this.textContext.save();
    
    // Set up text properties 
    this.textContext.font = 'bold 120px BlockyFont';
    this.textContext.textAlign = 'center';
    this.textContext.textBaseline = 'middle';
    
    // Enhanced multi-layered glow effect for "SHILL" text
    
    // 1. First outer glow layer (seafoam green)
    this.textContext.shadowColor = '#39ffd4';
    this.textContext.shadowBlur = 35;
    this.textContext.shadowOffsetX = 0;
    this.textContext.shadowOffsetY = 0;
    this.textContext.fillStyle = 'rgba(57, 255, 212, 0.25)';
    this.textContext.fillText('SHILL', centerX, centerY - 80);
    
    // 2. Second glow layer (brighter, smaller)
    this.textContext.shadowBlur = 25;
    this.textContext.fillStyle = 'rgba(57, 255, 212, 0.4)';
    this.textContext.fillText('SHILL', centerX, centerY - 80);
    
    // 3. Inner glow halo
    this.textContext.shadowBlur = 15;
    this.textContext.fillStyle = 'rgba(57, 255, 212, 0.6)';
    this.textContext.fillText('SHILL', centerX, centerY - 80);
    
    // 4. Solid text outline in seafoam green
    this.textContext.strokeStyle = '#39ffd4';
    this.textContext.lineWidth = 3;
    this.textContext.shadowBlur = 8;
    this.textContext.strokeText('SHILL', centerX, centerY - 80);
    
    // 5. Draw the main text in Neon Magenta
    this.textContext.shadowColor = '#39ffd4'; // Seafoam green glow
    this.textContext.shadowBlur = 10;
    this.textContext.fillStyle = '#ff00ff'; // Neon Magenta
    this.textContext.fillText('SHILL', centerX, centerY - 80);
    
    // Enhanced multi-layered glow effect for "ALL" text
    
    // 1. First outer glow layer (seafoam green)
    this.textContext.shadowColor = '#39ffd4';
    this.textContext.shadowBlur = 35;
    this.textContext.fillStyle = 'rgba(57, 255, 212, 0.25)';
    this.textContext.fillText('ALL', centerX, centerY + 40);
    
    // 2. Second glow layer (brighter, smaller)
    this.textContext.shadowBlur = 25;
    this.textContext.fillStyle = 'rgba(57, 255, 212, 0.4)';
    this.textContext.fillText('ALL', centerX, centerY + 40);
    
    // 3. Inner glow halo
    this.textContext.shadowBlur = 15;
    this.textContext.fillStyle = 'rgba(57, 255, 212, 0.6)';
    this.textContext.fillText('ALL', centerX, centerY + 40);
    
    // 4. Solid text outline in seafoam green
    this.textContext.strokeStyle = '#39ffd4';
    this.textContext.lineWidth = 3;
    this.textContext.shadowBlur = 8;
    this.textContext.strokeText('ALL', centerX, centerY + 40);
    
    // 5. Draw the main text in Neon Magenta
    this.textContext.shadowColor = '#39ffd4'; // Seafoam green glow
    this.textContext.shadowBlur = 10;
    this.textContext.fillStyle = '#ff00ff'; // Neon Magenta
    this.textContext.fillText('ALL', centerX, centerY + 40);
    
    // Add curved underline beneath "ALL" with enhanced glow effect
    
    // Set up for curve drawing
    const lineY = centerY + 85;
    const lineWidth = 160;
    const lineHeight = 30;
    
    // 1. Draw wide outer glow for the curve
    this.textContext.beginPath();
    this.textContext.moveTo(centerX - lineWidth, lineY);
    this.textContext.quadraticCurveTo(centerX, lineY + lineHeight, centerX + lineWidth, lineY);
    this.textContext.shadowColor = '#39ffd4'; // Seafoam green
    this.textContext.shadowBlur = 25;
    this.textContext.strokeStyle = 'rgba(57, 255, 212, 0.4)';
    this.textContext.lineWidth = 12;
    this.textContext.stroke();
    
    // 2. Draw medium glow for the curve
    this.textContext.beginPath();
    this.textContext.moveTo(centerX - lineWidth, lineY);
    this.textContext.quadraticCurveTo(centerX, lineY + lineHeight, centerX + lineWidth, lineY);
    this.textContext.shadowBlur = 15;
    this.textContext.strokeStyle = 'rgba(57, 255, 212, 0.6)';
    this.textContext.lineWidth = 9;
    this.textContext.stroke();
    
    // 3. Draw the main curve in neon magenta with seafoam green glow
    this.textContext.beginPath();
    this.textContext.moveTo(centerX - lineWidth, lineY);
    this.textContext.quadraticCurveTo(centerX, lineY + lineHeight, centerX + lineWidth, lineY);
    this.textContext.shadowColor = '#39ffd4';
    this.textContext.shadowBlur = 15;
    this.textContext.strokeStyle = '#ff00ff'; // Neon Magenta
    this.textContext.lineWidth = 6;
    this.textContext.stroke();
    
    // Add a little pulsing effect by drawing an inner highlight
    this.textContext.beginPath();
    this.textContext.moveTo(centerX - lineWidth, lineY);
    this.textContext.quadraticCurveTo(centerX, lineY + lineHeight, centerX + lineWidth, lineY);
    this.textContext.shadowBlur = 5;
    this.textContext.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // White inner highlight
    this.textContext.lineWidth = 2;
    this.textContext.stroke();
    
    this.textContext.restore();
  }
  
  // Create the 3D moon with textures
  createMoon() {
    // Create optimized sphere geometry (adjust segments based on device capabilities)
    const isMobile = window.innerWidth < 768;
    const segments = isMobile ? 64 : 96;
    const geometry = new THREE.SphereGeometry(this.moonSize, segments, segments);
    
    // Create optimized material with texture and normal map
    const material = new THREE.MeshStandardMaterial({
      map: this.moonTextureWithText,
      normalMap: this.moonNormalMap,
      normalScale: new THREE.Vector2(3, 3), // Normal map intensity
      roughness: 0.7, // More matte surface like the real moon
      metalness: 0.1, // Slight metalness for lighting effect
      
      // Conditional properties for high-end devices
      bumpMap: !isMobile ? this.moonTextureWithText : null, // Use texture as bump map
      bumpScale: 0.4, // Subtle bump effect
    });
    
    // Create mesh
    this.moon = new THREE.Mesh(geometry, material);
    
    // Position at center (0,0,0)
    this.moon.position.set(0, 0, 0);
    
    // Add the moon to the scene
    this.scene.add(this.moon);
    
    // Add ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Add directional light for primary illumination (key light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    this.scene.add(directionalLight);
    
    // Add secondary directional light (fill light) for softer shadows
    const secondaryLight = new THREE.DirectionalLight(0xc4f5ff, 0.3);
    secondaryLight.position.set(-5, -2, 3);
    this.scene.add(secondaryLight);
    
    // Add a subtle rim light to enhance the 3D effect
    if (!isMobile) {
      const rimLight = new THREE.DirectionalLight(0x8eceff, 0.2);
      rimLight.position.set(0, 0, -5);
      this.scene.add(rimLight);
    }
  }
  
  // Handle window resizing
  onWindowResize() {
    // Update container dimensions
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    
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
      // Rotate moon around Y-axis only at consistent speed
      this.moon.rotation.y += this.rotationSpeed / 60; // Adjust for 60fps
    }
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  // Update rotation speed (in seconds for a full rotation)
  setRotationSpeed(seconds) {
    this.rotationSpeed = (Math.PI * 2) / seconds;
  }
  
  // Set the moon size to fit within the inner ring
  setMoonSize(size) {
    this.moonSize = size;
    
    // If moon is already created, update its size
    if (this.moon) {
      // Scale the moon to the new size
      const scale = size / 90; // 90 is the default size
      this.moon.scale.set(scale, scale, scale);
    }
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
      if (this.moonTextureWithText) {
        this.moonTextureWithText.dispose();
      }
      if (this.moonNormalMap) {
        this.moonNormalMap.dispose();
      }
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.moon = null;
  }
}