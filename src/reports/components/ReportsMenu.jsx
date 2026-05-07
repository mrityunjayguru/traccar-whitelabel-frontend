import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import ListIcon from '@mui/icons-material/List';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RouteIcon from '@mui/icons-material/Route';
import NotesIcon from '@mui/icons-material/Notes';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAdministrator, useRestriction } from '../../common/util/permissions';
import MenuItem from '../../common/components/MenuItem';
import ForkRightRoundedIcon from '@mui/icons-material/ForkRightRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ModeOfTravelRoundedIcon from '@mui/icons-material/ModeOfTravelRounded';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';

const ReportsMenu = () => {
  const t = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const admin = useAdministrator();
  const readonly = useRestriction('readonly');

  const menuItems = [
    { title: t('reportCombined'), link: '/reports/combined', icon: <CategoryIcon /> },
    { title: t('reportRoute'), link: '/reports/route', icon: <ForkRightRoundedIcon /> },
    { title: t('reportEvents'), link: '/reports/event', icon: <EventAvailableRoundedIcon /> },
    { title: t('reportTrips'), link: '/reports/trip', icon: <ModeOfTravelRoundedIcon /> },
    { title: t('reportStops'), link: '/reports/stop', icon: <FmdGoodRoundedIcon /> },
    { title: t('reportSummary'), link: '/reports/summary', icon: <ListIcon /> },
    { title: "Summary Livi", link: '/reports/summarylivi', icon: <PlayArrowIcon /> },
    { title: "Consolidated Summary", link: '/reports/ConsolidatedSummary', icon: <ShowChartIcon /> },
    { title: "Mobilization", link: '/reports/Mobilization', icon: <StopIcon /> },
    { title: "Summary Position", link: '/reports/SummaryPosition', icon: <TimelineIcon /> },
    { title: t('reportChart'), link: '/reports/chart', icon: <InsertChartRoundedIcon /> },
    { title: t('reportReplay'), link: '/replay', icon: <RouteIcon /> },
    
  ];

  const secondaryItems = [
    { title: t('sharedLogs'), link: '/reports/logs', icon: <NotesIcon /> },
    ...(!readonly ? [{ title: t('reportScheduled'), link: '/reports/scheduled', icon: <EventRepeatIcon /> }] : []),
    ...(admin ? [{ title: t('statisticsTitle'), link: '/reports/statistics', icon: <BarChartIcon /> }] : []),
  ];

  return (
    <div className="flex flex-col gap-1 ">
      <div className="flex flex-row items-center  bg-white! dark:bg-[#222427]! rounded-full mx-1 px-1 py-2 shadow-md overflow-x-auto no-scrollbar border border-gray-100! w-fit dark:border-[#333]!">
        {menuItems.map((item) => (
          <MenuItem
            key={item.link}
            title={item.title}
            link={item.link}
            icon={item.icon}
            selected={location.pathname === item.link}
            className={`w-auto rounded-full! transition-all shrink-0 ${location.pathname === item.link ? 'bg-[#D9E821]! dark:bg-[#D9E821]! dark:text-white! text-black! shadow-sm ' : 'text-gray-800! hover:bg-gray-100!  dark:hover:bg-gray-500! dark:text-white!'}`}
            iconClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white!'}`}
            textClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white!'}`}
          />
        ))}
      </div>
      {secondaryItems.length > 0 && (
        <div className="flex flex-row items-center bg-white dark:bg-[#222427] rounded-full mx-1 px-2 py-2 shadow-md overflow-x-auto no-scrollbar border border-gray-100 w-fit dark:border-[#333]">
          {secondaryItems.map((item) => (
            <MenuItem
              key={item.link}
              title={item.title}
              link={item.link}
              icon={item.icon}
              selected={location.pathname === item.link}
              className={`w-auto rounded-full! transition-all shrink-0 ${location.pathname === item.link ? 'bg-[#D9E821]! dark:bg-[#D9E821]! dark:text-white! text-black! shadow-sm ' : 'text-gray-800! hover:bg-gray-100!  dark:hover:bg-gray-500! dark:text-white!'}`}
              iconClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white!'}`}
              textClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white!'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsMenu;
