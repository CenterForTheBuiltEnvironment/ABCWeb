import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "react-three-fiber";

function Model({ colors }) {
  const { nodes, materials } = useGLTF("humanbody.gltf");
  return (
    <group dispose={null}>
      {colors.map((obj, index) => {
        if (index == 0)
          return (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["Basemesh"].geometry}
              material={nodes["Basemesh"].material}
              key={index + 1}
            >
              <meshStandardMaterial color={colors[0]} />
            </mesh>
          );
        else {
          return (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["Basemesh_" + index.toString()].geometry}
              material={nodes["Basemesh_" + index.toString()].material}
              key={index + 10}
            >
              <meshStandardMaterial color={colors[index]} />
            </mesh>
          );
        }
      })}
    </group>
  );
}

export default function Canvass({ currentColorArray }) {
  return (
    <div
      style={{
        height: "50vh",
        width: "100%",
      }}
    >
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [0, 0, 150],
          fov: 50,
          zoom: 1.6,
        }}
        shadows
      >
        <ambientLight color="white" intensity={1} />
        <directionalLight color="white" intensity={3} position={[0, 1, 0]} />
        <directionalLight color="white" intensity={3} position={[0, 0, 1]} />
        <directionalLight color="white" intensity={3} position={[1, 0, 0]} />
        <directionalLight color="white" intensity={3} position={[0, 0, -1]} />
        <Suspense fallback={null}>
          <Stage intensity={1} shadows adjustCamera>
            <Model colors={currentColorArray} />
            <OrbitControls
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}
