import React from 'react';
import { Users, MapPin, BookOpen } from 'lucide-react';

export default function ConflictList({ filteredConflicts }) {
  if (!filteredConflicts) return null;

  const list = filteredConflicts.allConflicts || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Conflict List</h2>
      <div className="space-y-4">
        {list.map((conflict, index) => (
          <div key={conflict.id || index} className={`border rounded-lg p-4 ${
            conflict.type === 'professor' ? 'border-red-300 bg-red-50' :
            conflict.type === 'room' ? 'border-orange-300 bg-orange-50' :
            'border-yellow-300 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {conflict.type === 'professor' && <Users className="w-5 h-5 text-red-600" />}
              {conflict.type === 'room' && <MapPin className="w-5 h-5 text-orange-600" />}
              {conflict.type === 'student' && <BookOpen className="w-5 h-5 text-yellow-600" />}
              <span className="font-semibold text-gray-800">
                {conflict.type === 'professor' && `Professor: ${conflict.professor}`}
                {conflict.type === 'room' && `Room: ${conflict.room}`}
                {conflict.type === 'student' && `Course: ${conflict.course}`}
              </span>
              <span className="text-sm text-gray-600">{conflict.day} at {conflict.timeSlot}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">{conflict.id}</span>
            </div>
            <div className="text-sm text-gray-700 mb-2"><strong>Description:</strong> {conflict.description}</div>
            <div className="text-sm text-gray-700"><strong>Conflicting Entries ({conflict.conflictCount}):</strong>
              <ul className="list-disc list-inside mt-1">
                {conflict.conflictingEntries.map((entry, i) => (
                  <li key={i} className="font-mono text-xs">[{i+1}] {entry.timetable} - {entry.sheet} - {entry.course}{entry.teacher ? ` (${entry.teacher})` : ''}{entry.room ? ` in ${entry.room}` : ''}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
