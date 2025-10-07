// src/components/Sidebar.jsx
import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">UniTimetable</h1>
      <a href="#" className="mb-2 hover:bg-gray-700 p-2 rounded">Dashboard</a>
      <a href="#" className="mb-2 hover:bg-gray-700 p-2 rounded">Timetable</a>
      <a href="#" className="mb-2 hover:bg-gray-700 p-2 rounded">Events</a>
      <a href="#" className="mb-2 hover:bg-gray-700 p-2 rounded">Reports</a>
    </div>
  );
};

export default Sidebar;
