import { Button, Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useFloors } from 'hooks/properties/useFloor';
import { Floor } from 'interface/Properties';
import { DeleteIcon, EditIcon, RefreshCcw } from 'lucide-react';
import { useState, useCallback } from 'react';

interface FloorsDataGridProps {
  onEdit?: (floor: Floor) => void;
  onDelete?: (floorId: number) => void;
  onBulkDelete?: (floorIds: number[]) => void;
}

const FloorsDataGrid: React.FC<FloorsDataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { floors, isLoading, refetch } = useFloors();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEditFloor = useCallback(
    (floor: Floor) => {
      if (onEdit) {
        onEdit(floor);
        clearSelection();
      }
    },
    [onEdit, clearSelection],
  );

  const handleDeleteFloor = useCallback(
    (floorId: number) => {
      if (onDelete) {
        onDelete(floorId);
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
      field: 'floorId',
      headerName: 'Mã tầng',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'floorNumber',
      headerName: 'Số tầng',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'buildingId',
      headerName: 'Mã tòa nhà',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'buildingName',
      headerName: 'Tên tòa nhà',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'totalResidents',
      headerName: 'Số cư dân',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
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
              handleEditFloor(params.row as Floor);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFloor(params.row.floorId);
            }}
            sx={{ color: 'error.main' }}
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
      <Tooltip title="Refresh Data">
        <IconButton size="small" onClick={() => refetch()}>
          <RefreshCcw/>
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        loading={isLoading}
        rows={floors}
        columns={columns}
        getRowId={(row) => row.floorId}
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
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20, 30]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection as number[]);
        }}
        rowSelectionModel={selectedRows}
      />
    </Paper>
  );
};

export default FloorsDataGrid;
