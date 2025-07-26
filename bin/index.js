#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { initCommand, useCommand } = require('../src/index');

// Set up the CLI program
program
  .name('shopifyenv')
  .description('CLI tool to manage environment variables for Shopify extensions')
  .version('1.0.0');

// Define the init command
program
  .command('init')
  .description('Initialize shopifyenv configuration file')
  .action(() => {
    try {
      initCommand();
      console.log(chalk.green('✅ shopifyenv initialized successfully!'));
    } catch (error) {
      console.error(chalk.red(`❌ Error initializing shopifyenv: ${error.message}`));
      process.exit(1);
    }
  });

// Define the use command
program
  .command('use <env_name>')
  .description('Use the specified environment')
  .action((envName) => {
    try {
      useCommand(envName);
      console.log(chalk.green(`✅ Now using environment: ${chalk.bold(envName)}`));
    } catch (error) {
      console.error(chalk.red(`❌ Error using environment ${envName}: ${error.message}`));
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}