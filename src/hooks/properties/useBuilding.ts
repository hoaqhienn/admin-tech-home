import {
  useAddBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingsQuery,
  useUpdateBuildingMutation,
} from 'api/propertyApi';

export const useBuildings = () => {
  const { data: buildings = [], isLoading, error } = useGetBuildingsQuery();
  const [addBuilding] = useAddBuildingMutation();
  const [updateBuilding] = useUpdateBuildingMutation();
  const [deleteBuilding] = useDeleteBuildingMutation();

  const buildingIds = buildings.map((building) => building.buildingId);

  return {
    buildings,
    buildingIds,
    isLoading,
    error,
    addBuilding,
    updateBuilding,
    deleteBuilding,
  };
};
