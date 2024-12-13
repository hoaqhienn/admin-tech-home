import { Button, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useFacilities } from 'hooks/properties/useFacility';
import { Facility } from 'interface/Properties';
import { DeleteIcon, EditIcon } from 'lucide-react';
import { useState, useCallback } from 'react';

interface DataGridProps {
  onEdit?: (s: Facility) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const FacilityDataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { facilities, isLoading } = useFacilities();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (s: Facility) => {
      if (onEdit) {
        onEdit(s);
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

  //   const formatDate = (dateValue: any): string => {
  //     if (!dateValue) return '';

  //     try {
  //       // If it's already a Date object or if it's a string, try to create a Date object
  //       const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  //       if (isNaN(date.getTime())) {
  //         return 'Invalid Date';
  //       }

  //       // Format as DD/MM/YYYY
  //       const day = date.getDate().toString().padStart(2, '0');
  //       const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //       const year = date.getFullYear();

  //       return `${day}/${month}/${year}`;
  //     } catch (error) {
  //       console.error('Error formatting date:', error);
  //       return 'Invalid Date';
  //     }
  //   };

  const columns: GridColDef[] = [
    {
      field: 'facilityId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'facilityName',
      headerName: 'Tên cơ sở vật chất',
      flex: 2,
    },
    {
      field: 'facilityDescription',
      headerName: 'Mô tả',
      flex: 2,
    },
    {
      field: 'facilityLocation',
      headerName: 'Địa điểm',
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
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Facility);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Facility);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.facilityId);
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
        rows={facilities}
        columns={columns}
        getRowId={(row) => row.facilityId}
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

export default FacilityDataGrid;
