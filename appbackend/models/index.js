const sequelize = require('../config/db');
const Driver = require('./Driver');
const Bus = require('./Bus');
const Route = require('./Route');
const RoutePoint = require('./RoutePoint');
const BusStop = require('./BusStop');
const TripAssignment = require('./TripAssignment');
const TripHistory = require('./TripHistory');
const LiveLocation = require('./LiveLocation');
const Issue = require('./Issue');
const EmergencyAlert = require('./EmergencyAlert');
const Admin = require('./Admin');
const Notification = require('./Notification');

// Define associations
Route.hasMany(RoutePoint, { foreignKey: 'route_id', as: 'points' });
RoutePoint.belongsTo(Route, { foreignKey: 'route_id' });

Route.hasMany(BusStop, { foreignKey: 'route_id', as: 'stops' });
BusStop.belongsTo(Route, { foreignKey: 'route_id' });

Driver.hasMany(TripAssignment, { foreignKey: 'driver_id' });
TripAssignment.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });

Bus.hasMany(TripAssignment, { foreignKey: 'bus_id' });
TripAssignment.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });

Route.hasMany(TripAssignment, { foreignKey: 'route_id' });
TripAssignment.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

TripAssignment.hasMany(LiveLocation, { foreignKey: 'trip_id' });
LiveLocation.belongsTo(TripAssignment, { foreignKey: 'trip_id' });

TripAssignment.hasMany(Issue, { foreignKey: 'trip_id' });
Issue.belongsTo(TripAssignment, { foreignKey: 'trip_id' });

TripAssignment.hasMany(EmergencyAlert, { foreignKey: 'trip_id' });
EmergencyAlert.belongsTo(TripAssignment, { foreignKey: 'trip_id' });

// TripHistory can be linked if needed
TripHistory.belongsTo(TripAssignment, { foreignKey: 'trip_assignment_id' });

module.exports = {
  sequelize,
  Driver,
  Bus,
  Route,
  RoutePoint,
  BusStop,
  TripAssignment,
  TripHistory,
  LiveLocation,
  Issue,
  EmergencyAlert,
  Admin,
  Notification,
};