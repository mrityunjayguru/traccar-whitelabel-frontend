import React from 'react';
import { Button, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { reportsActions, devicesActions } from '../../store';
import ReportFilter from './ReportFilter';

const ReportSidebar = ({ handleSubmit, handleSchedule, loading, multiDevice, includeGroups, children, className }) => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClear = () => {
    dispatch(reportsActions.updatePeriod('today'));
    dispatch(reportsActions.updateGroupIds([]));
    dispatch(devicesActions.selectId(null));
    dispatch(devicesActions.selectIds([]));
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-[#222427] rounded-2xl w-80 overflow-hidden border border-gray-100 dark:border-[#333333] h-full pb-10 ${className}`}>
      <div className="flex items-center gap-2 p-6 pb-2 shrink-0">
        <span className="font-medium! text-xl text-gray-800 dark:text-white flex-1">
          {t('reportTitle')}
        </span>
        <Button
          variant="contained"
          size="small"
          onClick={handleClear}
          className="bg-[#D9E821]! shadow-none! text-black! dark:text-white rounded-full! px-4! py-1! text-md! normal-case! font-medium! min-w-0! hover:bg-[#c6e300] dark:hover:bg-[#333333]!"
        >
          Clear
        </Button>
      </div>
      <div className="px-6 shrink-0">
        <div className="h-px w-full bg-gray-300 rounded-full mb-4" />
      </div>
      <div className="flex-1 overflow-y-auto px-6 no-scrollbar min-h-0">
        <ReportFilter
          handleSubmit={handleSubmit}
          handleSchedule={handleSchedule}
          loading={loading}
          multiDevice={multiDevice}
          includeGroups={includeGroups}
        >
          {children}
        </ReportFilter>
      </div>
    </div>
  );
};

export default ReportSidebar;
