import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Mock timetable data
const mockTimetable = [
  { id: 1, course: "CSE101", day: "Monday", slot: "9:00-10:00", x: -3, y: 1, z: 0 },
  { id: 2, course: "CSE102", day: "Monday", slot: "10:00-11:00", x: -1, y: 1, z: 0 },
  { id: 3, course: "MAT201", day: "Tuesday", slot: "9:00-10:00", x: 1, y: 1, z: 0 },
  { id: 4, course: "PHY101", day: "Wednesday", slot: "11:00-12:00", x: 3, y: 1, z: 0 },
];

// Single 3D block component
const SlotBlock = ({ course }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        position={[course.x, course.y, course.z]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 0.5, 0.3]} />
        <meshStandardMaterial color={hovered ? "#22c55e" : "#4ade80"} />
      </mesh>
      {/* HTML overlay for course name */}
      <Html position={[course.x, course.y + 0.5, course.z]}>
        <div
          style={{
            color: "white",
            background: "rgba(0,0,0,0.5)",
            padding: "2px 5px",
            borderRadius: "4px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {course.course}
        </div>
      </Html>
    </>
  );
};

// Html from drei
import { Html } from "@react-three/drei";

const Timetable3D = () => {
  return (
    <div className="w-full h-96 border border-gray-300 rounded">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <OrbitControls />
        {mockTimetable.map((item) => (
          <SlotBlock key={item.id} course={item} />
        ))}
      </Canvas>
    </div>
  );
};

export default Timetable3D;
