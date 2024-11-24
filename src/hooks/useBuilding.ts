import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Building } from 'interface/Properties';
import { setBuildingIds, setBuildings } from 'store/slices/buildingSlice';
import { DeleteBuilding, GetBuildings, PostBuilding, PutBuilding } from 'services/buildingService';

export const useBuildings = () => {
  const dispatch = useDispatch();
  const buildings = useSelector((state: RootState) => state.rootReducer.buildings.buildings);
  const buildingIds = useSelector((state: RootState) => state.rootReducer.buildings.buildingIds);

  const updateBuildings = (buildings: Building[]) => {
    dispatch(setBuildings(buildings));
    dispatch(setBuildingIds(buildings.map((building) => building.buildingId)));
  };

  const fetchBuildings = async () => {
    console.log('Fetching buildings...');

    const buildings = await GetBuildings();
    updateBuildings(buildings);
  };

  const addBuilding = async (building: Omit<Building, 'buildingId'>) => {
    console.log('Adding building:', building);
    await PostBuilding(building);
    fetchBuildings();
  };

  const deleteBuilding = async (buildingId: number) => {
    console.log('Deleting building:', buildingId);
    await DeleteBuilding(buildingId);
    fetchBuildings();
  };

  const updateBuilding = async (building: Building) => {
    console.log('Updating building:', building);
    await PutBuilding(building);
    fetchBuildings();
  };

  return {
    buildings,
    buildingIds,
    fetchBuildings,
    updateBuildings,
    addBuilding,
    deleteBuilding,
    updateBuilding,
  };
};
