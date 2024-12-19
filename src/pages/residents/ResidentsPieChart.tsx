import { Paper } from '@mui/material';
import { useGetResidentsQuery } from 'api';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ResidentsPieChart: React.FC = () => {
  // Tính toán dữ liệu cho PieChart
  const { data: residents = [] } = useGetResidentsQuery();

  const data = [
    { name: 'Active', value: residents.filter((res) => res.status).length },
    { name: 'Inactive', value: residents.filter((res) => !res.status).length },
  ];

  // Màu sắc cho từng phần của biểu đồ
  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
        padding: 2,
      }}
    >
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Paper>
  );
};

export default ResidentsPieChart;
