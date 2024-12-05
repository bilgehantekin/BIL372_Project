import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to load environment variables
function loadEnv(environment) {
	const envFile = path.join(__dirname, `.env.${environment}`);
	const result = dotenv.config({ path: envFile });
	if (result.error) {
		console.error(`Error: ${envFile} file not found. Please ensure it exists.`);
		process.exit(1);
	} else {
		console.log(`Loaded environment from ${envFile}`);
		console.log(result.parsed);
		return result.parsed;
	}
}

// Parse command line arguments
const args = process.argv.slice(2);
let environment = 'development'; // Default to development
let command;

// Check for environment flags
if (args[0] === '--production' || args[0] === '--development' || args[0] === '--release') {
	environment = args[0].slice(2); // Remove '--' from the argument
	command = args.slice(1).join(' ');
} else {
	command = args.join(' ');
}

// Load environment variables
const loadedEnv = loadEnv(environment);

if (!command) {
	console.error('Please provide a command to run.');
	process.exit(1);
}

// Spawn a new process with the given command and merged environment variables
const childProcess = spawn(command, [], {
	stdio: 'inherit',
	shell: true,
	env: {
		...process.env,  // Include current process.env
		...loadedEnv     // Override with variables from .env file
	}
});

childProcess.on('error', (error) => {
	console.error(`Error executing command: ${error}`);
	process.exit(1);
});

childProcess.on('close', (code) => {
	console.log(`Command exited with code ${code}`);
	process.exit(code);
});

