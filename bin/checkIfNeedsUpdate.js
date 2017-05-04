import latestVersion from 'latest-version';
import winston from 'winston';
import inquirer from 'inquirer';
import packageJson from '../package.json';

const message = 'is out of date, would you like to update it now?';

export default function (callback) {
  winston.log('debug', 'Getting latest version');

  latestVersion(packageJson.name).then((version) => {
    winston.log('debug', `Current Version: ${packageJson.version} Latest Version: ${version}`);

    if (version !== packageJson.version) {
      winston.log('debug', 'We are not on the latest version, ask for update');

      const questions = [{
        type: 'confirm',
        name: 'confirm',
        message: `${packageJson.name} ${message}`,
        default: true,
      }];

      return inquirer.prompt(questions).then((answers) => {
        if (answers.confirm) {
          callback(true);
        } else {
          callback(false);
        }
      });
    }

    winston.log('debug', 'We are on the latest version');

    return callback(false);
  }).catch((err) => {
    winston.log('error', '');
    winston.log('error', 'Error getting latest version', err);
    winston.log('error', 'Carrying on anyway');
    winston.log('error', '');

    callback(false);
  });
}
