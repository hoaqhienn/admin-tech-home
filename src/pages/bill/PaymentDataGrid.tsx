import { Button, Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { usePayments } from 'hooks/payment/usePayment';
import { Payment } from 'interface/Bill';
import { DeleteIcon, Info, RefreshCcw } from 'lucide-react';
import { useState, useCallback } from 'react';

interface DataGridProps {
  onEdit?: (s: Payment) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const PaymentDataGrid: React.FC<DataGridProps> = ({ onEdit, onBulkDelete }) => {
  const { payments, isLoading, refetch } = usePayments();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback(
    (s: Payment) => {
      if (onEdit) {
        onEdit(s);
        clearSelection();
      }
    },
    [onEdit, clearSelection],
  );

  // const handleDelete = useCallback(
  //   (id: number) => {
  //     if (onDelete) {
  //       onDelete(id);
  //       clearSelection();
  //     }
  //   },
  //   [onDelete, clearSelection],
  // );

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

  const columns: GridColDef[] = [
    {
      field: 'paymentId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'paymentAmount',
      headerName: 'Số tiền thanh toán',
      flex: 1,
    },
    {
      field: 'paymentDate',
      headerName: 'Ngày thanh toán',
      flex: 1,
      renderCell: (params) => {
        const date = params.value as string;
        return formatDate(date);
      },
    },
    {
      field: 'orderCode',
      headerName: 'Order Code',
      flex: 1,
    },
    {
      field: 'paymentStatus',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => {
        const status = params.value as string;
        let color;
        let backgroundColor;

        switch (status) {
          case 'Success':
            color = '#1B5E20'; // Dark green text
            backgroundColor = '#E8F5E9'; // Light green background
            break;
          case 'Failed':
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
              handleEdit(params.row as Payment);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Payment);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.paymentId);
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton> */}
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
        rows={payments}
        columns={columns}
        getRowId={(row) => row.paymentId}
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

export default PaymentDataGrid;
