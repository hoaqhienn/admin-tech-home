import { Card } from '@mui/material';
import { useFloors } from 'hooks/properties/useFloor';
import { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StackedData {
  buildingName: string;
  buildingId: number;
  [key: string]: string | number;
}

const CHART_COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#06d6a0', // Teal
  '#f97316', // Orange
  '#eab308', // Yellow
  '#ec4899', // Pink
  '#14b8a6', // Emerald
  '#f59e0b', // Amber
] as const;

const FloorResidentsChart = memo(() => {
  const { floors, isLoading } = useFloors();

  const { chartData, floorNumbers } = useMemo(() => {
    if (!floors?.length) return { chartData: [], floorNumbers: [] };

    const uniqueFloorNumbers = [...new Set(floors.map((floor) => floor.floorNumber))].sort();

    const buildingGroups = floors.reduce<Record<number, StackedData>>((acc, floor) => {
      if (!acc[floor.buildingId]) {
        acc[floor.buildingId] = {
          buildingId: floor.buildingId,
          buildingName: floor.buildingName,
        };
      }
      acc[floor.buildingId][`Floor ${floor.floorNumber}`] = floor.totalResidents;
      return acc;
    }, {});

    return {
      chartData: Object.values(buildingGroups),
      floorNumbers: uniqueFloorNumbers,
    };
  }, [floors]);

  if (isLoading) {
    return (
      <Card className="w-full h-96 p-4">
        <div className="space-y-4">
          <div className="flex space-x-4 px-2">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-end space-x-4 h-72 px-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="w-10 bg-gray-200 rounded-t animate-pulse"
                style={{ height: `${Math.random() * 50 + 50}%` }}
              />
            ))}
          </div>
          <div className="flex space-x-4 px-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-5 w-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!chartData?.length) {
    return null;
  }

  return (
    <Card className="w-full h-[600px] p-4">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="buildingName"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis
              label={{
                value: 'Number of Residents',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
            {floorNumbers.map((floorNum, index) => (
              <Bar
                key={floorNum}
                dataKey={`Floor ${floorNum}`}
                stackId="residents"
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                radius={index === floorNumbers.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

FloorResidentsChart.displayName = 'FloorResidentsChart';

export default FloorResidentsChart;
