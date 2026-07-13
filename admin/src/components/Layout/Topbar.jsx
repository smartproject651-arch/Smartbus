import { AppBar, Toolbar, IconButton, Typography, Switch, Box } from '@mui/material';
import { Menu, Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick, toggleTheme, darkMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={onMenuClick} sx={{ mr: 2, display: { md: 'none' } }}>
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Where Is My Bus - Admin
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {user && (
            <Typography sx={{ ml: 2 }}>Welcome, {user.username}</Typography>
          )}
          <IconButton color="inherit" onClick={() => { dispatch(logout()); navigate('/login'); }}>
            Logout
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}