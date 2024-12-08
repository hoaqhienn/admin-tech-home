import { Button, Chip, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useBills } from 'hooks/payment/useBill';
import { Bill } from 'interface/Bill';
import { DeleteIcon, EditIcon, Info } from 'lucide-react';
import { useState, useCallback } from 'react';

interface DataGridProps {
  onEdit?: (s: Bill) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const BillDataGrid: React.FC<DataGridProps> = ({ onEdit, onDelete, onBulkDelete }) => {
  const { bills, isLoading } = useBills();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (s: Bill) => {
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

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';

    try {
      // If it's already a Date object or if it's a string, try to create a Date object
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      // Format as DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const randomDate = new Date(
    new Date().getTime() - Math.floor(Math.random() * 10000000000),
  ).toISOString();

  const columns: GridColDef[] = [
    {
      field: 'billId',
      headerName: 'ID',
      flex: 0.5,
    },
    {
      field: 'billName',
      headerName: 'Tên hóa đơn',
      flex: 1,
    },
    // {
    //   field: 'serviceBookingId',
    //   headerName: 'Mã dịch vụ',
    //   flex: 0.5,
    // },
    {
      field: 'residentId',
      headerName: 'Mã cư dân',
      flex: 0.5,
    },
    {
      field: 'residentName',
      headerName: 'Tên cư dân',
      flex: 1,
    },
    {
      field: 'billDate',
      headerName: 'Ngày lập',
      flex: 1,
      renderCell: () => (
        // random date
        <Chip label={formatDate(randomDate)} />
      ),
    },
    {
      field: 'billStatus',
      headerName: 'Trạng thái',
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value as string;
        let color;
        let backgroundColor;

        switch (status) {
          case 'PAID':
            color = '#1B5E20'; // Dark green text
            backgroundColor = '#E8F5E9'; // Light green background
            break;
          case 'UNPAID':
            color = '#B71C1C'; // Dark red text
            backgroundColor = '#FFEBEE'; // Light red background
            break;
          default:
            color = 'text.primary';
            backgroundColor = 'grey.100';
        }

        return (
          <Chip
            label={status}
            sx={{
              color: color,
              backgroundColor: backgroundColor,
              fontWeight: 'medium',
              minWidth: '80px',
            }}
          />
        );
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
              handleEdit(params.row as Bill);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Bill);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.serviceId);
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
        rows={bills}
        columns={columns}
        getRowId={(row) => row.billId}
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
        pageSizeOptions={[5, 10, 20, 30]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection as number[]);
        }}
        rowSelectionModel={selectedRows}
      />
    </Paper>
  );
};

export default BillDataGrid;
