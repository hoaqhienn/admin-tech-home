import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBuildings } from 'hooks/properties/useBuilding';
import { CardContent, Paper, Skeleton, Stack } from '@mui/material';

const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 60 },
  height: 400,
  barColor: '#4f46e5',
  barRadius: [4, 4, 0, 0] as [number, number, number, number],
  gridDash: '3 3',
};

const AXIS_CONFIG = {
  xAxis: {
    angle: -45,
    textAnchor: 'end' as const,
    height: 100,
    interval: 0,
  },
  yAxis: {
    label: {
      value: 'Number of Residents',
      angle: -90,
      position: 'insideLeft' as const,
      style: { textAnchor: 'middle' },
    },
  },
};

const ChartSkeleton = () => (
  <Stack spacing={2}>
    {/* Legend skeleton */}
    <Stack direction="row" spacing={2} sx={{ px: 2 }}>
      <Skeleton variant="text" width={100} height={20} />
      <Skeleton variant="text" width={80} height={20} />
    </Stack>
    
    {/* Chart bars skeleton */}
    <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ height: 300, px: 2 }}>
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={40}
          height={Math.random() * 200 + 100}
          sx={{ borderRadius: '4px 4px 0 0' }}
        />
      ))}
    </Stack>
    
    {/* X-axis labels skeleton */}
    <Stack direction="row" spacing={2} sx={{ px: 2, pb: 2 }}>
      {[...Array(6)].map((_, index) => (
        <Skeleton key={index} variant="text" width={40} height={20} />
      ))}
    </Stack>
  </Stack>
);

const BuildingResidentsChart = memo(() => {
  const { buildings, isLoading } = useBuildings();

  // Memoize the data transformation if needed
  const chartData = useMemo(() => buildings, [buildings]);

  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 2 }}>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Paper>
    );
  }

  if (!chartData?.length) {
    return null; // Or a proper empty state component
  }

  return (
    <Paper elevation={2} sx={{ height: '100%', width: '100%', p: 2 }}>
      <CardContent>
        <div style={{ height: CHART_CONFIG.height, width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={CHART_CONFIG.margin}>
              <CartesianGrid strokeDasharray={CHART_CONFIG.gridDash} />
              <XAxis 
                dataKey="buildingName"
                {...AXIS_CONFIG.xAxis}
              />
              <YAxis
                label={AXIS_CONFIG.yAxis.label}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar
                dataKey="totalResidents"
                fill={CHART_CONFIG.barColor}
                name="Cư dân"
                radius={CHART_CONFIG.barRadius}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Paper>
  );
});

BuildingResidentsChart.displayName = 'BuildingResidentsChart';

export default BuildingResidentsChart;