const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Constants
const CONFIG_FILE = 'shopifyenv.json';

/**
 * Initialize shopifyenv configuration
 * Creates a config file with default values
 */
function initCommand() {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  
  // Check if config file already exists
  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow(`Config file already exists at ${configPath}`));
    const overwrite = true; // In a real CLI, we would prompt the user here
    if (!overwrite) {
      throw new Error('Operation cancelled');
    }
  }
  
  // Scan for .env files in the current directory
  const envFiles = fs.readdirSync(process.cwd())
    .filter(file => file.startsWith('.env.'))
    .map(file => file.replace('.env.', ''));
  
  if (envFiles.length === 0) {
    console.log(chalk.yellow('No .env.* files found in the current directory.'));
  } else {
    console.log(chalk.blue(`Found environments: ${envFiles.join(', ')}`));
  }
  
  // Create initial config
  const config = {
    currentEnv: null,
    environments: {},
    keys: []
  };
  
  // Detect keys from all env files
  const allKeys = new Set();
  
  envFiles.forEach(env => {
    const envFilePath = path.join(process.cwd(), `.env.${env}`);
    try {
      const envContent = fs.readFileSync(envFilePath, 'utf8');
      const parsedEnv = dotenv.parse(envContent);
      
      // Add environment to config
      config.environments[env] = {
        path: `.env.${env}`,
        lastUsed: null
      };
      
      // Collect keys
      Object.keys(parsedEnv).forEach(key => allKeys.add(key));
    } catch (error) {
      console.error(chalk.yellow(`Warning: Could not read ${envFilePath}: ${error.message}`));
    }
  });
  
  // Add all detected keys to config
  config.keys = Array.from(allKeys);
  
  // Write config file
  fs.writeJSONSync(configPath, config, { spaces: 2 });
  console.log(chalk.blue(`Created config file at ${configPath}`));
  
  if (config.keys.length > 0) {
    console.log(chalk.blue(`Detected ${config.keys.length} environment variables: ${config.keys.join(', ')}`));
  }
}

/**
 * Use a specific environment
 * @param {string} envName - The environment name to use
 */
function useCommand(envName) {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  
  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found. Run 'shopifyenv init' first.`);
  }
  
  // Read config file
  const config = fs.readJSONSync(configPath);
  
  // Check if environment exists in config
  if (!config.environments[envName]) {
    // Check if .env.{envName} file exists
    const envFilePath = path.join(process.cwd(), `.env.${envName}`);
    if (!fs.existsSync(envFilePath)) {
      throw new Error(`Environment '${envName}' not found. No .env.${envName} file exists.`);
    }
    
    // Add environment to config
    config.environments[envName] = {
      path: `.env.${envName}`,
      lastUsed: null
    };
    
    console.log(chalk.blue(`Added new environment '${envName}' to config.`));
  }
  
  // Read environment file
  const envFilePath = path.join(process.cwd(), `.env.${envName}`);
  try {
    const envContent = fs.readFileSync(envFilePath, 'utf8');
    const parsedEnv = dotenv.parse(envContent);
    
    // Update config with current environment
    config.currentEnv = envName;
    config.environments[envName].lastUsed = new Date().toISOString();
    
    // Update keys if new ones are found
    Object.keys(parsedEnv).forEach(key => {
      if (!config.keys.includes(key)) {
        config.keys.push(key);
        console.log(chalk.blue(`Added new key: ${key}`));
      }
    });
    
    // Write updated config
    fs.writeJSONSync(configPath, config, { spaces: 2 });
    
    console.log(chalk.blue(`Environment values from ${envFilePath} are now active.`));
  } catch (error) {
    throw new Error(`Failed to read environment file: ${error.message}`);
  }
}

module.exports = {
  initCommand,
  useCommand
};