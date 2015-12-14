/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
  });

  app.import('bower_components/bootstrap/dist/css/bootstrap.min.css')
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot', { destDir: '/fonts' });
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg', { destDir: '/fonts' });
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf', { destDir: '/fonts' });
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff', { destDir: '/fonts' });
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2', { destDir: '/fonts'});

  return app.toTree();
};
