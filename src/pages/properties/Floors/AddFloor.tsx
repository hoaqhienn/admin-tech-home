import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useAddFloorMutation } from 'api/propertyApi';
import { useBuildings } from 'hooks/properties/useBuilding';
import { NewFloor } from 'interface/Properties';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
}

const AddFloor: React.FC<Props> = ({ setSnackbar }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const { buildings } = useBuildings();
  const [floorInput, setFloorInput] = useState<{
    buildingId: number;
    floorNumber: string;
  }>({
    buildingId: 0,
    floorNumber: '', // Changed from null to empty string
  });

  const [newFloor, { isLoading }] = useAddFloorMutation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFloorInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleReset = () => {
    setFloorInput({
      buildingId: 0,
      floorNumber: '', // Reset to empty string instead of null
    });
    setErrors([]);
  };

  const handleAdd = async () => {
    if (validateInput()) {
      try {
        // Convert floorNumber to number before sending
        const floorData: NewFloor = {
          buildingId: floorInput.buildingId,
          floorNumber: parseInt(floorInput.floorNumber, 10),
        };

        await newFloor(floorData).unwrap();
        handleReset();

        setSnackbar({
          open: true,
          message: 'Thêm tầng thành công',
          severity: 'success',
        });
      } catch (error: any) {
        setSnackbar({
          open: true,
          // message: 'Có lỗi xảy ra khi thêm tầng',
          message: error.data.message || 'Có lỗi xảy ra khi thêm tầng',
          severity: 'error',
        });
      }
    }
  };

  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { buildingId, floorNumber } = floorInput;

    if (buildingId === 0) {
      newErrors.push({ field: 'buildingId', message: 'Vui lòng chọn tòa nhà' });
    }

    if (!floorNumber) {
      newErrors.push({ field: 'floorNumber', message: 'Tầng không được để trống' });
    } else {
      const floorNum = parseInt(floorNumber, 10);
      if (isNaN(floorNum) || floorNum <= 0) {
        newErrors.push({ field: 'floorNumber', message: 'Tầng phải lớn hơn 0' });
      }
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

  const handleSelectChange = (event: any) => {
    setFloorInput((prev) => ({
      ...prev,
      buildingId: event.target.value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== 'buildingId'));
  };

  return (
    <Paper>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ChevronDown />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6">Thêm tầng</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl
            fullWidth
            margin="dense"
            error={errors.some((e) => e.field === 'buildingId')}
          >
            <Select
              labelId="floor-select-label"
              id="floor-select"
              value={floorInput.buildingId}
              placeholder="Mã tòa nhà"
              onChange={handleSelectChange}
              name="floorId"
              margin="dense"
              variant="outlined"
            >
              <MenuItem value={0}>
                <em>Select Building</em>
              </MenuItem>
              {buildings?.map((a) => (
                <MenuItem key={a.buildingId} value={a.buildingId}>
                  {a.buildingId} - {a.buildingName}
                </MenuItem>
              ))}
            </Select>
            {errors.some((e) => e.field === 'buildingId') && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                {errors.find((e) => e.field === 'buildingId')?.message}
              </Typography>
            )}
          </FormControl>

          <TextField
            margin="dense"
            fullWidth
            placeholder="Tầng"
            variant="outlined"
            name="floorNumber"
            type="number"
            required
            value={floorInput.floorNumber}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'floorNumber')}
            helperText={errors.find((e) => e.field === 'floorNumber')?.message}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleReset} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleAdd} disabled={isLoading}>
            Thêm
          </Button>
        </AccordionActions>
      </Accordion>
    </Paper>
  );
};

export default AddFloor;
