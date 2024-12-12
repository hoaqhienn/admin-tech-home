import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import { Vehicle } from 'interface/Vehicle';
import { useForm, Controller } from 'react-hook-form';
import { useAddVehicleMutation, useUpdateVehicleMutation } from 'api/residentApi';
import { useResidents } from 'hooks/resident/useResident';

interface VehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
  residentId?: number | null;
}

type FormInputs = {
  vehicleNumber: string;
  vehicleType: string;
  residentId: number;
};

const vehicleTypes = ['Car', 'Motorcycle', 'Bicycle'];

const VehicleDialog: React.FC<VehicleDialogProps> = ({ open, onClose, vehicle, residentId }) => {
  const [addVehicle] = useAddVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();
  const { residents, isLoading: isLoadingResidents } = useResidents();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      vehicleNumber: '',
      vehicleType: '',
      residentId: 0,
    },
  });

  // Load data when editing or when residentId is provided
  useEffect(() => {
    if (vehicle) {
      setValue('vehicleNumber', vehicle.vehicleNumber);
      setValue('vehicleType', vehicle.vehicleType);
      setValue('residentId', vehicle.residentId);
    } else if (residentId) {
      setValue('residentId', residentId);
    }
  }, [vehicle, residentId, setValue]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (vehicle?.vehicleId) {
        await updateVehicle({
          vehicleId: vehicle.vehicleId,
          vehicle: data,
        }).unwrap();
      } else {
        await addVehicle({ vehicle: data }).unwrap();
      }
      onClose();
      reset();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="vehicleNumber"
                control={control}
                rules={{ required: 'Vehicle number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vehicle Number"
                    fullWidth
                    error={!!errors.vehicleNumber}
                    helperText={errors.vehicleNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="vehicleType"
                control={control}
                rules={{ required: 'Vehicle type is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Vehicle Type"
                    fullWidth
                    error={!!errors.vehicleType}
                    helperText={errors.vehicleType?.message}
                  >
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {' '}
              <Controller
                name="residentId"
                control={control}
                rules={{ required: 'Resident is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.residentId}>
                    <InputLabel>Resident</InputLabel>
                    <Select {...field} label="Resident" disabled={isLoadingResidents}>
                      {residents?.map((resident) => (
                        <MenuItem key={resident.residentId} value={resident.residentId}>
                          {resident?.fullname} - {resident.phonenumber}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.residentId && (
                      <FormHelperText>{errors.residentId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {vehicle ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VehicleDialog;
