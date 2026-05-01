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
}) => {
  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      hideToolbar
    >
      <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#222427] overflow-hidden">
        <div className="shrink-0 mt-3">
          <ReportsMenu />
        </div>
        <div className="flex flex-1 min-h-0 overflow-hidden gap-4 pt-3">
          {!fullWidth && (
            <ReportSidebar
              handleSubmit={handleSubmit}
              handleSchedule={handleSchedule}
              loading={loading}
              multiDevice={multiDevice}
              includeGroups={includeGroups}
              className="m-0! h-[calc(100vh-120px)] shadow-lg"
            >
              {filterExtension}
            </ReportSidebar>
          )}
          <div className="flex-1 min-h-0 pr-10">
            <div className="bg-white dark:bg-[#222427] rounded-2xl shadow-md h-[calc(100vh-120px)] flex flex-col overflow-hidden border border-gray-100 no-scrollbar dark:border-[#333]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportLayout;
