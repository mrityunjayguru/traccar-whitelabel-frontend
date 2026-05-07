import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Typography, Badge,
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { useRestriction } from '../util/permissions';
import { nativePostMessage } from './NativeInterface';
import MAP from "../../resources/images/icon/map.svg"
import REPORTS from "../../resources/images/icon/analytics.svg"
import SETTINGS from "../../resources/images/icon/settings.svg"
import ACCOUNT from "../../resources/images/icon/account.svg"
import SIDELOGO from "../../resources/images/icon/sidebar-icon.svg"

const BottomMenu = () => {
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

  const handleSelection = (event, value) => {
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
        setAnchorEl(event.currentTarget);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1C1E]! border-t border-gray-200 dark:border-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        <div
          onClick={() => handleSelection(null, 'map')}
          className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-colors w-full ${currentSelection() === 'map' ? 'bg-[#ECFAD7] dark:bg-[#D9E821]! text-[#1D1D1D]' : 'text-[#B5BAD2] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          <div className="relative mb-1">
            <Badge color="error" variant="dot" invisible={socket !== false}>
              <img src={MAP} alt="map-icon" className={`w-6 h-6 ${currentSelection() === 'map' ? 'brightness-0' : 'dark:invert dark:opacity-60'}`} />
            </Badge>
          </div>
          <span className="text-[10px] font-medium leading-tight">Map</span>
        </div>

        {!disableReports && (
          <div
            onClick={() => handleSelection(null, 'reports')}
            className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-colors w-full ${currentSelection() === 'reports' ? 'bg-[#ECFAD7] dark:bg-[#D9E821]! text-[#1D1D1D]' : 'text-[#B5BAD2] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <img src={REPORTS} alt="reports-icon" className={`w-6 h-6 ${currentSelection() === 'reports' ? 'brightness-0' : 'dark:invert dark:opacity-60'}`} />
            <span className="text-[10px] font-medium leading-tight">Report</span>
          </div>
        )}

        <div
          onClick={() => handleSelection(null, 'settings')}
          className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-colors w-full ${currentSelection() === 'settings' ? 'bg-[#ECFAD7] dark:bg-[#D9E821]! text-[#1D1D1D]' : 'text-[#B5BAD2] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          <img src={SETTINGS} alt="settings-icon" className={`w-6 h-6 ${currentSelection() === 'settings' ? 'brightness-0' : 'dark:invert dark:opacity-60'}`} />
          <span className="text-[10px] font-medium leading-tight">Settings</span>
        </div>

        <div
          onClick={(e) => handleSelection(e, 'account')}
          className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-colors w-full ${currentSelection() === 'account' ? 'bg-[#ECFAD7] dark:bg-[#D9E821]! text-[#1D1D1D]' : 'text-[#B5BAD2] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          {readonly ? <img src={LOGOUT} alt="logout-icon" className={`w-6 h-6 ${currentSelection() === 'account' ? 'brightness-0' : 'dark:invert dark:opacity-60'}`} /> : <img src={ACCOUNT} alt="account-icon" className={`w-6 h-6 ${currentSelection() === 'account' ? 'brightness-0' : 'dark:invert dark:opacity-60'}`} />}
          <span className="text-[10px] font-medium leading-tight">{readonly ? t('loginLogout') : t('settingsUser')}</span>
        </div>
      </div>

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

export default BottomMenu;
