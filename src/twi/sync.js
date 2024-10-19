const { exec } = require('child_process');
const path = require('path');

const scripts = [
  'download-table-of-contents.js',
  'parse-table-of-contents.js',
  'download-chapters.js',
  'parse-chapters.js'
];

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    console.log(`Running ${scriptName}...`);
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptName}:`, error);
        reject(error);
        return;
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
      console.log(`Finished ${scriptName}`);
      resolve();
    });
  });
}

async function syncAll() {
  for (const script of scripts) {
    try {
      await runScript(script);
    } catch (error) {
      console.error(`Failed to run ${script}. Stopping execution.`);
      process.exit(1);
    }
  }
  console.log('All scripts executed successfully.');
}

syncAll();

