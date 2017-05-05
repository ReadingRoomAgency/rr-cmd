import winston from 'winston';
import { sync } from 'directory-exists';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import generator from '../generators/index';

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

function showInteractive() {
  winston.log('debug', 'Show interactive generator picker');

  const questions = [{
    type: 'list',
    name: 'choice',
    message: 'Choose a generator to run',
    choices: () => getDirectories(path.join(__dirname, '../generators/')),
  }];

  inquirer.prompt(questions).then((answers) => {
    winston.log('debug', 'Chose generator: ', answers.choice);
    generator(answers.choice);
  });
}

export default function (command) {
  if (command) {
    const commandParts = command.split(':');
    const generatorRelativePath = `../generators/${commandParts[0]}`;
    const generatorPath = path.join(__dirname, generatorRelativePath);

    winston.log('debug', 'Generator command parts:', commandParts);
    winston.log('debug', 'Generator path:', generatorPath);

    if (sync(generatorPath)) {
      winston.log('debug', 'Generator found, lets run it');
      generator(commandParts[0], commandParts[1]);
    } else {
      winston.log('error', `${commandParts[0]} does not exist in ./generators/`);
      showInteractive();
    }
  } else {
    winston.log('debug', 'No generator given, show interactive picker');
    showInteractive();
  }
}
