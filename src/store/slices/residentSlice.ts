import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResidentViaApartment } from 'interface/Residents';

interface ResidentState {
  residents: ResidentViaApartment[];
}

const initialState: ResidentState = {
  residents: [],
};

const residentSlice = createSlice({
  name: 'resident',
  initialState,
  reducers: {
    setResidents: (state, action: PayloadAction<ResidentViaApartment[]>) => {
      state.residents = action.payload;
    },
  },
});

export const { setResidents } = residentSlice.actions;
export default residentSlice.reducer;
