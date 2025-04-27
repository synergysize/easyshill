// /easyshill/background.js
(function() {
        var scene, camera, renderer;
        var container, aspectRatio,
                HEIGHT, WIDTH, fieldOfView,
                nearPlane, farPlane,
                mouseX, mouseY, windowHalfX,
                windowHalfY, stats, geometry,
                starStuff, materialOptions, stars;

        init();
        animate();

        function init() {
                container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = '100%';
                container.style.height = '100%';
                container.style.zIndex = '1'; // Set a low z-index to ensure it's behind other content
                document.body.appendChild(container);
                document.body.style.overflow = 'hidden';

                HEIGHT = window.innerHeight;
                WIDTH = window.innerWidth;
                aspectRatio = WIDTH / HEIGHT;
                fieldOfView = 75;
                nearPlane = 1;
                farPlane = 1000;
                mouseX = 0;
                mouseY = 0;

                windowHalfX = WIDTH / 2;
                windowHalfY = HEIGHT / 2;

                camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
                camera.position.z = farPlane / 2;

                scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x000000, 0.0003);

                starForge();

                renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setClearColor(0x000011, 1);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(WIDTH, HEIGHT);
                
                // Style the renderer's canvas element
                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = '0';
                renderer.domElement.style.left = '0';
                renderer.domElement.style.width = '100%';
                renderer.domElement.style.height = '100%';
                
                container.appendChild(renderer.domElement);

                window.addEventListener('resize', onWindowResize, false);
                document.addEventListener('mousemove', onMouseMove, false);
        }

        function animate() {
                requestAnimationFrame(animate);
                render();
        }

        function render() {
                camera.position.x += (mouseX - camera.position.x) * 0.005;
                camera.position.y += (-mouseY - camera.position.y) * 0.005;
                camera.lookAt(scene.position);
                
                // Add subtle rotation to the stars
                if (stars) {
                    stars.rotation.y += 0.0002;
                }
                
                renderer.render(scene, camera);
        }

        function onWindowResize() {
                WIDTH = window.innerWidth;
                HEIGHT = window.innerHeight;
                windowHalfX = WIDTH / 2;
                windowHalfY = HEIGHT / 2;
                camera.aspect = WIDTH / HEIGHT;
                camera.updateProjectionMatrix();
                renderer.setSize(WIDTH, HEIGHT);
        }

        function onMouseMove(e) {
                mouseX = e.clientX - windowHalfX;
                mouseY = e.clientY - windowHalfY;
        }

        function starForge() {
                const starQty = 45000;
                
                // Create a BufferGeometry for better performance
                geometry = new THREE.BufferGeometry();
                
                // Create position array for star vertices
                const positions = new Float32Array(starQty * 3);
                
                // Fill the positions array with random coordinates
                for (let i = 0; i < starQty; i++) {
                        const i3 = i * 3;
                        positions[i3] = Math.random() * 2000 - 1000;     // x
                        positions[i3 + 1] = Math.random() * 2000 - 1000; // y
                        positions[i3 + 2] = Math.random() * 2000 - 1000; // z
                }
                
                // Add position attribute to geometry
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                // Create material with proper parameters for points
                materialOptions = {
                        size: 1.0,
                        transparent: true,
                        opacity: 0.7,
                        color: 0xffffff,
                        sizeAttenuation: true
                };
                
                // Use PointsMaterial instead of deprecated PointCloudMaterial
                starStuff = new THREE.PointsMaterial(materialOptions);
                
                // Use Points instead of deprecated PointCloud
                stars = new THREE.Points(geometry, starStuff);
                scene.add(stars);
        }
})();