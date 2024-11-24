import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Apartment } from 'interface/Properties';

interface ApartmentState {
  apartments: Apartment[];
}

const initialState: ApartmentState = {
  apartments: [],
};

const apartmentSlice = createSlice({
  name: 'apartment',
  initialState,
  reducers: {
    setApartments: (state, action: PayloadAction<Apartment[]>) => {
      state.apartments = action.payload;
    },
  },
});

export const { setApartments } = apartmentSlice.actions;
export default apartmentSlice.reducer;
