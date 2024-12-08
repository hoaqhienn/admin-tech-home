import Grid from '@mui/material/Grid';
import { Apartment } from 'interface/Properties';
import { Typography } from '@mui/material';
import ScrollToTop from 'components/fab/ScrollToTop';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import IconifyIcon from 'components/base/IconifyIcon';
import ApartmentsDataGrid from './ApartmentsDataGrid';

export interface FloorProps {
  floorId: number;
  floorNumber: number;
  apartments: Apartment[];
}

export interface BuildingProps {
  buildingId: number;
  buildingName: string;
  floors: FloorProps[];
}

const Apartments = () => {
  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Add Apartment',
      onClick: () => {
        console.log('Add Apartment');
      },
    },
  ];

  const handleDelete = async (apartmentId: number) => {
    // await fetch(`/api/apartments/${apartmentId}`, { method: 'DELETE' });
    // fetchApartments();
    console.log('Delete:', apartmentId);
  };

  const handleBulkDelete = async (apartmentIds: number[]) => {
    console.log('Bulk delete:', apartmentIds);
  };

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách căn hộ</Typography>
        </Grid>
        <Grid item xs={12}>
          <ApartmentsDataGrid onDelete={handleDelete} onBulkDelete={handleBulkDelete} />
        </Grid>
      </Grid>
    </>
  );
};

export default Apartments;
