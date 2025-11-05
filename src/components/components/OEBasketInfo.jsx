import React from 'react';

const OEBasketInfo = ({ oeBasketInfo, showOeInfo, setShowOeInfo }) => {
  const renderBasketSection = (basket, basketName, color) => {
    const basketData = basketName === 'OE-Basket 1' ? oeBasketInfo.oe1 : oeBasketInfo.oe2;
    
    return (
      <div className={`border border-${color}-200 rounded-lg overflow-hidden`}>
        <div className={`bg-${color}-50 px-6 py-4`}>
          <h3 className={`text-xl font-semibold text-${color}-800`}>{basketName} Schedule</h3>
        </div>
        <div className="p-6">
          {basketData.length > 0 ? (
            <div className="space-y-4">
              {basketData.map((basket, index) => (
                <div key={index} className={`border border-${color}-100 rounded-lg p-4 bg-${color}-50`}>
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`bg-${color}-600 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {basket.day} {basket.time}
                    </span>
                    <span className={`text-${color}-700 font-medium`}>
                      Batch: {basket.batch}, Semester: {basket.semester}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {basket.courses.map((course, courseIndex) => (
                      <div key={courseIndex} className={`bg-white rounded-lg p-3 border border-${color}-200`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-semibold text-${color}-800`}>{course.courseTitle}</h4>
                            <p className="text-sm text-gray-600">Code: {course.courseCode}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Prof: {course.professor}</p>
                            <p className="text-sm text-gray-600">Room: {course.room}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs bg-${color}-100 text-${color}-800 px-2 py-1 rounded`}>
                            Sections: {course.sections.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No {basketName} courses scheduled</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Open Elective Basket Information</h2>
        <button
          onClick={() => setShowOeInfo(!showOeInfo)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {showOeInfo ? 'Hide' : 'Show'} OE Basket Details
        </button>
      </div>

      {showOeInfo && (
        <div className="space-y-6">
          {renderBasketSection(oeBasketInfo.oe1, 'OE-Basket 1', 'green')}
          {renderBasketSection(oeBasketInfo.oe2, 'OE-Basket 2', 'blue')}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">How OE Baskets Work:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>OE Basket 1</strong>: All sections have the same time slot on Monday</li>
              <li>• <strong>OE Basket 2</strong>: All sections have the same time slot on Tuesday</li>
              <li>• Students from all sections choose one course from each basket</li>
              <li>• Different sections get different courses from the basket</li>
              <li>• Each course has different professors and rooms</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OEBasketInfo;
