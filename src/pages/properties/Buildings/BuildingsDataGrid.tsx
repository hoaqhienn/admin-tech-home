import { Button, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useBuildings } from 'hooks/properties/useBuilding';
import { Building } from 'interface/Properties';
import { DeleteIcon, EditIcon, Info } from 'lucide-react';
import { useState, useCallback } from 'react';

interface BuildingsDataGridProps {
  onEdit?: (building: Building) => void;
  onDelete?: (buildingId: number) => void;
  onBulkDelete?: (buildingIds: number[]) => void;
}

const BuildingsDataGrid: React.FC<BuildingsDataGridProps> = ({
  onEdit,
  onDelete,
  onBulkDelete,
}) => {
  const { buildings, isLoading } = useBuildings();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEditBuilding = useCallback(
    (building: Building) => {
      if (onEdit) {
        onEdit(building);
        clearSelection();
      }
    },
    [onEdit, clearSelection],
  );

  const handleDeleteBuilding = useCallback(
    (buildingId: number) => {
      if (onDelete) {
        onDelete(buildingId);
        clearSelection();
      }
    },
    [onDelete, clearSelection],
  );

  const handleDeleteSelected = useCallback(() => {
    if (onBulkDelete && selectedRows.length > 0) {
      onBulkDelete(selectedRows);
      clearSelection();
    }
  }, [onBulkDelete, selectedRows, clearSelection]);

  const columns: GridColDef[] = [
    {
      field: 'buildingId',
      headerName: 'Mã tòa nhà',
      flex: 1,
    },
    {
      field: 'buildingName',
      headerName: 'Tòa nhà',
      flex: 1,
    },
    {
      field: 'totalFloors',
      headerName: 'Số tầng',
      flex: 1,
    },
    {
      field: 'totalApartments',
      headerName: 'Số căn hộ',
      flex: 1,
    },
    {
      field: 'totalResidents',
      headerName: 'Số cư dân',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditBuilding(params.row as Building);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditBuilding(params.row as Building);
            }}
            sx={{ color: 'orange' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBuilding(params.row.buildingId);
            }}
            sx={{ color: 'red' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const CustomToolbar = () => (
    <Stack direction="row" spacing={2} alignItems="center" p={2}>
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteSelected}
        >
          Delete Selected ({selectedRows.length})
        </Button>
      )}
      <GridToolbar />
    </Stack>
  );

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        loading={isLoading}
        rows={buildings}
        columns={columns}
        getRowId={(row) => row.buildingId}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection as number[]);
        }}
        rowSelectionModel={selectedRows}
      />
    </Paper>
  );
};

export default BuildingsDataGrid;
