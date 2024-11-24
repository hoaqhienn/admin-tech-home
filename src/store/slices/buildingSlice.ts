import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Building } from 'interface/Properties';

interface BuildingState {
  buildings: Building[];
  buildingIds: number[];
}

const initialState: BuildingState = {
  buildings: [],
  buildingIds: [],
};

const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    setBuildings: (state, action: PayloadAction<Building[]>) => {
      state.buildings = action.payload;
    },
    setBuildingIds: (state, action: PayloadAction<number[]>) => {
      state.buildingIds = action.payload;
    },
  },
});

export const { setBuildings, setBuildingIds } = buildingSlice.actions;
export default buildingSlice.reducer;
