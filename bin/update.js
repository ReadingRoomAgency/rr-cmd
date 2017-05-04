import winston from 'winston';
import { spawnSync } from 'child_process';
import windowsEnvironment from './windowsEnvironment';
import packageJson from '../package.json';

export default function () {
  let npm;

  if (windowsEnvironment) {
    npm = 'npm.cmd';
  } else {
    npm = 'npm';
  }

  winston.log('debug', 'Update self');

  spawnSync(npm, ['uninstall', '-g', packageJson.name], { stdio: 'inherit' });
  spawnSync(npm, ['install', '-g', packageJson.name], { stdio: 'inherit' });

  winston.log('debug', 'Finished update');
}
