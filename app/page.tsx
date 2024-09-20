"use client";

import { useEffect, useRef } from "react";
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  MeshPhongMaterial,
  TextureLoader,
} from "three";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sun } from "./sun";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const scene = new Scene();
      const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 20;
      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.render(scene, camera);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

      const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
      sunLight.position.set(-2, 0.5, 1.5);
      scene.add(sunLight);

      const textureLoader = new TextureLoader();

      const bumpRoughnessCloudsTexture = textureLoader.load(
        "./assets/planets/earth_day_4096.jpg"
      );
      const earth = new SphereGeometry(1, 64, 64);
      const earthmaterial = new MeshPhongMaterial({
        map: bumpRoughnessCloudsTexture,
        specularMap: textureLoader.load(
          "./assets/planets/earth_night_4096.jpg"
        ),
        bumpMap: textureLoader.load(
          "./assets/planets/earth_bump_roughness_clouds_4096.jpg"
        ),
        bumpScale: 0.04,
      });
      const earthMesh = new Mesh(earth, earthmaterial);

      const earthGroup = new THREE.Group();
      earthGroup.position.x = 20;
      scene.add(earthGroup);

      earthGroup.add(earthMesh);
      const lightsMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(
          "./assets/planets/earth_bump_roughness_clouds_4096.jpg"
        ),
        blending: THREE.AdditiveBlending,
      });
      const lightsMesh = new THREE.Mesh(earth, lightsMat);
      earthGroup.add(lightsMesh);


      const moon = new SphereGeometry(0.3, 64, 64);
      const moonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const moonMesh = new Mesh(moon, moonMaterial);
      moonMesh.position.x = 3;

      // scene.add(moonMesh);

      earthGroup.add(moonMesh);

      const renderScene = (t = 0) => {
        requestAnimationFrame(renderScene);
        earthGroup.position.x = Math.sin(t / 1000) * 10;
        earthGroup.position.y = Math.cos(t / 1000) * 10;
        earthGroup.rotation.y = t / 1000;

        moonMesh.position.x = Math.sin((t / 1000) * 5) * 2;
        moonMesh.position.y = Math.cos((t / 1000) * 5) * 2;
        moonMesh.rotation.y = (t / 1000) * 30;

        renderer.render(scene, camera);
        controls.update();
      };

      // Call the renderScene function to start the animation loop
      renderScene();
      const sun = new Sun().getSun();
      scene.add(sun);

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  return <div ref={containerRef} />;
}
