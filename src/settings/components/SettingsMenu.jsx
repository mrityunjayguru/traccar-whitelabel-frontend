import React from 'react';
import { Divider, List, useMediaQuery, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CreateIcon from '@mui/icons-material/Create';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import PublishIcon from '@mui/icons-material/Publish';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HelpIcon from '@mui/icons-material/Help';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';
import MenuItem from '../../common/components/MenuItem';

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const manager = useManager();
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);

  const features = useFeatures();

  const menuItems = [
    { title: t('sharedPreferences'), link: '/settings/preferences', icon: <SettingsIcon />, selected: location.pathname === '/settings/preferences' },
    ...(!readonly ? [
      { title: t('sharedNotifications'), link: '/settings/notifications', icon: <NotificationsIcon />, selected: location.pathname.startsWith('/settings/notification') },
      { title: t('settingsUser'), link: `/settings/user/${userId}`, icon: <PersonIcon />, selected: location.pathname === `/settings/user/${userId}` },
      { title: t('deviceTitle'), link: '/settings/devices', icon: <SmartphoneIcon />, selected: location.pathname.startsWith('/settings/device') },
      { title: t('sharedGeofences'), link: '/geofences', icon: <CreateIcon />, selected: location.pathname.startsWith('/settings/geofence') },
      ...(!features.disableGroups ? [{ title: t('settingsGroups'), link: '/settings/groups', icon: <FolderIcon />, selected: location.pathname.startsWith('/settings/group') }] : []),
      ...(!features.disableDrivers ? [{ title: t('sharedDrivers'), link: '/settings/drivers', icon: <PersonIcon />, selected: location.pathname.startsWith('/settings/driver') }] : []),
      ...(!features.disableCalendars ? [{ title: t('sharedCalendars'), link: '/settings/calendars', icon: <TodayIcon />, selected: location.pathname.startsWith('/settings/calendar') }] : []),
      ...(!features.disableComputedAttributes ? [{ title: t('sharedComputedAttributes'), link: '/settings/attributes', icon: <StorageIcon />, selected: location.pathname.startsWith('/settings/attribute') }] : []),
      ...(!features.disableMaintenance ? [{ title: t('sharedMaintenance'), link: '/settings/maintenances', icon: <BuildIcon />, selected: location.pathname.startsWith('/settings/maintenance') }] : []),
      ...(!features.disableSavedCommands ? [{ title: t('sharedSavedCommands'), link: '/settings/commands', icon: <PublishIcon />, selected: location.pathname.startsWith('/settings/command') }] : []),
      ...(supportLink ? [{ title: t('settingsSupport'), link: supportLink, icon: <HelpIcon />, selected: false }] : []),
    ] : []),
  ];

  const managerItems = manager ? [
    { title: t('serverAnnouncement'), link: '/settings/announcement', icon: <CampaignIcon />, selected: location.pathname === '/settings/announcement' },
    ...(admin ? [{ title: t('settingsServer'), link: '/settings/server', icon: <StorageIcon />, selected: location.pathname === '/settings/server' }] : []),
    { title: t('settingsUsers'), link: '/settings/users', icon: <PeopleIcon />, selected: location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}` },
  ] : [];

  const allItems = [...menuItems, ...managerItems];
  const splitIndex = allItems.length > 3 ? allItems.length - 3 : allItems.length;
  const topItems = allItems.slice(0, splitIndex);
  const bottomItems = allItems.slice(splitIndex);

  return (
    <>
      <div className="flex flex-col bg-white dark:bg-[#222427] rounded-full mx-1 my-1 px-3 py-1 shadow-md border border-gray-100 w-fit dark:border-[#333]">
        <div className="flex flex-wrap items-center">
          {topItems.map((item) => (
            <MenuItem
              key={item.link}
              title={item.title}
              link={item.link}
              icon={item.icon}
              selected={item.selected}
              className={`w-auto! rounded-full! transition-all ${item.selected ? 'bg-[#D9E821]! dark:bg-[#D9E821]! dark:text-white text-black! shadow-sm ' : 'text-gray-800! hover:bg-gray-100 dark:hover:bg-gray-500! dark:text-white!'}`}
              iconClassName={`${item.selected ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white!'}`}
              textClassName={`${item.selected ? '!text-black dark:text-white' : '!text-gray-800 dark:text-white!'}`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col bg-white! dark:bg-[#222427]! rounded-full mx-1 my-1 px-3 py-1 shadow-md border border-gray-100! w-fit dark:border-[#333]!">
        {bottomItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {bottomItems.map((item) => (
              <MenuItem
                key={item.link}
                title={item.title}
                link={item.link}
                icon={item.icon}
                selected={item.selected}
                className={`w-auto! rounded-full! transition-all ${item.selected ? 'bg-[#D9E821]! dark:bg-[#D9E821]! dark:text-white text-black! shadow-sm ' : 'text-gray-800! hover:bg-gray-100 dark:hover:bg-gray-500! dark:text-white!'}`}
                iconClassName={`${item.selected ? 'text-black! dark:text-black!' : '!text-gray-800 dark:text-white!'}`}
                textClassName={`${item.selected ? 'text-black! dark:text-black!' : '!text-gray-800 dark:text-white!'}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsMenu;
