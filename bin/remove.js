import winston from 'winston';
import inquirer from 'inquirer';
import settings from './settings';

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

    const questions = [{
      type: 'list',
      name: 'choice',
      message: 'Which command would you like to remove?',
      choices: () => Object.keys(settings.get()),
    }];

    inquirer.prompt(questions).then((answers) => {
      settings.unset(answers.choice);
      winston.log('info', `Removed command: ${answers.choice}`);
    });
  }
}
