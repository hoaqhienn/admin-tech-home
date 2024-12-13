import { Button, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useEvents } from 'hooks/service/useEvent';
import { DeleteIcon, EditIcon, Info } from 'lucide-react';
import { useState, useCallback } from 'react';
import { NewEvent } from 'interface/Utils'; // Import NewEvent type

interface DataGridProps {
  onEdit?: (event: NewEvent) => void; // Changed from Event to NewEvent
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const EventDataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { events, isLoading } = useEvents();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (event: NewEvent) => {
      // Changed from Event to NewEvent
      if (onEdit) {
        onEdit(event);
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

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';

    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'eventId',
      headerName: 'Mã sự kiện',
      flex: 1,
    },
    {
      field: 'eventName',
      headerName: 'Tên sự kiện',
      flex: 1,
    },
    {
      field: 'eventDescription',
      headerName: 'Mô tả',
      flex: 1.5,
    },
    {
      field: 'eventLocation',
      headerName: 'Địa điểm',
      flex: 1,
    },
    {
      field: 'eventDate',
      headerName: 'Ngày tổ chức',
      flex: 1,
      renderCell: (params) => formatDate(params.row.eventDate),
    },
    {
      field: 'buildingId',
      headerName: 'Tòa nhà',
      flex: 0.5,
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
              handleEdit(params.row as NewEvent); // Cast to NewEvent
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as NewEvent); // Cast to NewEvent
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.eventId);
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
        rows={events}
        columns={columns}
        getRowId={(row) => row.eventId}
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

export default EventDataGrid;
