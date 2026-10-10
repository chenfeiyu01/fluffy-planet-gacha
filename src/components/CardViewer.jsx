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
float grazing=pow(1.-clamp(abs(V.z),0.,1.),1.4);
float filmCoord=vUv.x*.95+vUv.y*.3-V.x*.9-V.y*.2-.54-sin(uTime*.17)*.025;
float sunPrism=exp(-pow(filmCoord*5.5,2.));
float fineBands=pow(.5+.5*sin((vUv.x*.92-vUv.y*.36+V.x*.65)*34.),6.);
vec3 filmColor=spectrum(filmCoord*.6+V.x*.3+.2);
c+=vec3(1.,.92,.78)*(.035+idle*.085)*uFoil;
c+=spectrum(vUv.x+vUv.y+uTime*.025)*edge*(.08+idle*.10)*uFoil;
float filmStrength=(sunPrism*(.28+grazing*.4)+fineBands*(.04+grazing*.06))*uFoil;
c=mix(c,c*(.18+.82*filmColor)+filmColor*.06,clamp(filmStrength,0.,.46));
c+=filmColor*sunPrism*(.045+grazing*.1)*uFoil;
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
function TurnHand({ side, form }) {
  return (
    <span className={`ssr-turn-cue ssr-turn-cue-${side}`} aria-hidden="true">
      <span className="ssr-turn-hand">
        <svg viewBox="0 0 64 76" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 53c-6-6-10-12-10-17 0-4 3-7 7-7 3 0 5 2 7 5V13c0-5 3-8 8-8s8 3 8 8v16c2-3 5-4 8-3 4 1 6 4 6 8v11c0 9-4 15-11 20H28l-8-12Z" fill="#FFF4DF" stroke="#9D6980" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M26 63h20v8H26z" fill="#F4B9CF" stroke="#9D6980" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M29 14v-2m10 2v-2" stroke="#FFFDF7" strokeWidth="3" strokeLinecap="round"/>
          <path d="M17 38c2 0 4 2 6 5" stroke="#E6B5B9" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 56c4 1 8 0 11-3" stroke="#E6B5B9" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      <span className="ssr-turn-label"><b>{side === "left" ? "向左扭" : "向右扭"}</b><small>{form}</small></span>
    </span>
  );
}
function CanvasCard({ card, api, onFormChange }) {
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
        let shownForm = 0;
        api.current = {
          reset: () => {
            rotation.current = { x: 0, y: card.alternate ? .24 : 0, vx: 0, vy: 0, drag: null };
            shownForm = 0;
            onFormChange(0);
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
          const angle = Math.atan2(-Math.sin(root.rotation.y), Math.cos(root.rotation.y));
          uniforms.uAngle.value = angle;
          if (card.alternate && Math.abs(angle) < 1.2) {
            const nextForm = angle > .15 ? 1 : angle < -.15 ? 0 : shownForm;
            if (nextForm !== shownForm) {
              shownForm = nextForm;
              onFormChange(nextForm);
            }
          }
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
      aria-label={`${card.name} 3D卡片，可拖拽查看正反面${card.rarity === "SSR" ? "，向左或向右拖动可切换形态" : ""}`}
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
      {card.rarity === "SSR" && !status && (
        <div className="ssr-turn-cues">
          <TurnHand side="left" form={card.forms?.[1] || "另一形态"} />
          <TurnHand side="right" form={card.forms?.[0] || "初始形态"} />
        </div>
      )}
      {status ? <span className="canvas-loading">{status}</span> : null}
    </div>
  );
}
export default function CardViewer({ card, onClose }) {
  const api = useRef();
  const [activeForm, setActiveForm] = useState(0);
  return (
    <Modal
      title={`${card.name}卡片详情`}
      onClose={onClose}
      className={`card-modal floating-viewer rarity-${card.rarity}`}
    >
      <div className="floating-halo" aria-hidden="true" />
      <CanvasCard card={card} api={api} onFormChange={setActiveForm} />
      <section className="viewer-story" aria-label={`${card.name}的故事`}>
        <h3>{card.name}<span>{card.rarity}{card.forms ? ` · ${card.forms[activeForm]}` : ""}</span></h3>
        <p key={activeForm} tabIndex={0}>{card.formStories?.[activeForm] || card.story || card.tag}</p>
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
