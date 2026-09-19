const { spawn } = require('child_process');
const path = require('path');

console.log("==========================================================");
console.log("    SafeMap AI - Real-Time Worldwide Crime Intelligence  ");
console.log("==========================================================");

const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

console.log("[1/2] Launching Node/Express Backend Server on http://localhost:5000...");
const serverProcess = spawn('node', ['server.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

console.log("[2/2] Launching React + Vite Frontend on http://localhost:5173...");
const clientProcess = spawn('node', ['node_modules/vite/bin/vite.js'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('[Backend Error]:', err);
});

clientProcess.on('error', (err) => {
  console.error('[Frontend Error]:', err);
});

process.on('SIGINT', () => {
  console.log('\nShutting down SafeMap AI servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});

console.log(">>> Both servers launched! The interactive map will open at http://localhost:5173");
console.log(">>> You can search ANY location on Earth or click anywhere on the world map!\n");
