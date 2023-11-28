#!/usr/bin/env node

// Packages
import { program } from 'commander';

// Relatives
// import publishPluginCommand from "./commands/publishPluginCommand.mjs";
import dummyCommand from './commands/dummyCommand.mjs';

program.command('dummy').description('Dummy Command').action(dummyCommand);
// program
//   .command("publish-plugin")
//   .description("Publish Plitzi Plugin Command")
//   .option("-p, --path <path>", "Path to the plugin")
//   .action(publishPluginCommand);

program.parse(process.argv);
