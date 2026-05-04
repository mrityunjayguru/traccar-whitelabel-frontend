import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconButton, Tooltip, Menu, MenuItem, Typography, Badge,
} from '@mui/material';

// import DescriptionIcon from '@mui/icons-material/Description';
// import SettingsIcon from '@mui/icons-material/Settings';
// import MapIcon from '@mui/icons-material/Map';
// import PersonIcon from '@mui/icons-material/Person';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';
import MAP from "../../resources/images/icon/map.svg"
import REPORTS from "../../resources/images/icon/analytics.svg"
import SETTINGS from "../../resources/images/icon/settings.svg"
import ACCOUNT from "../../resources/images/icon/account.svg"
import SIDELOGO from "../../resources/images/icon/sidebar-icon.svg"
import ActivityStatus from './activityStatus';

const SideBarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const disableReports = useRestriction('disableReports');
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      return 'account';
    } if (location.pathname.startsWith('/settings')) {
      return 'settings';
    } if (location.pathname.startsWith('/reports')) {
      return 'reports';
    } if (location.pathname === '/') {
      return 'map';
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: tokens.length > 1 ? tokens.filter((it) => it !== notificationToken).join(',') : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;
      case 'reports':
        navigate('/reports/combined');
        break;
      case 'settings':
        navigate('/settings/preferences');
        break;
      case 'account':
        navigate(`/settings/user/${user.id}`);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center  w-16 py-3 z-10">
      <div className="mb-3 flex items-center justify-center  cursor-pointer">
        <img src={SIDELOGO} alt="sidebar-icon" className="w-14 h-14" />
      </div>
      <div className="flex flex-col items-center bg-white dark:bg-[#1D1D1D] rounded-full  shadow-md border border-gray-100 dark:border-gray-800">
        <div
          onClick={() => handleSelection('map')}
          className={`flex items-center justify-center p-2.5 cursor-pointer transition-all rounded-full m-1 ${currentSelection() === 'map' ? 'bg-[#D9E821] text-[#1D1D1D] shadow-sm' : 'text-[#1D1D1D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <div className="relative">
            <Badge color="error" variant="dot" invisible={socket !== false}>
              <img src={MAP} alt="map-icon" className={`w-6 h-6 ${currentSelection() === 'map' ? 'brightness-0' : 'dark:invert'}`} />
            </Badge>
          </div>
        </div>

        {!disableReports && (
          <div
            onClick={() => handleSelection('reports')}
            className={`flex items-center justify-center p-2.5 cursor-pointer transition-all rounded-full m-1 ${currentSelection() === 'reports' ? 'bg-[#D9E821] text-[#1D1D1D] shadow-sm' : 'text-[#1D1D1D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className="relative">
              <Badge color="error" variant="dot" invisible={socket !== false}>
                <img src={REPORTS} alt="reports-icon" className={`w-6 h-6 ${currentSelection() === 'reports' ? 'brightness-0' : 'dark:invert'}`} />
              </Badge>
            </div>
          </div>
        )}

        <div
          onClick={() => handleSelection('settings')}
          className={`flex items-center justify-center p-2.5 cursor-pointer transition-all rounded-full m-1 ${currentSelection() === 'settings' ? 'bg-[#D9E821] text-[#1D1D1D] shadow-sm' : 'text-[#1D1D1D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <div className="relative">
            <Badge color="error" variant="dot" invisible={socket !== false}>
              <img src={SETTINGS} alt="settings-icon" className={`w-6 h-6 ${currentSelection() === 'settings' ? 'brightness-0' : 'dark:invert'}`} />
            </Badge>
          </div>
        </div>

        <div
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          className={`flex items-center justify-center p-2.5 cursor-pointer transition-all rounded-full m-1 ${currentSelection() === 'account' ? 'bg-[#D9E821] text-[#1D1D1D] shadow-sm' : 'text-[#1D1D1D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <div className="relative">
            <Badge color="error" variant="dot" invisible={socket !== false}>
              <img src={ACCOUNT} alt="account-icon" className={`w-6 h-6 ${currentSelection() === 'account' ? 'brightness-0' : 'dark:invert'}`} />
            </Badge>
          </div>
        </div>
      </div>
      <ActivityStatus/>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleAccount}>
          <Typography color="textPrimary">{t('settingsUser')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography color="error">{t('loginLogout')}</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SideBarNav;
