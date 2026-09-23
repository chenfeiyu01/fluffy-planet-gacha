import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// Real-time sparkle / star tunnel. Scene art stays crisp while particles add depth.
export default function Effects({ active = false, rare = false }) {
  const host = useRef(),
    mode = useRef({ active, rare });
  mode.current = { active, rare };
  useEffect(() => {
    const el = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(55, 1, 0.1, 60);
    camera.position.z = 12;
    const count = 180,
      pos = new Float32Array(count * 3),
      colors = new Float32Array(count * 3),
      seed = [];
    const palette = ["#ffc46d", "#ff98b6", "#a79aec", "#89d8c3"];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      seed.push(Math.random() * 6.28);
      new THREE.Color(palette[i % 4]).toArray(colors, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      uniforms: { uTime: { value: 0 }, uBurst: { value: 0 } },
      vertexShader: `varying vec3 vColor; uniform float uTime,uBurst; void main(){vColor=color;vec3 p=position;p.y+=sin(uTime*.5+position.x)*.2;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(17.+uBurst*20.)*(6./-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying vec3 vColor;void main(){vec2 p=abs(gl_PointCoord-.5);float star=1.-smoothstep(.08,.42,p.x+p.y);float core=1.-smoothstep(.03,.09,min(p.x,p.y));float a=max(star*.7,core*.5*(1.-smoothstep(.15,.5,max(p.x,p.y))));gl_FragColor=vec4(vColor,a*.7);}`,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let previous = 0;
    renderer.setAnimationLoop((t) => {
      if (document.hidden) return;
      const dt = Math.min((t - previous) / 1000, 0.05);
      previous = t;
      mat.uniforms.uTime.value = t * 0.001;
      mat.uniforms.uBurst.value = mode.current.active ? 1 : 0;
      if (!reduced) {
        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] += dt * (mode.current.active ? 2.3 : 0.11);
          pos[i * 3 + 2] += dt * (mode.current.active ? 4 : 0.03);
          if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = -9;
          if (pos[i * 3 + 2] > 8) pos[i * 3 + 2] = -8;
        }
        geo.attributes.position.needsUpdate = true;
        points.rotation.z = Math.sin(t * 0.0001) * 0.03;
      }
      renderer.render(scene, camera);
    });
    return () => {
      ro.disconnect();
      renderer.setAnimationLoop(null);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.replaceChildren();
    };
  }, []);
  return (
    <div
      className={`effects ${active ? "effects-active" : ""}`}
      ref={host}
      aria-hidden="true"
    />
  );
}
