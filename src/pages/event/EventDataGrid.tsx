import { Button, Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useEvents } from 'hooks/service/useEvent';
import { DeleteIcon, Info, RefreshCcw } from 'lucide-react';
import { useState, useCallback } from 'react';
import { NewEvent } from 'interface/Utils'; // Import NewEvent type
import { formatDate } from 'utils/dateUtils';

interface DataGridProps {
  onEdit?: (event: NewEvent) => void; // Changed from Event to NewEvent
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const EventDataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { events, isLoading, refetch } = useEvents();
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

  const columns: GridColDef[] = [
    {
      field: 'eventId',
      headerName: 'Mã sự kiện',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'eventName',
      headerName: 'Tên sự kiện',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'eventDescription',
      headerName: 'Mô tả',
      flex: 1.5,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'eventLocation',
      headerName: 'Địa điểm',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'eventDate',
      headerName: 'Ngày tổ chức',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const eventDate = new Date(params.row.eventDate);
        const currentDate = new Date();
        const isFutureEvent = eventDate > currentDate;

        return (
          <Chip
            label={formatDate(params.row.eventDate)}
            color={isFutureEvent ? 'success' : 'default'}
            sx={{
              backgroundColor: isFutureEvent ? 'green' : 'gray',
              color: 'white',
            }}
            size="small"
          />
        );
      },
    },
    {
      field: 'buildingId',
      headerName: 'Tòa nhà',
      flex: 0.5,
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
              handleEdit(params.row as NewEvent); // Cast to NewEvent
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as NewEvent); // Cast to NewEvent
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton> */}
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
      <Tooltip title="Refresh Data">
        <IconButton size="small" onClick={() => refetch()}>
          <RefreshCcw />
        </IconButton>
      </Tooltip>
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
