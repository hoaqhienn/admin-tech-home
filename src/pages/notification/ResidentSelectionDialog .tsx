import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { ResidentViaApartment } from 'interface/Residents'; // Adjust the import path
import { useState } from 'react';

interface ResidentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  residents: ResidentViaApartment[];
  onSelect: (selectedResidents: ResidentViaApartment[]) => void;
}

const ResidentSelectionDialog: React.FC<ResidentSelectionDialogProps> = ({
  open,
  onClose,
  residents,
  onSelect,
}) => {
  const [selectedResidents, setSelectedResidents] = useState<ResidentViaApartment[]>([]);

  const handleSelectResident = (resident: ResidentViaApartment) => {
    setSelectedResidents((prev) => {
      if (prev.includes(resident)) {
        return prev.filter((r) => r !== resident);
      }
      return [...prev, resident];
    });
  };

  const handleConfirmSelection = () => {
    onSelect(selectedResidents);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Residents</DialogTitle>
      <DialogContent>
        <List>
          {residents.map((resident) => (
            <ListItem
              button
              key={resident.residentId}
              onClick={() => handleSelectResident(resident)}
            >
              <Checkbox checked={selectedResidents.includes(resident)} />
              <ListItemText primary={resident.fullname} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleConfirmSelection} color="primary">
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResidentSelectionDialog;
