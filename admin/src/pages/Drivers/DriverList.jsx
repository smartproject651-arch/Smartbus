import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, deleteDriver } from '../../redux/slices/driverSlice';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, Chip, Box, Typography } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DriverList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { drivers, loading } = useSelector((state) => state.drivers);

  useEffect(() => { dispatch(fetchDrivers()); }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete driver?')) dispatch(deleteDriver(id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Drivers</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/drivers/add')}>Add Driver</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.id}</TableCell>
              <TableCell>{driver.driver_name}</TableCell>
              <TableCell>{driver.driver_code}</TableCell>
              <TableCell>{driver.phone}</TableCell>
              <TableCell>
                <Chip label={driver.status} color={driver.status === 'active' ? 'success' : 'default'} size="small" />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => navigate(`/drivers/edit/${driver.id}`)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(driver.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}