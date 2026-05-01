import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  Divider, List, ListItemButton, ListItemText,
} from '@mui/material';

import { geofencesActions } from '../store';
import CollectionActions from '../settings/components/CollectionActions';
import { useCatchCallback } from '../reactHelper';

const useStyles = makeStyles((theme) => ({
  list: {
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  listItem: {
    borderRadius: '12px!important',
    marginBottom: '8px!important',
    padding: '12px 16px!important',
    '&:hover': {
      backgroundColor: '#f1f5f9!important',
    },
  },
  listItemText: {
    '& .MuiTypography-root': {
      fontSize: '14px',
      fontWeight: 500,
      color: '#334155',
    },
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
}));

const GeofencesList = ({ onGeofenceSelected }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.geofences.items);

  const refreshGeofences = useCatchCallback(async () => {
    const response = await fetch('/api/geofences');
    if (response.ok) {
      dispatch(geofencesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, [dispatch]);

  return (
    <List className={classes.list}>
      {Object.values(items).map((item) => (
        <Fragment key={item.id}>
          <ListItemButton
            key={item.id}
            onClick={() => onGeofenceSelected(item.id)}
            className={classes.listItem}
          >
            <ListItemText
              primary={item.name}
              className={classes.listItemText}
            />
            <CollectionActions itemId={item.id} editPath="/settings/geofence" endpoint="geofences" setTimestamp={refreshGeofences} />
          </ListItemButton>
        </Fragment>
      ))}
    </List>
  );
};

export default GeofencesList;
