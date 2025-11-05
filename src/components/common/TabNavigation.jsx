const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-4 px-2 font-medium ${
            activeTab === tab
              ? "text-blue-800 border-b-2 border-blue-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;