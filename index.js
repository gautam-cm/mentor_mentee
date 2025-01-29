const { spawn } = require('child_process');

// Function to start a backend service
const startService = (port, path) => {
  const service = spawn('node', [path], {
    env: { ...process.env, PORT: port },
    stdio: 'inherit', // This will allow logs from the spawned process to be shown in the terminal
  });

  service.on('error', (err) => {
    console.error(`Error starting service on port ${port}: ${err.message}`);
  });

  service.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Service on port ${port} exited with code ${code}`);
    } else {
      console.log(`Service on port ${port} started successfully`);
    }
  });
};

// Start each backend service
startService(3001, 'site1/backend/server.js');
startService(3002, 'site2/backend/server.js');
startService(3003, 'site3/backend/server.js');
startService(3004, 'parent-site/backend/server.js');
startService(3005, 'sign/server.js');

console.log('All backend services are running...');
