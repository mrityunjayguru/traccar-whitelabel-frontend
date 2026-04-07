import { useState } from 'react';
import { Button, TextField, Typography, Snackbar, IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { snackBarDurationShortMs } from '../common/util/duration';
import { useCatch } from '../reactHelper';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

<<<<<<< HEAD



const useStyles = makeStyles((theme) => ({
=======
const useStyles = makeStyles()((theme) => ({
>>>>>>> 5f656ae1c84a3b998923f70336c267cd2130efc8
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('passwordReset');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();
    if (!token) {
      await fetchOrThrow('/api/password/reset', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}`),
      });
    } else {
      await fetchOrThrow('/api/password/update', {
        method: 'POST',
        body: new URLSearchParams(
          `token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`,
        ),
      });
    }
    setSnackbarOpen(true);
  });

  
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

  return (
    <LoginLayout>
      <div className={classes.container}>
        <div className={classes.header}>
          <IconButton color="primary" onClick={() => navigate('/login')}>
            <BackIcon />
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
