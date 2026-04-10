/**
 * VoyaGo™ — Safe Start Script
 * Kills any existing process on PORT before starting the server.
 * Usage:  node start.js
 */

const { execSync, spawn } = require('child_process');
const PORT = process.env.PORT || 5000;

console.log(`\n[VoyaGo] Checking if port ${PORT} is in use...`);

try {
    // Windows: find PID using the port and kill it
    const output = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
    const lines = output.trim().split('\n').filter(l => l.includes('LISTENING'));

    if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') {
            console.log(`[VoyaGo] Port ${PORT} in use by PID ${pid}. Killing it...`);
            execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
            console.log(`[VoyaGo] PID ${pid} terminated.\n`);
            // Wait a moment for port to free up
            require('child_process').execSync('timeout /t 1 /nobreak > NUL', { stdio: 'ignore' });
        }
    } else {
        console.log(`[VoyaGo] Port ${PORT} is free.\n`);
    }
} catch (e) {
    // No process found on port — that's fine
    console.log(`[VoyaGo] Port ${PORT} is free.\n`);
}

// Now start the actual server
console.log('[VoyaGo] Starting server...\n');
const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: process.env,
});

server.on('close', (code) => {
    if (code !== 0) {
        console.error(`[VoyaGo] Server exited with code ${code}`);
    }
});

process.on('SIGINT',  () => { server.kill('SIGINT');  process.exit(0); });
process.on('SIGTERM', () => { server.kill('SIGTERM'); process.exit(0); });
