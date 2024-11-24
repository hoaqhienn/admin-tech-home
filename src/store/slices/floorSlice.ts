import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Floor } from 'interface/Properties';

interface FloorState {
  floors: Floor[];
  floorIds: number[];
}

const initialState: FloorState = {
  floors: [],
  floorIds: [],
};

const floorSlice = createSlice({
  name: 'floor',
  initialState,
  reducers: {
    setFloors: (state, action: PayloadAction<Floor[]>) => {
      state.floors = action.payload;
    },
    setFloorIds: (state, action: PayloadAction<number[]>) => {
      state.floorIds = action.payload;
      state.floors.forEach((floor) => {
        if (!state.floorIds.includes(floor.floorId)) {
          state.floorIds.push(floor.floorId);
        }
      });
      state.floorIds.sort((a, b) => a - b);
      state.floors.sort((a, b) => a.floorNumber.localeCompare(b.floorNumber));
    },
  },
});

export const { setFloors } = floorSlice.actions;
export default floorSlice.reducer;
