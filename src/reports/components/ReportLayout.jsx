import React from 'react';
import PageLayout from '../../common/components/PageLayout';
import ReportsMenu from './ReportsMenu';
import ReportSidebar from './ReportSidebar';

const ReportLayout = ({
  breadcrumbs,
  handleSubmit,
  handleSchedule,
  loading,
  multiDevice,
  includeGroups,
  children,
  filterExtension,
  fullWidth = false,
  showExportButton = false,
}) => {
  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      hideToolbar
    >
      <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#222427] overflow-hidden">
        <div className="shrink-0 p-4 pb-0">
          <ReportsMenu />
        </div>
        <div className="flex flex-1 min-h-0 overflow-hidden gap-4 p-4 pt-3">
          {!fullWidth && (
            <ReportSidebar
              handleSubmit={handleSubmit}
              handleSchedule={handleSchedule}
              loading={loading}
              multiDevice={multiDevice}
              includeGroups={includeGroups}
              showExportButton={showExportButton}
              className="m-0! shadow-lg"
            >
              {filterExtension}
            </ReportSidebar>
          )}
          <div className="flex-1 min-h-0">
            <div className="bg-white dark:bg-[#222427] rounded-2xl shadow-md flex flex-col h-full overflow-hidden border border-gray-100 no-scrollbar dark:border-[#333]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportLayout;
