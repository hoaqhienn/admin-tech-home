import Grid from '@mui/material/Grid';
import { useCallback, useState } from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import ResidentsDataGrid from './ResidentsDataGrid';
import AddResident from './AddResident';
import EditResident from './EditResident';
import { Resident } from 'interface/Residents';
import { useDeleteResidentMutation } from 'api/residentApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import ScrollToTop from 'components/fab/ScrollToTop';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const ResidentPage = () => {
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
  const navigate = useNavigate();

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
        message: 'Xóa cư dân thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Cư dân này không thể xóa!',
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
        message: 'Xóa các cư dân đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các cư dân',
        severity: 'error',
      });
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
    }
  };

  const actions: SpeedDialActionType[] = [
    {
      icon: <Plus />,
      title: 'Add multi resident',
      onClick: () => {
        navigate('/residents/add');
      },
    },
  ];

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
      <SpeedDialCustom actions={actions} />

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
        title={`Xóa cư dân - ID: ${currentResident?.residentId}`}
        message="Bạn có chắc chắn muốn xóa cư dân này không?"
      />

      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều cư dân"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} cư dân được chọn?`}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Danh sách cư dân</Typography>
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

export default ResidentPage;
