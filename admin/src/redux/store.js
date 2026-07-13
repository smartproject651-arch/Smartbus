import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import driverReducer from './slices/driverSlice';
import busReducer from './slices/busSlice';
import routeReducer from './slices/routeSlice';
import tripReducer from './slices/tripSlice';
import dashboardReducer from './slices/dashboardSlice';
import issueReducer from './slices/issueSlice';
import emergencyReducer from './slices/emergencySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driverReducer,
    buses: busReducer,
    routes: routeReducer,
    trips: tripReducer,
    dashboard: dashboardReducer,
    issues: issueReducer,
    emergencies: emergencyReducer,
  },
});