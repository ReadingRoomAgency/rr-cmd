import winston from 'winston';
import { spawnSync } from 'child_process';
import path from 'path';
import inquirer from 'inquirer';
import { readFileSync, existsSync } from 'fs';
import windowsEnvironment from './windowsEnvironment';
import settings from './settings';
import chooseProject from './chooseProject';

function runScript(project, script, commands) {
  let scriptToRun;
  let runParams = [];
  let cmd;
  const params = commands;

  let dir = settings.get(project);

  if (!dir) {
    throw new Error(`${project} project does not exist. Add it with: rr add`);
  }

  dir = path.dirname(dir);

  if (script) {
    scriptToRun = script;
  } else {
    scriptToRun = 'start';
  }

  if (params && params.length) {
    params.splice(0, 3);
    runParams = params;
  }

  if (windowsEnvironment) {
    cmd = 'npm.cmd';
  } else {
    cmd = 'npm';
  }

  const args = ['run', scriptToRun].concat(runParams);

  winston.log('debug', 'Commands:', cmd, args, dir);

  try {
    spawnSync(cmd, args, { cwd: dir, stdio: 'inherit' });
  } catch (err) {
    winston.log('error', 'Could not run command');
    throw err;
  }
}

function chooseScripts(project, callback) {
  const packageJsonPath = settings.get(project);

  if (!packageJsonPath) {
    throw new Error(`No command found for ${project}. Add it with: rr add`);
  }

  if (!existsSync(packageJsonPath)) {
    throw new Error(`No package.json file at: ${packageJsonPath}`);
  }

  const packageJson = readFileSync(packageJsonPath, 'utf-8');
  const packageJsonObject = JSON.parse(packageJson);

  if (!packageJsonObject.scripts) {
    throw new Error(`${packageJsonPath} has no scripts`);
  }

  const questions = [{
    type: 'list',
    name: 'choice',
    message: 'Choose a script to run',
    choices: () => Object.keys(packageJsonObject.scripts),
  }];

  inquirer.prompt(questions).then((answers) => {
    winston.log('debug', 'Chose: ', answers.choice);
    callback(answers.choice);
  });
}

export default function (commands) {
  winston.log('debug', 'run.js', commands);

  if (!commands[1]) {
    winston.log('debug', 'No project given, show a list');

    chooseProject('Pick a project to run a script from', (project) => {
      chooseScripts(project, (script) => {
        runScript(project, script);
      });
    });
  } else if (!commands[2]) {
    winston.log('debug', 'No script given, show a list');

    chooseScripts(commands[1], (script) => {
      runScript(commands[1], script);
    });
  } else {
    winston.log('debug', 'Command and script given, lets run it');
    runScript(commands[1], commands[2], commands);
  }
}
