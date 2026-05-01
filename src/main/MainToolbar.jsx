import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Tooltip, OutlinedInput, ListItemText,
} from '@mui/material';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useDeviceReadonly } from '../common/util/permissions';
import PLUS from "../resources/images/icon/plus.svg"

const MainToolbar = ({
  keyword,
  setKeyword,
  filter,
  setFilter,
  filterSort,
  setFilterSort,
  filterMap,
  setFilterMap,
  handleStatusToggle,
}) => {
  const navigate = useNavigate();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();
  const groups = useSelector((state) => state.groups.items);

  return (
    <div className="flex items-center gap-4 w-full py-0.5">
      <IconButton
        onClick={() => navigate('/settings/device')}
        disabled={deviceReadonly}
        className="bg-[#D9E821]! p-1 hover:bg-[#c5d31d] shadow-sm shrink-0!"
        sx={{ borderRadius: '50%' }}
      >
        <img src={PLUS} alt="plus-icon" className="w-4 h-4 brightness-0" />
      </IconButton>

      <div className="grow max-w-[400px]">
        <FormControl size="small" fullWidth>
          <OutlinedInput
            placeholder={t('sharedSearchDevices')}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sx={{ borderRadius: '8px', height: 40 }}
          />
        </FormControl>
      </div>

      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="status-label">{t('deviceStatus')}</InputLabel>
        <Select
          labelId="status-label"
          label={t('deviceStatus')}
          multiple
          value={filter.statuses}
          onChange={(e) => {
            const value = e.target.value;
            setFilter({ ...filter, statuses: typeof value === 'string' ? value.split(',') : value });
          }}
          renderValue={(selected) => selected.map(s => t(`deviceStatus${s.charAt(0).toUpperCase() + s.slice(1)}`)).join(', ')}
          sx={{ borderRadius: '8px', height: 40 }}
        >
          {['online', 'offline', 'unknown'].map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={filter.statuses.indexOf(status) > -1} size="small" />
              <ListItemText
                primary={t(`deviceStatus${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                primaryTypographyProps={{
                  style: { color: status === 'online' ? '#24B467' : status === 'offline' ? '#ef4444' : '#f59e0b' }
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="groups-label">{t('settingsGroups')}</InputLabel>
        <Select
          labelId="groups-label"
          label={t('settingsGroups')}
          multiple
          value={filter.groups}
          onChange={(e) => setFilter({ ...filter, groups: e.target.value })}
          renderValue={(selected) => selected.map(id => groups[id]?.name).join(', ')}
          sx={{ borderRadius: '8px', height: 40 }}
        >
          {Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
            <MenuItem key={group.id} value={group.id}>
              <Checkbox checked={filter.groups.indexOf(group.id) > -1} size="small" />
              <ListItemText primary={group.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="sort-label">{t('sharedSortBy')}</InputLabel>
        <Select
          labelId="sort-label"
          label={t('sharedSortBy')}
          value={filterSort}
          onChange={(e) => setFilterSort(e.target.value)}
          sx={{ borderRadius: '8px', height: 40 }}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="name">{t('sharedName')}</MenuItem>
          <MenuItem value="lastUpdate">{t('deviceLastUpdate')}</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={filterMap}
            onChange={(e) => setFilterMap(e.target.checked)}
          />
        }
        label={<span className="text-sm whitespace-nowrap text-gray-600">{t('sharedFilterMap')}</span>}
        sx={{ mr: 0 }}
      />
    </div>
  );
};

export default MainToolbar;
