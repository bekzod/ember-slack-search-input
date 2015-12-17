/* jshint node: true */
'use strict';
var path = require('path');

module.exports = {
  name: 'ember-slack-search-input',
  included: function(app) {
    this._super.included(app);

    var bowerDir = app.bowerDirectory;
    var options = app.options['ember-slack-search-input'] || {};

    app.import(path.join(bowerDir, 'moment', 'moment.js'));
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
