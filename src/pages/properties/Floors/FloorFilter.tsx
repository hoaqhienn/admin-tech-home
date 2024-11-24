import { Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import { Floor } from 'interface/Properties';
import React from 'react';

interface FloorFilterProps {
  floors: Floor[];
  selectedBuildingIds: number[];
  setSelectedBuildingIds: (ids: number[]) => void;
}

export const FloorFilter: React.FC<FloorFilterProps> = ({
  floors,
  selectedBuildingIds,
  setSelectedBuildingIds,
}) => {
  const handleCheckboxChange = (buildingId: number) => {
    setSelectedBuildingIds(
      selectedBuildingIds.includes(buildingId)
        ? selectedBuildingIds.filter((id) => id !== buildingId)
        : [...selectedBuildingIds, buildingId],
    );
  };

  const uniqueBuildingIds = React.useMemo(() => {
    return Array.from(new Set(floors.map((floor) => floor.buildingId))).sort((a, b) => a - b);
  }, [floors]);

  return (
    <Paper>
      <Typography variant="h6">Filter by Building ID:</Typography>
      {uniqueBuildingIds.map((buildingId) => (
        <FormControlLabel
          key={buildingId}
          control={
            <Checkbox
              checked={selectedBuildingIds.includes(buildingId)}
              onChange={() => handleCheckboxChange(buildingId)}
            />
          }
          label={`Building ${buildingId}`}
        />
      ))}
    </Paper>
  );
};
