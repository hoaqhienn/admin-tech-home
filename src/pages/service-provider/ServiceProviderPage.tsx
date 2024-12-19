import Grid from '@mui/material/Grid';
import { useCallback, useState } from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import ResidentsDataGrid from './ServiceProviderDataGrid';
import AddResident from './AddServiceProvider';
import EditResident from './EditProvider';
import { Resident } from 'interface/Residents';
import { useDeleteResidentMutation } from 'api/residentApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import ScrollToTop from 'components/fab/ScrollToTop';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const ServiceProviderPage = () => {
  const [currentResident, setCurrentResident] = useState<Resident | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [deleteResident] = useDeleteResidentMutation();

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);
  const handleCloseEdit = useCallback(() => setCurrentResident(null), []);
  const handleCloseSnackbar = useCallback(
    () => setSnackbar((prev) => ({ ...prev, open: false })),
    [],
  );

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleDeleteResident = async () => {
    if (!currentResident?.residentId) return;

    try {
      await deleteResident(currentResident.residentId).unwrap();
      setSnackbar({
        open: true,
        message: 'Xóa nhà cung cấp thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Nhà cung cấp này không thể xóa!',
        severity: 'error',
      });
    } finally {
      handleCloseDialog();
      setCurrentResident(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteResident(id).unwrap()));
      setSnackbar({
        open: true,
        message: 'Xóa các nhà cung cấp đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các nhà cung cấp',
        severity: 'error',
      });
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
    }
  };

  const handleEdit = useCallback((resident: Resident) => {
    setCurrentResident(resident);
    setIsEditMode(true);
  }, []);

  const handleDelete = useCallback((residentId: number) => {
    setCurrentResident({ residentId } as Resident);
    setOpenDialog(true);
    setIsEditMode(false);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteResident}
        title={`Xóa nhà cung cấp dịch vụ - ID: ${currentResident?.residentId}`}
        message="Bạn có chắc chắn muốn xóa nhà cung cấp này không?"
      />

      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều nhà cung cấp dịch vụ"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} nhà cung cấp được chọn?`}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách nhà cung cấp dịch vụ</Typography>
        </Grid>

        <Grid item xs={12}>
          <ResidentsDataGrid
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={(ids: number[]) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          {currentResident && isEditMode ? (
            <EditResident
              resident={currentResident}
              onClose={handleCloseEdit}
              setSnackbar={setSnackbar}
            />
          ) : (
            <AddResident setSnackbar={setSnackbar} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ServiceProviderPage;
