import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import buildingReducer from './buildingSlice';
import floorReducer from './floorSlice';
import apartmentReducer from './apartmentSlice';
import residentReducer from './residentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  buildings: buildingReducer,
  floors: floorReducer,
  apartments: apartmentReducer,
  residents: residentReducer,
});

export default rootReducer;
