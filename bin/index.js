import winston from 'winston';
import commandLineArgs from 'command-line-args';
import packageJson from '../package.json';
import update from './update';
import checkIfNeedsUpdate from './checkIfNeedsUpdate';
import globalHelp from './globalHelp';
import add from './add';

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
        switch (options.cmd[0]) {
          case 'add':
            winston.log('debug', 'Add command');
            add();
            break;

          case 'cd':
            winston.log('debug', 'Change directory command');
            break;

          case 'install':
            winston.log('debug', 'Install command');
            break;

          case 'rm':
            winston.log('debug', 'Remove command');
            break;

          case 'run':
            winston.log('debug', 'Run command');
            break;

          default:
            winston.log('debug', 'Command not found');
            globalHelp(options.cmd[0]);
            break;
        }
      }
    }
  });
}
