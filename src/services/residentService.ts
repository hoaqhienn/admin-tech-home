import { api } from 'apis';
import { ResidentViaApartment } from 'interface/Residents';

export const GetResidents = async () => {
  try {
    const res: any = await api.get<ResidentViaApartment>('/admin/resident/getAll');
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const GetResidentByApartment = async (ApartmentId: number) => {
  try {
    const res: any = await api.get<ResidentViaApartment>(
      `/admin/apartment/resident/${ApartmentId}`,
    );
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
