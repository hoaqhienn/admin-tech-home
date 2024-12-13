import { useState, useCallback, useRef } from 'react';
import { Building } from 'interface/Properties';
import ScrollToTop from 'components/fab/ScrollToTop';
import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import BuildingsDataGrid from './BuildingsDataGrid';
import BuildingResidentsChart from './BuildingResidentsChart';
import AddBuilding from './AddBuilding';
import ConfirmDialog from 'components/dialog/ConfirmDialog';
import { useDeleteBuildingMutation, useUpdateBuildingMutation } from 'api/propertyApi';
import EditBuildingDialog from './EditBuildingDialog';

const Buildings = () => {
  const [buildingToEdit, setBuildingToEdit] = useState<Building | null>(null);
  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number[]>([]);
  const [dialogs, setDialogs] = useState({
    delete: false,
    bulkDelete: false,
    edit: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const addRef = useRef<HTMLDivElement>(null);

  const [deleteBuilding] = useDeleteBuildingMutation();
  const [updateBuilding] = useUpdateBuildingMutation();

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const toggleDialog = useCallback((type: keyof typeof dialogs, value: boolean) => {
    setDialogs((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleDeleteBuilding = async () => {
    if (!currentBuilding?.buildingId) return;

    try {
      await deleteBuilding(currentBuilding.buildingId).unwrap();
      showSnackbar('Xóa tòa nhà thành công', 'success');
    } catch {
      showSnackbar('Tòa nhà này đang được sử dụng', 'error');
    } finally {
      toggleDialog('delete', false);
      setCurrentBuilding(null);
    }
  };

  const handleUpdateBuilding = async (buildingId: number, newName: string) => {
    try {
      await updateBuilding({ buildingId, buildingName: newName }).unwrap();
      showSnackbar('Cập nhật tòa nhà thành công', 'success');
    } catch (error: any) {
      if (error.status === 409) {
        showSnackbar('Tên tòa nhà đã tồn tại. Vui lòng chọn tên khác.', 'error');
      } else {
        showSnackbar('Có lỗi xảy ra khi cập nhật tòa nhà', 'error');
      }
    } finally {
      toggleDialog('edit', false);
      setBuildingToEdit(null);
    }
  };

  const handleBulkDeleteBuildings = async () => {
    try {
      await Promise.all(selectedBuildingIds.map((id) => deleteBuilding(id).unwrap()));
      showSnackbar('Xóa các tòa nhà đã chọn thành công', 'success');
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa các tòa nhà', 'error');
    } finally {
      toggleDialog('bulkDelete', false);
      setSelectedBuildingIds([]);
    }
  };

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Building',
      onClick: () => addRef.current?.scrollIntoView({ behavior: 'smooth' }),
    },
  ];

  return (
    <>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ScrollToTop />
      <SpeedDialCustom actions={actions} />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={dialogs.delete}
        onClose={() => toggleDialog('delete', false)}
        onConfirm={handleDeleteBuilding}
        title={`Xóa tòa nhà - ID: ${currentBuilding?.buildingId}`}
        message="Bạn có chắc chắn muốn xóa tòa nhà này không?"
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        open={dialogs.bulkDelete}
        onClose={() => toggleDialog('bulkDelete', false)}
        onConfirm={handleBulkDeleteBuildings}
        title="Xóa nhiều tòa nhà"
        message={`Bạn có chắc chắn muốn xóa ${selectedBuildingIds.length} tòa nhà được chọn?`}
      />

      <EditBuildingDialog
        building={buildingToEdit}
        open={dialogs.edit}
        onClose={() => toggleDialog('edit', false)}
        onSave={handleUpdateBuilding}
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách tòa nhà</Typography>
        </Grid>
        <Grid item xs={12}>
          <BuildingsDataGrid
            onEdit={(building) => {
              setBuildingToEdit(building);
              toggleDialog('edit', true);
            }}
            onDelete={(buildingId) => {
              setCurrentBuilding({ buildingId } as Building);
              toggleDialog('delete', true);
            }}
            onBulkDelete={(buildingIds) => {
              setSelectedBuildingIds(buildingIds);
              toggleDialog('bulkDelete', true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <BuildingResidentsChart />
        </Grid>
        <Grid item xs={12} ref={addRef}>
          <AddBuilding setSnackbar={(value) => showSnackbar(value.message, value.severity)} />
        </Grid>
      </Grid>
    </>
  );
};

export default Buildings;
