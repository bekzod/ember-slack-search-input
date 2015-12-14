/* jshint node: true */
'use strict';
var path = require('path');

module.exports = {
  name: 'ember-tag-search-input',
  included: function(app) {
    this._super.included(app);

    var bowerDir = app.bowerDirectory;
    var options = app.options['ember-tag-search-input'] || {};
    var bootstrapPath = path.join(bowerDir,'/bootstrap/dist/');

    if (options.importBootstrapCSS) {
      app.import(path.join(bootstrapPath, 'css/bootstrap.css'));
      app.import(path.join(bootstrapPath, 'css/bootstrap.css.map'), { destDir: 'assets' });

      // Import glyphicons
      app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.eot'), { destDir: '/fonts' });
      app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.svg'), { destDir: '/fonts' });
      app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.ttf'), { destDir: '/fonts' });
      app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.woff'), { destDir: '/fonts' });
      app.import(path.join(bootstrapPath, 'fonts/glyphicons-halflings-regular.woff2'), { destDir: '/fonts'});
    }

    app.import(path.join(bowerDir, 'moment', 'moment.js'));

    // Import css from bootstrap
    if (options.importBootstrapJS) {
      app.import(path.join(bootstrapPath, 'js/bootstrap.js'));
    }

    app.import(path.join(
      bowerDir,
      'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
    ));

    app.import(path.join(
      bowerDir,
      'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
    ));
  }
};
