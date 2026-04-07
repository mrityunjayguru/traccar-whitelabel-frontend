<<<<<<< HEAD

import React, { useEffect, useState } from 'react';
=======
import { useEffect, useState } from 'react';
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import { formatAddress } from '../util/formatter';
import { usePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';

const AddressValue = ({ latitude, longitude, originalAddress }) => {
  const t = useTranslation();

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);
  const coordinateFormat = usePreference('coordinateFormat');

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(originalAddress);
  }, [latitude, longitude, originalAddress]);

  const showAddress = useCatch(async (event) => {
    event.preventDefault();
   
    const query = new URLSearchParams({ latitude, longitude });
<<<<<<< HEAD
  //  const response = await fetch(`/api/server/geocode?${query.toString()}`);
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
  
  if (response.ok) {

         const data = await response.json();
        // Full readable address
        setAddress(data.display_name);


        // setAddress(await response.text());
    } else {
      throw Error(await response.text());
    }
=======
    const response = await fetchOrThrow(`/api/server/geocode?${query.toString()}`);
    setAddress(await response.text());
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8
  });

  if (address) {
    return address;
  }
  if (addressEnabled) {
    return (
      <Link href="#" onClick={showAddress}>
        {t('sharedShowAddress')}
      </Link>
    );
  }
  return formatAddress({ latitude, longitude }, coordinateFormat);
};

export default AddressValue;







