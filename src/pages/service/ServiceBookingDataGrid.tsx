import { Button, Chip, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useDeleteServiceBookingMutation, useGetServiceBookingsQuery } from 'api/serviceApi';
import { ServiceBooking } from 'interface/Service';
import { DeleteIcon } from 'lucide-react';
import { useState, useCallback } from 'react';

interface DataGridProps {
  onEdit?: (s: ServiceBooking) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const ServiceBookingDataGrid: React.FC<DataGridProps> = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const { data: services = [], isLoading } = useGetServiceBookingsQuery();

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const [deleteServiceBooking] = useDeleteServiceBookingMutation();

  const handleDelete = useCallback(
    (id: number) => {
      deleteServiceBooking(id);
      clearSelection();
    },
    [clearSelection],
  );

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

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      selectedRows.forEach((id) => deleteServiceBooking(id));
      clearSelection();
    }
  }, [selectedRows, clearSelection]);

  const columns: GridColDef[] = [
    {
      field: 'serviceBookingId',
      headerName: 'Mã đặt dịch vụ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'serviceId',
      headerName: 'Mã dịch vụ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'residentId',
      headerName: 'Mã cư dân',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'bookingStatus',
      headerName: 'Trạng thái',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'bookingDate',
      headerName: 'Ngày đặt dịch vụ',
      flex: 1,
      renderCell: (params) => formatDate(params.row.bookingDate),
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
            disabled={true}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.serviceBookingId);
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
        rows={services}
        columns={columns}
        getRowId={(row) => row.serviceBookingId}
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

export default ServiceBookingDataGrid;
