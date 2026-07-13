import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { DirectionsBus, People, Route, Warning } from '@mui/icons-material';
import { fetchDashboardStats } from '../redux/slices/dashboardSlice';
import LiveMap from '../components/Maps/LiveMap';
import TripChart from '../components/Charts/TripChart';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
    <Box sx={{ backgroundColor: color, borderRadius: 2, p: 1, mr: 2 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </Box>
  </Paper>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Drivers" value={stats.totalDrivers} icon={<People />} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Buses" value={stats.totalBuses} icon={<DirectionsBus />} color="#388e3c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Running Trips" value={stats.runningTrips} icon={<Route />} color="#f57c00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Alerts" value={stats.activeAlerts} icon={<Warning />} color="#d32f2f" />
        </Grid>
      </Grid>

      {/* Live Map */}
      <Paper sx={{ p: 2, mb: 4, height: 500 }}>
        <Typography variant="h6" gutterBottom>Live Bus Tracking</Typography>
        <LiveMap />
      </Paper>

      {/* Chart */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Trip Statistics</Typography>
        <TripChart />
      </Paper>
    </Box>
  );
}