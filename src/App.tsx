import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { UI } from "./components/UI";
import "./App.css";

function Fallback() {
  return null;
}

function App() {
  return (
    <div className="app">
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#0c0e12"]} />
          <Suspense fallback={<Fallback />}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <UI />
    </div>
  );
}

export default App;
