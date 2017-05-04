import winston from 'winston';
import commandLineArgs from 'command-line-args';
import packageJson from '../package.json';

winston.cli();

const optionDefinitions = [
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'debug', alias: 'd', type: Boolean },
  { name: 'cmd', type: String, multiple: true, defaultOption: true },
];

const options = commandLineArgs(optionDefinitions);

if (options.debug) {
  winston.level = 'debug';
}

winston.log('debug', 'DEBUG ENABLED');
winston.log('debug', 'Options', options);

if (options.version || options.cmd[0] === 'version') {
  winston.log('debug', 'Log version');
  winston.log('info', `${packageJson.name} version: ${packageJson.version}`);
}

winston.log('debug', 'End of script');
