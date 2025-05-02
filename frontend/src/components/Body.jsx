import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ scale }) {
  const { scene } = useGLTF("src/assets/world_map_static.glb");

  useEffect(() => {
    console.log(scene); // Inspect the scene and its materials
  }, [scene]);

  return <primitive object={scene} scale={scale} />;
}

function Body() {
  const controlsRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-green-100">
      <Canvas
        style={{ height: isMobile ? "780px" : "450px", width: "100%" }}
        camera={{ position: [0, 0, 4], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} />
        <Suspense fallback={null}>
          <Model scale={isMobile ? 0.35 : 0.5} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          autoRotate
          autoRotateSpeed={1.0}
        />
      </Canvas>
    </div>
  );
}

export default Body;
