import { Grid, Typography } from '@mui/material';
import { Apartment, Building, Floor } from 'interface/Properties';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Introduction } from './Introduction';
import { BuildingSelected } from './BuildingSelected';
import { FloorSelected } from './FloorSelected';
import { ApartmentSelected } from './ApartmentSelected';
import { ResidentView } from './ResidentView';
import ScrollToTop from 'components/fab/ScrollToTop';
import IconifyIcon from 'components/base/IconifyIcon';
import { SpeedDialActionType, SpeedDialCustom } from 'components/fab/SpeedDial';
import { useFloors } from 'hooks/useFloor';
import { useBuildings } from 'hooks/useBuilding';
import { useApartments } from 'hooks/useApartment';
import { useResidents } from 'hooks/useResident';
import paths from 'routes/paths';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const navigate = useNavigate();

  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);

  const buildingSectionRef = useRef<HTMLDivElement>(null);
  const floorSectionRef = useRef<HTMLDivElement>(null);
  const apartmentSectionRef = useRef<HTMLDivElement>(null);
  const residentSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  const { fetchBuildings, buildings } = useBuildings();
  const { fetchFloors, floors, fetchFloorsByBuildingId } = useFloors();
  const { fetchApartments, fetchApartmentsByFloorId, apartments } = useApartments();
  const { fetchResidents, fetchResidentsByApartment, residents, clearResident } = useResidents();

  const initialFetch = useCallback(() => {
    setCurrentBuilding(null);
    setCurrentFloor(null);
    setCurrentApartment(null);
    clearResident();
    fetchBuildings();
    fetchFloors();
    fetchApartments();
    fetchResidents();
  }, []);

  useEffect(() => {
    initialFetch();
  }, []);

  useEffect(() => {
    if (currentBuilding) {
      fetchFloorsByBuildingId(currentBuilding.buildingId);
    } else {
      setCurrentFloor(null);
    }
  }, [currentBuilding]);

  const handleBuildingClick = useCallback((building: Building) => {
    scrollToSection(floorSectionRef);
    console.log('building', building);
    setCurrentBuilding(building);
    setCurrentFloor(null);
    setCurrentApartment(null);
  }, []);

  const handleFloorClick = useCallback((floor: Floor) => {
    scrollToSection(apartmentSectionRef);
    setCurrentFloor(floor);
    fetchApartmentsByFloorId(floor.floorId);
    setCurrentApartment(null);
    clearResident();
  }, []);

  const handleApartmentClick = useCallback((apartment: Apartment) => {
    scrollToSection(residentSectionRef);
    setCurrentApartment(apartment);
    fetchResidentsByApartment(apartment.apartmentId);
  }, []);

  // const useState title / setTitle type string

  const actions: SpeedDialActionType[] = [
    {
      icon: <IconifyIcon icon="ic:person-add" />,
      title: 'Resident',
      onClick: () => {},
    },
    {
      icon: <IconifyIcon icon="ic:baseline-bed" />,
      title: 'Apartment',
      onClick: () => {},
    },
    { icon: <IconifyIcon icon="ic:baseline-layers" />, title: 'Floor', onClick: () => {} },
    {
      icon: <IconifyIcon icon="ic:baseline-apartment" />,
      title: 'Building',
      onClick: () => {
        navigate(paths.buildings);
      },
    },
    {
      icon: <IconifyIcon icon="ic:baseline-refresh" />,
      title: 'Floor',
      onClick: () => {
        initialFetch();
        scrollToSection(buildingSectionRef);
      },
    },
  ];

  return (
    <>
      <ScrollToTop />
      <SpeedDialCustom actions={actions} />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h2">Overview</Typography>
        </Grid>
        <Grid item xs={12}>
          <Introduction />
        </Grid>
        <Grid item xs={12} ref={buildingSectionRef}>
          <BuildingSelected
            buildings={buildings}
            currentBuilding={currentBuilding}
            onBuildingSelect={handleBuildingClick}
          />
        </Grid>
        <Grid item xs={12} ref={floorSectionRef}>
          <FloorSelected
            floors={floors}
            currentFloor={currentFloor}
            onFloorSelect={handleFloorClick}
          />
        </Grid>

        <Grid item xs={12} ref={apartmentSectionRef}>
          <ApartmentSelected
            apartments={apartments}
            currentApartment={currentApartment}
            onApartmentSelect={handleApartmentClick}
          />
        </Grid>
        <Grid item xs={12} ref={residentSectionRef}>
          <ResidentView residents={residents} />
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
