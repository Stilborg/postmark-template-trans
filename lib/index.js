#!/usr/bin/env node
"use strict";
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var clear = require('clear');
var figlet = require('figlet');
// const path = require('path');
var commander_1 = __importDefault(require("commander"));
clear();
console.log(chalk_1.default.red(figlet.textSync('node-ts-cli-template', { horizontalLayout: 'full' })));
commander_1.default
    .version('0.0.1')
    .description("A CLI template project")
    .option('-l, --list', 'List items')
    .option('-i, --item <itemid>', 'Show item with id [itemid]')
    .parse(process.argv);
console.log('Here is what you did:');
if (commander_1.default.list)
    console.log('Item list goes here');
if (commander_1.default.item)
    console.log("Item with id " + commander_1.default.item + " is shown here");
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
