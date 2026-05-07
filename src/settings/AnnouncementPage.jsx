import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  TextField,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsLayout from './components/SettingsLayout';
import { useCatchCallback } from '../reactHelper';
import useSettingsStyles from './common/useSettingsStyles';
import SelectField from '../common/components/SelectField';
import { prefixString } from '../common/util/stringUtils';

const AnnouncementPage = () => {
  const navigate = useNavigate();
  const classes = useSettingsStyles();
  const t = useTranslation();

  const [users, setUsers] = useState([]);
  const [notificator, setNotificator] = useState();
  const [message, setMessage] = useState({});

  const handleSend = useCatchCallback(async () => {
    const query = new URLSearchParams();
    users.forEach((userId) => query.append('userId', userId));
    const response = await fetch(`/api/notifications/send/${notificator}?${query.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (response.ok) {
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  }, [users, notificator, message, navigate]);

  return (
    <SettingsLayout breadcrumbs={['serverAnnouncement']}>
      <Container maxWidth="md" className={classes.container}>
        <Accordion defaultExpanded className="mb-4! border border-gray-200 dark:border-gray-700 rounded-md! shadow-none! before:hidden">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <SelectField
              multiple
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              endpoint="/api/users"
              label={t('settingsUsers')}
            />
            <SelectField
              value={notificator}
              onChange={(e) => setNotificator(e.target.value)}
              endpoint="/api/notifications/notificators?announcement=true"
              keyGetter={(it) => it.type}
              titleGetter={(it) => t(prefixString('notificator', it.type))}
              label={t('notificationNotificators')}
            />
            <TextField
              value={message.subject}
              onChange={(e) => setMessage({ ...message, subject: e.target.value })}
              label={t('sharedSubject')}
            />
            <TextField
              value={message.body}
              onChange={(e) => setMessage({ ...message, body: e.target.value })}
              label={t('commandMessage')}
            />
          </AccordionDetails>
        </Accordion>
        <div className="shrink-0 flex items-center justify-center gap-3 py-4 border-t border-gray-100 dark:border-[#333] w-full">
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center justify-center
              px-6 py-2.5 rounded-md
              text-sm font-semibold
              border border-gray-300! dark:border-[#444]!
              text-gray-700! dark:text-gray-200!
              bg-white dark:bg-[#2a2a2e]!
              hover:bg-gray-50! dark:hover:bg-[#333]!
              active:scale-[0.97]
              transition-all duration-150 ease-in-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              shadow-sm cursor-pointer
              w-1/6
            "
          >
            {t('sharedCancel')}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={handleSend}
            disabled={!notificator || !message.subject || !message.body}
            className="
              inline-flex items-center justify-center
              px-6 py-2.5 rounded-md
              text-sm font-bold
              bg-[#D9E821]! text-black!
              hover:bg-[#d4f500]!
              active:scale-[0.97]
              transition-all duration-150 ease-in-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              shadow-md shadow-[#D9E821]/20 cursor-pointer
              w-1/6
            "
          >
            {t('commandSend')}
          </Button>
        </div>
      </Container>
    </SettingsLayout>
  );
};

export default AnnouncementPage;
