import React from 'react';
import { Divider, List, useMediaQuery, useTheme } from '@mui/material';
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
    { title: t('reportChart'), link: '/reports/chart', icon: <InsertChartRoundedIcon /> },
    { title: t('reportReplay'), link: '/replay', icon: <RouteIcon /> },
  ];
  return (
    <>
      <List>
        <MenuItem
          title={t('reportCombined')}
          link="/reports/combined"
          icon={<StarIcon />}
          selected={location.pathname === '/reports/combined'}
        />
        <MenuItem
          title={t('reportRoute')}
          link="/reports/route"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/route'}
        />
        <MenuItem
          title={t('reportEvents')}
          link="/reports/event"
          icon={<NotificationsActiveIcon />}
          selected={location.pathname === '/reports/event'}
        />
        <MenuItem
          title={t('reportTrips')}
          link="/reports/trip"
          icon={<PlayCircleFilledIcon />}
          selected={location.pathname === '/reports/trip'}
        />
        <MenuItem
          title={t('reportStops')}
          link="/reports/stop"
          icon={<PauseCircleFilledIcon />}
          selected={location.pathname === '/reports/stop'}
        />

      <MenuItem
          title={"Summary L"}
          link="/reports/summarylivi"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/summarylivi'}
        />



      <MenuItem
          title={"Consolidated Summary"}
          link="/reports/ConsolidatedSummary"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/ConsolidatedSummary'}
        />


      <MenuItem
          title={"Mobilization "}
          link="/reports/Mobilization"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/Mobilization'}
        />


    
<MenuItem
          title={"Summary + Position"}
          link="/reports/SummaryPosition"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/SummaryPosition'}
        />
        <MenuItem
          title={t('reportSummary')}
          link="/reports/summary"
          icon={<FormatListBulletedIcon />}
          selected={location.pathname === '/reports/summary'}
        />

{/*
  <MenuItem
    title='Travel'
    link="/reports/travel"
    icon={<FormatListBulletedIcon />}
    selected={location.pathname === '/reports/travel'}
  />

  <MenuItem
    title='Alert'
    link="/reports/alert"
    icon={<FormatListBulletedIcon />}
    selected={location.pathname === '/reports/alert'}
  />

  <MenuItem
    title='Distance'
    link="/reports/distance"
    icon={<FormatListBulletedIcon />}
    selected={location.pathname === '/reports/distance'}
  />
*/}


  const secondaryItems = [
    { title: t('sharedLogs'), link: '/reports/logs', icon: <NotesIcon /> },
    ...(!readonly ? [{ title: t('reportScheduled'), link: '/reports/scheduled', icon: <EventRepeatIcon /> }] : []),
    ...(admin ? [{ title: t('statisticsTitle'), link: '/reports/statistics', icon: <BarChartIcon /> }] : []),
  ];

  if (desktop) {
    return (
      <div className="flex flex-row items-center bg-white dark:bg-[#222427] rounded-full  mx-1 my-1 px-2 py-1 shadow-md overflow-x-auto no-scrollbar border border-gray-100 w-fit dark:border-[#333]">
        {menuItems.map((item) => (
          <MenuItem
            key={item.link}
            title={item.title}
            link={item.link}
            icon={item.icon}
            selected={location.pathname === item.link}
            className={`w-auto rounded-full!  transition-all ${location.pathname === item.link ? 'bg-[#D9E821]! dark:bg-[#D9E821]/10 dark:text-white text-black! shadow-sm ' : 'text-gray-800! hover:bg-gray-100  dark:hover:bg-gray-500 dark:text-white!'}`}
            iconClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white'}`}
            textClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white'}`}
          />
        ))}
        <div className="h-8 w-[2px] bg-[#D9E821]  mx-4 self-center rounded-full opacity-60" />
        {secondaryItems.map((item) => (
          <MenuItem
            key={item.link}
            title={item.title}
            link={item.link}
            icon={item.icon}
            selected={location.pathname === item.link}
            className={`w-auto rounded-full!  transition-all ${location.pathname === item.link ? 'bg-[#D9E821]! dark:bg-[#D9E821]/10 dark:text-white text-black! shadow-sm' : 'text-gray-800! hover:bg-gray-50!'}`}
            iconClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white'}`}
            textClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white'}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <List className="py-0!">
        {menuItems.map((item) => (
          <MenuItem
            key={item.link}
            title={item.title}
            link={item.link}
            icon={item.icon}
            selected={location.pathname === item.link}
            className={`px-6 py-3! ${location.pathname === item.link ? 'bg-[#D9E821]/10 dark:text-white text-black! border-r-4 border-[#D9E821]' : 'text-gray-800!'}`}
            iconClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white'}`}
          />
        ))}
      </List>
      <Divider className="my-2!" />
      <List className="py-0!">
        {secondaryItems.map((item) => (
          <MenuItem
            key={item.link}
            title={item.title}
            link={item.link}
            icon={item.icon}
            selected={location.pathname === item.link}
            className={`px-6 py-3! ${location.pathname === item.link ? 'bg-[#D9E821]/10 dark:text-white text-black! border-r-4 border-[#D9E821]' : 'text-gray-500!'}`}
            iconClassName={`${location.pathname === item.link ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white'}`}
          />
        ))}
      </List>
    </div>
  );
};

export default ReportsMenu;
