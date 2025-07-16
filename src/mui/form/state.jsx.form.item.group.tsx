import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box, FormControl, FormControlLabel, FormGroup, Stack,
} from '@mui/material';
import React, { Fragment, useMemo } from 'react';
import type StateFormItemGroup from '../../controllers/StateFormItemGroup';
import {
  BOX,
  STACK,
  LOCALIZED,
  FORM_GROUP,
  FORM_CONTROL,
  FORM_CONTROL_LABEL,
  INDETERMINATE,
  DIV,
  NONE
} from '../../constants';

interface IFormItemGroupProps {
  def: StateFormItemGroup;
  children: React.ReactNode;
}

const StateJsxFormItemGroup = React.memo<IFormItemGroupProps>(({ def: item, children }) => {
  // Memoize the table to prevent recreation on every render
  const table: Record<string, () => JSX.Element> = useMemo(() => ({
    [BOX]: () => (
      <Box {...item.props}>
        {children}
      </Box>
    ),
    [STACK]: () => (
      <Stack {...item.props}>
        {children}
      </Stack>
    ),
    [LOCALIZED]: () => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    ),
    [FORM_GROUP]: () => (
      <FormGroup {...item.props}>
        {children}
      </FormGroup>
    ),
    [FORM_CONTROL]: () => (
      <FormControl {...item.props}>
        {children}
      </FormControl>
    ),
    [FORM_CONTROL_LABEL]: () => (
      <FormControlLabel
        {...item.props}
        control={children}
      />
    ),
    [INDETERMINATE]: () => {
      const childrenArray = Array.isArray(children) ? [...children] : [children];
      const parent = childrenArray.shift();
      return (
        <div>
          <FormControlLabel
            {...item.props}
            control={parent}
          />
          {childrenArray}
        </div>
      );
    },
    [DIV]: () => (
      <div {...item.props}>
        {children}
      </div>
    ),
    [NONE]: () => (
      <Fragment>
        {children}
      </Fragment>
    )
  }), [item.props, children]);

  // Memoize the type lookup
  const itemType = useMemo(() => item.type.toLowerCase(), [item.type]);
  
  // Get the renderer function, with fallback to Fragment
  const renderer = table[itemType] || table[NONE];
  
  return renderer();
});

// Set display name for debugging
StateJsxFormItemGroup.displayName = 'StateJsxFormItemGroup';

export default StateJsxFormItemGroup;
