import { Button, Chip, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useActiveResidentMutation } from 'api/residentApi';
import { useResidents } from 'hooks/resident/useResident';
import { Resident, ResidentViaApartment } from 'interface/Residents';
import { DeleteIcon, EditIcon } from 'lucide-react';
import { useState, useCallback } from 'react';

interface DataGridProps {
  onEdit?: (r: Resident) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onSelectionChange?: (selectedResidents: ResidentViaApartment[]) => void;
}

const ResidentsDataGrid: React.FC<DataGridProps> = ({
  onEdit,
  onDelete,
  onBulkDelete,
  onSelectionChange,
}) => {
  const { residents, isLoading } = useResidents();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // const active = useActiveResidentMutation
  const [toggleActive] = useActiveResidentMutation();

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEditBuilding = useCallback(
    (building: Resident) => {
      if (onEdit) {
        onEdit(building);
        clearSelection();
      }
    },
    [onEdit, clearSelection],
  );

  const handleDelete = useCallback(
    (residentId: number) => {
      if (onDelete) {
        onDelete(residentId);
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

  const handleToggleActive = useCallback((residentId: number) => {
    // Call the mutation
    toggleActive({ residentId });
  }, []);

  // New handler for selection changes
  const handleSelectionChange = useCallback(
    (newSelection: number[]) => {
      setSelectedRows(newSelection);

      // Get the full resident objects for selected rows
      const selectedResidents = residents.filter((resident) =>
        newSelection.includes(resident.residentId),
      );

      // Call the callback with selected residents
      onSelectionChange?.(selectedResidents);
    },
    [residents, onSelectionChange],
  );

  const columns: GridColDef[] = [
    {
      field: 'residentId',
      headerName: 'ID',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'idcard',
      headerName: 'Mã định danh',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'fullname',
      headerName: 'Họ và tên',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'phonenumber',
      headerName: 'Số điện thoại',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant={'contained'}
          color={params.row.status ? 'success' : 'error'}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(params.row.residentId);
          }}
        >
          {params.row.status ? 'Active' : 'Inactive'}
        </Button>
      ),
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
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditBuilding(params.row as Resident);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditBuilding(params.row as Resident);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.residentId);
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
    </Stack>
  );

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        loading={isLoading}
        rows={residents}
        columns={columns}
        getRowId={(row) => row.residentId}
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
          handleSelectionChange(newSelection as number[]);
        }}
        rowSelectionModel={selectedRows}
      />
    </Paper>
  );
};

export default ResidentsDataGrid;
