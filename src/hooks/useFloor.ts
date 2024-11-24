import { Floor } from 'interface/Properties';
import { useDispatch, useSelector } from 'react-redux';
import {
  DeleteFloor,
  GetFloors,
  GetFloorsByBuildingId,
  PostFloor,
  PutFloor,
} from 'services/floorService';
import { RootState } from 'store';
import { setFloors } from 'store/slices/floorSlice';

export const useFloors = () => {
  const dispatch = useDispatch();
  const floors = useSelector((state: RootState) => state.rootReducer.floors.floors);
  const floorIds = useSelector((state: RootState) => state.rootReducer.floors.floorIds);

  const updateFloors = (floors: Floor[]) => {
    dispatch(setFloors(floors));
  };

  const fetchFloors = async () => {
    console.log('Fetching floors...');

    const floors = await GetFloors();
    updateFloors(floors);
  };

  const fetchFloorsByBuildingId = async (buildingId: number) => {
    console.log('Fetching floors by buildingId...');
    const floors = await GetFloorsByBuildingId(buildingId);
    updateFloors(floors);
  };

  const AddFloor = async (floors: Omit<Floor, 'floorId'>) => {
    console.log('Adding floor...');

    await PostFloor(floors);
    fetchFloors();
  };

  const UpdateFloor = async (floors: Floor) => {
    console.log('Updating floor...');

    await PutFloor(floors);
    fetchFloors();
  };

  const RemoveFloor = async (floorId: number) => {
    console.log('Removing floor...');

    await DeleteFloor(floorId);
    fetchFloors();
  };

  return {
    floors,
    floorIds,
    AddFloor,
    UpdateFloor,
    RemoveFloor,
    fetchFloors,
    fetchFloorsByBuildingId,
    updateFloors,
  };
};
