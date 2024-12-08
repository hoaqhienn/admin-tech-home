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
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface InputProps {
  buildingName: string;
  numOfFloor: number | null;
  numOfApartment: number | null;
}

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
}

const AddBuilding: React.FC<Props> = ({ setSnackbar }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [input, setInput] = useState<InputProps>({
    buildingName: '',
    numOfFloor: null,
    numOfApartment: null,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Convert building name to uppercase automatically
    const processedValue = name === 'buildingName' ? value.toUpperCase() : value;

    setInput((prev) => ({
      ...prev,
      [name]: name === 'buildingName' ? processedValue : value === '' ? null : Number(value),
    }));
    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };
  const handleReset = () => {
    setInput({
      buildingName: '',
      numOfFloor: null,
      numOfApartment: null,
    });
    setErrors([]);
  };

  const handleAdd = () => {
    if (validateInput()) {
      // Proceed with adding building
      console.log('Valid input:', input);
      setSnackbar({
        open: true,
        message: 'Thêm tòa nhà thành công',
        severity: 'success',
      });
    }
  };

  // Validate input
  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { buildingName, numOfFloor, numOfApartment } = input;

    // Validate building name
    if (!buildingName?.trim()) {
      newErrors.push({ field: 'buildingName', message: 'Tên tòa nhà không được để trống' });
    } else if (buildingName.length < 1) {
      newErrors.push({ field: 'buildingName', message: 'Tên tòa nhà phải có ít nhất 1 ký tự' });
    } else if (!/^[A-Z]+$/.test(buildingName)) {
      newErrors.push({
        field: 'buildingName',
        message: 'Tên tòa nhà chỉ được chứa các chữ cái in hoa từ A-Z',
      });
    }

    // Validate number of floors
    if (numOfFloor === null) {
      newErrors.push({ field: 'numOfFloor', message: 'Số tầng không được để trống' });
    } else if (numOfFloor <= 0) {
      newErrors.push({ field: 'numOfFloor', message: 'Số tầng phải lớn hơn 0' });
    }

    // Validate number of apartments per floor
    if (numOfApartment === null) {
      newErrors.push({
        field: 'numOfApartment',
        message: 'Số căn hộ mỗi tầng không được để trống',
      });
    } else if (numOfApartment <= 0) {
      newErrors.push({ field: 'numOfApartment', message: 'Số căn hộ mỗi tầng phải lớn hơn 0' });
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

  return (
    <Paper>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ChevronDown />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6">Thêm tòa nhà</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            autoFocus
            fullWidth
            type="text"
            margin="dense"
            variant="outlined"
            placeholder="Tên tòa nhà"
            name="buildingName"
            required
            value={input.buildingName}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'buildingName')}
            helperText={errors.find((e) => e.field === 'buildingName')?.message}
          />
          <TextField
            margin="dense"
            fullWidth
            placeholder="Số tầng"
            variant="outlined"
            name="numOfFloor"
            type="number"
            required
            value={input.numOfFloor ?? ''}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'numOfFloor')}
            helperText={errors.find((e) => e.field === 'numOfFloor')?.message}
          />
          <TextField
            margin="dense"
            placeholder="Số căn hộ mỗi tầng"
            fullWidth
            variant="outlined"
            name="numOfApartment"
            type="number"
            required
            value={input.numOfApartment ?? ''}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'numOfApartment')}
            helperText={errors.find((e) => e.field === 'numOfApartment')?.message}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleReset}>Hủy</Button>
          <Button onClick={handleAdd}>Thêm</Button>
        </AccordionActions>
      </Accordion>
    </Paper>
  );
};

export default AddBuilding;
