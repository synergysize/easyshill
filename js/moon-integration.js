/**
 * Integration script for enhanced 3D moon
 * 
 * This script:
 * 1. Creates the enhanced 3D moon
 * 2. Positions it in the center of the innermost ring
 * 3. Sets proper scaling to fit inside the innermost ring
 * 4. Maintains the 20-second rotation cycle
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for the DOM to be ready
  setTimeout(initMoon, 500);
});

function initMoon() {
  // Initialize the enhanced 3D moon
  const moonContainer = document.getElementById('moon-3d-container');
  if (!moonContainer) {
    console.error('Moon container not found');
    return;
  }
  
  // Create the moon
  window.enhancedMoon = new EnhancedMoon3D('moon-3d-container');
  
  // Set rotation speed (20 seconds per rotation)
  window.enhancedMoon.setRotationSpeed(20);
  
  // Get size of innermost ring
  const innerRingSize = getInnerRingSize();
  
  // Set moon size to fit inside innermost ring (with enhanced padding)
  // Significantly reduced size to ensure moon fits in the smallest ring
  const padding = 40; // Substantially increased padding to make moon much smaller
  const moonSize = innerRingSize ? (innerRingSize / 2) - padding : 32; // Default to 32 if innerRingSize is not available
  
  // Apply the smaller size
  window.enhancedMoon.setMoonSize(moonSize);
  
  // Center moon in viewport
  centerMoon();
  
  // Re-center moon on window resize
  window.addEventListener('resize', centerMoon);
}

// Calculate size of innermost ring
function getInnerRingSize() {
  // Find innermost ring in the rings map
  const ringMap = document.querySelector('map[name="ring-map"]');
  if (!ringMap) return 0;
  
  // Get all circular areas
  const areas = ringMap.querySelectorAll('area[shape="circle"]');
  if (!areas.length) return 0;
  
  // Sort areas by radius (the innermost ring will have the smallest radius)
  const sortedAreas = Array.from(areas).sort((a, b) => {
    const radiusA = parseInt(a.getAttribute('coords').split(',')[2]);
    const radiusB = parseInt(b.getAttribute('coords').split(',')[2]);
    return radiusA - radiusB;
  });
  
  // Return the smallest radius (innermost ring)
  const innerRingCoords = sortedAreas[0].getAttribute('coords').split(',');
  return parseInt(innerRingCoords[2]) * 2; // Diameter = radius * 2
}

// Center the moon in the viewport
function centerMoon() {
  if (!window.enhancedMoon || !window.enhancedMoon.camera) return;
  
  // Center camera for proper alignment
  const aspectRatio = window.innerWidth / window.innerHeight;
  window.enhancedMoon.camera.aspect = aspectRatio;
  window.enhancedMoon.camera.updateProjectionMatrix();
  
  // Update renderer size if needed
  if (window.enhancedMoon.renderer) {
    window.enhancedMoon.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}