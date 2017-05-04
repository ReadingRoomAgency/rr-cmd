import winston from 'winston';
import settings from './settings';
import chooseProject from './chooseProject';

export default function (projectName) {
  if (projectName) {
    winston.log('debug', 'Removing: ', projectName);

    if (settings.get(projectName)) {
      settings.unset(projectName);
      winston.log('info', `Removed command: ${projectName}`);
    } else {
      winston.log('error', '');
      winston.log('error', `${projectName} command does not exist`);
      winston.log('error', '');
    }
  } else {
    winston.log('debug', 'Show choice of commands to remove');

    chooseProject('Which command would you like to remove?', (choice) => {
      settings.unset(choice);
      winston.log('info', `Removed command: ${choice}`);
    });
  }
}
