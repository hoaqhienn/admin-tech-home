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
  TextField,
  FormControlLabel,
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
  const [searchText, setSearchText] = useState('');

  // Lọc danh sách cư dân theo từ khóa
  const filteredResidents = residents.filter((resident) =>
    resident.fullname.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelectResident = (resident: ResidentViaApartment) => {
    setSelectedResidents((prev) =>
      prev.includes(resident) ? prev.filter((r) => r !== resident) : [...prev, resident],
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedResidents(filteredResidents);
    } else {
      setSelectedResidents([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedResidents([]);
  };

  const handleConfirmSelection = () => {
    onSelect(selectedResidents);
    setSelectedResidents([]); // Reset selected residents
    onClose();
  };

  const handleClose = () => {
    setSelectedResidents([]); // Reset selected residents
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: 'sm',
        },
      }}
    >
      <DialogTitle>Chọn cư dân để gửi</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Tìm kiếm cư dân"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={
                filteredResidents.length > 0 &&
                filteredResidents.every((resident) => selectedResidents.includes(resident))
              }
              onChange={handleSelectAll}
            />
          }
          label="Chọn tất cả"
        />
        <Button onClick={handleClearSelection} color="secondary" size="small" sx={{ ml: 2 }}>
          Xóa chọn
        </Button>
        <List
          sx={{
            maxHeight: 300, // Chiều cao cố định
            overflowY: 'auto', // Thêm scrollbar
            border: '1px solid #ddd', // Viền cho rõ ràng
            mt: 2,
          }}
        >
          {filteredResidents.map((resident) => (
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
        <Button onClick={handleClose} color="secondary">
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
