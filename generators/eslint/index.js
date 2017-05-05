import inquirer from 'inquirer';
import winston from 'winston';
import path from 'path';
import {
  initialiseGenerator,
  setOption,
  getOption,
  setInstallLocation,
  setFile,
  getInstallLocation,
} from '../store';

function askQuestions(questions, done) {
  if (questions.length) {
    inquirer.prompt(questions).then((answers) => {
      done(answers);
    });
  } else {
    done();
  }
}

exports.options = (subCommand, done) => {
  initialiseGenerator('eslint');
  setInstallLocation('eslint', 'default', process.cwd());

  const questionsReact = [];

  if (getOption('eslint', 'react') === undefined) {
    questionsReact.push({
      type: 'confirm',
      name: 'react',
      message: 'Will this project use react?',
      default: true,
    });
  }

  askQuestions(questionsReact, (answersReact) => {
    if (answersReact) {
      setOption('eslint', 'react', answersReact.react);
    }

    const questions = [];

    if (getOption('eslint', 'react')) {
      setOption('eslint', 'importResolver', true);
      setOption('eslint', 'browserGlobals', true);
      setOption('eslint', 'extraneousDependencies', true);
    } else {
      questions.push({
        type: 'confirm',
        name: 'importResolver',
        message: 'Would you like to use import alias\'?',
        default: true,
      });

      questions.push({
        type: 'confirm',
        name: 'browserGlobals',
        message: 'Does this project use browser globals?',
        default: true,
      });

      questions.push({
        type: 'confirm',
        name: 'extraneousDependencies',
        message: 'Do you want to disable extraneous dependencies?',
        default: true,
      });
    }

    askQuestions(questions, (answers) => {
      if (answers) {
        setOption('eslint', 'importResolver', answers.importResolver);
        setOption('eslint', 'browserGlobals', answers.browserGlobals);
        setOption('eslint', 'extraneousDependencies', answers.extraneousDependencies);
      }

      done();
    });
  });
};

exports.build = (done) => {
  winston.log('debug', 'BUILD BUILD');

  const eslintPath = path.join(__dirname, 'files/.eslintrc');
  const outputPath = getInstallLocation('eslint', 'default');
  const eslintOutput = path.join(outputPath, '.eslintrc');

  setFile(eslintOutput, eslintPath, {
    importResolver: getOption('eslint', 'importResolver'),
    browserGlobals: getOption('eslint', 'browserGlobals'),
    extraneousDependencies: getOption('eslint', 'extraneousDependencies'),
    react: getOption('eslint', 'react'),
  });

  done();
};

exports.examples = () => {
  winston.log('debug', 'Build example');
};

exports.conflict = () => {
  winston.log('debug', 'Conflict resolve');
};
