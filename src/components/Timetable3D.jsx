import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

// Color palette for different courses
const courseColors = [
  '#4ade80', '#22c55e', '#16a34a', '#15803d',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6',
  '#f59e0b', '#d97706', '#b45309', '#92400e',
  '#ef4444', '#dc2626', '#b91c1c', '#991b1b'
];

// Single 3D block component
const SlotBlock = ({ course, color, onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += hovered ? 0.01 : 0.003;
      const scale = hovered ? 1.3 : 1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    if (onHover) onHover(course, true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (onHover) onHover(course, false);
  };

  return (
    <>
      <mesh
        ref={meshRef}
        position={[course.x, course.y, course.z]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.5, 0.5, 0.3]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : color} 
          emissive={hovered ? "#333333" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      {/* HTML overlay for course name */}
      <Html position={[course.x, course.y + 0.5, course.z]}>
        <div
          style={{
            color: "white",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "11px",
            textAlign: "center",
            minWidth: "60px",
            border: hovered ? "2px solid white" : "1px solid rgba(255,255,255,0.3)"
          }}
        >
          {course.courseName || course.course}
        </div>
      </Html>
    </>
  );
};

const Timetable3D = ({ timetableData, selectedBatch, onCourseHover }) => {
  const [hoveredCourse, setHoveredCourse] = useState(null);

  // Process timetable data for 3D visualization
  const processedData = useMemo(() => {
    if (!timetableData || !timetableData.schedules) return [];

    const schedule = selectedBatch 
      ? timetableData.schedules[selectedBatch] 
      : Object.values(timetableData.schedules)[0];

    if (!schedule || !schedule.classes) return [];

    // Group classes by day and time
    const dayMap = {
      'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4
    };

    const timeMap = {
      '9:00-10:00': 0, '10:00-11:00': 1, '11:00-12:00': 2,
      '13:00-14:00': 3, '14:00-15:00': 4, '15:00-16:00': 5, '16:00-17:00': 6
    };

    return schedule.classes.map((cls, index) => {
      const dayIndex = dayMap[cls.day] || 0;
      const timeIndex = timeMap[cls.time] || 0;
      
      return {
        id: cls.id,
        course: cls.courseCode,
        courseName: cls.courseName,
        day: cls.day,
        time: cls.time,
        professor: cls.professor?.name,
        room: cls.room?.name,
        x: dayIndex * 2 - 4,
        y: timeIndex * 0.8 + 1,
        z: 0,
        color: courseColors[index % courseColors.length]
      };
    });
  }, [timetableData, selectedBatch]);

  const handleCourseHover = (course, isHovered) => {
    setHoveredCourse(isHovered ? course : null);
    if (onCourseHover) onCourseHover(course, isHovered);
  };

  return (
    <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
        
        {/* Grid lines for better visualization */}
        <gridHelper args={[20, 20, '#666666', '#333333']} />
        
        {/* Course blocks */}
        {processedData.map((item) => (
          <SlotBlock 
            key={item.id} 
            course={item} 
            color={item.color}
            onHover={handleCourseHover}
          />
        ))}
        
        {/* Day labels */}
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
          <Html key={day} position={[index * 2 - 4, -0.5, 0]}>
            <div className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
              {day}
            </div>
          </Html>
        ))}
        
        {/* Time labels */}
        {['9:00', '10:00', '11:00', '1:00', '2:00', '3:00', '4:00'].map((time, index) => (
          <Html key={time} position={[-6, index * 0.8 + 1, 0]}>
            <div className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
              {time}
            </div>
          </Html>
        ))}
      </Canvas>
      
      {/* Course details overlay */}
      {hoveredCourse && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-semibold text-gray-900">{hoveredCourse.courseName}</h4>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><strong>Day:</strong> {hoveredCourse.day}</p>
            <p><strong>Time:</strong> {hoveredCourse.time}</p>
            {hoveredCourse.professor && <p><strong>Professor:</strong> {hoveredCourse.professor}</p>}
            {hoveredCourse.room && <p><strong>Room:</strong> {hoveredCourse.room}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable3D;
