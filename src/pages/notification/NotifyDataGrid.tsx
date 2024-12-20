import { Button, Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useNotifications } from 'hooks/service/useNotify';
import { Notify } from 'interface/Utils';
import { DeleteIcon, Info, RefreshCcw, Send } from 'lucide-react';
import { useState, useCallback } from 'react';
import { formatDate } from 'utils/dateUtils';

interface DataGridProps {
  onEdit?: (notify: Notify) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onSendNotification?: (notify: Notify) => void;
}

const NotifyDataGrid: React.FC<DataGridProps> = ({
  onEdit,
  onDelete,
  onBulkDelete,
  onSendNotification,
}) => {
  const { notifications, isLoading, refetch } = useNotifications();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (s: Notify) => {
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
        console.log('Delete notification');
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

  const handleSendNotification = useCallback(
    (s: Notify) => {
      if (onSendNotification) {
        onSendNotification(s); // Trigger onSendNotification when the user clicks "Send"
        clearSelection();
      }
    },
    [onSendNotification, clearSelection],
  );

  const columns: GridColDef[] = [
    {
      field: 'notificationId',
      headerName: 'ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'notificationTitle',
      headerName: 'Tiêu đề',
      flex: 1.5,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'notificationBody',
      headerName: 'Mô tả',
      flex: 2,
      headerAlign: 'center',
      align: 'left',
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
              handleSendNotification(params.row as Notify);
            }}
            sx={{ color: 'lightgreen' }}
          >
            <Send fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Notify);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Notify);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.notificationId);
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
        rows={notifications}
        columns={columns}
        getRowId={(row) => row.notificationId}
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

export default NotifyDataGrid;
