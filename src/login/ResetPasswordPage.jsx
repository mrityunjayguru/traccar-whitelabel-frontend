import React, { useState } from 'react';
import {
  Button, TextField, Typography, Snackbar, IconButton,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import useQuery from '../common/util/useQuery';
import { snackBarDurationShortMs } from '../common/util/duration';
import { useCatch } from '../reactHelper';




const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
}));

const ResetPasswordPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const query = useQuery();

  const token = query.get('passwordReset');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();
    let response;
    if (!token) {
      response = await fetch('/api/password/reset', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}`),
      });
    } else {
      response = await fetch('/api/password/update', {
        method: 'POST',
        body: new URLSearchParams(`token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`),
      });
    }
    if (response.ok) {
      setSnackbarOpen(true);
    } else {
      throw Error(await response.text());
    }
  });

  
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

  return (
    <LoginLayout>
      <div className={classes.container}>
        <div className={classes.header}>
          <IconButton color="primary" onClick={() => navigate('/login')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title} color="primary">
            {t('loginReset')}
          </Typography>
        </div>
        {!token ? (
  <TextField
    required
    type="email"
    label={t('userEmail')}
    name="email"
    value={email}
    autoComplete="email"
    onChange={(event) => setEmail(event.target.value)}
  />
) : (
  <>
    <TextField
      required
      label={t('userPassword')}
      name="password"
      value={password}
      type={showPassword ? 'text' : 'password'}
      autoComplete="new-password"
      onChange={(event) => setPassword(event.target.value)}
    />

    <TextField
      required
      label="Confirm Password"
      name="confirmPassword"
      value={confirmPassword}
      type={showPassword ? 'text' : 'password'}
      onChange={(event) => setConfirmPassword(event.target.value)}
      error={confirmPassword && password !== confirmPassword}
      helperText={
        confirmPassword && password !== confirmPassword
          ? 'Passwords do not match'
          : ''
      }
    />

    <Button onClick={() => setShowPassword((prev) => !prev)}>
      {showPassword ? 'Hide Password' : 'Show Password'}
    </Button>
  </>
)}
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={handleSubmit}
          disabled={
            !token
              ? !/(.+)@(.+)\.(.{2,})/.test(email)
              : !password || password !== confirmPassword
          }
          fullWidth
        >
          {t('loginReset')}
        </Button>
      </div>
      <Snackbar
        open={snackbarOpen}
        onClose={() => navigate('/login')}
        autoHideDuration={snackBarDurationShortMs}
        message={!token ? t('loginResetSuccess') : t('loginUpdateSuccess')}
      />
    </LoginLayout>
  );
};

export default ResetPasswordPage;
