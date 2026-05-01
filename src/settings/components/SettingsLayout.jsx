import React from 'react';
import PageLayout from '../../common/components/PageLayout';
import SettingsMenu from './SettingsMenu';

const SettingsLayout = ({
  breadcrumbs,
  children,
}) => {
  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      hideToolbar
    >
      <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#222427] overflow-hidden">
        <div className="shrink-0 mt-3 px-3">
          <SettingsMenu />
        </div>
        <div className="flex flex-1 min-h-0 overflow-hidden gap-4 pt-3 pb-3 px-3 md:pr-10 md:pl-3">
          <div className="flex-1 min-h-0">
            <div className="bg-white dark:bg-[#222427] rounded-2xl shadow-md h-full flex flex-col overflow-y-auto overflow-x-hidden border border-gray-100 no-scrollbar dark:border-[#333]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsLayout;
