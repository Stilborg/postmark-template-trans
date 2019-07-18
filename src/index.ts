#!/usr/bin/env node

import chalk from 'chalk';
const clear = require('clear');
const figlet = require('figlet');
// const path = require('path');
import program from 'commander';
import { transferAllTemplates, getPostmarkCliConfigFromFile, getPostmarkClient, backupAllTemplatesToFile } from './postmark-cli/postmark-cli-functions';




clear();
console.log(
  chalk.blue(
    figlet.textSync('Postmark CLI', { horizontalLayout: 'full' })
  )
);

program
	.version('0.0.1')
  .description("A CLI template project")
  .option('-r, --run', 'Run the transfer of all templates')
  .option('-b, --backup', 'Backup all the source server templates to the backup.json file')
	.parse(process.argv);
  
if (program.run) { 
  transferAllTemplates(getPostmarkCliConfigFromFile, getPostmarkClient, console.log)
}

if (program.backup) { 
  const config = getPostmarkCliConfigFromFile()
  backupAllTemplatesToFile(config.source_server, getPostmarkClient, console.log)
}

if (!process.argv.slice(2).length) {
	program.outputHelp();
}
