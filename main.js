
const PLANETS = [
    { name: 'Mercury', color: 0xb1b1b1, distance: 12, size: 1, speed: 0.020 },
    { name: 'Venus',   color: 0xfdc07f, distance: 18, size: 1.7, speed: 0.015 },
    { name: 'Earth',   color: 0x3996ec, distance: 25, size: 1.9, speed: 0.012 },
    { name: 'Mars',    color: 0xd14f22, distance: 32, size: 1.35, speed: 0.009 },
    { name: 'Jupiter', color: 0xe1c193, distance: 40, size: 4.5, speed: 0.006 },
    { name: 'Saturn',  color: 0xe1d8b9, distance: 49, size: 4.0, speed: 0.005 },
    { name: 'Uranus',  color: 0x95edfd, distance: 58, size: 3.0, speed: 0.0032 },
    { name: 'Neptune', color: 0x2d45fc, distance: 66, size: 2.8, speed: 0.002 }
  ];
  
  let scene, camera, renderer, sun;
  const planetsOrbits = [], planetMeshes = [];
  const speeds = PLANETS.map(p => p.speed);
  let controlsDiv;
  
  function init() {
    scene = new THREE.Scene();
  
    // Sun 
    const sunGeometry = new THREE.SphereGeometry(5.7, 40, 36);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd45d });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
  
    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambient);
    const sunLight = new THREE.PointLight(0xffffff, 2.2, 350);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
  
    // Planets (add orbits + planet spheres)
    for (let i = 0; i < PLANETS.length; i++) {
      const p = PLANETS[i];
      // Orbit group
      let orbit = new THREE.Object3D();
      scene.add(orbit);
  
      // Optionally: add orbital "rings" for visual effect (can comment out if not wanted)
      const ringGeometry = new THREE.RingGeometry(p.distance - 0.18, p.distance + 0.18, 70);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x333a43, side: THREE.DoubleSide, transparent: true, opacity: 0.19 });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;  // Lay flat
      scene.add(ring);
  
      // Create planet sphere
      const geo = new THREE.SphereGeometry(p.size, 32, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 0.49,
        metalness: 0.25,
        emissive: 0x000000
      });
      let mesh = new THREE.Mesh(geo, mat);
  
      mesh.position.set(p.distance, 0, 0);
      orbit.add(mesh);
  
      planetMeshes.push(mesh);
      planetsOrbits.push(orbit);
    }
  
    // Camera setup
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 400);
    camera.position.set(0, 37, 135);
  
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x101020, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
  
    // Controls
    controlsDiv = document.getElementById('speedControls');
    createSpeedControls();
  
    window.addEventListener('resize', onWindowResize, false);
  
    animate();
  }
  
  function createSpeedControls() {
    controlsDiv.innerHTML = "<strong>Planet Orbital Speeds</strong><br>";
    PLANETS.forEach((p, i) => {
      const group = document.createElement('div');
      group.className = "slider-group";
  
      const label = document.createElement('label');
      label.className = 'slider-label';
      label.htmlFor = `speed${i}`;
      label.textContent = `${p.name}: ${speeds[i].toFixed(3)}`;
  
      const slider = document.createElement('input');
      slider.type = "range";
      slider.min = 0.001;
      slider.max = 0.04;
      slider.step = 0.001;
      slider.value = p.speed;
      slider.id = `speed${i}`;
      slider.addEventListener('input', e => {
        speeds[i] = Number(e.target.value);
        label.textContent = `${p.name}: ${speeds[i].toFixed(3)}`;
      });
  
      group.appendChild(label);
      group.appendChild(slider);
      controlsDiv.appendChild(group);
    });
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // Animation loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
  
    const elapsed = clock.getElapsedTime();
  
    // Animate planet orbits and spins
    for (let i = 0; i < PLANETS.length; i++) {
      planetsOrbits[i].rotation.y = elapsed * speeds[i] * 2.5;
      planetMeshes[i].rotation.y = elapsed * 0.7; 
    }
    sun.rotation.y += 0.003; 
  
    renderer.render(scene, camera);
  }
  
  init();