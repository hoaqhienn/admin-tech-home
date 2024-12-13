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
import { useAddResidentMutation } from 'api/residentApi';
import { useApartments } from 'hooks/properties/useApartment';
import { NewResident } from 'interface/Residents';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: any) => void;
}

const AddResident: React.FC<Props> = ({ setSnackbar }) => {
  const { apartments } = useApartments();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [addResident, { isLoading }] = useAddResidentMutation();

  const [residentInput, setResidentInput] = useState<NewResident>({
    fullname: '',
    idcard: '',
    apartmentId: null,
    phonenumber: '', // Add phone field
    email: '', // Add email field
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResidentInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleSelectChange = (event: any) => {
    const value = event.target.value === 0 ? null : event.target.value;
    setResidentInput((prev) => ({
      ...prev,
      apartmentId: value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== 'apartmentId'));
  };

  const handleReset = () => {
    setResidentInput({
      fullname: '',
      idcard: '',
      apartmentId: 0,
      phonenumber: '',
      email: '',
    });
    setErrors([]);
  };

  const handleAdd = async () => {
    if (validateInput()) {
      try {
        console.log(residentInput);

        await addResident(residentInput).unwrap();
        setSnackbar({
          open: true,
          message: 'Thêm cư dân thành công',
          severity: 'success',
        });
        handleReset();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi thêm cư dân',
          severity: 'error',
        });
      }
    }
  };

  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { fullname, idcard, phonenumber, email } = residentInput;

    if (!fullname.trim()) {
      newErrors.push({ field: 'fullname', message: 'Họ và tên không được để trống' });
    } else if (fullname.length < 2) {
      newErrors.push({ field: 'fullname', message: 'Họ và tên phải có ít nhất 2 ký tự' });
    }

    if (!idcard.trim()) {
      newErrors.push({ field: 'idcard', message: 'Mã định danh không được để trống' });
    } else if (!/^\d{12}$/.test(idcard)) {
      newErrors.push({ field: 'idcard', message: 'Mã định danh phải gồm 12 chữ số' });
    }

    if (phonenumber && !/^\d{10}$/.test(phonenumber)) {
      newErrors.push({ field: 'phonenumber', message: 'Số điện thoại phải gồm 10 chữ số' });
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.push({ field: 'email', message: 'Địa chỉ email không hợp lệ' });
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
          <TextField
            margin="dense"
            label="Số điện thoại"
            type="number"
            fullWidth
            variant="outlined"
            name="phonenumber"
            value={residentInput.phonenumber}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'phonenumber')}
            helperText={errors.find((e) => e.field === 'phonenumber')?.message}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            name="email"
            value={residentInput.email}
            onChange={handleInputChange}
            error={errors.some((e) => e.field === 'email')}
            helperText={errors.find((e) => e.field === 'email')?.message}
          />
          <FormControl fullWidth margin="dense" error={errors.some((e) => e.field === 'apartment')}>
            <InputLabel id="apartment-select-label">Mã căn hộ</InputLabel>
            <Select
              labelId="apartment-select-label"
              id="apartment-select"
              value={residentInput.apartmentId || 0} // Hiển thị 'None' nếu giá trị là null
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
          <Button onClick={handleReset} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </AccordionActions>
      </Accordion>
    </Paper>
  );
};

export default AddResident;
