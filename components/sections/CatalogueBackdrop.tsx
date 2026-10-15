"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 140; // number of light streaks
const W = 44;
const H = 20;
const D = 16;

/**
 * Ambient three.js background: red and white light streaks racing past,
 * following the mouse and speeding up when the page scrolls.
 */
export default function CatalogueBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the section simply keeps its plain dark background
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 10;

    // Each streak is a line segment: a dark tail and a bright head
    const positions = new Float32Array(COUNT * 6);
    const colors = new Float32Array(COUNT * 6);
    const speeds = new Float32Array(COUNT);
    const lengths = new Float32Array(COUNT);
    const red = new THREE.Color("#D80005");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * W;
      const y = (Math.random() - 0.5) * H;
      const z = (Math.random() - 0.5) * D - 2;
      const len = 0.8 + Math.random() * 2.6;
      lengths[i] = len;
      speeds[i] = 0.5 + Math.random() * 1.3;

      positions.set([x - len, y, z], i * 6);
      positions.set([x, y, z], i * 6 + 3);

      const c = Math.random() < 0.35 ? red : white;
      const strength = 0.25 + Math.random() * 0.45;
      colors.set([0, 0, 0], i * 6); // tail fades out
      colors.set([c.r * strength, c.g * strength, c.b * strength], i * 6 + 3);
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(positions, 3);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttr);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.LineSegments(geometry, material));

    // Mouse parallax and scroll boost
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    let boost = 0;
    let lastScroll = window.scrollY;
    const onScroll = () => {
      boost = Math.min(boost + Math.abs(window.scrollY - lastScroll) * 0.004, 4);
      lastScroll = window.scrollY;
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;

      boost *= 0.94;
      const speedUp = 1 + boost;
      for (let i = 0; i < COUNT; i++) {
        const dx = speeds[i] * dt * 2 * speedUp;
        positions[i * 6] += dx;
        positions[i * 6 + 3] += dx;
        if (positions[i * 6] > W / 2) {
          // Streak left the screen: send it back to the other side
          positions[i * 6 + 3] = -W / 2;
          positions[i * 6] = -W / 2 - lengths[i];
        }
      }
      positionAttr.needsUpdate = true;

      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" />;
}