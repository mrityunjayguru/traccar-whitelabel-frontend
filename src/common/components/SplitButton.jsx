import React, { useRef, useState } from 'react';
import {
  Button, ButtonGroup, Menu, MenuItem, Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const SplitButton = ({
  fullWidth, variant, color, disabled, onClick, options, selected, setSelected,
}) => {
  const anchorRef = useRef();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  return (
    <>
      <div className="flex gap-2">
        <Button
          fullWidth
          variant="contained"
          disabled={disabled}
          onClick={() => onClick(selected)}
          className="bg-[#1a1a1a]! text-white! dark:text-black! dark:bg-white! rounded-full! py-4! normal-case! font-bold! hover:bg-black! dark:hover:bg-gray-200! transition-transform! flex-1"
        >
          <Typography variant="button" noWrap>{options[selected]}</Typography>
        </Button>
        <Button
          variant="contained"
          disabled={disabled}
          ref={anchorRef}
          onClick={() => setMenuAnchorEl(anchorRef.current)}
          className="bg-[#1a1a1a]! text-white! dark:text-black! dark:bg-white! rounded-full! py-4! normal-case! font-bold! hover:bg-black! dark:hover:bg-gray-200! transition-transform!"
        >
          <ArrowDropDownIcon />
        </Button>
      </div>
      <Menu
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {Object.entries(options).map(([key, value]) => (
          <MenuItem
            key={key}
            onClick={() => {
              setSelected(key);
              setMenuAnchorEl(null);
            }}
          >
            {value}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SplitButton;
