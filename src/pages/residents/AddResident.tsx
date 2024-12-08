import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useApartments } from 'hooks/properties/useApartment';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ResidentsProps {
  fullname: string;
  idcard: string;
  username: string;
  apartment: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: any) => void;
}

const AddResident: React.FC<Props> = ({ setSnackbar }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { apartments } = useApartments();

  const [residentInput, setResidentInput] = useState<ResidentsProps>({
    fullname: '',
    idcard: '',
    username: '',
    apartment: 0,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResidentInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleSelectChange = (event: any) => {
    setResidentInput((prev) => ({
      ...prev,
      apartment: event.target.value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== 'apartment'));
  };

  const handleReset = () => {
    setResidentInput({
      fullname: '',
      idcard: '',
      username: '',
      apartment: 0,
    });
    setErrors([]);
  };

  const handleAdd = () => {
    if (validateInput()) {
      // Proceed with adding resident
      console.log('Valid input:', residentInput);
      setSnackbar({
        open: true,
        message: 'Thêm cư dân thành công',
        severity: 'success',
      });
    }
  };

  // Validate input
  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { fullname, idcard, username, apartment } = residentInput;

    // Validate fullname
    if (!fullname.trim()) {
      newErrors.push({ field: 'fullname', message: 'Họ và tên không được để trống' });
    } else if (fullname.length < 2) {
      newErrors.push({ field: 'fullname', message: 'Họ và tên phải có ít nhất 2 ký tự' });
    }

    // Validate username
    if (!username.trim()) {
      newErrors.push({ field: 'username', message: 'Username không được để trống' });
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.push({
        field: 'username',
        message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới',
      });
    }

    // Validate idcard
    if (!idcard.trim()) {
      newErrors.push({ field: 'idcard', message: 'Mã định danh không được để trống' });
    } else if (!/^\d{9,12}$/.test(idcard)) {
      newErrors.push({ field: 'idcard', message: 'Mã định danh phải có từ 9-12 chữ số' });
    }

    // Validate apartment
    if (!apartment) {
      newErrors.push({ field: 'apartment', message: 'Vui lòng chọn căn hộ' });
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ChevronDown />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6">Thêm cư dân</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            autoFocus
            margin="dense"
            label="Họ và tên"
            fullWidth
            variant="outlined"
            name="fullname"
            required
            value={residentInput.fullname}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'fullname')}
            helperText={errors.find((e) => e.field === 'fullname')?.message}
          />
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            name="username"
            required
            value={residentInput.username}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'username')}
            helperText={errors.find((e) => e.field === 'username')?.message}
          />
          <TextField
            margin="dense"
            label="Mã định danh"
            fullWidth
            variant="outlined"
            name="idcard"
            required
            value={residentInput.idcard}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'idcard')}
            helperText={errors.find((e) => e.field === 'idcard')?.message}
          />
          <FormControl fullWidth margin="dense" error={errors.some((e) => e.field === 'apartment')}>
            <InputLabel id="apartment-select-label">Mã căn hộ</InputLabel>
            <Select
              labelId="apartment-select-label"
              id="apartment-select"
              value={residentInput.apartment}
              label="Mã căn hộ"
              onChange={handleSelectChange}
              name="apartment"
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {apartments?.map((a) => (
                <MenuItem key={a.apartmentId} value={a.apartmentId}>
                  {a.apartmentNumber} - F{a.floorNumber} - {a.buildingName}
                </MenuItem>
              ))}
            </Select>
            {errors.some((e) => e.field === 'apartment') && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                {errors.find((e) => e.field === 'apartment')?.message}
              </Typography>
            )}
          </FormControl>
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleReset}>Hủy</Button>
          <Button onClick={handleAdd}>Thêm</Button>
        </AccordionActions>
      </Accordion>
    </Paper>
  );
};

export default AddResident;
