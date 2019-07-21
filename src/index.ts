#!/usr/bin/env node

import chalk from 'chalk'
const clear = require('clear')
const figlet = require('figlet')
// const path = require('path');
import program from 'commander'
import {
  transferAllTemplates,
  getPostmarkCliConfigFromFile,
  getPostmarkClient,
  backupAllTemplatesToFile,
  templateListProvider,
} from './postmark-cli/postmark-cli-functions'
import { storageObjectWrapper, storageObjectWriter } from './postmark-cli/postmark-cli-storage'
import { transferReportWriter } from './postmark-cli/postmark-cli-reports'

clear()
console.log(chalk.blue(figlet.textSync('Postmark CLI', { horizontalLayout: 'full' })))

program
  .version('0.0.1')
  .description('A CLI for working with Templates across postmark accounts')
  .option('-r, --run', 'Run the transfer of all templates')
  .option('-b, --backup', 'Backup all the source server templates to the backup.json file')
  .option(
    '-i, --import',
    'Load templates from a file and create/update the templates of the target system, name is used as key',
  )
  .option('-c, --config', 'Print the current configuration')
  .option('-s, --set <key> <value>', 'Set config parameter [parametername] [parametervalue]')
  .parse(process.argv)

if (program.run) {
  transferAllTemplates(getPostmarkCliConfigFromFile, getPostmarkClient, templateListProvider, transferReportWriter)
}

if (program.backup) {
  const config = getPostmarkCliConfigFromFile()
  backupAllTemplatesToFile(
    config.source_server,
    getPostmarkClient,
    templateListProvider,
    storageObjectWrapper,
    storageObjectWriter,
  )
}

if (program.import) {
  console.log('Not Implemented Yet')
}

if (program.config) {
  console.log('Not Implemented Yet')
}

if (program.set) {
  console.log('Not Implemented Yet')
}

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
