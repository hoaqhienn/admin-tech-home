import { ResidentViaApartment } from 'interface/Residents';
import { useDispatch, useSelector } from 'react-redux';
import { GetResidentByApartment, GetResidents } from 'services/residentService';
import { RootState } from 'store';
import { setResidents } from 'store/slices/residentSlice';

export const useResidents = () => {
  const dispatch = useDispatch();
  const residents = useSelector((state: RootState) => state.rootReducer.residents.residents);

  const updateResidents = (residents: ResidentViaApartment[]) => {
    dispatch(setResidents(residents));
  };

  const fetchResidents = async () => {
    console.log('Fetching residents...');

    const residents = await GetResidents();
    updateResidents(residents);
    console.log('Fetched residents:', residents);
  };

  const fetchResidentsByApartment = async (apartmentId: number) => {
    console.log(`Fetching residents by apartmentId: ${apartmentId}...`);
    const residents = await GetResidentByApartment(apartmentId);
    updateResidents(residents);
  };

  const clearResident = () => {
    updateResidents([]);
  };

  return { residents, updateResidents, fetchResidents, fetchResidentsByApartment, clearResident };
};
