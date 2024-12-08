import Grid from '@mui/material/Grid';
import { useState } from 'react';

import { Apartment } from 'interface/Properties';
import { Typography } from '@mui/material';
import ScrollToTop from 'components/fab/ScrollToTop';
import { FormDialog, TextFieldProps } from 'components/input/FormDialog';
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
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);
  console.log('currentApartment:', currentApartment);

  const [newApartment, setNewApartment] = useState({
    apartmentNumber: '',
    apartmentType: '',
    createdAt: '',
    updatedAt: '',
    floorId: '',
  });

  const handleClickOpen = (apartment?: Apartment) => {
    if (apartment) {
      setNewApartment({
        apartmentNumber: apartment.apartmentNumber,
        apartmentType: apartment.apartmentType,
        createdAt: apartment.createdAt,
        updatedAt: apartment.updatedAt,
        floorId: apartment.floorId.toString(),
      });
      setCurrentApartment(apartment);
      setIsEditing(true);
    } else {
      setNewApartment({
        apartmentNumber: '',
        apartmentType: '',
        createdAt: '',
        updatedAt: '',
        floorId: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentApartment(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewApartment({ ...newApartment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // const updatedAt = new Date().toISOString();

    // if (isEditing && currentApartment) {
    //   // Update the apartment
    //   const updatedApartment: Apartment = {
    //     ...currentApartment,
    //     apartmentNumber: newApartment.apartmentNumber,
    //     apartmentType: newApartment.apartmentType,
    //     createdAt: newApartment.createdAt,
    //     updatedAt: updatedAt,
    //     floorId: parseInt(newApartment.floorId),
    //   };

    //   await updateApartment(updatedApartment);
    // } else {
    //   // Add new apartment
    //   const createdAt = new Date().toISOString();
    //   const newApartmentData: Omit<Apartment, 'apartmentId'> = {
    //     apartmentNumber: newApartment.apartmentNumber,
    //     apartmentType: newApartment.apartmentType,
    //     createdAt,
    //     updatedAt,
    //     floorId: parseInt(newApartment.floorId),
    //     floorNumber: -1,
    //     buildingId: -1,
    //     buildingName: '',
    //     residents: [],
    //   };
    //   await addApartment(newApartmentData);
    // }

    handleClose();
  };

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:add" />,
      title: 'Add Apartment',
      onClick: () => {
        handleClickOpen();
      },
    },
  ];

  const inputs: TextFieldProps[] = [
    {
      name: 'apartmentNumber',
      label: 'Apartment Number',
      value: newApartment.apartmentNumber,
    },
    {
      name: 'apartmentType',
      label: 'Apartment Type',
      value: newApartment.apartmentType,
    },
    {
      name: 'floorId',
      label: 'Floor ID',
      value: newApartment.floorId,
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
      <FormDialog
        open={open}
        isEditing={isEditing}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        textInput={inputs}
      />
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h1">Danh sách căn hộ</Typography>
        </Grid>
        <Grid item xs={12}>
          <ApartmentsDataGrid
            onEdit={handleClickOpen}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Apartments;
