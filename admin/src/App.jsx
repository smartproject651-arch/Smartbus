import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { useState, useMemo } from 'react';
import { getTheme } from './theme';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DriverList from './pages/Drivers/DriverList';
import DriverForm from './pages/Drivers/DriverForm';
// ... import other pages

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><DashboardLayout toggleTheme={toggleTheme} darkMode={darkMode} /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="drivers" element={<DriverList />} />
            <Route path="drivers/add" element={<DriverForm />} />
            <Route path="drivers/edit/:id" element={<DriverForm />} />
            <Route path="buses" element={<BusList />} />
            <Route path="buses/add" element={<BusForm />} />
            <Route path="buses/edit/:id" element={<BusForm />} />
            <Route path="routes" element={<RouteList />} />
            <Route path="routes/add" element={<RouteForm />} />
            <Route path="routes/edit/:id" element={<RouteForm />} />
            <Route path="trips" element={<TripList />} />
            <Route path="trips/add" element={<TripForm />} />
            <Route path="trips/:id" element={<TripDetails />} />
            <Route path="issues" element={<IssueList />} />
            <Route path="emergencies" element={<EmergencyList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}