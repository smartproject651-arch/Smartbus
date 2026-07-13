module.exports = (io, socket) => {
  // Admin can resolve alerts, etc.
  socket.on('resolve-emergency', async (alertId) => {
    const { EmergencyAlert } = require('../models');
    await EmergencyAlert.update({ resolved: true }, { where: { id: alertId } });
    io.to('admin').emit('emergency-resolved', { alertId });
  });

  socket.on('resolve-issue', async (issueId) => {
    const { Issue } = require('../models');
    await Issue.update({ status: 'resolved' }, { where: { id: issueId } });
    io.to('admin').emit('issue-resolved', { issueId });
  });
};