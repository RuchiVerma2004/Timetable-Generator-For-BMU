import React from 'react';

const TimetableSettings = ({ settings, setSettings, generateTimeSlots }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Timetable Settings</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Class Timings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Hour</label>
              <input
                type="number"
                min="6"
                max="23"
                value={settings.classStartHour}
                onChange={(e) => setSettings({ ...settings, classStartHour: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Minute</label>
              <input
                type="number"
                min="0"
                max="59"
                step="15"
                value={settings.classStartMinute}
                onChange={(e) => setSettings({ ...settings, classStartMinute: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Hour</label>
              <input
                type="number"
                min="6"
                max="23"
                value={settings.classEndHour}
                onChange={(e) => setSettings({ ...settings, classEndHour: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Minute</label>
              <input
                type="number"
                min="0"
                max="59"
                step="15"
                value={settings.classEndMinute}
                onChange={(e) => setSettings({ ...settings, classEndMinute: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slot Duration (minutes)</label>
            <select
              value={settings.slotDurationMinutes}
              onChange={(e) => setSettings({ ...settings, slotDurationMinutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={45}>45 minutes</option>
              <option value={50}>50 minutes</option>
              <option value={60}>1 hour</option>
              <option value={75}>1 hour 15 minutes</option>
              <option value={90}>1 hour 30 minutes</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Lunch Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lunch Start</label>
              <select
                value={settings.lunchStartHour}
                onChange={(e) => setSettings({ ...settings, lunchStartHour: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={12}>12:00 PM</option>
                <option value={13}>1:00 PM</option>
                <option value={14}>2:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lunch End</label>
              <select
                value={settings.lunchEndHour}
                onChange={(e) => setSettings({ ...settings, lunchEndHour: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={14}>2:00 PM</option>
                <option value={15}>3:00 PM</option>
                <option value={16}>4:00 PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration</label>
            <select
              value={settings.lunchDuration}
              onChange={(e) => setSettings({ ...settings, lunchDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.wednesdayHalfDay}
              onChange={(e) => setSettings({ ...settings, wednesdayHalfDay: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Wednesday Half Day</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Preview:</strong> Classes from {String(settings.classStartHour).padStart(2, '0')}:{String(settings.classStartMinute).padStart(2, '0')}
          to {String(settings.classEndHour).padStart(2, '0')}:{String(settings.classEndMinute).padStart(2, '0')}
          with {settings.slotDurationMinutes} minute slots ({generateTimeSlots.length} slots per day)
        </p>
      </div>
    </div>
  );
};

export default TimetableSettings;
