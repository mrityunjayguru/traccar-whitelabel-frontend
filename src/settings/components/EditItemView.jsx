import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Button, Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography, TextField,
} from '@mui/material';
import { useCatch, useEffectAsync } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import SettingsLayout from './SettingsLayout';
import useSettingsStyles from '../common/useSettingsStyles';

const EditItemView = ({
  children, endpoint, item, setItem, defaultItem, validate, onItemSaved, breadcrumbs,
}) => {
  const navigate = useNavigate();
  const classes = useSettingsStyles();
  const t = useTranslation();

  const { id } = useParams();

  useEffectAsync(async () => {
    if (!item) {
      if (id) {
        const response = await fetch(`/api/${endpoint}/${id}`);
        if (response.ok) {
          setItem(await response.json());
        } else {
          throw Error(await response.text());
        }
      } else {
        setItem(defaultItem || {});
      }
    }
  }, [id, item, defaultItem]);

  const handleSave = useCatch(async () => {
    let url = `/api/${endpoint}`;
    if (id) {
      url += `/${id}`;
    }

    const response = await fetch(url, {
      method: !id ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      if (onItemSaved) {
        onItemSaved(await response.json());
      }
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <SettingsLayout breadcrumbs={breadcrumbs}>
      <Container maxWidth="md" className={classes.container}>
        {item ? children : (
          <Accordion defaultExpanded className="mb-4! border border-gray-200 dark:border-gray-700 rounded-md! shadow-none! before:hidden">
            <AccordionSummary>
              <Typography variant="subtitle1">
                <Skeleton width="10em" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={-i} width="100%">
                  <TextField />
                </Skeleton>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
         <div className="shrink-0 flex items-center justify-center gap-3 py-4 border-t border-gray-100 dark:border-[#333] w-full">
          <button
            type="button"
            disabled={!item}
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center justify-center
              px-6 py-2.5 rounded-md
              text-sm font-semibold
              border border-gray-300 dark:border-[#444]
              text-gray-700! dark:text-gray-200!
              bg-white dark:bg-[#2a2a2e]!
              hover:bg-gray-50 dark:hover:bg-[#333]
              active:scale-[0.97]
              transition-all duration-150 ease-in-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              shadow-sm cursor-pointer
              w-1/6
            "
          >
            {t('sharedCancel')}
          </button>

          <button
            type="button"
            disabled={!item || !validate()}
            onClick={handleSave}
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
            {t('sharedSave')}
          </button>
        </div>
      </Container>
    </SettingsLayout>
  );
};

export default EditItemView;
