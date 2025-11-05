const RecentActivities = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-blue-900 mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              activity.type === "success"
                ? "bg-green-50"
                : activity.type === "warning"
                ? "bg-yellow-50"
                : "bg-blue-50"
            }`}
          >
            <p className="font-medium text-gray-900">{activity.action}</p>
            <p className="text-sm text-gray-600">By {activity.user}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;