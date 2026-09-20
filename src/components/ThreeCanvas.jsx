import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas({ activePage }) {
  const mountRef = useRef(null);
  const activePageRef = useRef(activePage);

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE & RENDERER SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfff9ed, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // ─── WIREFRAME BUILDING GENERATOR (ARCHITECTURAL GOLD) ───
    function createArchitecturalBuilding(w, h, d, floors) {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, h, d);
      const edges = new THREE.EdgesGeometry(geom);
      const material = new THREE.LineBasicMaterial({
        color: 0xb89248,
        transparent: true,
        opacity: 0.28,
      });
      const outerFrame = new THREE.LineSegments(edges, material);
      group.add(outerFrame);

      const floorMaterial = new THREE.LineBasicMaterial({
        color: 0x8c723b,
        transparent: true,
        opacity: 0.22,
      });

      const points = [];
      const floorSpacing = h / floors;
      for (let i = 1; i < floors; i++) {
        const y = -h / 2 + i * floorSpacing;
        points.push(-w / 2, y, -d / 2, w / 2, y, -d / 2);
        points.push(w / 2, y, -d / 2, w / 2, y, d / 2);
        points.push(w / 2, y, d / 2, -w / 2, y, d / 2);
        points.push(-w / 2, y, d / 2, -w / 2, y, -d / 2);

        // Diagonal truss cross-bracing
        if (i % 2 === 0) {
          points.push(-w / 2, y, -d / 2, w / 2, y - floorSpacing, -d / 2);
          points.push(w / 2, y, -d / 2, -w / 2, y - floorSpacing, -d / 2);
        }
      }
      const floorGeom = new THREE.BufferGeometry();
      floorGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const floorLines = new THREE.LineSegments(floorGeom, floorMaterial);
      group.add(floorLines);

      return { group, material, floorMaterial };
    }

    // ─── 1. OVERVIEW SCENE (Landmark Architectural Skyline & Arches) ───
    const homeGroup = new THREE.Group();
    const buildings = [];
    const buildingMaterials = [];

    const buildingLayout = [
      { x: -70, y: -10, z: -35, w: 18, h: 65, d: 18 },
      { x: -44, y: -4, z: -25, w: 22, h: 88, d: 20 },
      { x: -18, y: -8, z: -40, w: 15, h: 56, d: 15 },
      { x: 10, y: -2, z: -20, w: 26, h: 100, d: 22 },
      { x: 36, y: -10, z: -30, w: 18, h: 62, d: 18 },
      { x: 62, y: -6, z: -36, w: 16, h: 74, d: 16 },
      { x: 84, y: -12, z: -45, w: 14, h: 48, d: 14 },
    ];

    buildingLayout.forEach((cfg) => {
      const floors = Math.floor(cfg.h / 4);
      const bObj = createArchitecturalBuilding(cfg.w, cfg.h, cfg.d, floors);
      bObj.group.position.set(cfg.x, cfg.y, cfg.z);
      homeGroup.add(bObj.group);
      buildings.push(bObj.group);
      buildingMaterials.push(bObj.material);
    });

    // Precision Blueprint Grid Plane
    const groundGrid = new THREE.GridHelper(280, 70, 0xb89248, 0xd6cca9);
    groundGrid.position.y = -35;
    groundGrid.material.opacity = 0.22;
    groundGrid.material.transparent = true;
    homeGroup.add(groundGrid);

    // Floating Ambient Particles
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 800;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPositions[i] = (Math.random() - 0.5) * 220;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x9c7a34,
      transparent: true,
      opacity: 0.35,
    });
    const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    homeGroup.add(dustMesh);

    scene.add(homeGroup);

    // ─── 2. SERVICES SCENE (Parametric Bridge Arch & Trusses) ───
    const servicesGroup = new THREE.Group();
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-60, -10, 0),
      new THREE.Vector3(-30, 15, 0),
      new THREE.Vector3(0, 20, 0),
      new THREE.Vector3(30, 15, 0),
      new THREE.Vector3(60, -10, 0),
    ]);
    const archGeom = new THREE.TubeGeometry(archCurve, 64, 0.4, 8, false);
    const archMat = new THREE.MeshBasicMaterial({ color: 0xb89248, wireframe: true, transparent: true, opacity: 0.26 });
    const archMesh = new THREE.Mesh(archGeom, archMat);
    servicesGroup.add(archMesh);

    // Dual arch
    const archMesh2 = archMesh.clone();
    archMesh2.position.z = -12;
    servicesGroup.add(archMesh2);

    const bridgeGrid = new THREE.GridHelper(160, 40, 0xb89248, 0xd6cca9);
    bridgeGrid.position.y = -12;
    bridgeGrid.material.opacity = 0.2;
    bridgeGrid.material.transparent = true;
    servicesGroup.add(bridgeGrid);

    scene.add(servicesGroup);

    // ─── 3. ABOUT SCENE (Geodesic Matrix Dome) ───
    const aboutGroup = new THREE.Group();
    const domeGeom = new THREE.IcosahedronGeometry(42, 2);
    const domeEdges = new THREE.EdgesGeometry(domeGeom);
    const domeMat = new THREE.LineBasicMaterial({ color: 0x9c7a34, transparent: true, opacity: 0.24 });
    const domeMesh = new THREE.LineSegments(domeEdges, domeMat);
    domeMesh.position.set(0, -38, -15);
    aboutGroup.add(domeMesh);
    scene.add(aboutGroup);

    // ─── 4. CONTACT SCENE (Radar Concentric Range Rings) ───
    const contactGroup = new THREE.Group();
    const ringMat = new THREE.LineBasicMaterial({ color: 0xb89248, transparent: true, opacity: 0.25 });
    for (let r = 18; r <= 84; r += 14) {
      const rg = new THREE.RingGeometry(r, r + 0.12, 64);
      const re = new THREE.EdgesGeometry(rg);
      const rm = new THREE.LineSegments(re, ringMat);
      rm.rotation.x = Math.PI / 2;
      contactGroup.add(rm);
    }
    scene.add(contactGroup);

    // ─── POINTER & SCROLL TRACKING WITH MOMENTUM ───
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollY = window.scrollY;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.035;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.035;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ─── ANIMATION RENDER LOOP ───
    let currentHomeOpacity = 1.0;
    let currentServicesOpacity = 0.0;
    let currentAboutOpacity = 0.0;
    let currentContactOpacity = 0.0;
    const clock = new THREE.Clock();
    let frameId;

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);
      const t = clock.getElapsedTime();

      // Smooth lerp pointer momentum
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const active = activePageRef.current;
      const targetHome = active === 'home' ? 1.0 : 0.0;
      const targetServices = active === 'services' ? 1.0 : 0.0;
      const targetAbout = active === 'about' ? 1.0 : 0.0;
      const targetContact = active === 'contact' ? 1.0 : 0.0;

      currentHomeOpacity += (targetHome - currentHomeOpacity) * 0.06;
      currentServicesOpacity += (targetServices - currentServicesOpacity) * 0.06;
      currentAboutOpacity += (targetAbout - currentAboutOpacity) * 0.06;
      currentContactOpacity += (targetContact - currentContactOpacity) * 0.06;

      // Home Animation
      homeGroup.visible = currentHomeOpacity > 0.01;
      if (homeGroup.visible) {
        buildingMaterials.forEach((m) => {
          m.opacity = currentHomeOpacity * 0.18;
        });
        dustMaterial.opacity = currentHomeOpacity * 0.35;
        buildings.forEach((b, i) => {
          b.rotation.y = t * 0.008 * (i % 2 === 0 ? 1 : -1);
        });
        dustMesh.rotation.y = t * 0.004;
      }

      // Services Animation
      servicesGroup.visible = currentServicesOpacity > 0.01;
      if (servicesGroup.visible) {
        archMat.opacity = currentServicesOpacity * 0.22;
        servicesGroup.rotation.y = t * 0.015;
      }

      // About Animation
      aboutGroup.visible = currentAboutOpacity > 0.01;
      if (aboutGroup.visible) {
        domeMat.opacity = currentAboutOpacity * 0.15;
        domeMesh.rotation.y = t * 0.02;
      }

      // Contact Animation
      contactGroup.visible = currentContactOpacity > 0.01;
      if (contactGroup.visible) {
        ringMat.opacity = currentContactOpacity * 0.18;
        contactGroup.rotation.y = t * 0.025;
      }

      // Camera Transitions based on Page
      if (active === 'home') {
        const targetZ = 34 - scrollY * 0.008;
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        camera.position.x += (currentMouseX * 0.08 - camera.position.x) * 0.05;
        camera.position.y += (-currentMouseY * 0.06 - scrollY * 0.002 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      } else if (active === 'services') {
        camera.position.z += (46 - camera.position.z) * 0.05;
        camera.position.x += (currentMouseX * 0.08 - camera.position.x) * 0.05;
        camera.position.y += (6 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      } else if (active === 'about') {
        camera.position.z += (120 - camera.position.z) * 0.05;
        camera.position.y += (20 - camera.position.y) * 0.05;
        camera.lookAt(0, -15, 0);
      } else if (active === 'contact') {
        camera.position.z += (52 - camera.position.z) * 0.05;
        camera.position.y += (8 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div id="canvas-container" ref={mountRef} aria-hidden="true" />;
}
