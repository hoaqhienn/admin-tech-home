import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Paper } from '@mui/material';
import { useGetApartmentsQuery } from 'api'; // Giả sử API này trả danh sách căn hộ.

const ApartmentPieChart: React.FC = () => {
  const { data: apartments = [] } = useGetApartmentsQuery(); // Lấy danh sách căn hộ.

  // Tính toán dữ liệu cho PieChart
  const data = [
    { name: 'Được sử dụng', value: apartments.filter((apt) => apt.residents.length > 0).length },
    { name: 'Còn trống', value: apartments.filter((apt) => apt.residents.length === 0).length },
  ];

  // Màu sắc cho từng phần của biểu đồ
  const COLORS = ['#4CAF50', '#FF5722'];

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
      <PieChart width={900} height={400}>
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

export default ApartmentPieChart;
