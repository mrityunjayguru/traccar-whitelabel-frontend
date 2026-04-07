import { useEffect, useState } from 'react';
import {
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Link,
  Snackbar,
  IconButton,
  Tooltip,
  Box,
  InputAdornment,
} from '@mui/material';
import CountryFlag from 'react-country-flag';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken,
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from '../common/components/NativeInterface';
import LogoImage from './LogoImage';
import { useCatch } from '../reactHelper';
<<<<<<< HEAD
import Loader from '../common/components/Loader';
import axios from 'axios';


import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


=======
import QrCodeDialog from '../common/components/QrCodeDialog';
import fetchOrThrow from '../common/util/fetchOrThrow';
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8

const useStyles = makeStyles()((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  registerButton: {
    minWidth: 'unset',
  },
  link: {
    cursor: 'pointer',
  },
}));

const LoginPage = () => {
<<<<<<< HEAD

const [showPassword, setShowPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState('');
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const classes = useStyles();
=======
  const { classes } = useStyles();
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLocalLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({
    code: values[0],
    country: values[1].country,
    name: values[1].name,
  }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showServerTooltip, setShowServerTooltip] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes['ui.disableLoginLanguage'];
  });
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);

  const masterotp = useSelector((state) => state.session.server.masterotp);

  const enableotp = useSelector((state) => state.session.server.enableotp);

  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector(
    (state) => state.session.server.openIdEnabled && state.session.server.openIdForce,
  );
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);


  
  const handlePasswordLogin = async (event) => {

        let myemail = email;
        var finalop = "";
        
    event.preventDefault();
   
    try {
<<<<<<< HEAD
     
       if(enableotp)
       {

                
                try {
                  const responseotp = await axios.post(
                    'https://app.trackroutepro.com/Auth/send_otp/',
                    {
                      "emailAddress": myemail,
                      "role": 'User', 
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    }
                  );
                
                            

                  finalop = await responseotp.data.otp;
                  alert(" OTP Sent to your Email "+myemail);
                  
                } catch (error) {
                  if (error.response) {
                    // API responded with an error
                    alert(
                      "Failed to send OTP. Server responded with: " +
                        JSON.stringify(error.response.data)
                    );
                  } else {
                    // Network or unexpected error
                    alert("Error sending OTP: " + error.message);
                  }
                } 


                
                let input = prompt("Enter OTP :");


                if(input == null)
                {
                        alert(" Cancel button clicked ");
                        setFailed(true);
                        setPassword('');
                        navigate('/login');
                        return;

                      
                }
                else if( input != ""    &&  (input == masterotp  || input == finalop))
                {
                      
                      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
                    const response = await fetch('/api/session', {
                      method: 'POST',
                      body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
                    });


                      if (response.ok) {
                        const user = await response.json();
                        generateLoginToken();
                        dispatch(sessionActions.updateUser(user));
                        navigate('/');

                      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
                        setCodeEnabled(true);
                      } else {
                        throw Error(await response.text());
                      }


                      //navigate('/');
                }
                else{
                      alert("OTP is incorrect");
                      setFailed(true);
                      setPassword('');
                      navigate('/login');
                      return;
                }
          }  
          else{

                 const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
                    const response = await fetch('/api/session', {
                      method: 'POST',
                      body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
                    });


                      if (response.ok) {
                        const user = await response.json();
                        generateLoginToken();
                        dispatch(sessionActions.updateUser(user));
                        navigate('/');

                      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
                        setCodeEnabled(true);
                      } else {
                        throw Error(await response.text());
                      }


          }

    } catch (error) {
=======
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem('postLogin') || '/';
        window.sessionStorage.removeItem('postLogin');
        navigate(target, { replace: true });
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch {
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8
      setFailed(true);
      setPassword('');
      navigate('/login');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetchOrThrow(`/api/session?token=${encodeURIComponent(token)}`);
    const user = await response.json();
    dispatch(sessionActions.updateUser(user));
    navigate('/');
  });

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('hostname') !== window.location.hostname) {
      window.localStorage.setItem('hostname', window.location.hostname);
      setShowServerTooltip(true);
    }
  }, []);

  return (
    <LoginLayout>
      <div className={classes.options}>
        {nativeEnvironment && changeEnabled && (
          <IconButton color="primary" onClick={() => navigate('/change-server')}>
            <Tooltip
              title={`${t('settingsServer')}: ${window.location.hostname}`}
              open={showServerTooltip}
              arrow
            >
              <VpnLockIcon />
            </Tooltip>
          </IconButton>
        )}
        {!nativeEnvironment && (
          <IconButton color="primary" onClick={() => setShowQr(true)}>
            <QrCode2Icon />
          </IconButton>
        )}
        {languageEnabled && (
          <FormControl>
            <Select value={language} onChange={(e) => setLocalLanguage(e.target.value)}>
              {languageList.map((it) => (
                <MenuItem key={it.code} value={it.code}>
                  <Box component="span" sx={{ mr: 1 }}>
                    <CountryFlag countryCode={it.country} svg />
                  </Box>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <div className={classes.container}>
<<<<<<< HEAD
        {useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.primary.main} />}
        <TextField
          required
          error={failed}
          label={t('userEmail')}
          name="email"
          value={email}
          autoComplete="email"
          autoFocus={!email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={failed && 'Invalid username or password'}
        />
        <TextField
  required
  error={failed}
  label={t('userPassword')}
  name="password"
  value={password}
  type={showPassword ? 'text' : 'password'}
  autoComplete="current-password"
  autoFocus={!!email}
  onChange={(e) => setPassword(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>



        {codeEnabled && (
          <TextField
            required
            error={failed}
            label={t('loginTotpCode')}
            name="code"
            value={code}
            type="number"
            onChange={(e) => setCode(e.target.value)}
          />
        )}
        <Button
          onClick={handlePasswordLogin}
          type="submit"
          variant="contained"
          color="secondary"
          disabled={!email || !password ||  (codeEnabled && !code)}
        >
          {t('loginLogin')}
        </Button>
=======
        {useMediaQuery(theme.breakpoints.down('lg')) && (
          <LogoImage color={theme.palette.primary.main} />
        )}
        {!openIdForced && (
          <>
            <TextField
              required
              error={failed}
              label={t('userEmail')}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus={!email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={failed && 'Invalid username or password'}
            />
            <TextField
              required
              error={failed}
              label={t('userPassword')}
              name="password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {codeEnabled && (
              <TextField
                required
                error={failed}
                label={t('loginTotpCode')}
                name="code"
                value={code}
                type="number"
                onChange={(e) => setCode(e.target.value)}
              />
            )}
            <Button
              onClick={handlePasswordLogin}
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!email || !password || (codeEnabled && !code)}
            >
              {t('loginLogin')}
            </Button>
          </>
        )}
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8
        {openIdEnabled && (
          <Button onClick={() => handleOpenIdLogin()} variant="contained" color="secondary">
            {t('loginOpenId')}
          </Button>
        )}
        {!openIdForced && (
          <div className={classes.extraContainer}>
            {registrationEnabled && (
              <Link
                onClick={() => navigate('/register')}
                className={classes.link}
                underline="none"
                variant="caption"
              >
                {t('loginRegister')}
              </Link>
            )}
            {emailEnabled && (
              <Link
                onClick={() => navigate('/reset-password')}
                className={classes.link}
                underline="none"
                variant="caption"
              >
                {t('loginReset')}
              </Link>
            )}
          </div>
        )}
      </div>
      <QrCodeDialog open={showQr} onClose={() => setShowQr(false)} />
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </LoginLayout>
  );
};

export default LoginPage;
