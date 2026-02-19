import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

function CameraParallax() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    mouse.current.x += (target.current.x * 0.35 - mouse.current.x) * 0.04;
    mouse.current.y += (target.current.y * 0.2 - mouse.current.y) * 0.04;
    camera.position.x = mouse.current.x;
    camera.position.y = mouse.current.y;
    camera.position.z = 4.5;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function FloatingShape({
  position,
  scale = 1,
  color,
  speed = 1,
  shape = "sphere",
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  speed?: number;
  shape?: "sphere" | "torus" | "box";
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3 * speed;
      ref.current.rotation.x += delta * 0.15 * speed;
    }
  });

  const common = { ref, position };
  if (shape === "torus") {
    return (
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <Torus args={[0.4 * scale, 0.15 * scale, 16, 32]} scale={scale} {...common}>
          <meshStandardMaterial color={color} wireframe roughness={0.8} metalness={0.2} />
        </Torus>
      </Float>
    );
  }
  if (shape === "box") {
    return (
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh scale={scale} {...common}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color={color} wireframe roughness={0.8} metalness={0.2} />
        </mesh>
      </Float>
    );
  }
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
      <Sphere ref={ref} args={[0.5 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={1.5 * speed}
          roughness={0.4}
          metalness={0.3}
        />
      </Sphere>
    </Float>
  );
}

export function Scene() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2("#0c0e12", 0.06);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <CameraParallax />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, -5, 5]} intensity={0.6} color="#ffaa66" />
      <pointLight position={[5, 10, -5]} intensity={0.4} color="#66aaff" />

      {/* Scattered shapes: spheres, torus, box (enlarged) */}
      <FloatingShape position={[-4, 2, -2]} scale={0.62} color="#e8b86d" speed={0.8} shape="sphere" />
      <FloatingShape position={[-3.2, -1.8, -3.5]} scale={0.54} color="#6bb5c4" speed={1} shape="torus" />
      <FloatingShape position={[-2, 2.5, -1.8]} scale={0.47} color="#c46b9e" speed={1.2} shape="box" />
      <FloatingShape position={[4, 1.2, -2.5]} scale={0.7} color="#7bc46b" speed={0.7} shape="sphere" />
      <FloatingShape position={[3.5, -2, -3.2]} scale={0.62} color="#b86be8" speed={0.9} shape="torus" />
      <FloatingShape position={[0, 2.2, -3.8]} scale={0.5} color="#e8b86d" speed={0.85} shape="sphere" />
      <FloatingShape position={[0, -2.4, -2.2]} scale={0.59} color="#6bb5c4" speed={1.1} shape="torus" />
      <FloatingShape position={[-3.8, 0, -3]} scale={0.65} color="#c46b9e" speed={0.95} shape="box" />
      <FloatingShape position={[3.8, -0.5, -2.8]} scale={0.56} color="#7bc46b" speed={0.75} shape="sphere" />
      <FloatingShape position={[-1.5, 1, -4]} scale={0.44} color="#b86be8" speed={1} shape="torus" />
      <FloatingShape position={[2, 1.8, -1.6]} scale={0.78} color="#e8b86d" speed={0.8} shape="sphere" />
      <FloatingShape position={[-2.5, -2.2, -2.4]} scale={0.53} color="#6bb5c4" speed={1.05} shape="box" />
      <FloatingShape position={[1.2, -1.2, -3.6]} scale={0.47} color="#c46b9e" speed={0.9} shape="torus" />
    </>
  );
}
