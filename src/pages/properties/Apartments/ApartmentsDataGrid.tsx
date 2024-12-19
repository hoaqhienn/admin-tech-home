import { Button, Chip, IconButton, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useApartments } from 'hooks/properties/useApartment';
import { Apartment } from 'interface/Properties';
import { DeleteIcon, Info } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApartmentsDataGridProps {
  onEdit?: (a: Apartment) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

const ApartmentsDataGrid: React.FC<ApartmentsDataGridProps> = ({ onDelete, onBulkDelete }) => {
  const { apartments, isLoading } = useApartments();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const nav = useNavigate();

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  // const handleEdit = useCallback(
  //   (a: Apartment) => {
  //     if (onEdit) {
  //       onEdit(a);
  //       clearSelection();
  //     }
  //   },
  //   [onEdit, clearSelection],
  // );

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
      field: 'apartmentId',
      headerName: 'Mã căn hộ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'apartmentNumber',
      headerName: 'Số căn hộ',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    // {
    //   field: 'apartmentType',
    //   headerName: 'Loại căn hộ',
    //   flex: 1,
    // },
    // {
    //   field: 'apartmentSize',
    //   headerName: 'Diện tích',
    //   flex: 1,
    //   renderCell: () => (
    //     <div
    //       style={{
    //         width: '100%',
    //         height: '100%',
    //         display: 'flex',
    //         alignItems: 'center',
    //       }}
    //     >
    //       <Typography>
    //         70m<sup>2</sup>
    //       </Typography>
    //     </div>
    //   ),
    // },
    {
      field: 'floorNumber',
      headerName: 'Tầng',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'buildingName',
      headerName: 'Tòa nhà',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <Chip label={params.value} color="primary" size="medium" />;
      },
    },
    {
      field: 'totalResidents',
      headerName: 'Số cư dân',
      flex: 1,
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
              nav(`/apartments/${params.row.apartmentId}`);
            }}
            sx={{ color: 'blue' }}
          >
            <Info fontSize="small" />
          </IconButton>
          {/* <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row as Apartment);
            }}
            sx={{ color: 'warning.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.apartmentId);
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
    <>
      <Paper sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          loading={isLoading}
          rows={apartments}
          columns={columns}
          getRowId={(row) => row.apartmentId}
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
    </>
  );
};

export default ApartmentsDataGrid;
