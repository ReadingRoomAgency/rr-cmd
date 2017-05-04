#! /usr/bin/env node

require('babel-register')({
  ignore: false,
  only: /bin/
});

require('./index');
