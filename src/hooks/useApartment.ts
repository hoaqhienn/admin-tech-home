import {
  ApartmentsByFloor,
  PostApartment,
  PutApartment,
  SearchApartments,
  SearchProps,
} from './../services/apartmentService';
import { Apartment } from 'interface/Properties';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteApartment, GetApartments } from 'services/apartmentService';
import { RootState } from 'store';
import { setApartments } from 'store/slices/apartmentSlice';

export const useApartments = () => {
  const dispatch = useDispatch();
  const apartments = useSelector((state: RootState) => state.rootReducer.apartments.apartments);

  const updateApartments = (apartments: Apartment[]) => {
    dispatch(setApartments(apartments));
  };

  const fetchApartments = async () => {
    const apartments = await GetApartments();
    updateApartments(apartments);
  };

  const fetchApartmentsByFloorId = async (floorId: number) => {
    const apartments = await ApartmentsByFloor(floorId);
    updateApartments(apartments);
  };

  const addApartment = async (apartment: Omit<Apartment, 'apartmentId'>) => {
    await PostApartment(apartment);
    fetchApartments();
  };

  const updateApartment = async (apartment: Apartment) => {
    await PutApartment(apartment);
    fetchApartments();
  };

  const deleteApartment = async (apartmentId: number) => {
    await DeleteApartment(apartmentId);
    fetchApartments();
  };

  const searchApartments = async ({ floorId, buildingId }: SearchProps) => {
    const apartments : Apartment[] = await SearchApartments({ floorId, buildingId });
    updateApartments(apartments);
  };

  return {
    apartments,
    updateApartments,
    fetchApartments,
    fetchApartmentsByFloorId,
    addApartment,
    updateApartment,
    deleteApartment,
    searchApartments,
  };
};
