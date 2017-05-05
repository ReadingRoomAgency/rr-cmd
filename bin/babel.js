#! /usr/bin/env node

require('babel-register')({
  ignore: false,
  only: /bin|generators/,
});

require('./index');
