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
import { useNewBuildingMutation } from 'api/propertyApi';
import { NewBuilding } from 'interface/Properties';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
}

const AddBuilding: React.FC<Props> = ({ setSnackbar }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [input, setInput] = useState<NewBuilding>({
    buildingName: '',
    numOfFloor: null,
    numOfApartment: null,
  });

  // Correctly destructure the mutation hook
  const [newBuilding, { isLoading }] = useNewBuildingMutation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Convert building name to uppercase automatically
    // const processedValue = name === 'buildingName' ? value.toUpperCase() : value;
    const processedValue = name === 'buildingName' ? value : value;

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

  const handleAdd = async () => {
    if (validateInput()) {
      try {
        // Properly call the mutation
        await newBuilding(input).unwrap();

        setSnackbar({
          open: true,
          message: 'Thêm tòa nhà thành công',
          severity: 'success',
        });

        // Optionally reset the form after successful submission
        handleReset();
      } catch (error: any) {
        // Check if it's a conflict error (status 409)
        if (error?.status === 409) {
          setErrors((prev) => [
            ...prev,
            { field: 'buildingName', message: 'Tên tòa nhà đã tồn tại' },
          ]);
          setSnackbar({
            open: true,
            message: 'Tên tòa nhà đã tồn tại. Vui lòng nhập tên khác.',
            severity: 'error',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi thêm tòa nhà',
            severity: 'error',
          });
        }
      }
    }
  };

  // Rest of the component remains the same...
  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { buildingName, numOfFloor, numOfApartment } = input;

    if (!buildingName?.trim()) {
      newErrors.push({ field: 'buildingName', message: 'Tên tòa nhà không được để trống' });
    } else if (buildingName.length < 1) {
      newErrors.push({ field: 'buildingName', message: 'Tên tòa nhà phải có ít nhất 1 ký tự' });
    }

    if (numOfFloor === null) {
      newErrors.push({ field: 'numOfFloor', message: 'Số tầng không được để trống' });
    } else if (numOfFloor <= 0) {
      newErrors.push({ field: 'numOfFloor', message: 'Số tầng phải lớn hơn 0' });
    }

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

export default AddBuilding;
