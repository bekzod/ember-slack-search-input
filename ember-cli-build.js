/*jshint node:true*/
/* global require, module */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

module.exports = function(defaults) {
  const app = new EmberAddon(defaults, {
  });

  const bootstrapPath = path.join('bower_components','/bootstrap/dist/');
  app.import(path.join(bootstrapPath, 'css/bootstrap.css'));
  app.import(path.join(bootstrapPath, 'css/bootstrap.css.map'), { destDir: 'assets' });

  // Import glyphicons
  app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.eot'), { destDir: '/fonts' });
  app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.svg'), { destDir: '/fonts' });
  app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.ttf'), { destDir: '/fonts' });
  app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.woff'), { destDir: '/fonts' });
  app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.woff2'), { destDir: '/fonts'});

  return app.toTree();
};
