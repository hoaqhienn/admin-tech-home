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
import { useAddProviderMutation } from 'api/adApi';
import { NewProvider } from 'interface/Residents';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  setSnackbar: (value: any) => void;
}

const AddServiceProvider: React.FC<Props> = ({ setSnackbar }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [addProvider, { isLoading }] = useAddProviderMutation();

  const [residentInput, setResidentInput] = useState<NewProvider>({
    fullname: '',
    // set username with get date now
    username: '',
    idcard: '',
    phonenumber: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResidentInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleReset = () => {
    setResidentInput({
      fullname: '',
      username: '',
      idcard: '',
      phonenumber: '',
    });
    setErrors([]);
  };

  useEffect(() => {
    // Update username based on idcard
    if (residentInput.idcard.length === 12) {
      const username = `user${residentInput.idcard.substring(6)}`; // Get last 6 digits
      setResidentInput((prev) => ({
        ...prev,
        username,
      }));
    }
  }, [residentInput.idcard]);

  const handleAdd = async () => {
    if (validateInput()) {
      try {
        console.log(residentInput);

        await addProvider(residentInput).unwrap();
        setSnackbar({
          open: true,
          message: 'Thêm thành công',
          severity: 'success',
        });
        handleReset();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi thêm',
          severity: 'error',
        });
      }
    }
  };

  const validateInput = (): boolean => {
    const newErrors: ValidationError[] = [];
    const { fullname, idcard, phonenumber } = residentInput;

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
          <Typography variant="h6">Thêm nhà cung cấp dịch vụ</Typography>
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
            required
          />
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

export default AddServiceProvider;
