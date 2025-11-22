const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isDev = process.argv[2] === 'dev';

// Check if .env files exist and copy them
const envFolder = path.join(__dirname, '..', '.env');
const backendFolders = [
  { name: 'Member A', folder: path.join(__dirname, '..', 'Member A', 'backend') },
  { name: 'Member B', folder: path.join(__dirname, '..', 'Member B', 'backend') },
  { name: 'Member C', folder: path.join(__dirname, '..', 'Member C', 'backend') },
];

// Copy .env files if they exist
backendFolders.forEach((backend, index) => {
  const envFileName = index === 0 ? 'MemberA.env' : index === 1 ? 'MemberB.env' : 'MemberC.env';
  const envFile = path.join(envFolder, envFileName);
  const targetEnv = path.join(backend.folder, '.env');

  if (fs.existsSync(envFile)) {
    // Always copy to ensure latest password is used
    fs.copyFileSync(envFile, targetEnv);
    console.log(`✓ Copied ${envFileName} to ${backend.name}/backend/.env`);
  } else {
    console.warn(`⚠ Warning: ${envFileName} not found in .env folder`);
    console.warn(`   Expected at: ${envFile}`);
  }
});

// Start all services
console.log('🚀 Starting all Lendify services...\n');

const commands = [
  {
    name: 'Member A Backend',
    command: isDev ? 'npm' : 'npm',
    args: isDev ? ['run', 'dev'] : ['start'],
    cwd: path.join(__dirname, '..', 'Member A', 'backend'),
    color: '\x1b[36m', // Cyan
  },
  {
    name: 'Member B Backend',
    command: isDev ? 'npm' : 'npm',
    args: isDev ? ['run', 'dev'] : ['start'],
    cwd: path.join(__dirname, '..', 'Member B', 'backend'),
    color: '\x1b[32m', // Green
  },
  {
    name: 'Member C Backend',
    command: isDev ? 'npm' : 'npm',
    args: isDev ? ['run', 'dev'] : ['start'],
    cwd: path.join(__dirname, '..', 'Member C', 'backend'),
    color: '\x1b[33m', // Yellow
  },
  {
    name: 'Frontend',
    command: 'npm',
    args: ['start'],
    cwd: path.join(__dirname, '..', 'frontend'),
    color: '\x1b[35m', // Magenta
  },
];

const processes = [];

commands.forEach((cmd) => {
  const proc = spawn(cmd.command, cmd.args, {
    cwd: cmd.cwd,
    shell: true,
    stdio: 'inherit',
  });

  processes.push(proc);

  proc.on('error', (error) => {
    console.error(`${cmd.color}[${cmd.name}]\x1b[0m Error:`, error.message);
  });

  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`${cmd.color}[${cmd.name}]\x1b[0m Process exited with code ${code}`);
    }
  });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all services...');
  processes.forEach((proc) => {
    proc.kill('SIGINT');
  });
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down all services...');
  processes.forEach((proc) => {
    proc.kill('SIGTERM');
  });
  process.exit(0);
});

console.log('\n✅ All services are starting...');
console.log('📝 Press Ctrl+C to stop all services\n');

