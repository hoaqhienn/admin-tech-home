import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useVehicles } from 'hooks/resident/useVehicle';
import { Vehicle } from 'interface/Vehicle';
import { Paper, Typography } from '@mui/material';

const VehiclePieChart: React.FC = () => {
  const { vehicles, isLoading } = useVehicles();

  // Group vehicles by type
  const vehicleTypeCount = vehicles.reduce((acc: { [key: string]: number }, vehicle: Vehicle) => {
    const type = vehicle.vehicleType || 'Unknown'; // Default to 'Unknown' if no type is available
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for Pie chart
  const chartData = Object.entries(vehicleTypeCount).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Define colors for each pie slice
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF59F9'];

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
      }}
    >
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Biểu đồ phân loại phương tiện cư dân
      </Typography>
      <div>
        {!isLoading && chartData.length > 0 && (
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
    </Paper>
  );
};

export default VehiclePieChart;
