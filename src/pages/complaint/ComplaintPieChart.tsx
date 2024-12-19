import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useComplaints } from 'hooks/service/useComplaint';
import { Paper } from '@mui/material';

const ComplaintPieChart: React.FC = () => {
  const { complaints } = useComplaints();

  // Tính toán số lượng complaints theo trạng thái
  const statusCounts = complaints.reduce((acc: Record<string, number>, complaint) => {
    acc[complaint.complaintStatus] = (acc[complaint.complaintStatus] || 0) + 1;
    return acc;
  }, {});

  // Chuyển đổi dữ liệu thành format cho PieChart
  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#FFBB28', '#0088FE', '#00C49F', '#FF8042']; // Màu sắc cho các trạng thái

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
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
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

export default ComplaintPieChart;
