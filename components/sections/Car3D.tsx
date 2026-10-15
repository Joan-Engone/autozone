"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface Car3DProps {
  /** Path of the .glb model, e.g. /models/car.glb */
  src: string;
  /** Static image shown if the model can't be loaded. */
  fallbackSrc?: string;
  alt: string;
  className?: string;
  /** Allows zooming with the wheel / pinch (used in the full-screen showroom). */
  interactive?: boolean;
  /** Turns the automatic rotation on or off. */
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  /** Change this number to send the camera back to its starting view. */
  resetKey?: number;
  /** Stops rendering (use it while the car is hidden behind something). */
  paused?: boolean;
}

/** Soft dark ellipse that grounds the car on the "floor". */
function makeShadowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.9)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.35)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function Car3D({
  src,
  fallbackSrc,
  alt,
  className = "",
  interactive = false,
  autoRotate = true,
  autoRotateSpeed = 1.1,
  resetKey = 0,
  paused = false,
}: Car3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);

  // Values the render loop reads without restarting the scene
  const pausedRef = useRef(paused);
  const autoRef = useRef(autoRotate);
  const apiRef = useRef<{ apply: () => void; reset: () => void } | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    autoRef.current = autoRotate;
    apiRef.current?.apply();
  }, [autoRotate]);
  useEffect(() => {
    if (resetKey > 0) apiRef.current?.reset();
  }, [resetKey]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mount = mountRef.current;
    if (!wrap || !mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // Scene, reflections and lights
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff2a2f, 3); // brand-red rim light
    rim.position.set(-5, 2, -4);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(4, 1.6, 6);

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    scene.add(shadow);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // Drag to rotate, slow automatic turn
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = interactive; // off in the hero so the page keeps scrolling
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI * (interactive ? 0.12 : 0.32);
    controls.maxPolarAngle = Math.PI * 0.52; // never look from under the floor
    controls.autoRotateSpeed = autoRotateSpeed;
    renderer.domElement.style.touchAction = interactive ? "none" : "pan-y";

    const apply = () => {
      controls.autoRotate = autoRef.current && !reduceMotion;
    };
    apply();

    const home = { position: new THREE.Vector3() };
    const reset = () => {
      gsap.killTweensOf(camera.position);
      gsap.to(camera.position, {
        x: home.position.x,
        y: home.position.y,
        z: home.position.z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => controls.update(),
      });
    };
    apiRef.current = { apply, reset };

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      if (resumeTimer) clearTimeout(resumeTimer);
    });
    controls.addEventListener("end", () => {
      resumeTimer = setTimeout(apply, 2000);
    });

    // Load the model
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(
      src,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        // Center the car, put its wheels on the floor, and scale it to a standard size
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 4 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        pivot.add(model);

        const height = size.y * scale;
        const length = Math.max(size.x, size.z) * scale;
        camera.position.set(length * 0.95, height * 1.15, length * 1.35);
        controls.target.set(0, height * 0.45, 0);
        controls.update();
        shadow.scale.set(length * 1.5, length * 1.5, 1);

        home.position.copy(camera.position);
        if (interactive) {
          const distance = camera.position.distanceTo(controls.target);
          controls.minDistance = distance * 0.5;
          controls.maxDistance = distance * 1.4;
        }

        if (!reduceMotion) {
          gsap.from(pivot.rotation, { y: -Math.PI * 0.9, duration: 2.4, ease: "power4.out" });
          gsap.from(pivot.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 1.6, ease: "power3.out" });
        }
        setStatus("ready");
      },
      (event) => {
        if (!disposed && event.lengthComputable) setProgress(event.loaded / event.total);
      },
      (error) => {
        console.error("Car3D: could not load the model", error);
        if (!disposed) setStatus("error");
      }
    );

    // Size handling
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // Render loop, paused when the car is off-screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || pausedRef.current) return;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      apiRef.current = null;
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      gsap.killTweensOf([pivot.rotation, pivot.scale, camera.position]);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      draco.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => {
            Object.values(m as unknown as Record<string, unknown>).forEach((v) => {
              if (v instanceof THREE.Texture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, interactive, autoRotateSpeed]);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={`${alt}. Faites glisser pour faire pivoter.`}
      className={`relative cursor-grab select-none active:cursor-grabbing ${className}`}
    >
      <div ref={mountRef} className="absolute inset-0" />

      {status === "error" && fallbackSrc && (
        <Image src={fallbackSrc} alt={alt} fill priority className="object-contain" />
      )}

      {status === "loading" && (
        <div className="absolute inset-x-[20%] bottom-6 text-center" aria-hidden="true">
          <p className="mb-2 text-[11px] font-medium text-white/50">Chargement du modèle 3D…</p>
          <div className="h-[2px] w-full bg-white/10">
            <div
              className="h-full bg-[#D80005] transition-[width] duration-200"
              style={{ width: `${Math.max(5, Math.round(progress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {status === "ready" && (
        <p className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[11px] font-medium text-white/50">
          <MoveHorizontal size={14} aria-hidden="true" />
          {interactive ? "Glissez pour pivoter · Molette pour zoomer" : "Glissez pour faire pivoter"}
        </p>
      )}
    </div>
  );
}