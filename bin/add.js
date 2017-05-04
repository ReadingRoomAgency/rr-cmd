import winston from 'winston';
import inquirer from 'inquirer';
import { existsSync } from 'fs';
import settings from './settings';
import windowsEnvironment from './windowsEnvironment';

function returnPackageJsonPath(input) {
  let path = input;

  if (!path.includes('package.json')) {
    if (windowsEnvironment) {
      path += '\\package.json';
    } else {
      path += '/package.json';
    }
  }

  return path;
}

export default function () {
  winston.log('debug', 'add.js');

  const questions = [
    {
      type: 'input',
      name: 'packageJson',
      message: 'Enter the path to your projects package.json file',
      validate: (input) => {
        const path = returnPackageJsonPath(input);

        if (existsSync(path)) {
          return true;
        }

        return `package.json file does not exist at ${input}`;
      },
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter a <projectName> to use for these commands,\n  you will then be able to run any script in\n  this package.json file by running:\n  rr run <projectName> <scriptName>\n',
      validate: (input) => {
        if (/^[a-zA-Z-_]+$/.test(input)) {
          return true;
        }

        return 'Project name must only be made up of letters, - and _';
      },
    },
  ];

  return inquirer.prompt(questions).then((answers) => {
    const path = returnPackageJsonPath(answers.packageJson);
    settings.set(answers.name, path);
    winston.log('info', `${answers.name} command added, linked to: ${path}`);
  });
}
