import winston from 'winston';
import util from 'util';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import {
  getFile,
  getGenerators,
  getFiles,
} from './store';

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

const generatorFunctions = {};

getDirectories(__dirname).forEach((dir) => {
  // eslint-disable-next-line
  generatorFunctions[dir] = require(`./${dir}/index`);
});

function runAllGeneratorOptions(initialGenerator, generators, index, done) {
  if (index >= generators.length) {
    winston.log('debug', 'Finished running generator options');
    return done();
  }

  let newIndex;
  const generator = generators[index];

  if (generator === initialGenerator) {
    winston.log('debug', 'Generator is initial, don\'t run it', generator);
    newIndex = index + 1;
    return runAllGeneratorOptions(initialGenerator, generators, newIndex, done);
  }

  winston.log('debug', 'Running generator options: ', generator);

  return generatorFunctions[generator].options(null, () => {
    newIndex = index + 1;
    runAllGeneratorOptions(initialGenerator, generators, newIndex, done);
  });
}

function runAllGeneratorBuilds(generators, index, done) {
  if (index >= generators.length) {
    winston.log('debug', 'Finished running generator builds');
    return done();
  }

  let newIndex;
  const generator = generators[index];

  winston.log('debug', 'Running generator build: ', generator);

  return generatorFunctions[generator].build(() => {
    newIndex = index + 1;
    runAllGeneratorBuilds(generators, newIndex, done);
  });
}

function addFiles(files, index, done) {
  if (index >= files.length) {
    return done();
  }

  const fileProps = getFile(files[index]);

  return ejs.renderFile(
    fileProps.template,
    fileProps.variables,
    {},
    (err, str) => {
      if (err) {
        throw new Error(err);
      }

      fs.writeFile(files[index], str, (error) => {
        if (error) {
          throw new Error(error);
        }

        winston.log('info', 'Written to: ', files[index]);
      });

      const newIndex = index + 1;
      addFiles(files, newIndex, done);
    },
  );
}

export default function (generatorCommand, subCommand) {
  winston.log('debug', 'Run generator options:', generatorCommand, subCommand);

  generatorFunctions[generatorCommand].options(subCommand, () => {
    winston.log('debug', 'Run all other generator options');

    const generators = Object.keys(getGenerators());

    runAllGeneratorOptions(generatorCommand, generators, 0, () => {
      winston.log('debug', 'Build generators!!');

      runAllGeneratorBuilds(generators, 0, () => {
        winston.log('debug', 'Finished building generators!!');
        winston.log('debug', 'Add files');

        addFiles(Object.keys(getFiles()), 0, () => {
          winston.log('debug', 'Added files! Yay');
        });
      });
    });
  });
}
