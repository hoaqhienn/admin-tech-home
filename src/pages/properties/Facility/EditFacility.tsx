import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Facility } from 'interface/Properties';
import { useState, useEffect } from 'react';
import { useUpdateFacilityMutation } from 'api/propertyApi';
import { useBuildings } from 'hooks/properties/useBuilding';

interface Props {
  open: boolean;
  facility: Facility | null;
  onClose: () => void;
  setSnackbar: (value: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
}

interface ValidationError {
  field: string;
  message: string;
}

const EditFacility: React.FC<Props> = ({ open, facility, onClose, setSnackbar }) => {
  const { buildings } = useBuildings();
  const [updateFacility, { isLoading }] = useUpdateFacilityMutation();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [input, setInput] = useState<Partial<Facility>>({
    facilityName: '',
    facilityDescription: '',
    facilityLocation: '',
    buildingId: 0,
  });

  useEffect(() => {
    if (facility) {
      setInput({
        facilityId: facility.facilityId,
        facilityName: facility.facilityName,
        facilityDescription: facility.facilityDescription,
        facilityLocation: facility.facilityLocation,
        buildingId: facility.buildingId,
      });
      setErrors([]);
    }
  }, [facility]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleSelectChange = (event: any) => {
    setInput((prev) => ({
      ...prev,
      buildingId: event.target.value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== 'buildingId'));
  };

  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { facilityName, facilityDescription, facilityLocation, buildingId } = input;

    if (!facilityName?.trim()) {
      newErrors.push({ field: 'facilityName', message: 'Tên cơ sở vật chất không được để trống' });
    }

    if (!facilityDescription?.trim()) {
      newErrors.push({ field: 'facilityDescription', message: 'Mô tả không được để trống' });
    }

    if (!facilityLocation?.trim()) {
      newErrors.push({ field: 'facilityLocation', message: 'Vị trí không được để trống' });
    }

    if (!buildingId || buildingId === 0) {
      newErrors.push({ field: 'buildingId', message: 'Vui lòng chọn tòa nhà' });
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng kiểm tra lại thông tin nhập vào',
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (validateInput()) {
      try {
        await updateFacility(input as Facility).unwrap();
        setSnackbar({
          open: true,
          message: 'Cập nhật cơ sở vật chất thành công',
          severity: 'success',
        });
        onClose();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi cập nhật cơ sở vật chất',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập nhật cơ sở vật chất</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Tên cơ sở vật chất"
          type="text"
          name="facilityName"
          value={input.facilityName}
          onChange={handleInputChange}
          error={errors.some((e) => e.field === 'facilityName')}
          helperText={errors.find((e) => e.field === 'facilityName')?.message}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Mô tả"
          type="text"
          name="facilityDescription"
          value={input.facilityDescription}
          onChange={handleInputChange}
          error={errors.some((e) => e.field === 'facilityDescription')}
          helperText={errors.find((e) => e.field === 'facilityDescription')?.message}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Vị trí"
          type="text"
          name="facilityLocation"
          value={input.facilityLocation}
          onChange={handleInputChange}
          error={errors.some((e) => e.field === 'facilityLocation')}
          helperText={errors.find((e) => e.field === 'facilityLocation')?.message}
        />
        <FormControl fullWidth margin="dense" error={errors.some((e) => e.field === 'buildingId')}>
          <Select value={input.buildingId} onChange={handleSelectChange} name="buildingId">
            <MenuItem value={0}>
              <em>Chọn tòa nhà</em>
            </MenuItem>
            {buildings?.map((building) => (
              <MenuItem key={building.buildingId} value={building.buildingId}>
                {building.buildingId} - {building.buildingName}
              </MenuItem>
            ))}
          </Select>
          {errors.some((e) => e.field === 'buildingId') && (
            <Typography color="error" variant="caption" sx={{ ml: 2 }}>
              {errors.find((e) => e.field === 'buildingId')?.message}
            </Typography>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button onClick={handleUpdate} disabled={isLoading}>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFacility;
