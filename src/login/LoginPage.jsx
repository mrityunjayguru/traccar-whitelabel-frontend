import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionActions } from "../store";
import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import LoginLayout from "./LoginLayout";
import usePersistedState from "../common/util/usePersistedState";
import {
  generateLoginToken,
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from "../common/components/NativeInterface";
import LogoImage from "./LogoImage";
import { useCatch } from "../reactHelper";
import Loader from "../common/components/Loader";
import axios from "axios";

import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";



const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({
    code: values[0],
    country: values[1].country,
    name: values[1].name,
  }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const registrationEnabled = useSelector(
    (state) => state.session.server.registration,
  );
  const languageEnabled = useSelector(
    (state) => !state.session.server.attributes["ui.disableLoginLanguage"],
  );
  const changeEnabled = useSelector(
    (state) => !state.session.server.attributes.disableChange,
  );
  const emailEnabled = useSelector(
    (state) => state.session.server.emailEnabled,
  );

  const masterotp = useSelector((state) => state.session.server.masterotp);
  const enableotp = useSelector((state) => state.session.server.enableotp);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);
  const [codeEnabled, setCodeEnabled] = useState(false);
  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const handlePasswordLogin = async (event) => {
    let myemail = email;
    var finalop = "";
    event.preventDefault();

    try {
      if (enableotp) {
        try {
          const responseotp = await axios.post(
            "https://app.trackroutepro.com/Auth/send_otp/",
            { emailAddress: myemail, role: "User" },
            { headers: { "Content-Type": "application/json" } },
          );
          finalop = await responseotp.data.otp;
          alert(" OTP Sent to your Email " + myemail);
        } catch (error) {
          alert(error.response ? "Failed to send OTP. Server responded with: " + JSON.stringify(error.response.data) : "Error sending OTP: " + error.message);
        }

        let input = prompt("Enter OTP :");
        if (input == null) {
          setFailed(true); setPassword(""); navigate("/login"); return;
        } else if (input != "" && (input == masterotp || input == finalop)) {
          const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
          const response = await fetch("/api/session", { method: "POST", body: new URLSearchParams(code.length ? `${query}&code=${code}` : query) });
          if (response.ok) {
            const user = await response.json(); generateLoginToken(); dispatch(sessionActions.updateUser(user)); navigate("/");
          } else if (response.status === 401 && response.headers.get("WWW-Authenticate") === "TOTP") {
            setCodeEnabled(true);
          } else {
            throw Error(await response.text());
          }
        } else {
          alert("OTP is incorrect"); setFailed(true); setPassword(""); navigate("/login"); return;
        }
      } else {
        const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        const response = await fetch("/api/session", { method: "POST", body: new URLSearchParams(code.length ? `${query}&code=${code}` : query) });
        if (response.ok) {
          const user = await response.json(); generateLoginToken(); dispatch(sessionActions.updateUser(user)); navigate("/");
        } else if (response.status === 401 && response.headers.get("WWW-Authenticate") === "TOTP") {
          setCodeEnabled(true);
        } else {
          throw Error(await response.text());
        }
      }
    } catch (error) {
      setFailed(true); setPassword(""); navigate("/login");
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetch(`/api/session?token=${encodeURIComponent(token)}`);
    if (response.ok) {
      const user = await response.json(); dispatch(sessionActions.updateUser(user)); navigate("/");
    } else {
      throw Error(await response.text());
    }
  });

  const handleOpenIdLogin = () => { document.location = "/api/session/openid/auth"; };

  useEffect(() => nativePostMessage("authentication"), []);
  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  if (openIdForced) { handleOpenIdLogin(); return <Loader />; }

  return (
    <div className="relative w-full h-full">
      <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
        {nativeEnvironment && changeEnabled && (
          <Tooltip title={t("settingsServer")}>
            <IconButton onClick={() => navigate("/change-server")} className="bg-black/10 hover:bg-black/20 dark:bg-[#1A1C1E/10] dark:hover:bg-[#1A1C1E/20] dark:text-white">
              <LockOpenIcon className="dark:text-white" />
            </IconButton>
          </Tooltip>
        )}
        {languageEnabled && (
          <FormControl size="small">
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1A1C1E] text-white rounded-lg overflow-hidden border-none"
              sx={{
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center', backgroundColor: 'DDE1E8', gap: 1, color: '', py: 1, px: 2 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSvgIcon-root': { color: 'black' }
              }}
            >
              {languageList.map((it) => (
                <MenuItem key={it.code} value={it.code} className="flex items-center gap-2">
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ReactCountryFlag countryCode={it.country} svg />
                  </Box>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <LoginLayout>
        <div className="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-3 text-2xl font-bold text-[#1A1C1E]">
              <Box className="bg-[#1A1C1E] text-white rounded-full p-2 flex items-center justify-center ">
                <img src="/src/resources/images/icon/login.svg" alt="" className="h-4 w-4" />
              </Box>
              <span className="font-normal dark:text-white">
                Login
              </span>
            </div>
            <div className="text-[#1A1D1F] text-sm font-normal dark:text-white">
              Enter your details to sign in to your account
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <TextField
              required
              error={failed}
              label="Account"
              name="email"
              value={email}
              autoComplete="email"
              autoFocus={!email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px' } }}
            />
            <TextField
              required
              error={failed}
              label="Password"
              name="password"
              value={password}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
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
                label={t("loginOtp")}
                name="code"
                value={code}
                type="number"
                onChange={(e) => setCode(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={handlePasswordLogin}
              disabled={!email || !password || (codeEnabled && !code)}
              className="bg-[#1A1C1E] text-[#D9E821] cursor-pointer! hover:bg-[#2D2F31] dark:bg-[#D9E821]!  dark:text-black! dark:hover:text-white/80 rounded-[2px] py-3 text-lg font-semibold normal-case shadow-none mt-2"
              sx={{
                backgroundColor: '#1A1C1E !important',
                color: '#D9E821 !important',
                '&:hover': { backgroundColor: '#2D2F31 !important' },
                borderRadius: '2px'
              }}
            >
              Sign In
            </Button>

            {openIdEnabled && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleOpenIdLogin()}
                className="bg-[#1A1C1E] text-white hover:bg-[#2D2F31] rounded-xl py-3 text-lg font-semibold normal-case shadow-none"
                sx={{
                  backgroundColor: '#1A1C1E !important',
                  color: 'white !important',
                  borderRadius: '12px'
                }}
              >
                {t("loginOpenId")}
              </Button>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <Link
              className="text-gray-400! text-sm! no-underline! cursor-pointer hover:text-gray-600!"
              onClick={() => navigate("/reset-password")}
              title="Reset Password"
            >
              Reset Password
            </Link>
            <div className="text-gray-400 text-sm">
              Go to <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => navigate("/login")}>Admin Portal</span>
            </div>
          </div>

          {registrationEnabled && (
            <Button
              color="secondary"
              onClick={() => navigate("/register")}
              className="normal-case font-medium mt-2"
            >
              {t("loginRegister")}
            </Button>
          )}
        </div>

        <Snackbar
          open={failed}
          autoHideDuration={3000}
          onClose={() => setFailed(false)}
          message={t("loginFailed")}
        />
        <Snackbar
          open={announcementShown && !!announcement}
          message={announcement}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setAnnouncementShown(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </LoginLayout>
    </div>
  );
};

export default LoginPage;
