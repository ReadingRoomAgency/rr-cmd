const options = {
  generators: {},
  packages: {},
  scripts: {},
  readme: {},
  files: {},
};

export function getInstallLocation(generator, location) {
  return options.generators[generator].installLocations[location];
}

export function setInstallLocation(generator, location, value) {
  // Run conflict function first
  options.generators[generator].installLocations[location] = value;
}

export function getOption(generator, option) {
  return options.generators[generator].options[option];
}

export function setOption(generator, option, value) {
  // Run conflict function first
  options.generators[generator].options[option] = value;
}

export function initialiseGenerator(name) {
  if (!options.generators[name]) {
    options.generators[name] = {
      installLocations: {},
      options: {},
    };
  }

  return options;
}

export function getGenerators() {
  return options.generators;
}

export function getFile(filePath) {
  return options.files[filePath];
}

export function getFiles() {
  return options.files;
}

export function setFile(outputPath, template, variables) {
  options.files[outputPath] = {
    template,
    variables,
  };
}
