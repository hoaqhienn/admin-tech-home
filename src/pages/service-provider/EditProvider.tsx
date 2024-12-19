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
import { useUpdateResidentMutation } from 'api/residentApi';
// import { useApartments } from 'hooks/properties/useApartment';
import { Resident } from 'interface/Residents';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  resident: Resident | null;
  onClose: () => void;
  setSnackbar: (value: any) => void;
}

const EditProvider: React.FC<Props> = ({ resident, onClose, setSnackbar }) => {
  //   const { apartments } = useApartments();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [updateResident, { isLoading }] = useUpdateResidentMutation();

  const [residentInput, setResidentInput] = useState<Resident | null>(null);

  useEffect(() => {
    if (resident) {
      setResidentInput(resident);
    }
  }, [resident]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResidentInput((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null,
    );
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  //   const handleSelectChange = (event: any) => {
  //     const value = event.target.value === 0 ? null : event.target.value;
  //     setResidentInput((prev) =>
  //       prev
  //         ? {
  //             ...prev,
  //             apartmentId: value,
  //           }
  //         : null,
  //     );
  //     setErrors((prev) => prev.filter((error) => error.field !== 'apartmentId'));
  //   };

  const handleCancel = () => {
    setResidentInput(null);
    setErrors([]);
    onClose();
  };

  const handleUpdate = async () => {
    if (!residentInput) return;

    if (validateInput()) {
      try {
        await updateResident({
          residentId: residentInput.residentId || 0,
          resident: {
            fullname: residentInput.fullname || '',
            idcard: residentInput.idcard,
            phonenumber: residentInput.phonenumber || '',
            email: residentInput.email || '',
          },
        }).unwrap();
        setSnackbar({
          open: true,
          message: 'Cập nhật cư dân thành công',
          severity: 'success',
        });
        handleCancel();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi cập nhật cư dân',
          severity: 'error',
        });
      }
    }
  };

  const validateInput = (): boolean => {
    if (!residentInput) return false;

    const newErrors: ValidationError[] = [];
    const { fullname, idcard } = residentInput;

    if (!fullname?.trim()) {
      newErrors.push({ field: 'fullname', message: 'Họ và tên không được để trống' });
    } else if (fullname.length < 2) {
      newErrors.push({ field: 'fullname', message: 'Họ và tên phải có ít nhất 2 ký tự' });
    }

    if (!idcard?.trim()) {
      newErrors.push({ field: 'idcard', message: 'Mã định danh không được để trống' });
    } else if (!/^\d{12}$/.test(idcard)) {
      newErrors.push({ field: 'idcard', message: 'Mã định danh phải gồm 12 chữ số' });
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

  if (!residentInput) return null;

  return (
    <Paper>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ChevronDown />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6">Cập nhật thông tin nhà cung cấp dịch vụ</Typography>
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
            fullWidth
            variant="outlined"
            name="phonenumber"
            value={residentInput.phonenumber || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            name="email"
            value={residentInput.email || ''}
            onChange={handleInputChange}
          />
          {/* <FormControl fullWidth margin="dense" error={errors.some((e) => e.field === 'apartment')}>
            <InputLabel id="apartment-select-label">Mã căn hộ</InputLabel>
            <Select
              labelId="apartment-select-label"
              id="apartment-select"
              value={residentInput.apartmentId || 0}
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
          </FormControl> */}
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </AccordionActions>
      </Accordion>
    </Paper>
  );
};

export default EditProvider;
