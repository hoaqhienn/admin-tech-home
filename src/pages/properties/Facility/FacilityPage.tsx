import Grid from '@mui/material/Grid';
import { Alert, Snackbar, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Facility } from 'interface/Properties';
import { useDeleteFacilityMutation } from 'api/propertyApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import FacilityDataGrid from './FacilityDataGrid';
import AddFacility from './AddFacility';
import EditFacility from './EditFacility';

const FacilityPage = () => {
  const [currentFacility, setCurrentFacility] = useState<Facility | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [deleteFacility] = useDeleteFacilityMutation();

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  const handleCloseBulkDeleteDialog = useCallback(() => setOpenBulkDeleteDialog(false), []);
  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
    setCurrentFacility(null);
  }, []);

  const handleDelete = async () => {
    if (!currentFacility?.facilityId) return;

    try {
      await deleteFacility(currentFacility.facilityId).unwrap();
      setSnackbar({
        open: true,
        message: 'Xóa thành công!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Hiện tại không thể xóa!',
        severity: 'error',
      });
    } finally {
      handleCloseDialog();
      setCurrentFacility(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteFacility(id).unwrap()));
      setSnackbar({
        open: true,
        message: 'Xóa các cơ sở vật chất đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các cơ sở vật chất',
        severity: 'error',
      });
    } finally {
      handleCloseBulkDeleteDialog();
      setSelectedIds([]);
    }
  };

  return (
    <>
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

      <ConfirmDialog
        key="delete"
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title={`Xóa cơ sở vật chất - ID: ${currentFacility?.facilityId}`}
        message="Bạn có chắc chắn muốn xóa không?"
      />

      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều cơ sở vật chất"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} cơ sở vật chất được chọn?`}
      />

      <EditFacility
        open={openEditDialog}
        facility={currentFacility}
        onClose={handleCloseEditDialog}
        setSnackbar={setSnackbar}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách cơ sở vật chất</Typography>
        </Grid>
        <Grid item xs={12}>
          <FacilityDataGrid
            onEdit={(facility) => {
              setCurrentFacility(facility);
              setOpenEditDialog(true);
            }}
            onDelete={(facilityId) => {
              setCurrentFacility({ facilityId } as Facility);
              setOpenDialog(true);
            }}
            onBulkDelete={(ids) => {
              setSelectedIds(ids);
              setOpenBulkDeleteDialog(true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <AddFacility setSnackbar={setSnackbar} />
        </Grid>
      </Grid>
    </>
  );
};

export default FacilityPage;
