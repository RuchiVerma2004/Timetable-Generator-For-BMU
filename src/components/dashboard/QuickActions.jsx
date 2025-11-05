import { Upload, BarChart3 } from "lucide-react";

const QuickActions = ({ onTabChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-blue-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={() => onTabChange('upload')}
          className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Upload size={18} className="text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Upload Excel Data</p>
              <p className="text-sm text-blue-600">Upload course, professor, and room data</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onTabChange('reports')}
          className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <BarChart3 size={18} className="text-purple-600" />
            <div>
              <p className="font-medium text-purple-800">View Reports</p>
              <p className="text-sm text-purple-600">System analytics and statistics</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;