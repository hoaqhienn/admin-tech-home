import Grid from '@mui/material/Grid';
import { useCallback, useState } from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import ResidentsDataGrid from './ResidentsDataGrid';
import AddResident from './AddResident';
import { Resident } from 'interface/Residents';
import { useDeleteResidentMutation } from 'api/residentApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import ScrollToTop from 'components/fab/ScrollToTop';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResidentPage = () => {
  const [currentResident, setCurrentResident] = useState<Resident | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [deleteResident] = useDeleteResidentMutation();

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);

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
      // Sequential deletion of all selected buildings
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

  const nav = useNavigate();

  const actions: SpeedDialActionType[] = [
    {
      icon: <Plus />,
      title: 'Add multi resident',
      onClick: () => {
        nav('/resident/add');
      },
    },
  ];

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Single Delete Confirmation */}
      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteResident}
        title={`Xóa cư dân - ID: ${currentResident?.residentId}`}
        message="Bạn có chắc chắn muốn xóa cư dân này không?"
      />

      {/* Bulk Delete Confirmation */}
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
          <Typography variant="h1">Danh sách cư dân</Typography>
        </Grid>
        <Grid item xs={12}>
          <ResidentsDataGrid
            onEdit={() => {}}
            onDelete={(residentId) => {
              setCurrentResident({ residentId } as Resident);
              setOpenDialog(true);
            }}
            onBulkDelete={(buildingIds) => {
              setSelectedIds(buildingIds);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <AddResident setSnackbar={setSnackbar} />
        </Grid>
      </Grid>
    </>
  );
};

export default ResidentPage;
