import TabNavigation from "../common/TabNavigation";
import ExcelUpload from "../ExcelUpload";
import TimetableGenerator from "../TimetableGenerator";
import TimetableViewer from "../TimetableViewer";

const MainContent = ({ activeTab, setActiveTab, uploadedData, setUploadedData, generatedTimetable, setGeneratedTimetable }) => {
  const tabs = ["overview", "upload", "generate", "view", "conflicts", "reports"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "upload":
        return <ExcelUpload onDataUploaded={setUploadedData} />;
      case "generate":
        return uploadedData ? (
          <TimetableGenerator data={uploadedData} onTimetableGenerated={setGeneratedTimetable} />
        ) : (
          <div className="text-center py-8 text-gray-600">
            Please upload data first to generate timetable
          </div>
        );
      case "view":
        return generatedTimetable ? (
          <TimetableViewer timetableData={generatedTimetable} />
        ) : (
          <div className="text-center py-8 text-gray-600">
            No timetable generated yet
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-gray-600">
            Select an action from the tabs above
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default MainContent;