#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var clear = require('clear');
var figlet = require('figlet');
// const path = require('path');
var commander_1 = __importDefault(require("commander"));
var postmark_cli_functions_1 = require("./postmark-cli/postmark-cli-functions");
clear();
console.log(chalk_1.default.blue(figlet.textSync('Postmark CLI', { horizontalLayout: 'full' })));
commander_1.default
    .version('0.0.1')
    .description("A CLI template project")
    .option('-r, --run', 'Run the transfer of all templates')
    .option('-b, --backup', 'Backup all the source server templates to the backup.json file')
    .parse(process.argv);
if (commander_1.default.run) {
    postmark_cli_functions_1.transferAllTemplates(postmark_cli_functions_1.getPostmarkCliConfigFromFile, postmark_cli_functions_1.getPostmarkClient, console.log);
}
if (commander_1.default.backup) {
    var config = postmark_cli_functions_1.getPostmarkCliConfigFromFile();
    postmark_cli_functions_1.backupAllTemplatesToFile(config.source_server, postmark_cli_functions_1.getPostmarkClient, console.log);
}
console.log('Here is what you did:');
if (commander_1.default.list_source) {
}
if (commander_1.default.item) {
    console.log(commander_1.default.item);
}
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
