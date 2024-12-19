import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useAddFacilityMutation } from 'api/propertyApi';
import { Facility } from 'interface/Properties';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
  buildings?: Array<{ buildingId: number; buildingName: string }>;
}

const AddFacility: React.FC<Props> = ({ setSnackbar }) => {
  // const { buildings } = useBuildings();

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [input, setInput] = useState<Partial<Facility>>({
    facilityName: '',
    facilityDescription: '',
    facilityLocation: '',
    buildingId: 0,
  });

  const [addFacility, { isLoading }] = useAddFacilityMutation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  // const handleSelectChange = (event: any) => {
  //   setInput((prev) => ({
  //     ...prev,
  //     buildingId: event.target.value,
  //   }));
  //   setErrors((prev) => prev.filter((error) => error.field !== 'buildingId'));
  // };

  const handleReset = () => {
    setInput({
      facilityName: '',
      facilityDescription: '',
      facilityLocation: '',
      buildingId: 0,
    });
    setErrors([]);
  };

  const handleAdd = async () => {
    if (validateInput()) {
      try {
        await addFacility(input as Facility).unwrap();
        setSnackbar({
          open: true,
          message: 'Thêm cơ sở vật chất thành công',
          severity: 'success',
        });
        handleReset();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi thêm cơ sở vật chất',
          severity: 'error',
        });
      }
    }
  };

  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { facilityName, facilityDescription, facilityLocation } = input;

    if (!facilityName?.trim()) {
      newErrors.push({ field: 'facilityName', message: 'Tên cơ sở vật chất không được để trống' });
    }

    if (!facilityDescription?.trim()) {
      newErrors.push({ field: 'facilityDescription', message: 'Mô tả không được để trống' });
    }

    if (!facilityLocation?.trim()) {
      newErrors.push({ field: 'facilityLocation', message: 'Vị trí không được để trống' });
    }

    // if (!buildingId || buildingId === 0) {
    //   newErrors.push({ field: 'buildingId', message: 'Vui lòng chọn tòa nhà' });
    // }

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

  return (
    <Paper>
      <Accordion>
        <AccordionSummary
          expandIcon={<ChevronDown />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6">Thêm cơ sở vật chất</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            autoFocus
            fullWidth
            type="text"
            margin="dense"
            variant="outlined"
            placeholder="Tên cơ sở vật chất"
            name="facilityName"
            required
            value={input.facilityName}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'facilityName')}
            helperText={errors.find((e) => e.field === 'facilityName')?.message}
          />
          <TextField
            margin="dense"
            fullWidth
            placeholder="Mô tả"
            variant="outlined"
            name="facilityDescription"
            type="text"
            required
            value={input.facilityDescription}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'facilityDescription')}
            helperText={errors.find((e) => e.field === 'facilityDescription')?.message}
          />
          <TextField
            margin="dense"
            placeholder="Vị trí"
            fullWidth
            variant="outlined"
            name="facilityLocation"
            type="text"
            required
            value={input.facilityLocation}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'facilityLocation')}
            helperText={errors.find((e) => e.field === 'facilityLocation')?.message}
          />
          {/* <FormControl
            fullWidth
            margin="dense"
            error={errors.some((e) => e.field === 'buildingId')}
          >
            <Select
              labelId="building-select-label"
              id="building-select"
              value={input.buildingId}
              onChange={handleSelectChange}
              name="buildingId"
            >
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
          </FormControl> */}
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

export default AddFacility;
