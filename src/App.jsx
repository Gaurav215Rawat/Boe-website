import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  
  const mountRef = useRef(null);
  const cursorRef = useRef(null);
  const activePageRef = useRef(activePage);

  useEffect(() => {
    activePageRef.current = activePage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activePage]);

  // Loader sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 1000);
          return 100;
        }
        return next;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  // Nav scroll listener
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Cursor
  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', moveCursor);

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .hover-target, select, input, textarea')) {
        setCursorHover(true);
      }
    };
    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], .hover-target, select, input, textarea')) {
        setCursorHover(false);
      }
    };

    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [activePage, loading]);

  // Three.js Background
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // HELPER: Wireframe Building with glowing edges
    function createWireframeBuilding(width, height, depth, floors) {
      const group = new THREE.Group();
      
      const geom = new THREE.BoxGeometry(width, height, depth);
      const edges = new THREE.EdgesGeometry(geom);
      const material = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.12
      });
      const outerFrame = new THREE.LineSegments(edges, material);
      group.add(outerFrame);
      
      const floorMaterial = new THREE.LineBasicMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.15
      });
      
      const points = [];
      const floorSpacing = height / floors;
      for (let i = 1; i < floors; i++) {
        const y = -height / 2 + i * floorSpacing;
        points.push(-width / 2, y, -depth / 2,  width / 2, y, -depth / 2);
        points.push(width / 2, y, -depth / 2,   width / 2, y, depth / 2);
        points.push(width / 2, y, depth / 2,    -width / 2, y, depth / 2);
        points.push(-width / 2, y, depth / 2,   -width / 2, y, -depth / 2);
        // Cross bracing on front face
        if (i % 3 === 0) {
          points.push(-width / 2, y, -depth / 2, width / 2, y - floorSpacing * 3, -depth / 2);
          points.push(width / 2, y, -depth / 2, -width / 2, y - floorSpacing * 3, -depth / 2);
        }
      }
      const floorGeom = new THREE.BufferGeometry();
      floorGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const floorLines = new THREE.LineSegments(floorGeom, floorMaterial);
      group.add(floorLines);
      
      // Glowing core column
      const corePoints = [];
      corePoints.push(0, -height / 2, 0, 0, height / 2, 0);
      const coreGeom = new THREE.BufferGeometry();
      coreGeom.setAttribute('position', new THREE.Float32BufferAttribute(corePoints, 3));
      const coreMaterial = new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.06
      });
      group.add(new THREE.LineSegments(coreGeom, coreMaterial));

      return { group, material, floorMaterial };
    }

    // HELPER: Truss Bridge
    function createTrussBridge(length, height, depth, panels) {
      const group = new THREE.Group();
      const trussMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.12
      });
      
      const points = [];
      const panelWidth = length / panels;
      
      for (let side = -depth / 2; side <= depth / 2; side += depth) {
        for (let i = 0; i <= panels; i++) {
          const x = -length / 2 + i * panelWidth;
          points.push(x, -height / 2, side, x, height / 2, side);
          
          if (i < panels) {
            const nextX = x + panelWidth;
            points.push(x, -height / 2, side, nextX, -height / 2, side);
            points.push(x, height / 2, side, nextX, height / 2, side);
            points.push(x, -height / 2, side, nextX, height / 2, side);
            points.push(x, height / 2, side, nextX, -height / 2, side);
          }
        }
      }
      
      for (let i = 0; i <= panels; i++) {
        const x = -length / 2 + i * panelWidth;
        points.push(x, -height / 2, -depth / 2, x, -height / 2, depth / 2);
        points.push(x, height / 2, -depth / 2, x, height / 2, depth / 2);
      }
      
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      group.add(new THREE.LineSegments(geom, trussMaterial));
      
      // Road deck
      const deckPoints = [];
      for (let i = 0; i <= panels; i++) {
        const x = -length / 2 + i * panelWidth;
        deckPoints.push(x, -height / 2, -depth / 2, x, -height / 2, depth / 2);
      }
      for (let z = -depth / 2; z <= depth / 2; z += depth / 4) {
        deckPoints.push(-length / 2, -height / 2, z, length / 2, -height / 2, z);
      }
      const deckGeom = new THREE.BufferGeometry();
      deckGeom.setAttribute('position', new THREE.Float32BufferAttribute(deckPoints, 3));
      const deckMat = new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.06 });
      group.add(new THREE.LineSegments(deckGeom, deckMat));

      return { group, trussMaterial };
    }

    // ─── HOME GROUP ───
    const homeGroup = new THREE.Group();
    const buildings = [];
    const buildingMaterials = [];
    const buildingFloorMaterials = [];
    
    // Generate 12 buildings for a dense, immersive skyline
    const buildingConfigs = [
      { x: -70, y: -16, z: -35, w: 16, h: 65, d: 16 },
      { x: -45, y: -10, z: -30, w: 20, h: 85, d: 18 },
      { x: -20, y: -14, z: -40, w: 14, h: 55, d: 14 },
      { x: 5, y: -8, z: -25, w: 22, h: 95, d: 20 },
      { x: 30, y: -16, z: -35, w: 16, h: 60, d: 16 },
      { x: 55, y: -12, z: -38, w: 15, h: 72, d: 15 },
      { x: 80, y: -18, z: -45, w: 12, h: 48, d: 12 },
      { x: -60, y: -20, z: -60, w: 11, h: 40, d: 11 },
      { x: -10, y: -22, z: -65, w: 10, h: 35, d: 10 },
      { x: 45, y: -20, z: -58, w: 13, h: 45, d: 13 },
      { x: 70, y: -24, z: -70, w: 9, h: 30, d: 9 },
      { x: -35, y: -22, z: -68, w: 10, h: 38, d: 10 },
    ];
    
    buildingConfigs.forEach((cfg) => {
      const floors = Math.floor(cfg.h / 4.5);
      const bObj = createWireframeBuilding(cfg.w, cfg.h, cfg.d, floors);
      bObj.group.position.set(cfg.x, cfg.y, cfg.z);
      homeGroup.add(bObj.group);
      buildings.push(bObj.group);
      buildingMaterials.push(bObj.material);
      buildingFloorMaterials.push(bObj.floorMaterial);
    });

    // Ground grid for home — brighter and wider
    const homeGrid = new THREE.GridHelper(300, 80, 0x3b82f6, 0x0f172a);
    homeGrid.position.y = -40;
    homeGrid.material.opacity = 0.1;
    homeGrid.material.transparent = true;
    homeGroup.add(homeGrid);

    // Accent point lights to illuminate the scene with blue glow
    const accentLight1 = new THREE.PointLight(0x3b82f6, 2.5, 120);
    accentLight1.position.set(-30, 40, -20);
    homeGroup.add(accentLight1);
    const accentLight2 = new THREE.PointLight(0x60a5fa, 1.8, 100);
    accentLight2.position.set(40, 30, -15);
    homeGroup.add(accentLight2);
    const accentLight3 = new THREE.PointLight(0x1d4ed8, 1.5, 150);
    accentLight3.position.set(0, -10, 10);
    homeGroup.add(accentLight3);

    // Floating particles — much denser and brighter
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 1500;
    const dustArray = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustArray[i] = (Math.random() - 0.5) * 280;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustArray, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    homeGroup.add(dustMesh);

    // Orbiting energy ring
    const energyRingGeom = new THREE.TorusGeometry(55, 0.15, 16, 120);
    const energyRingMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.18,
    });
    const energyRing = new THREE.Mesh(energyRingGeom, energyRingMat);
    energyRing.position.y = -5;
    energyRing.rotation.x = Math.PI / 2.2;
    homeGroup.add(energyRing);

    // Second energy ring — slightly offset
    const energyRing2Geom = new THREE.TorusGeometry(70, 0.1, 16, 100);
    const energyRing2Mat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.1,
    });
    const energyRing2 = new THREE.Mesh(energyRing2Geom, energyRing2Mat);
    energyRing2.position.y = 5;
    energyRing2.rotation.x = Math.PI / 2.5;
    homeGroup.add(energyRing2);

    scene.add(homeGroup);

    // ─── SERVICES GROUP ───
    const servicesGroup = new THREE.Group();
    const bridgeObj = createTrussBridge(140, 16, 14, 14);
    bridgeObj.group.position.set(0, -5, -20);
    servicesGroup.add(bridgeObj.group);

    const servicesGridHelper = new THREE.GridHelper(140, 50, 0x3b82f6, 0x0f172a);
    servicesGridHelper.position.y = -13;
    servicesGridHelper.material.opacity = 0.08;
    servicesGridHelper.material.transparent = true;
    servicesGroup.add(servicesGridHelper);

    const servicesParticlesGeometry = new THREE.BufferGeometry();
    const servicesParticlesCount = 200;
    const servicesPosArray = new Float32Array(servicesParticlesCount * 3);
    for (let i = 0; i < servicesParticlesCount * 3; i++) {
      servicesPosArray[i] = (Math.random() - 0.5) * 120;
    }
    servicesParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(servicesPosArray, 3));
    const servicesParticlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const servicesParticlesMesh = new THREE.Points(servicesParticlesGeometry, servicesParticlesMaterial);
    servicesGroup.add(servicesParticlesMesh);
    scene.add(servicesGroup);

    // ─── ABOUT GROUP ───
    const aboutGroup = new THREE.Group();
    const domeGeom = new THREE.IcosahedronGeometry(50, 2);
    const domeEdges = new THREE.EdgesGeometry(domeGeom);
    const domeMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.1
    });
    const domeMesh = new THREE.LineSegments(domeEdges, domeMaterial);
    domeMesh.position.set(0, -65, -20);
    aboutGroup.add(domeMesh);

    // Grid planes
    const aboutGridGeometry = new THREE.BufferGeometry();
    const aboutGridMaterial = new THREE.LineBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.4
    });
    const aboutPoints = [];
    const aboutSize = 1000;
    const aboutStep = 50;
    for (let i = -aboutSize; i <= aboutSize; i += aboutStep) {
      aboutPoints.push(-aboutSize, 0, i, aboutSize, 0, i);
      aboutPoints.push(i, 0, -aboutSize, i, 0, aboutSize);
    }
    aboutGridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(aboutPoints, 3));

    const aboutPlane1 = new THREE.LineSegments(aboutGridGeometry, aboutGridMaterial);
    aboutPlane1.position.y = -100;
    aboutGroup.add(aboutPlane1);
    const aboutPlane2 = new THREE.LineSegments(aboutGridGeometry, aboutGridMaterial);
    aboutPlane2.position.y = 100;
    aboutGroup.add(aboutPlane2);

    const aboutVGeo = new THREE.BufferGeometry();
    const aboutVPoints = [];
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() - 0.5) * aboutSize * 2;
      const z = (Math.random() - 0.5) * aboutSize * 2;
      const snappedX = Math.round(x / aboutStep) * aboutStep;
      const snappedZ = Math.round(z / aboutStep) * aboutStep;
      aboutVPoints.push(snappedX, -100, snappedZ, snappedX, 100, snappedZ);
    }
    aboutVGeo.setAttribute('position', new THREE.Float32BufferAttribute(aboutVPoints, 3));
    const aboutVMaterial = new THREE.LineBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.2 });
    aboutGroup.add(new THREE.LineSegments(aboutVGeo, aboutVMaterial));
    scene.add(aboutGroup);

    // ─── CONTACT GROUP ───
    const contactGroup = new THREE.Group();
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    for (let r = 20; r <= 90; r += 15) {
      const ringGeom = new THREE.RingGeometry(r, r + 0.15, 80);
      const ringEdges = new THREE.EdgesGeometry(ringGeom);
      const ringMesh = new THREE.LineSegments(ringEdges, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      contactGroup.add(ringMesh);
    }

    const axesGeom = new THREE.BufferGeometry();
    const axesPoints = new Float32Array([
      -120, 0, 0,  120, 0, 0,
      0, 0, -120,  0, 0, 120
    ]);
    axesGeom.setAttribute('position', new THREE.BufferAttribute(axesPoints, 3));
    contactGroup.add(new THREE.LineSegments(axesGeom, ringMaterial));
    scene.add(contactGroup);

    // ─── INTERACTION ───
    let mouseX = 0, mouseY = 0, scrollY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.05;
      mouseY = (e.clientY - windowHalfY) * 0.05;
    };
    const onScroll = () => { scrollY = window.scrollY; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    // ─── ANIMATION ───
    let currentHomeOpacity = 1.0;
    let currentServicesOpacity = 0.0;
    let currentAboutOpacity = 0.0;
    let currentContactOpacity = 0.0;
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const currentActive = activePageRef.current;
      const targetHome = currentActive === 'home' ? 1.0 : 0.0;
      const targetServices = currentActive === 'services' ? 1.0 : 0.0;
      const targetAbout = currentActive === 'about' ? 1.0 : 0.0;
      const targetContact = currentActive === 'contact' ? 1.0 : 0.0;

      currentHomeOpacity += (targetHome - currentHomeOpacity) * 0.04;
      currentServicesOpacity += (targetServices - currentServicesOpacity) * 0.04;
      currentAboutOpacity += (targetAbout - currentAboutOpacity) * 0.04;
      currentContactOpacity += (targetContact - currentContactOpacity) * 0.04;

      // HOME
      homeGroup.visible = currentHomeOpacity > 0.01;
      if (homeGroup.visible) {
        buildingMaterials.forEach((mat) => mat.opacity = currentHomeOpacity * 0.18);
        buildingFloorMaterials.forEach((mat) => mat.opacity = currentHomeOpacity * 0.22);
        dustMaterial.opacity = currentHomeOpacity * 0.5;
        
        buildings.forEach((bld, idx) => {
          bld.rotation.y = t * 0.015 * (idx % 2 === 0 ? 1 : -1);
        });
        dustMesh.rotation.y = t * 0.008;
        dustMesh.rotation.x = Math.sin(t * 0.1) * 0.02;

        // Animate energy rings
        energyRing.rotation.z = t * 0.08;
        energyRingMat.opacity = currentHomeOpacity * (0.15 + Math.sin(t * 0.5) * 0.05);
        energyRing2.rotation.z = -t * 0.06;
        energyRing2Mat.opacity = currentHomeOpacity * (0.08 + Math.sin(t * 0.3) * 0.04);

        // Pulse accent lights
        accentLight1.intensity = 2.5 + Math.sin(t * 0.8) * 0.8;
        accentLight2.intensity = 1.8 + Math.sin(t * 0.6 + 1) * 0.6;
      }

      // SERVICES
      servicesGroup.visible = currentServicesOpacity > 0.01;
      if (servicesGroup.visible) {
        bridgeObj.trussMaterial.opacity = currentServicesOpacity * 0.14;
        servicesGridHelper.material.opacity = currentServicesOpacity * 0.08;
        servicesParticlesMaterial.opacity = currentServicesOpacity * 0.25;
        bridgeObj.group.position.y = -6 + Math.sin(t * 0.35) * 0.4;
        servicesParticlesMesh.rotation.y = scrollY * 0.00008;
      }

      // ABOUT
      aboutGroup.visible = currentAboutOpacity > 0.01;
      if (aboutGroup.visible) {
        domeMaterial.opacity = currentAboutOpacity * 0.12;
        aboutGridMaterial.opacity = currentAboutOpacity * 0.4;
        aboutVMaterial.opacity = currentAboutOpacity * 0.2;
        domeMesh.rotation.y = t * 0.03;
        domeMesh.rotation.x = Math.sin(t * 0.08) * 0.08;
        aboutGroup.rotation.x = scrollY * 0.0003;
      }

      // CONTACT — brighter rings so they show through the transparent hero
      contactGroup.visible = currentContactOpacity > 0.01;
      if (contactGroup.visible) {
        ringMaterial.opacity = currentContactOpacity * 0.25;
        contactGroup.rotation.y = t * 0.04;
        contactGroup.rotation.x = Math.sin(t * 0.15) * 0.1;
      }

      // Camera
      if (currentActive === 'home') {
        scene.fog.color.setHex(0x020617);
        const targetZ = 35 - scrollY * 0.012;
        camera.position.z += (targetZ - camera.position.z) * 0.04;
        camera.position.x += (mouseX * 0.12 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 0.08 - scrollY * 0.004 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
      } else if (currentActive === 'services') {
        scene.fog.color.setHex(0x020617);
        camera.position.z += (45 - camera.position.z) * 0.04;
        camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.04;
        camera.position.y += (10 + Math.sin(t * 0.35) * 1.2 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
      } else if (currentActive === 'about') {
        scene.fog.color.setHex(0x020617);
        camera.position.z += (280 - camera.position.z) * 0.04;
        camera.position.y += (60 - camera.position.y) * 0.04;
        camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.04;
        camera.lookAt(0, -30, 0);
      } else if (currentActive === 'contact') {
        scene.fog.color.setHex(0x020617);
        camera.position.z += (65 - camera.position.z) * 0.04;
        camera.position.y += (12 + Math.sin(t * 0.25) * 2 - camera.position.y) * 0.04;
        camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.04;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bg-deep-obsidian text-on-surface select-none relative min-h-screen">
      {/* Custom Cursor */}
      <div id="custom-cursor" ref={cursorRef} className={cursorHover ? 'hover' : ''} />

      {/* THREE.JS CANVAS */}
      <div id="canvas-container" ref={mountRef} />

      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[9000] bg-deep-obsidian flex flex-col items-center justify-center">
          <div className="relative mb-12">
            <div className="font-headline-lg text-7xl text-gradient-blue italic tracking-widest">BOE</div>
            <div className="absolute -bottom-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          </div>
          <div className="w-72 h-[2px] bg-warm-charcoal relative overflow-hidden rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 absolute left-0 top-0 transition-all duration-100 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"></div>
            <span className="text-[11px] font-label-caps text-on-surface-variant tracking-[0.3em] uppercase">
              Initializing · {Math.floor(progress)}%
            </span>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] px-6 md:px-margin-desktop py-5 flex items-center justify-between transition-all duration-500 ${
        navScrolled 
          ? 'bg-deep-obsidian/90 backdrop-blur-2xl border-b border-primary/5 py-4' 
          : 'bg-transparent border-b border-transparent py-6'
      }`}>
        <button 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-4 text-left hover-target focus:outline-none group"
        >
          <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center text-[11px] font-label-caps text-primary tracking-widest group-hover:border-primary/50 transition-colors duration-500 relative">
            <div className="absolute inset-0 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
            <span className="relative">BOE</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <span className="block text-[9px] tracking-[0.3em] font-label-caps uppercase text-primary/70 mb-1">City of Los Angeles</span>
            <span className="block text-[14px] font-medium text-on-surface tracking-tight">Bureau of Engineering</span>
          </div>
        </button>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary p-2 hover-target focus:outline-none"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0 font-label-caps text-label-caps">
            {['home', 'services', 'about', 'contact'].map((page) => (
              <li key={page}>
                <button 
                  onClick={() => setActivePage(page)}
                  className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-300 relative pb-1 ${
                    activePage === page 
                      ? 'text-primary' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {page}
                  {activePage === page && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary"></span>
                  )}
                </button>
              </li>
            ))}
            <li>
              <a 
                href="#footer"
                className="text-[11px] uppercase border border-primary/20 text-primary px-6 py-3 hover:bg-primary/8 hover:border-primary/40 transition-all duration-400 rounded-sm"
              >
                Permits
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-deep-obsidian/95 backdrop-blur-2xl border-b border-primary/10 py-10 flex flex-col items-center gap-8 md:hidden z-50">
            {['home', 'services', 'about', 'contact'].map((page) => (
              <button 
                key={page}
                onClick={() => { setActivePage(page); setMobileMenuOpen(false); }}
                className={`text-lg font-label-caps uppercase tracking-wider ${activePage === page ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="relative z-10 min-h-[90vh]">
        {activePage === 'home' && <HomeView setActivePage={setActivePage} />}
        {activePage === 'services' && <ServicesView />}
        {activePage === 'about' && <AboutView />}
        {activePage === 'contact' && <ContactView />}
      </main>

      {/* FOOTER */}
      <footer id="footer" className="bg-deep-obsidian/40 backdrop-blur-md border-t border-primary/10 py-24 px-6 md:px-margin-desktop relative z-10">
        <div className="grid grid-cols-12 gap-y-12 md:gap-gutter pb-20 border-b border-warm-charcoal/20 mb-10 max-w-container-max mx-auto">
          <div className="col-span-12 md:col-span-5">
            <div className="font-headline-lg text-4xl mb-8">
              Bureau of <br />
              <i className="text-gradient-blue font-serif">Engineering</i>
            </div>
            <p className="text-[15px] text-on-surface-variant leading-[1.9] max-w-md font-light">
              The City of Los Angeles' lead agency for planning, design, and construction of public buildings and infrastructure. Serving 4 million Angelenos since 1906.
            </p>
          </div>
          <div className="col-span-6 md:col-span-2 md:col-start-7">
            <p className="text-[10px] font-label-caps tracking-[0.3em] uppercase text-primary/70 mb-8">Services</p>
            <ul className="space-y-4 list-none text-[14px] text-on-surface-variant font-light m-0 p-0">
              <li><button onClick={() => setActivePage('services')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Infrastructure & Bridges</button></li>
              <li><button onClick={() => setActivePage('services')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Public Buildings</button></li>
              <li><button onClick={() => setActivePage('services')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Stormwater & Sewers</button></li>
              <li><button onClick={() => setActivePage('services')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Permits</button></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-2">
            <p className="text-[10px] font-label-caps tracking-[0.3em] uppercase text-primary/70 mb-8">Offices</p>
            <ul className="space-y-4 list-none text-[14px] text-on-surface-variant font-light m-0 p-0">
              <li><button onClick={() => setActivePage('contact')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Downtown HQ</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Valley District</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-primary transition-colors duration-300 hover-target text-left">West LA</button></li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-2">
            <p className="text-[10px] font-label-caps tracking-[0.3em] uppercase text-primary/70 mb-8">Connect</p>
            <ul className="space-y-4 list-none text-[14px] text-on-surface-variant font-light m-0 p-0">
              <li><button onClick={() => setActivePage('contact')} className="hover:text-primary transition-colors duration-300 hover-target text-left">Contact Us</button></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300 hover-target">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-300 hover-target">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-gutter max-w-container-max mx-auto">
          <div className="col-span-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-label-caps text-on-surface-variant/30 uppercase tracking-[0.2em]">
            <p>© 2026 City of Los Angeles, Bureau of Engineering.</p>
            <p>200 N Spring St, Los Angeles · 311</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── COUNTER COMPONENT ───
function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ─── 1. HOME VIEW ───
function HomeView({ setActivePage }) {
  return (
    <div className="fade-in pt-28">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[95vh] flex flex-col justify-end overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/70 to-deep-obsidian/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-deep-obsidian/60 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-margin-desktop pb-24 max-w-container-max mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-9">
              <p className="text-[10px] font-label-caps tracking-[0.4em] uppercase text-primary/60 flex items-center gap-4 mb-8 hero-animate-label">
                <span className="hero-line h-[1px] bg-gradient-to-r from-primary/60 to-transparent"></span>
                Est. 1906 · Public Works
              </p>
              <h1 className="font-headline-lg text-[clamp(3.2rem,12vw,9rem)] leading-[0.9] tracking-tight mb-14">
                <span className="block opacity-90 hero-animate-h1-1">Engineering</span>
                <span className="block opacity-90 hero-animate-h1-2">Los Angeles'</span>
                <span className="block text-gradient-blue italic font-serif hero-animate-h1-3">Future.</span>
              </h1>
            </div>
            <div className="md:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-10 mt-4 hero-animate-stats">
              <div className="flex items-center gap-12 md:gap-20">
                <div>
                  <span className="block font-headline-lg text-5xl md:text-6xl text-gradient-blue leading-none mb-3">
                    <AnimatedCounter prefix="$" end={588} suffix="M" />
                  </span>
                  <span className="block text-[9px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/60">Sixth St Viaduct</span>
                </div>
                <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block"></div>
                <div>
                  <span className="block font-headline-lg text-5xl md:text-6xl text-gradient-blue leading-none mb-3">
                    <AnimatedCounter end={12} suffix="ac" />
                  </span>
                  <span className="block text-[9px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/60">Sixth Street PARC</span>
                </div>
                <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block"></div>
                <div>
                  <span className="block font-headline-lg text-5xl md:text-6xl text-gradient-blue leading-none mb-3">
                    <AnimatedCounter end={118} suffix="yr" />
                  </span>
                  <span className="block text-[9px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/60">Of Excellence</span>
                </div>
              </div>
              <p className="max-w-[38ch] text-[15px] leading-[1.9] text-on-surface-variant/70 font-light md:text-right hero-animate-desc">
                Lead agency for planning, design and construction management of LA's public infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 hero-scroll-indicator">
          <span className="text-[9px] font-label-caps tracking-[0.3em] uppercase text-primary">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-primary/10 py-5 bg-deep-obsidian/60 backdrop-blur-xl relative z-10">
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-16 px-8 text-[11px] font-label-caps tracking-[0.3em] uppercase text-white/70 whitespace-nowrap shrink-0">
              <span>Infrastructure Design</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Bridge Engineering</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Stormwater Systems</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Public Buildings</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Street Design</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Permitting</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Seismic Analysis</span><span className="text-[6px] text-primary/40">◆</span>
              <span>Sustainability</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section with Image */}
      <section className="py-32 md:py-44 px-6 md:px-margin-desktop relative z-10 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-gutter items-center">
          <div className="md:col-span-5 md:col-start-2 order-2 md:order-1">
            <div className="flex items-center gap-4 mb-8 reveal-item">
              <span className="w-10 h-[1px] bg-gradient-to-r from-primary to-transparent"></span>
              <span className="text-[10px] font-label-caps tracking-[0.3em] uppercase text-primary/60">Our Mission</span>
            </div>
            <h2 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight mb-10">
              Building a <em className="italic text-gradient-blue font-serif">sustainable, livable</em> city
            </h2>
            <div className="reveal-item reveal-delay-2 text-[15px] leading-[2] text-on-surface-variant/70 font-light space-y-6">
              <p>The Bureau of Engineering is the City of Los Angeles' lead agency for the planning, design, and construction management of public buildings and infrastructure — from police and fire stations to bridges, streets, and wastewater systems.</p>
              <p>We are committed to designing and building environmentally sustainable, architecturally engaging projects with widespread community engagement.</p>
            </div>
            <button 
              onClick={() => setActivePage('about')}
              className="inline-flex items-center gap-4 text-[11px] font-label-caps tracking-[0.2em] uppercase text-primary border border-primary/15 px-8 py-4 mt-14 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500 reveal-item reveal-delay-3 rounded-sm group focus:outline-none shine-effect"
            >
              Who we are <span className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </div>
          <div className="md:col-span-5 md:col-start-8 order-1 md:order-2 reveal-item relative">
            <div className="aspect-[4/5] relative overflow-hidden rounded-sm glow-blue">
              <img 
                src="/images/sustainability.png"
                alt="Modern public building architecture" 
                className="w-full h-full object-cover filter grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian/80 via-transparent to-deep-obsidian/20"></div>
              <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 flex justify-between items-center rounded-sm">
                <div className="text-center">
                  <span className="block font-headline-md text-3xl text-gradient-blue leading-none mb-2">
                    <AnimatedCounter end={1906} />
                  </span>
                  <span className="block text-[8px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/60">Founded</span>
                </div>
                <div className="w-[1px] h-10 bg-primary/10"></div>
                <div className="text-center">
                  <span className="block font-headline-md text-3xl text-gradient-blue leading-none mb-2">
                    <AnimatedCounter end={2500} suffix="+" />
                  </span>
                  <span className="block text-[8px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/60">Staff</span>
                </div>
                <div className="w-[1px] h-10 bg-primary/10"></div>
                <div className="text-center">
                  <span className="block font-headline-md text-3xl text-gradient-blue leading-none mb-2">
                    <AnimatedCounter end={100} suffix="+" />
                  </span>
                  <span className="block text-[8px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/60">Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-28 md:py-40 px-6 md:px-margin-desktop relative z-10 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-20">
          <div className="md:col-span-10 md:col-start-2 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <div className="flex items-center gap-4 mb-8 reveal-item">
                <span className="w-10 h-[1px] bg-gradient-to-r from-primary to-transparent"></span>
                <span className="text-[10px] font-label-caps tracking-[0.3em] uppercase text-primary/60">Featured Work</span>
              </div>
              <h2 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight">Landmark <em className="italic text-gradient-blue font-serif">projects</em></h2>
            </div>
            <button 
              onClick={() => setActivePage('services')}
              className="inline-flex items-center gap-4 text-[11px] font-label-caps tracking-[0.2em] uppercase text-primary border border-primary/15 px-8 py-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500 reveal-item rounded-sm group focus:outline-none shine-effect"
            >
              All Services <span className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="group reveal-item">
            <div className="h-[420px] md:h-[560px] relative overflow-hidden mb-8 rounded-sm glow-blue">
              <img 
                src="/images/bridge.png"
                alt="Sixth Street Viaduct" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/20 to-transparent"></div>
              <div className="absolute top-6 left-6 text-[9px] font-label-caps tracking-[0.25em] uppercase glass-panel text-primary/80 px-4 py-2 rounded-sm">Infrastructure</div>
            </div>
            <div>
              <h3 className="font-headline-md text-3xl mb-4 group-hover:text-primary transition-colors duration-500">Sixth Street Viaduct</h3>
              <p className="text-[14px] text-on-surface-variant/60 leading-[1.9] font-light mb-6 line-clamp-2">A $588M landmark connecting Boyle Heights and the Arts District — sweeping arches, award-winning design.</p>
              <div className="flex justify-between items-center pt-5 border-t border-primary/5">
                <span className="text-[10px] font-label-caps text-on-surface-variant/40 tracking-[0.2em] uppercase">Completed 2022</span>
                <span className="flex items-center gap-3 text-[10px] font-label-caps text-primary/60 uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"></span> Iconic
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group reveal-item reveal-delay-2">
            <div className="h-[420px] md:h-[560px] relative overflow-hidden mb-8 rounded-sm glow-blue">
              <img 
                src="/images/interior.png"
                alt="Modern civic interior" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/20 to-transparent"></div>
              <div className="absolute top-6 left-6 text-[9px] font-label-caps tracking-[0.25em] uppercase glass-panel text-primary/80 px-4 py-2 rounded-sm">Public Buildings</div>
            </div>
            <div>
              <h3 className="font-headline-md text-3xl mb-4 group-hover:text-primary transition-colors duration-500">Civic Center Complex</h3>
              <p className="text-[14px] text-on-surface-variant/60 leading-[1.9] font-light mb-6 line-clamp-2">World-class facilities designed for community resilience — modern materials, sustainable systems, open spaces.</p>
              <div className="flex justify-between items-center pt-5 border-t border-primary/5">
                <span className="text-[10px] font-label-caps text-on-surface-variant/40 tracking-[0.2em] uppercase">Ongoing</span>
                <span className="flex items-center gap-3 text-[10px] font-label-caps text-primary/60 uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"></span> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed Image CTA Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden my-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-deep-obsidian/60 via-transparent to-deep-obsidian/60"></div>
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <div className="hr-diamond mb-10 reveal-item">
            <span className="text-[9px] font-label-caps tracking-[0.3em] uppercase text-primary/40">Engineering Excellence</span>
          </div>
          <h2 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-tight mb-8">
            Designing for <em className="italic text-gradient-blue font-serif">generations</em> to come
          </h2>
          <p className="reveal-item reveal-delay-2 text-[15px] text-on-surface-variant/60 leading-[2] font-light max-w-xl mx-auto mb-12">
            Every structure we create is a promise to the future. We combine cutting-edge engineering with architectural artistry to build infrastructure that serves communities for a century and beyond.
          </p>
          <button 
            onClick={() => setActivePage('services')}
            className="reveal-item reveal-delay-3 inline-flex items-center gap-4 text-[11px] font-label-caps tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 px-10 py-5 hover:bg-primary/20 hover:border-primary/40 transition-all duration-500 rounded-sm group focus:outline-none shine-effect"
          >
            Explore Our Work <span className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-2">→</span>
          </button>
        </div>
      </section>

      {/* Awards / Recognition */}
      <section className="py-28 px-6 md:px-margin-desktop relative z-10 max-w-container-max mx-auto">
        <div className="text-center mb-20">
          <div className="hr-diamond mb-10 reveal-item">
            <span className="text-[9px] font-label-caps tracking-[0.3em] uppercase text-primary/40">Recognition</span>
          </div>
          <h2 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight">
            Award-Winning <em className="italic text-gradient-blue font-serif">Design</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            { number: '47', label: 'Design Awards', icon: 'emoji_events' },
            { number: '2500', label: 'Team Members', icon: 'groups' },
            { number: '200', label: 'Active Projects', icon: 'engineering' },
            { number: '4', label: 'Million Served', icon: 'location_city' },
          ].map((item, i) => (
            <div key={i} className={`reveal-item reveal-delay-${i + 1} text-center glass-panel p-8 md:p-10 rounded-sm border border-primary/5 border-animate shine-effect`}>
              <span className="material-symbols-outlined text-primary/40 mb-4 block" style={{ fontSize: '28px', fontVariationSettings: "'wght' 200" }}>{item.icon}</span>
              <div className="font-headline-lg text-4xl md:text-5xl text-gradient-blue leading-none mb-3">
                <AnimatedCounter end={parseInt(item.number)} suffix={item.number === '4' ? 'M' : '+'} />
              </div>
              <span className="text-[9px] font-label-caps tracking-[0.25em] uppercase text-on-surface-variant/40">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── 2. SERVICES VIEW ───
function ServicesView() {
  return (
    <div className="fade-in pt-28">
      {/* Hero with Image */}
      <section className="relative min-h-[55vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/bridge.png" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/80 to-deep-obsidian/30"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-6 md:px-margin-desktop pb-20 w-full">
          <div className="flex items-center gap-4 mb-8 reveal-item">
            <div className="w-12 h-px bg-gradient-to-r from-primary/40 to-transparent"></div>
            <span className="font-label-caps text-[10px] tracking-[0.3em] text-primary/50 uppercase">SEC_01</span>
          </div>
          <h1 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-gradient-blue mb-8 max-w-5xl">
            Core Disciplines.
          </h1>
          <p className="reveal-item reveal-delay-2 font-body-lg text-body-lg text-on-surface-variant/60 max-w-2xl leading-relaxed">
            Delivering world-class structural integrity and visionary urban planning. Our services define the physical landscape and operational foundation of the modern metropolis.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-container-max mx-auto px-6 md:px-margin-desktop py-28">
        <div className="blueprint-divider font-label-caps text-[10px] text-on-surface-variant/30 mb-16 w-full tracking-[0.3em]">
          <span>SERVICES_OVERVIEW</span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Card */}
          <div className="col-span-12 md:col-span-8 mb-4 group relative overflow-hidden card-hover border border-primary/5 bg-deep-obsidian transition-all duration-700 reveal-item rounded-sm">
            <div 
              className="absolute inset-0 z-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1000 bg-cover bg-center" 
              style={{ backgroundImage: `url('/images/bridge.png')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/90 to-deep-obsidian/40 z-0"></div>
            <div className="relative z-10 p-10 md:p-14 min-h-[520px] flex flex-col justify-end">
              <div className="flex items-center gap-4 mb-6">
                <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '28px', fontVariationSettings: "'wght' 200" }}>architecture</span>
                <span className="font-label-caps text-[10px] text-primary/40 tracking-[0.3em]">01</span>
              </div>
              <h2 className="font-headline-lg text-4xl md:text-5xl text-gradient-blue mb-6">Infrastructure & Bridges</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant/60 max-w-2xl mb-10">
                Engineering monumental connections. We design, construct, and maintain structurally advanced bridges and critical transport arteries that endure generations.
              </p>
              <button className="w-fit border border-primary/20 text-primary font-label-caps text-[11px] tracking-[0.2em] px-8 py-4 hover:bg-primary hover:text-deep-obsidian transition-all duration-700 ease-in-out focus:outline-none rounded-sm shine-effect">
                VIEW CAPABILITIES
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-12 md:col-span-4 mb-4 card-hover border border-primary/5 bg-deep-obsidian p-10 md:p-12 flex flex-col justify-between min-h-[520px] transition-all duration-700 reveal-item reveal-delay-1 rounded-sm shine-effect">
            <div>
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '28px', fontVariationSettings: "'wght' 200" }}>domain</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant/30 tracking-[0.3em]">02</span>
              </div>
              <h2 className="font-headline-md text-3xl text-gradient-blue mb-5">Public Buildings</h2>
              <p className="font-body-md text-body-md text-on-surface-variant/60 leading-relaxed">
                Architectural excellence for civic institutions. From cutting-edge libraries to emergency response facilities, we build the spaces that serve the public.
              </p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary/70 font-label-caps text-[10px] tracking-[0.2em] hover:text-primary transition-colors duration-300 group" href="#explore">
              EXPLORE FACILITIES 
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
            </a>
          </div>

          {/* Card 3 */}
          <div className="col-span-12 md:col-span-4 mb-4 card-hover border border-primary/5 bg-deep-obsidian p-10 md:p-12 flex flex-col justify-between min-h-[400px] transition-all duration-700 reveal-item rounded-sm shine-effect">
            <div>
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '28px', fontVariationSettings: "'wght' 200" }}>water_drop</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant/30 tracking-[0.3em]">03</span>
              </div>
              <h2 className="font-headline-md text-2xl text-gradient-blue mb-4">Stormwater & Sewers</h2>
              <p className="font-body-md text-body-md text-on-surface-variant/60 leading-relaxed">
                Hydraulic precision. Advanced subterranean networks managing urban water flow, ensuring environmental protection and sanitation.
              </p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary/70 font-label-caps text-[10px] tracking-[0.2em] hover:text-primary transition-colors duration-300 group" href="#system">
              SYSTEM DETAILS
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
            </a>
          </div>

          {/* Card 4 */}
          <div className="col-span-12 md:col-span-4 mb-4 card-hover border border-primary/5 bg-deep-obsidian p-10 md:p-12 flex flex-col justify-between min-h-[400px] transition-all duration-700 reveal-item reveal-delay-1 rounded-sm shine-effect">
            <div>
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '28px', fontVariationSettings: "'wght' 200" }}>assignment</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant/30 tracking-[0.3em]">04</span>
              </div>
              <h2 className="font-headline-md text-2xl text-gradient-blue mb-4">Permits & Development</h2>
              <p className="font-body-md text-body-md text-on-surface-variant/60 leading-relaxed">
                Streamlined regulatory execution. Facilitating private and public development through rigorous, efficient permitting processes.
              </p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary/70 font-label-caps text-[10px] tracking-[0.2em] hover:text-primary transition-colors duration-300 group" href="#permits">
              START PROCESS
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
            </a>
          </div>

          {/* Card 5 */}
          <div className="col-span-12 md:col-span-4 mb-4 card-hover border border-primary/5 bg-deep-obsidian p-10 md:p-12 flex flex-col justify-between min-h-[400px] transition-all duration-700 reveal-item reveal-delay-2 rounded-sm shine-effect">
            <div>
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '28px', fontVariationSettings: "'wght' 200" }}>map</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant/30 tracking-[0.3em]">05</span>
              </div>
              <h2 className="font-headline-md text-2xl text-gradient-blue mb-4">NavigateLA Mapping</h2>
              <p className="font-body-md text-body-md text-on-surface-variant/60 leading-relaxed">
                Geospatial intelligence. Comprehensive digital mapping systems providing critical topographic and infrastructural data for strategic planning.
              </p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary/70 font-label-caps text-[10px] tracking-[0.2em] hover:text-primary transition-colors duration-300 group" href="#access">
              ACCESS PORTAL
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-28 px-6 md:px-margin-desktop relative z-10 max-w-container-max mx-auto">
        <div className="text-center mb-20">
          <div className="hr-diamond mb-10 reveal-item">
            <span className="text-[9px] font-label-caps tracking-[0.3em] uppercase text-primary/40">Methodology</span>
          </div>
          <h2 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight">
            Our <em className="italic text-gradient-blue font-serif">Process</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Analysis', desc: 'Deep environmental and structural analysis of site conditions, community needs, and regulatory requirements.', icon: 'analytics' },
            { step: '02', title: 'Design', desc: 'Parametric modeling and computational design to optimize form, function, and sustainability.', icon: 'draw' },
            { step: '03', title: 'Engineering', desc: 'Rigorous structural calculations, seismic modeling, and material specification by expert engineers.', icon: 'precision_manufacturing' },
            { step: '04', title: 'Delivery', desc: 'Full construction management with quality oversight, safety compliance, and community communication.', icon: 'verified' },
          ].map((item, i) => (
            <div key={i} className={`reveal-item reveal-delay-${i + 1} glass-panel p-8 rounded-sm border border-primary/5 text-center relative group shine-effect`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-deep-obsidian border border-primary/20 flex items-center justify-center">
                <span className="text-[9px] font-label-caps text-primary/60">{item.step}</span>
              </div>
              <span className="material-symbols-outlined text-primary/30 mb-6 mt-4 block" style={{ fontSize: '32px', fontVariationSettings: "'wght' 200" }}>{item.icon}</span>
              <h3 className="font-headline-md text-xl text-primary/80 mb-4">{item.title}</h3>
              <p className="text-[13px] text-on-surface-variant/50 leading-[1.8] font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── 3. ABOUT VIEW ───
function AboutView() {
  return (
    <div className="fade-in pt-28">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-bg.png" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/80 to-deep-obsidian/50"></div>
        </div>
        <div className="relative z-10 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="grid grid-cols-12 gap-gutter">
            <div className="col-span-12 md:col-span-8">
              <div className="blueprint-divider font-label-caps text-[10px] text-on-surface-variant/30 mb-8 w-64 tracking-[0.3em] reveal-item">
                <span>SEC_01</span>
              </div>
              <h1 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-gradient-blue mb-8">
                Engineering a Legacy.
              </h1>
              <p className="reveal-item reveal-delay-2 font-body-lg text-body-lg text-on-surface-variant/60 max-w-2xl leading-relaxed">
                Since our inception, the Bureau of Engineering has been the silent architect of modern infrastructure. We bridge the gap between theoretical physics and functional artistry, designing structures that define the skyline and endure through time.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 mt-12 md:mt-0 relative flex justify-end reveal-item reveal-delay-3">
              <div className="w-full h-full min-h-[300px] border border-primary/5 relative overflow-hidden group rounded-sm glow-blue">
                <div className="absolute inset-0 bg-gradient-to-tr from-deep-obsidian/80 to-transparent z-10"></div>
                <img 
                  src="/images/interior.png"
                  alt="Abstract architectural detail" 
                  className="w-full h-full object-cover filter grayscale-[0.4] opacity-70 group-hover:opacity-100 transition-opacity duration-1000 group-hover:grayscale-0"
                />
                <div className="absolute bottom-4 left-4 z-20 font-label-caps text-[9px] text-primary/40 tracking-[0.3em]">
                  STRC_DTL_01
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 md:px-margin-desktop max-w-container-max mx-auto py-32">
        <div className="blueprint-divider font-label-caps text-[10px] text-on-surface-variant/30 mb-16 w-full max-w-sm tracking-[0.3em] reveal-item">
          <span>SEC_02 // CORE_PRINCIPLES</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'eco', title: 'Sustainability', desc: 'Engineering with an ecological conscience. We integrate advanced materials and passive design strategies to minimize environmental impact while maximizing structural longevity.', delay: 1 },
            { icon: 'architecture', title: 'Innovation', desc: 'Pushing the boundaries of structural mechanics. We leverage computational design and predictive modeling to solve complex spatial challenges.', delay: 2, offset: true },
            { icon: 'location_city', title: 'Livability', desc: 'Designing for the human experience. Our civic projects prioritize accessibility, natural light, and fluid circulation to enhance the urban fabric.', delay: 3 },
          ].map((item, i) => (
            <div key={i} className={`glass-panel p-10 md:p-12 border border-primary/5 group relative overflow-hidden reveal-item reveal-delay-${item.delay} rounded-sm transition-all duration-500 hover:border-primary/15 shine-effect ${item.offset ? 'md:translate-y-12' : ''}`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <span className="material-symbols-outlined text-primary/40 mb-8 text-4xl block" style={{ fontVariationSettings: "'wght' 200" }}>{item.icon}</span>
              <h3 className="font-headline-md text-2xl text-gradient-blue mb-5">{item.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="relative px-6 md:px-margin-desktop max-w-container-max mx-auto pb-32">
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-40 mb-12 md:mb-0">
              <div className="blueprint-divider font-label-caps text-[10px] text-on-surface-variant/30 mb-8 w-48 tracking-[0.3em] reveal-item">
                <span>SEC_03 // CHRONOLOGY</span>
              </div>
              <h2 className="reveal-item reveal-delay-1 font-headline-lg text-4xl md:text-5xl text-gradient-blue mb-6">Evolution of Form.</h2>
              <p className="reveal-item reveal-delay-2 font-body-lg text-body-lg text-on-surface-variant/60 leading-relaxed">
                A century of definitive public works, charting our progress from foundational infrastructure to contemporary architectural marvels.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <div className="space-y-0">
              {[
                { year: '1906', title: 'Foundation & First Aqueduct', desc: 'The establishment of the Bureau marked the beginning of modern civic engineering in the region, pioneering massive water transport systems that enabled metropolitan expansion.' },
                { year: '1954', title: 'The Bridge Expansion Era', desc: 'A period defined by the deployment of innovative steel truss designs and reinforced concrete, creating critical arteries across the urban landscape.', hasImage: true },
                { year: '2024', title: 'Parametric Civic Centers', desc: 'Today, we utilize generative design and advanced material science to construct carbon-neutral public facilities that serve as community anchors.' },
              ].map((item, i) => (
                <div key={i} className="border-b border-primary/5 py-12 group hover:bg-surface-container/20 transition-colors duration-500 relative px-8 -mx-8 reveal-item">
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-primary/5 group-hover:bg-primary/15 transition-colors duration-500"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-4">
                    <span className="font-headline-md text-2xl text-gradient-blue w-32 shrink-0">{item.year}</span>
                    <h3 className="font-headline-md text-2xl text-on-surface flex-grow">{item.title}</h3>
                  </div>
                  <div className="md:pl-32">
                    <p className="font-body-md text-body-md text-on-surface-variant/60 leading-relaxed max-w-xl mb-6">{item.desc}</p>
                    {item.hasImage && (
                      <div className="h-48 w-full border border-primary/5 relative overflow-hidden rounded-sm glow-blue">
                        <img 
                          src="/images/bridge.png"
                          alt="Bridge architectural detail" 
                          className="w-full h-full object-cover filter grayscale-[0.5] opacity-60 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="px-6 md:px-margin-desktop max-w-container-max mx-auto pb-32">
        <div className="text-center mb-20">
          <div className="hr-diamond mb-10 reveal-item">
            <span className="text-[9px] font-label-caps tracking-[0.3em] uppercase text-primary/40">SEC_04 // Directors</span>
          </div>
          <h2 className="reveal-item reveal-delay-1 font-headline-lg text-4xl md:text-5xl text-gradient-blue">Structural Leadership.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-20 max-w-4xl mx-auto">
          {[
            { name: 'Arthur Pendelton', role: 'Chief Engineer', desc: 'Specializing in seismic resilience and large-scale structural dynamics, Arthur brings 30 years of uncompromising rigor to the Bureau\'s most complex civic projects.', code: 'DIR_01', offset: false },
            { name: 'Dr. Elena Rostova', role: 'Director of Sustainability', desc: 'A pioneer in biomimetic materials and passive thermodynamic systems. Elena ensures that every structure functions harmoniously within its local ecosystem.', code: 'DIR_02', offset: true },
          ].map((leader, i) => (
            <div key={i} className={`flex flex-col items-center text-center group reveal-item ${leader.offset ? 'md:mt-24' : ''}`}>
              <div className="w-64 h-80 border border-primary/5 mb-8 relative overflow-hidden rounded-sm glow-blue">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="w-full h-full bg-surface-container flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-obsidian/90 z-10"></div>
                  <div className="w-full h-full bg-gradient-to-br from-surface-container to-warm-charcoal flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/15" style={{ fontSize: '80px', fontVariationSettings: "'wght' 100" }}>person</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 z-20 font-label-caps text-[9px] text-primary/30 tracking-[0.3em]">{leader.code}</div>
              </div>
              <h3 className="font-headline-md text-2xl text-on-surface mb-2">{leader.name}</h3>
              <p className="font-label-caps text-[10px] text-primary/60 mb-4 tracking-[0.3em]">{leader.role}</p>
              <p className="font-body-md text-body-md text-on-surface-variant/50 max-w-sm leading-relaxed">{leader.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── 4. CONTACT VIEW ───
function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Permits',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', department: 'Permits', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="fade-in pt-28">
      {/* Hero — transparent so 3D rings show through */}
      <section className="relative min-h-[45vh] flex flex-col justify-end">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-6 md:px-margin-desktop pb-16 w-full">
          <div className="flex items-center gap-4 mb-8 reveal-item">
            <div className="w-12 h-px bg-gradient-to-r from-primary/40 to-transparent"></div>
            <span className="font-label-caps text-[10px] tracking-[0.3em] text-primary/50 uppercase">SEC_01 // Inquiries</span>
          </div>
          <h1 className="reveal-item reveal-delay-1 font-headline-lg text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-gradient-blue mb-6">
            Contact Us.
          </h1>
          <p className="reveal-item reveal-delay-2 text-[15px] text-on-surface-variant/50 max-w-lg leading-[1.9] font-light">
            Connect with our team of engineers and architects. We're here to discuss your project needs.
          </p>
        </div>
      </section>

      {/* Form + Directory */}
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop pb-32 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-sm border border-primary/5 relative z-20 reveal-item glow-blue">
            {submitted ? (
              <div className="text-center py-24 fade-in">
                <span className="material-symbols-outlined text-primary/60 text-6xl mb-6 float-animation block">
                  check_circle
                </span>
                <h3 className="font-headline-md text-2xl text-gradient-blue mb-4">Transmission Successful</h3>
                <p className="text-on-surface-variant/50 max-w-md mx-auto leading-relaxed font-light">
                  Your inquiry has been logged. A representative from the chosen department will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="name" className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-deep-obsidian/80 border border-primary/8 p-4 text-on-surface focus:outline-none focus:border-primary/30 transition-colors duration-500 rounded-sm text-[14px]"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="email" className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-deep-obsidian/80 border border-primary/8 p-4 text-on-surface focus:outline-none focus:border-primary/30 transition-colors duration-500 rounded-sm text-[14px]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="department" className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Department</label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-deep-obsidian/80 border border-primary/8 p-4 text-on-surface focus:outline-none focus:border-primary/30 transition-colors duration-500 rounded-sm text-[14px]"
                  >
                    <option value="Permits">Permits & Development Services</option>
                    <option value="Bridges">Bridges & Structural Engineering</option>
                    <option value="Buildings">Public Buildings Program</option>
                    <option value="Wastewater">Stormwater & Sewers</option>
                    <option value="NavigateLA">Geospatial / NavigateLA Systems</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="subject" className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-deep-obsidian/80 border border-primary/8 p-4 text-on-surface focus:outline-none focus:border-primary/30 transition-colors duration-500 rounded-sm text-[14px]"
                    placeholder="Inquiry subject"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="message" className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-deep-obsidian/80 border border-primary/8 p-4 text-on-surface focus:outline-none focus:border-primary/30 transition-colors duration-500 rounded-sm resize-none text-[14px]"
                    placeholder="Enter details of your request..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full border border-primary/20 text-primary font-label-caps text-[11px] tracking-[0.2em] py-5 hover:bg-primary hover:text-deep-obsidian transition-all duration-700 rounded-sm focus:outline-none shine-effect"
                >
                  SUBMIT TRANSMISSION
                </button>
              </form>
            )}
          </div>

          {/* Directory */}
          <div className="lg:col-span-5 space-y-12 relative z-20">
            <div className="space-y-6 reveal-item">
              <h3 className="font-headline-md text-2xl text-gradient-blue">District Directory</h3>
              <div className="h-px bg-gradient-to-r from-primary/10 to-transparent w-full"></div>
              
              <div className="space-y-8">
                {[
                  { name: 'Downtown Headquarters', addr: '200 N Spring St, Suite 700\nLos Angeles, CA 90012', phone: '(213) 485-4934' },
                  { name: 'Valley District Office', addr: '6262 Van Nuys Blvd, Suite 251\nVan Nuys, CA 91401', phone: '(818) 374-4600' },
                  { name: 'West Los Angeles Office', addr: '1828 Sawtelle Blvd, Suite 300\nWest Los Angeles, CA 90025', phone: '(310) 575-8384' },
                ].map((office, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="material-symbols-outlined text-primary/40 group-hover:text-primary/60 transition-colors duration-500" style={{ fontSize: '22px', fontVariationSettings: "'wght' 200" }}>location_city</span>
                    <div>
                      <h4 className="font-medium text-[14px] mb-1">{office.name}</h4>
                      <p className="text-[13px] text-on-surface-variant/40 font-light leading-relaxed whitespace-pre-line">{office.addr}</p>
                      <p className="text-[12px] text-primary/50 mt-2 font-mono">{office.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 border border-primary/5 rounded-sm space-y-4 reveal-item reveal-delay-1">
              <h4 className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Operating Hours</h4>
              <p className="text-[13px] text-on-surface-variant/50 font-light leading-relaxed">
                Monday – Friday<br />
                8:00 AM – 5:00 PM PST<br />
                <span className="text-[11px] text-primary/30 italic mt-2 block">Closed on municipal holidays.</span>
              </p>
            </div>

            <div className="glass-panel p-8 border border-primary/5 rounded-sm space-y-4 reveal-item reveal-delay-2">
              <h4 className="font-label-caps text-[9px] tracking-[0.3em] text-primary/50 uppercase">Emergency</h4>
              <p className="text-[13px] text-on-surface-variant/50 font-light leading-relaxed">
                For urgent infrastructure concerns, call 311 or visit <span className="text-primary/60">lacity.org/311</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
