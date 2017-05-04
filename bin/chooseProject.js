import inquirer from 'inquirer';
import winston from 'winston';
import settings from './settings';

export default function (message, callback) {
  winston.log('debug', 'Chose a project');

  const questions = [{
    type: 'list',
    name: 'choice',
    message,
    choices: () => Object.keys(settings.get()),
  }];

  inquirer.prompt(questions).then((answers) => {
    winston.log('debug', 'Chose: ', answers.choice);
    callback(answers.choice);
  });
}
