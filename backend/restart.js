const { execSync } = require('child_process');

try {
  console.log('--- Force Restarting Backend ---');
  
  // Try to kill anything on port 3001
  try {
    const pid = execSync('lsof -t -i:3001').toString().trim();
    if (pid) {
      console.log(`Killing old process ${pid} on port 3001...`);
      execSync(`kill -9 ${pid}`);
    }
  } catch (e) {
    // Port 3001 was already free
  }

  console.log('Starting backend with nodemon app.js...');
  execSync('npx nodemon app.js', { stdio: 'inherit' });

} catch (err) {
  console.error('Error during restart:', err.message);
}
