import { Button, Chip, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useComplaints } from 'hooks/service/useComplaint';
import { Complaint } from 'interface/Utils';
import { DeleteIcon, Info, RefreshCcw } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import ComplaintStatusDialog from './ComplaintStatusDialog';
import { formatDate } from 'utils/dateUtils';

interface DataGridProps {
  onEdit?: (s: Complaint) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onStatusUpdate?: (id: number, status: string) => Promise<void>;
}

const ComplaintDataGrid4: React.FC<DataGridProps> = ({ onDelete, onBulkDelete, onStatusUpdate }) => {
  const { complaints, isLoading, refetch: refetchComplaints } = useComplaints();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    // Load trạng thái hiện tại của khiếu nại khi dialog mở
    if (statusDialogOpen && selectedComplaint) {
      setSelectedComplaint(selectedComplaint);
    }
  }, [statusDialogOpen, selectedComplaint]);

  const handleStatusUpdate = async (status: string) => {
    if (selectedComplaint && onStatusUpdate) {
      try {
        await onStatusUpdate(selectedComplaint.complaintId, status);
        setUpdateError(null); // Clear any previous error
      } catch (error) {
        setUpdateError('Failed to update the status. Please try again later.');
      }
    }
    setStatusDialogOpen(false);
    setSelectedComplaint(null);
  };

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

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

  const getNonEmptyValue = (value: any, defaultValue: string = 'N/A') => {
    return value || defaultValue;
  };

  const columns: GridColDef[] = [
    {
      field: 'complaintId',
      headerName: 'ID',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'complaintTitle',
      headerName: 'Tiêu đề',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'complaintDescription',
      headerName: 'Mô tả',
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="small" />;
      },
    },
    {
      field: 'complaintDate',
      headerName: 'Ngày tạo',
      flex: 1,
      renderCell: (params) => {
        const date = formatDate(params.value);
        return <Chip label={date} color="primary" size="medium" />;
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Cập nhật lần cuối',
      flex: 1,
      renderCell: (params) => {
        const date = formatDate(params.value);
        return <Chip label={date} color="primary" size="medium" />;
      },
    },
    {
      field: 'complaintStatus',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => {
        const status = params.value as string;
        let color;
        let backgroundColor;
        switch (status) {
          case 'Resolved':
            color = '#1B5E20';
            backgroundColor = '#E8F5E9';
            break;
          case 'Rejected':
            color = '#B71C1C';
            backgroundColor = '#FFEBEE';
            break;
          case 'Pending':
            color = 'orange';
            backgroundColor = '#E8F5E9';
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
      field: 'buildingId',
      headerName: 'Mã tòa nhà',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={getNonEmptyValue(params.value)} color="primary" size="small" />;
      },
    },
    {
      field: 'floorId',
      headerName: 'Mã tầng',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={getNonEmptyValue(params.value)} color="primary" size="small" />;
      },
    },
    {
      field: 'apartmentId',
      headerName: 'Mã căn hộ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={getNonEmptyValue(params.value)} color="primary" size="small" />;
      },
    },
    {
      field: 'residentId',
      headerName: 'Mã cư dân',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={getNonEmptyValue(params.value)} color="primary" size="small" />;
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
        <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'center' }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComplaint(params.row as Complaint);
              setStatusDialogOpen(true);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.complaintId);
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
        <IconButton size="small" onClick={() => refetchComplaints()}>
          <RefreshCcw />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        loading={isLoading}
        rows={complaints.filter(complaint => complaint.complaintStatus === 'Rejected')}
        columns={columns}
        getRowId={(row) => row.complaintId}
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
      <ComplaintStatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        currentStatus={selectedComplaint?.complaintStatus || ''}
        complaint={
          selectedComplaint
            ? {
                title: selectedComplaint.complaintTitle,
                description: selectedComplaint.complaintDescription,
                date: formatDate(selectedComplaint.complaintDate),
                status: selectedComplaint.complaintStatus,
              }
            : { title: '', description: '', date: '', status: '' }
        } // Ensure default values
      />
      {updateError && (
        <Paper sx={{ p: 2, mt: 2, backgroundColor: 'error.light', color: 'error.contrastText' }}>
          {updateError}
        </Paper>
      )}
    </Paper>
  );
};

export default ComplaintDataGrid4;
