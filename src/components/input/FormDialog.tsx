import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useCallback } from 'react';

interface FormDialogProps {
  open: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textInput: TextFieldProps[];
}

export interface TextFieldProps {
  label: string;
  name: string;
  value: any;
}

export const FormDialog = ({
  open,
  isEditing,
  onClose,
  onSubmit,
  onInputChange,
  textInput,
}: FormDialogProps) => {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  const _textFieldBuilder = () => {
    return textInput.map(({ label, name, value }) => {
      return (
        <TextField
          fullWidth
          required
          margin="dense"
          label={label}
          name={name}
          variant="outlined"
          value={value}
          onChange={onInputChange}
        />
      );
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Update' : 'Add New'}</DialogTitle>
        <DialogContent>{_textFieldBuilder()}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
