import React from 'react';
import { useSelector } from 'react-redux';
import {
    DeviceHub as TotalIcon,
    CheckCircle as OnlineIcon,
    Cancel as OfflineIcon,
    Help as UnknownIcon,
} from '@mui/icons-material';
import { useTranslation } from './LocalizationProvider';
import { Wifi, WifiOff } from 'lucide-react';

const ActivityStatus = () => {
    const t = useTranslation();
    const devices = useSelector((state) => state.devices.items);
    const deviceList = Object.values(devices);

    const counts = {
        total: deviceList.length,
        online: deviceList.filter((d) => d.status === 'online').length,
        offline: deviceList.filter((d) => d.status === 'offline').length,
        unknown: deviceList.filter((d) => d.status === 'unknown' || !d.status).length,
    };

    const StatusItem = ({ icon: Icon, count, color, label, bgColor }) => (
        <div 
            className="relative group flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all cursor-pointer mb-2 border border-transparent dark:border-gray-800 hover:scale-110 active:scale-95"
            style={{ backgroundColor: bgColor }}
        >
            <div style={{ color }} className="flex flex-col items-center">
                <Icon sx={{ fontSize: 16 }} />
                <span className="text-[12px] font-bold leading-none mt-0.5">{count}</span>
            </div>
            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-[12px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}: {count}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center  mt-4 p-1.5 bg-white dark:bg-[#1D1D1D] rounded-full shadow-md border border-gray-100 dark:border-gray-800">
            <StatusItem
                icon={TotalIcon}
                count={counts.total}
                color="#10110f"
                label={t('deviceTitle')}
                bgColor="#D9E821"
            />
            <StatusItem
                icon={Wifi}
                count={counts.online}
                color="#059669"
                label={t('deviceStatusOnline')}
                bgColor="#D1FAE5"
            />
            <StatusItem
                icon={WifiOff}
                count={counts.offline}
                color="#DC2626"
                label={t('deviceStatusOffline')}
                bgColor="#FEE2E2"
            />
            <StatusItem
                icon={UnknownIcon}
                count={counts.unknown}
                color="#4B5563"
                label={t('deviceStatusUnknown')}
                bgColor="#F3F4F6"
            />
        </div>
    );
};

export default ActivityStatus;