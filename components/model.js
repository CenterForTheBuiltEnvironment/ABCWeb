import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "react-three-fiber";

function Model({ colors }) {
  const { nodes, materials } = useGLTF("humanbody.gltf");
  
  return (
    <group dispose={null}>
      {colors.map((obj, nodeIndex) => {
        // console.log("nodeIndex", nodeIndex);
        // console.log("nodes", nodes);
        // console.log("colors", colors);
        if (nodeIndex == 0)
          return (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["Basemesh"].geometry}
              material={nodes["Basemesh"].material}
              key={nodeIndex+1}
            >
              <meshStandardMaterial color={colors[1]} />
            </mesh>
          );
        else {
          return (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["Basemesh_" + nodeIndex.toString()].geometry}
              material={nodes["Basemesh_" + nodeIndex.toString()].material}
              key={nodeIndex + 10}
            >
              <meshStandardMaterial color={colors[nodeIndex]} />
            </mesh>
          );
        }
      })}
    {/* [Aki - Temporal] Append colors[0] (face in segment data) to 
    Basemesh_3,4,5 (face in node) as the number of node's array is weird.
    
    It seems that the number of manikin's segments is 18 not 16 because the Head segment
    subdevides into (1) Face, (2) Back of the head, and (3) Neck.
    This makes the code unreasonable but need more time to fix the issues including the manikin data (humanbody.gltf) and index.js.
    Temporal fix has been made for now.*/}
    <mesh
      castShadow
      receiveShadow
      geometry={nodes["Basemesh_4"].geometry}
      material={nodes["Basemesh_4"].material}
      key={"Basemesh_4"}
    >
      <meshStandardMaterial color={colors[0]} />
    </mesh>
    <mesh
      castShadow
      receiveShadow
      geometry={nodes["Basemesh_5"].geometry}
      material={nodes["Basemesh_5"].material}
      key={"Basemesh_5"}
    >
      <meshStandardMaterial color={colors[0]} />
    </mesh>
    <mesh
      castShadow
      receiveShadow
      geometry={nodes["Basemesh_3"].geometry}
      material={nodes["Basemesh_3"].material}
      key={"Basemesh_3"}
    >
      <meshStandardMaterial color={colors[0]} />
    </mesh>
    </group>
  );
}

export default function Canvass({ currentColorArray }) {
  // console.log("currentColorArray", currentColorArray);
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
