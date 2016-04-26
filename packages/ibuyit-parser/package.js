Package.describe({
  name: 'ibuyit-parser',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'package for babyparse library',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.1');
  api.use('ecmascript');
  api.addFiles('babyparse.js');
  api.mainModule('ibuyit-parser.js');
  api.export("IbuyitParse");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ibuyit-parser');
  api.mainModule('ibuyit-parser-tests.js');
});
