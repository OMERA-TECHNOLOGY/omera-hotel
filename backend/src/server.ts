const expressApp = require("./app");

const PORT = process.env.PORT || 3001;

expressApp.listen(PORT, () => {
  console.log(`🏨 Omera Hotel API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
