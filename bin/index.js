import winston from 'winston';
import commandLineArgs from 'command-line-args';
import packageJson from '../package.json';
import update from './update';
import checkIfNeedsUpdate from './checkIfNeedsUpdate';
import globalHelp from './globalHelp';

winston.cli();

const optionDefinitions = [
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'debug', alias: 'd', type: Boolean },
  { name: 'update', alias: 'u', type: Boolean },
  { name: 'cmd', type: String, multiple: true, defaultOption: true },
];

const options = commandLineArgs(optionDefinitions);

if (options.debug) {
  winston.level = 'debug';
}

winston.log('debug', 'DEBUG ENABLED');
winston.log('debug', 'Options', options);

if (!options.cmd || !options.cmd.length || options.cmd[0] === 'help') {
  globalHelp();
} else if (options.update || options.cmd[0] === 'update') {
  update();
} else {
  checkIfNeedsUpdate((confirmUpdate) => {
    if (confirmUpdate) {
      winston.log('debug', 'Confirmed update');
      update();
    } else {
      winston.log('debug', 'Carry on with command');

      if (options.version || options.cmd[0] === 'version') {
        winston.log('debug', 'Log version');
        winston.log('info', `${packageJson.name} version: ${packageJson.version}`);
      } else {
        winston.log('debug', 'Command not found');
        globalHelp(options.cmd[0]);
      }
    }
  });
}
