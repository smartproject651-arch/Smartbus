import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useTheme, Box } from '@mui/material';
import { Dashboard, DirectionsBus, People, Route, Trip, ReportProblem, Emergency } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Drivers', icon: <People />, path: '/drivers' },
  { text: 'Buses', icon: <DirectionsBus />, path: '/buses' },
  { text: 'Routes', icon: <Route />, path: '/routes' },
  { text: 'Trips', icon: <Trip />, path: '/trips' },
  { text: 'Issues', icon: <ReportProblem />, path: '/issues' },
  { text: 'Emergencies', icon: <Emergency />, path: '/emergencies' },
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const content = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); if (isMobile) onClose(); }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return isMobile ? (
    <Drawer variant="temporary" open={mobileOpen} onClose={onClose} sx={{ width: drawerWidth }}>
      {content}
    </Drawer>
  ) : (
    <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0 }}>
      {content}
    </Drawer>
  );
}