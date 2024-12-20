import { Button, Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useVehicles } from 'hooks/resident/useVehicle';
import { Vehicle } from 'interface/Vehicle';
import { DeleteIcon, EditIcon, RefreshCcw } from 'lucide-react';
import { useState, useCallback } from 'react';
import { formatDate } from 'utils/dateUtils';

interface DataGridProps {
  onEdit?: (v: Vehicle) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const VehicleDataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { vehicles, isLoading, refetch } = useVehicles();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (v: Vehicle) => {
      if (onEdit) {
        onEdit(v);
        clearSelection();
      }
    },
    [onEdit, clearSelection],
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (onDelete) {
        onDelete(id);
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
      field: 'vehicleId',
      headerName: 'Mã phương tiện',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'vehicleNumber',
      headerName: 'Biển số',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'vehicleType',
      headerName: 'Loại',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'residentId',
      headerName: 'Mã cư dân',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Cập nhật lần cuối',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const date = formatDate(params.value);
        return <Chip label={date} color="primary" size="medium" />;
      },
    },
    // {
    //   field: 'Resident.fullname',
    //   headerName: 'Username',
    //   flex: 1,
    //   // renderCell: (params) => params.row.Resident?.User?.fullname,
    // },
    // {
    //   field: 'Resident.User.email',
    //   headerName: 'Email',
    //   flex: 1,
    //   renderCell: (params) => params.row.Resident?.User?.email,
    // },
    // {
    //   field: 'Resident.phonenumber',
    //   headerName: 'Số điện thoại',
    //   flex: 1,
    //   renderCell: (params) => params.row.Resident?.phonenumber,
    // },
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
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Vehicle);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Vehicle);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.vehicleId);
              console.log(params.row);
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
        rows={vehicles}
        columns={columns}
        getRowId={(row) => row.vehicleId}
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

export default VehicleDataGrid;
