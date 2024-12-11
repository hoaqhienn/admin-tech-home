import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Alert } from '@mui/material';
import {
  useGetApartmentByIdQuery,
  useJoinToApartmentMutation,
  useLeaveOutApartmentMutation,
} from 'api/propertyApi';
import { useResidents } from 'hooks/resident/useResident';
import { ChevronDown, X } from 'lucide-react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import ResidentSelector from './ResidentSelector';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

interface ConfirmDialogState {
  open: boolean;
  residentId: number | null;
  residentName: string;
}

const ApartmentDetail = () => {
  const { id } = useParams();
  const { residents } = useResidents();

  const { data: apartment, isLoading, error } = useGetApartmentByIdQuery(Number(id));
  const [joinApartment] = useJoinToApartmentMutation();
  const [leaveApartment] = useLeaveOutApartmentMutation();

  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    residentId: null,
    residentName: '',
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleConfirmDialogOpen = (residentId: number, residentName: string) => {
    setConfirmDialog({
      open: true,
      residentId,
      residentName,
    });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({
      open: false,
      residentId: null,
      residentName: '',
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading apartment details</div>;
  }

  if (!apartment) {
    return <div>Apartment not found</div>;
  }

  const handleAddResident = async () => {
    if (!selectedResidentId) return;

    try {
      const res: any = await joinApartment({
        residentId: [selectedResidentId],
        apartmentId: parseInt(id!),
      }).unwrap();
      console.log(res);

      setSelectedResidentId(null);
      if (res) {
        showSnackbar('Thêm cư dân thành công', 'success');
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Thêm cư dân thất bại', 'error');
    }
  };

  const handleRemoveResident = async () => {
    if (!confirmDialog.residentId) return;

    try {
      const res: any = await leaveApartment({
        residentId: [confirmDialog.residentId],
        apartmentId: parseInt(id!),
      }).unwrap();

      if (res) {
        showSnackbar('Xóa cư dân thành công', 'success');
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Xóa cư dân thất bại', 'error');
    } finally {
      handleConfirmDialogClose();
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Trang chủ
          </Link>
          <Link component={RouterLink} to="/apartment/all" color="inherit">
            Danh sách căn hộ
          </Link>
          <Typography className="font-bold" color="text.primary">
            Căn hộ {apartment.apartmentNumber}
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Typography variant="h1">Chi tiết căn hộ {apartment.apartmentNumber}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Typography>Mã căn hộ:</Typography>
          <TextField
            placeholder="Mã căn hộ"
            value={apartment.apartmentId}
            variant="outlined"
            fullWidth
            margin="dense"
            disabled
          />
          <Typography>Căn hộ số:</Typography>
          <TextField
            placeholder="Căn hộ số"
            value={apartment.apartmentNumber}
            variant="outlined"
            fullWidth
            margin="dense"
            inputMode="numeric"
          />
          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography variant="h6">Danh sách cư dân ({apartment.residents.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {apartment.residents.map((r) => (
                <TextField
                  key={r.residentId}
                  value={r.fullname}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleConfirmDialogOpen(r.residentId, r.fullname)}
                        >
                          <X />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Typography variant="h6" mt={2}>
            Thêm cư dân mới
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <ResidentSelector
                selectedResidentId={selectedResidentId}
                setSelectedResidentId={setSelectedResidentId}
                residents={residents}
                apartment={apartment}
              />
            </Grid>
            <Grid item xs={2}>
              <Button fullWidth variant="contained" color="primary" onClick={handleAddResident}>
                Thêm cư dân
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleConfirmDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa cư dân</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa cư dân {confirmDialog.residentName} khỏi căn hộ này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleRemoveResident} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ApartmentDetail;
