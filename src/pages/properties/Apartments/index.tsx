import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

import { Apartment } from 'interface/Properties';
import { Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import ScrollToTop from 'components/fab/ScrollToTop';
import { useApartments } from 'hooks/useApartment';
import { ApartmentCard } from './ApartmentCard';
import { FormDialog, TextFieldProps } from 'components/input/FormDialog';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import IconifyIcon from 'components/base/IconifyIcon';
import { useBuildings } from 'hooks/useBuilding';

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
  const { buildingIds, fetchBuildings } = useBuildings();
  const {
    apartments,
    fetchApartments,
    addApartment,
    updateApartment,
    deleteApartment,
    searchApartments,
  } = useApartments();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);

  const [newApartment, setNewApartment] = useState({
    apartmentNumber: '',
    apartmentType: '',
    createdAt: '',
    updatedAt: '',
    floorId: '',
  });

  useEffect(() => {
    fetchBuildings();
    fetchApartments();
  }, []);

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
    const updatedAt = new Date().toISOString();

    if (isEditing && currentApartment) {
      // Update the apartment
      const updatedApartment: Apartment = {
        ...currentApartment,
        apartmentNumber: newApartment.apartmentNumber,
        apartmentType: newApartment.apartmentType,
        createdAt: newApartment.createdAt,
        updatedAt: updatedAt,
        floorId: parseInt(newApartment.floorId),
      };

      await updateApartment(updatedApartment);
    } else {
      // Add new apartment
      const createdAt = new Date().toISOString();
      const newApartmentData: Omit<Apartment, 'apartmentId'> = {
        apartmentNumber: newApartment.apartmentNumber,
        apartmentType: newApartment.apartmentType,
        createdAt,
        updatedAt,
        floorId: parseInt(newApartment.floorId),
      };
      await addApartment(newApartmentData);
    }

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

  const [selectedBuildingIds, setSelectedBuildingIds] = useState<number>();

  const handleCheckboxChange = (buildingId: number) => {
    setSelectedBuildingIds(buildingId);
    searchApartments({ buildingId: selectedBuildingIds, floorId: [] });
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
          <Typography variant="h2">Apartments</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h6">Filter by Building ID:</Typography>
            {buildingIds.map((id) => (
              <FormControlLabel
                key={id}
                control={
                  <Checkbox
                    checked={selectedBuildingIds === id}
                    onClick={() => handleCheckboxChange(id)}
                    value={id}
                  />
                }
                label={`Building ${id}`}
              />
            ))}
            <Typography variant="h6">Filter by Floor Number:</Typography>
          </Paper>
        </Grid>

        {apartments.map((a) => (
          <Grid item xs={6} md={4} key={a.apartmentId}>
            <ApartmentCard
              apartment={a}
              handleToggle={() => {}}
              handleEdit={() => {
                handleClickOpen(a);
              }}
              handleDelete={() => {
                deleteApartment(a.apartmentId);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Apartments;
