import React from 'react';

const DistributionStats = ({ distributionStats }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Section Distribution Statistics</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Section</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Lectures</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Labs</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Total Slots</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Balance Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(distributionStats).map(section => (
              <tr key={section} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">{section.replace(/_/g, ' ')}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{distributionStats[section].lectures}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{distributionStats[section].labs}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{distributionStats[section].total}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    Math.abs(distributionStats[section].total - Object.values(distributionStats)[0].total) <= 2
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {Math.abs(distributionStats[section].total - Object.values(distributionStats)[0].total) <= 2
                      ? 'Balanced'
                      : 'Needs Adjustment'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The system attempts to distribute workload equally across all sections.
          Labs count as 2 slots since they typically require double periods.
        </p>
      </div>
    </div>
  );
};

export default DistributionStats;
