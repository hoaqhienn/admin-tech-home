import Grid from '@mui/material/Grid';
import { Alert, Snackbar, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Facility } from 'interface/Properties';
import { useDeleteFacilityMutation } from 'api/propertyApi';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import FacilityDataGrid from './FacilityDataGrid';

const FacilityPage = () => {
  const [currentFacility, setCurrentFacility] = useState<Facility | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  // Handle single deletion
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

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      // Sequential deletion of all selected buildings
      await Promise.all(selectedIds.map((id) => deleteFacility(id).unwrap()));

      setSnackbar({
        open: true,
        message: 'Xóa các tòa nhà đã chọn thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa các tòa nhà',
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
        title={`Xóa cơ sở tiện ích - ID: ${currentFacility?.facilityId}`}
        message="Bạn có chắc chắn muốn xóa không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        key="bulk-delete"
        open={openBulkDeleteDialog}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Xóa nhiều cơ sở tiện ích"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} cơ sở tiện ích được chọn?`}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách cơ sở vật chất</Typography>
        </Grid>
        <Grid item xs={12}>
          <FacilityDataGrid
            onEdit={() => {}}
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
      </Grid>
    </>
  );
};

export default FacilityPage;
