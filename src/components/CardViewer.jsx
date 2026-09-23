import { needsSSRGuide, completeSSRGuide } from "../ssrGuide";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Download, RotateCcw } from "lucide-react";
import { loadCardArtwork, loadCardBack } from "../cardArtwork";
import Modal from "./Modal";
// Lenticular angle/phase model adapted from holo-card-studio (MIT).
const vertex = `varying vec2 vUv; varying vec3 vView; uniform mat4 uRootInverse;
void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vView=(uRootInverse*vec4(cameraPosition,1.)).xyz-(uRootInverse*w).xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const fragment = `varying vec2 vUv;varying vec3 vView;uniform sampler2D tA,tB;uniform float uDual,uTime,uFoil,uAngle;
vec3 spectrum(float t){return .55+.45*cos(6.283*(t+vec3(0.,.32,.66)));}
void main(){vec3 V=normalize(vView);float lens=fract(vUv.x*140.)-.5;float angle=degrees(uAngle);float phase=smoothstep(-8.,8.,angle+lens*1.2)*uDual;
vec4 texel=mix(texture2D(tA,vUv),texture2D(tB,vUv),phase);if(texel.a<.04)discard;vec3 c=texel.rgb;
float wave=.5+.5*sin((vUv.x*.8-vUv.y*.5+V.x*1.6)*9.);float sweep=pow(wave,24.);
float edge=1.-smoothstep(.025,.075,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));
float idle=pow(.5+.5*sin((vUv.x*.75-vUv.y*.4)*7.-uTime*.38),26.);
float grain=fract(sin(dot(floor(vUv*vec2(800.,1200.)),vec2(12.9898,78.233)))*43758.5453);
c+=vec3(1.,.92,.78)*(.035+idle*.085)*uFoil;
c+=spectrum(vUv.x+vUv.y+uTime*.025)*edge*(.08+idle*.10)*uFoil;
c+=(grain-.5)*.006;
c+=spectrum(wave+V.x)*sweep*.13*uFoil;gl_FragColor=vec4(pow(max(c,vec3(0.)),vec3(2.2)),1.);
#include <colorspace_fragment>}`;
function roundedShape() {
  const s = new THREE.Shape(),
    x = -1,
    y = -1.5,
    w = 2,
    h = 3,
    r = 0.075;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function CanvasCard({ card, api, onExplore }) {
  const host = useRef(),
    rotation = useRef({ x: 0, y: card.alternate ? .24 : 0, vx: 0, vy: 0, drag: null });
  const [status, setStatus] = useState("正在载入卡片…");
  useEffect(() => {
    let dead = false,
      renderer,
      observer;
    const el = host.current,
      disposables = [];
    const keep = (o) => {
      disposables.push(o);
      return o;
    };
    async function init() {
      try {
        const [a, b, backImage] = await Promise.all([
          loadCardArtwork(card),
          loadCardArtwork(card, !!card.alternate),
          loadCardBack(card),
        ]);
        if (dead) return;
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        el.appendChild(renderer.domElement);
        const scene = new THREE.Scene(),
          camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30),
          root = new THREE.Group();
        camera.position.z = 6.6;
        scene.add(root);
        root.rotation.y = card.alternate ? .24 : 0;
        const inverse = new THREE.Matrix4();
        const texture = (canvas) => {
          const t = keep(new THREE.CanvasTexture(canvas));
          t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          return t;
        };
        const uniforms = {
          tA: { value: texture(a.canvas) },
          tB: { value: texture(b.canvas) },
          uAngle: { value: card.alternate ? -.24 : 0 },
          uDual: { value: card.alternate ? 1 : 0 },
          uFoil: { value: card.rarity === "R" ? 0.45 : 1 },
          uTime: { value: 0 },
          uRootInverse: { value: inverse },
        };
        const frontMat = keep(
          new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
          }),
        );
        const backTex = keep(new THREE.CanvasTexture(backImage.canvas));
        backTex.colorSpace = THREE.SRGBColorSpace;
        backTex.needsUpdate = true;
        backTex.anisotropy = 8;
        const backMat = keep(
          new THREE.MeshStandardMaterial({
            map: backTex,
            roughness: 0.5,
            metalness: 0.08,
          }),
        );
        const sideMat = keep(
          new THREE.MeshStandardMaterial({
            color: "#e9cda6",
            metalness: 0.6,
            roughness: 0.32,
          }),
        );
        const makeShape = (outline) => {
          if (!outline) return roundedShape();
          const s = new THREE.Shape();
          outline.forEach(([x, y], i) =>
            i
              ? s.lineTo(x * 2 - 1, 1.5 - y * 3)
              : s.moveTo(x * 2 - 1, 1.5 - y * 3),
          );
          s.closePath();
          return s;
        };
        const makeFace = (shape) => {
          const geo = keep(new THREE.ShapeGeometry(shape, 16)),
            p = geo.attributes.position,
            uv = geo.attributes.uv;
          for (let i = 0; i < p.count; i++)
            uv.setXY(i, (p.getX(i) + 1) / 2, (p.getY(i) + 1.5) / 3);
          uv.needsUpdate = true;
          return geo;
        };
        const shape = makeShape(a.outline),
          face = makeFace(shape);
        const front = new THREE.Mesh(face, frontMat);
        front.position.z = 0.026;
        const back = new THREE.Mesh(
          makeFace(makeShape(backImage.outline)),
          backMat,
        );
        back.rotation.y = Math.PI;
        back.position.z = -0.026;
        // Thin laminated body, with a bevel catching light when viewed edge-on.
        const bodyGeo = keep(
          new THREE.ExtrudeGeometry(shape, {
            depth: 0.038,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelSegments: 3,
            steps: 1,
            curveSegments: 16,
          }),
        );
        bodyGeo.translate(0, 0, -0.019);
        root.add(new THREE.Mesh(bodyGeo, sideMat), front, back);
        scene.add(new THREE.HemisphereLight("#fff7ed", "#9881b6", 2.4));
        const key = new THREE.DirectionalLight("#fff7df", 3);
        key.position.set(-3, 5, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight("#c1d7ff", 2);
        rim.position.set(3, 1, -4);
        scene.add(rim);
        const resize = () => {
          const w = el.clientWidth,
            h = el.clientHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.fov = THREE.MathUtils.radToDeg(
            2 * Math.atan(Math.max(1.82, 1.2 / camera.aspect) / 6.6),
          );
          camera.updateProjectionMatrix();
        };
        observer = new ResizeObserver(resize);
        observer.observe(el);
        resize();
        setStatus("");
        api.current = {
          reset: () => {
            rotation.current = { x: 0, y: card.alternate ? .24 : 0, vx: 0, vy: 0, drag: null };
          },
          save: () => {
            renderer.render(scene, camera);
            const link = document.createElement("a");
            link.href = renderer.domElement.toDataURL("image/png");
            link.download = `${card.name}.png`;
            link.click();
          },
        };
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let previous = 0;
        renderer.setAnimationLoop((time) => {
          if (document.hidden) return;
          const dt = Math.min((time - previous) / 16.67 || 1, 3);
          previous = time;
          const r = rotation.current;
          if (!r.drag) {
            r.x += r.vx * dt;
            r.y += r.vy * dt;
            r.vx *= Math.pow(0.9, dt);
            r.vy *= Math.pow(0.9, dt);
          }
          r.x = THREE.MathUtils.clamp(r.x, -1.25, 1.25);
          root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, r.x, 0.2);
          root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, r.y, 0.2);
          root.position.y = reduce ? 0 : Math.sin(time * 0.0012) * 0.025;
          root.rotation.z = reduce ? 0 : Math.sin(time * 0.0008) * 0.008;
          root.updateMatrixWorld(true);
          inverse.copy(root.matrixWorld).invert();
          uniforms.uAngle.value = Math.atan2(-Math.sin(root.rotation.y), Math.cos(root.rotation.y));
          uniforms.uTime.value = reduce ? 0 : time * 0.001;
          renderer.render(scene, camera);
        });
      } catch (e) {
        console.error(e);
        if (!dead) setStatus("卡片载入失败，请关闭后重试。");
      }
    }
    init();
    return () => {
      dead = true;
      observer?.disconnect();
      renderer?.setAnimationLoop(null);
      renderer?.dispose();
      disposables.forEach((o) => o.dispose());
      el.querySelector("canvas")?.remove();
      api.current = null;
    };
  }, [card.id]);
  const release = () => {
    rotation.current.drag = null;
  };
  return (
    <div
      className="card-stage"
      role="img"
      aria-label={`${card.name} 3D卡片，可拖拽查看正反面`}
      tabIndex={0}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        rotation.current.drag = { x: e.clientX, y: e.clientY };
        rotation.current.vx = rotation.current.vy = 0;
      }}
      onPointerMove={(e) => {
        const r = rotation.current;
        if (!r.drag) return;
        const scale =
          (2 * Math.PI) / Math.max(e.currentTarget.clientWidth, 300);
        const dy = (e.clientX - r.drag.x) * scale,
          dx = (e.clientY - r.drag.y) * scale;
        if (Math.abs(e.clientX - r.drag.x) > 2) onExplore?.();
        r.y += dy;
        r.x += dx;
        r.vy = THREE.MathUtils.clamp(dy, -0.03, 0.03);
        r.vx = THREE.MathUtils.clamp(dx, -0.02, 0.02);
        r.drag = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onKeyDown={(e) => {
        const r = rotation.current;
        if (e.key.startsWith("Arrow")) {
          e.preventDefault();
          r.vx = r.vy = 0;
          if (e.key === "ArrowLeft") r.y -= 0.2;
          if (e.key === "ArrowRight") r.y += 0.2;
          if (e.key === "ArrowUp") r.x -= 0.15;
          if (e.key === "ArrowDown") r.x += 0.15;
        }
      }}
    >
      <div className="renderer-mount" ref={host} />
      {status ? <span className="canvas-loading">{status}</span> : null}
    </div>
  );
}
export default function CardViewer({ card, onClose }) {
  const api = useRef();
  const [guide, setGuide] = useState(
    () => card.rarity === "SSR" && needsSSRGuide(),
  );
  const explore = () => {
    if (guide) {
      completeSSRGuide();
      setGuide(false);
    }
  };
  return (
    <Modal
      title={`${card.name}卡片详情`}
      onClose={onClose}
      className={`card-modal floating-viewer rarity-${card.rarity}`}
    >
      <div className="floating-halo" aria-hidden="true" />
      <CanvasCard card={card} api={api} onExplore={explore} />
      <section className="viewer-story" aria-label={`${card.name}的故事`}>
        <h3>{card.name}<span>{card.rarity}</span></h3>
        <p tabIndex={0}>{card.story || card.tag}</p>
        {card.rarity === "SSR" && <div className="ssr-persistent-hint"><span aria-hidden="true">↔</span> 左右扭转卡片，看看另一种模样</div>}
      </section>
      <div className="viewer-actions">
        <button className="viewer-action" onClick={() => api.current?.reset()}>
          <RotateCcw size={18} />
          归位
        </button>
        <button
          className="viewer-action save-action"
          onClick={() => api.current?.save()}
        >
          <Download size={18} />
          保存卡片
        </button>
      </div>
    </Modal>
  );
}
