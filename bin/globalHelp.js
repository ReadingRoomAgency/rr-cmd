import winston from 'winston';

export default function (commandNotFound) {
  const help = [
    '',
    'HELP: rr-cmd',
    '',
    '  COMMANDS:',
    '    add             Add a global command',
    '    install         Install a template',
    '    rm              Remove a global command',
    '    run             Run a global command',
    '    update          Update rr-cmd',
    '',
    '  FLAGS:',
    '    --debug, -d     Run any command in debug mode',
    '    --help, -h      Help for using the cli',
    '    --version, -v   Display the current version',
    '',
    '  rr <cmd> --help   Quick help on <cmd>',
    '',
  ];

  if (commandNotFound) {
    const message = 'command not found. See --help for available commands:';
    help.unshift(`'rr ${commandNotFound}' ${message}`);
    help.unshift('');
  }

  help.map(helpText => winston.log('info', helpText));
}
