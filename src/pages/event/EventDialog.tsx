import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { NewEvent } from 'interface/Utils';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewEvent) => void;
  event?: NewEvent | null;
}

const EventDialog: React.FC<EventDialogProps> = ({ open, onClose, onSubmit, event }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewEvent>({
    defaultValues: event || {
      eventName: '',
      eventDescription: '',
      eventLocation: '',
      eventDate: '',
      buildingId: 0,
    },
  });

  const onSubmitForm = (data: NewEvent) => {
    // Format date if necessary
    const formattedData = {
      ...data,
      eventDate: dayjs(data.eventDate).format('YYYY-MM-DD'),
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>{event ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }} direction={'column'}>
            <Controller
              name="eventName"
              control={control}
              rules={{ required: 'Tên sự kiện là bắt buộc' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tên sự kiện"
                  error={!!errors.eventName}
                  helperText={errors.eventName?.message}
                />
              )}
            />

            <Controller
              name="eventDescription"
              control={control}
              rules={{ required: 'Mô tả là bắt buộc' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={4}
                  error={!!errors.eventDescription}
                  helperText={errors.eventDescription?.message}
                />
              )}
            />

            <Controller
              name="eventLocation"
              control={control}
              rules={{ required: 'Địa điểm là bắt buộc' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Địa điểm"
                  error={!!errors.eventLocation}
                  helperText={errors.eventLocation?.message}
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="eventDate"
                control={control}
                rules={{ required: 'Ngày tổ chức là bắt buộc' }}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày tổ chức"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => field.onChange(newValue)}
                    minDate={dayjs().add(1, 'day')} // Disable dates before tomorrow
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.eventDate,
                        helperText: errors.eventDate?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <Controller
              name="buildingId"
              control={control}
              rules={{
                required: 'Mã tòa nhà là bắt buộc',
                min: { value: 1, message: 'Mã tòa nhà phải là số dương' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Mã tòa nhà"
                  error={!!errors.buildingId}
                  helperText={errors.buildingId?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained">
            {event ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventDialog;
