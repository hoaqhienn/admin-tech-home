import { Button, Chip, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useExternalServices } from 'hooks/service/useExternalService';
import { OutsourcingService } from 'interface/Ad';
import { DeleteIcon, Info } from 'lucide-react';
import { useState, useCallback } from 'react';
import { formatDate } from 'utils/dateUtils';

interface DataGridProps {
  onEdit?: (s: OutsourcingService) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const ExternalServiceDataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { eServices, isLoading } = useExternalServices();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (s: OutsourcingService) => {
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

  const columns: GridColDef[] = [
    {
      field: 'outsourcingServiceId',
      headerName: 'Mã dịch vụ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'outsourcingServiceName',
      headerName: 'Tên dịch vụ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'outsourcingServiceType',
      headerName: 'Danh mục',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'outsourcingServiceStatus',
      headerName: 'Trạng thái', // ACTIVE | INACTIVE
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        // render chip
        return (
          <Chip
            label={params.value === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}
            color={params.value === 'ACTIVE' ? 'success' : 'error'}
            size="small"
          />
        );
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
      headerName: 'Hành động',
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
              handleEdit(params.row as OutsourcingService);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.outsourcingServiceId);
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
        rows={eServices}
        columns={columns}
        getRowId={(row) => row.outsourcingServiceId}
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

export default ExternalServiceDataGrid;
