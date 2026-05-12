import React, { useState } from 'react';
import {
  Button, TextField, Typography, Snackbar, IconButton,
  Box,
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
    if("hi@mrityunjaygautam.com"==email)
    {
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

      }
      else
      {
        alert("Only administrator will abble to rest the password.");
      }


  });


  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LoginLayout>
      <div className={classes.container}>
        <div onClick={() => navigate('/login')}>
          <Box className="bg-[#1A1C1E] text-white rounded-full p-2 flex items-center justify-center w-fit mb-10 cursor-pointer" >
            <ArrowBackIcon className='bg-[#D9E821] text-black h-6! w-6! p-1 rounded-full mr-2' />
            <span>Back to Login</span>
          </Box>
        </div>
        <div className="flex flex-col gap-1 mb-4">

          <div className="flex items-center gap-3 text-2xl font-bold text-[#1A1C1E]">

            <span className="font-normal dark:text-white">
              Reset Password
            </span>
          </div>
          <div className="text-[#1A1D1F] text-sm font-normal dark:text-white">
            Enter your details to reset your password
          </div>
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

            <Button onClick={() => setShowPassword((prev) => !prev)}
              className="bg-[#1A1C1E] text-[#D9E821] cursor-pointer! hover:bg-[#2D2F31] dark:bg-[#D9E821]!  dark:text-black! dark:hover:text-white/80 rounded-[2px] py-3 text-lg font-semibold normal-case shadow-none mt-2"
              sx={{
                backgroundColor: '#1A1C1E !important',
                color: '#D9E821 !important',
                '&:hover': { backgroundColor: '#2D2F31 !important' },
                borderRadius: '2px'
              }}
            >
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
          className="bg-[#1A1C1E] text-[#D9E821] cursor-pointer! hover:bg-[#2D2F31] dark:bg-[#D9E821]!  dark:text-black! dark:hover:text-white/80 rounded-[2px] py-3 text-lg font-semibold normal-case shadow-none mt-2"
          sx={{
            backgroundColor: '#1A1C1E !important',
            color: '#D9E821 !important',
            '&:hover': { backgroundColor: '#2D2F31 !important' },
            borderRadius: '2px'
          }}
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
