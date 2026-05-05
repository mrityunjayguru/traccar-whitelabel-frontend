import React, { useState } from 'react';
import {
  AppBar,
  Breadcrumbs,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './LocalizationProvider';
import Back from '../../icons/back';

const useStyles = makeStyles((theme) => ({
  desktopRoot: {
    height: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  mobileRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  desktopDrawer: {
    width: (props) => (props.miniVariant ? `calc(${theme.spacing(8)} + 1px)` : theme.dimensions.drawerWidthDesktop),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  mobileDrawer: {
    width: theme.dimensions.drawerWidthTablet,
  },
  mobileToolbar: {
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
}));

const PageTitle = ({ breadcrumbs }) => {
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  if (desktop) {
    return (
      <Typography variant="h6" noWrap>{t(breadcrumbs[0])}</Typography>
    );
  }
  return (
    <Breadcrumbs>
      {breadcrumbs.slice(0, -1).map((breadcrumb) => (
        <Typography variant="h6" color="inherit" key={breadcrumb}>{t(breadcrumb)}</Typography>
      ))}
      <Typography variant="h6" color="textPrimary">{t(breadcrumbs[breadcrumbs.length - 1])}</Typography>
    </Breadcrumbs>
  );
};

const PageLayout = ({
  menu, breadcrumbs, children, hideToolbar = false,
}) => {
  const [miniVariant, setMiniVariant] = useState(false);
  const classes = useStyles({ miniVariant });
  const theme = useTheme();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setMiniVariant(!miniVariant);

  return desktop ? (
    <div className={classes.desktopRoot}>
      {menu && (
        <Drawer
          variant="permanent"
          className={classes.desktopDrawer}
          classes={{ paper: classes.desktopDrawer }}
        >
          <Toolbar>
            {!miniVariant && (
              <>
                <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')} aria-label="back" fontSize="large">
                  <ArrowBackIcon />
                </IconButton>
                <PageTitle breadcrumbs={breadcrumbs} />
              </>
            )}
            <IconButton color="inherit" edge="start" sx={{ ml: miniVariant ? -2 : 'auto' }} onClick={toggleDrawer} aria-label="toggle drawer">
              {miniVariant ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Toolbar>
          <Divider />
          {menu}
        </Drawer>
      )}
      <div className={classes.content + "sm:pl-15 md:pl-16"}>
        {!menu && !hideToolbar && (
          <Toolbar className="bg-white border-b border-gray-200">
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')} aria-label="back" fontSize="large">
              <ArrowBackIcon />
            </IconButton>
            <PageTitle breadcrumbs={breadcrumbs} />
          </Toolbar>
        )}
        {children}
      </div>
    </div>
  ) : (
    <div className={classes.mobileRoot}>
      {menu && (
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          classes={{ paper: classes.mobileDrawer }}
        >
          {menu}
        </Drawer>
      )}
      <AppBar className={classes.mobileToolbar} position="static" color="inherit">
        <Toolbar>
          {menu && (
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => setOpenDrawer(true)} aria-label="toggle drawer" fontSize="large">
              <MenuIcon />
            </IconButton>
          )}
          {!menu && (
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')} aria-label="back" fontSize="large">
              <ArrowBackIcon />
            </IconButton>
          )}
          <PageTitle breadcrumbs={breadcrumbs} />
        </Toolbar>
      </AppBar>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default PageLayout;
