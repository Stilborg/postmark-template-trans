# Transfer postmark templates

A cli tool that can transfer templates from a server on one postmark account to a server on another postmark account. It can also be used to create a json file backup of templates.

NOTE: Sort of unfinished as development was holted after it reached a point where it solved my immidiate problem of transfering templates between postmark accounts.

But if you have the same need as I did, this might save you some time.

## Shoulders

This CLI part of project is based from articles and examples by [Jeroenouw](https://github.com/jeroenouw)

## Preperation for use

Add a `transfer-config.json` file to your project root (next to the index.ts file). Use this file to set your postmark api keys.

```json
{
  "source_server": "ApiKey of the postmark server to fetch template from",
  "target_server": "ApiKey of the postmark server to write templates to"
}
```

## Installation

Node version is controlled using nvm, check .nvmrc file for correct version

`nvm use`

`npm i`

`npm run create` to install and run the CLI

## Usage

Use `pm_transfer` on the command line

### `pm_transfer -r`

Transfers all templates from source to target and writes a `postmark-template-transfer-report.json` file in the home folder. The file contains the templateIDs of the source server mapped to the new templateIDs of the target server.

### `pm_transfer -b`

Backs up all templates from source and writes them to a `postmark-template-backup.json` file in the home folder in a json format.

## Missing

Well, tests. Sorry about that

`-- import` should import a backup and perform Update/Create on the target server

Output filenames and paths should be controlled by the configuration

Configuration should be stored in a file in the users home dir and should be changeable through the CLI

`-- config` Should display the current config settings

`-- set` Should update the config using an input key value pair

The structure could probably use some work as well

All PR's are welcome
