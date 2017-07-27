/* jshint node: true */
'use strict';
var path = require('path');
var resolve = require('resolve');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-slack-search-input',

  included: function(app) {
    this._super.included.apply(this, arguments);
    app.import('vendor/moment/moment.js');
    app.import('vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');
    app.import('vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');
  },

  treeForVendor: function(tree) {
    var trees = [];
    var moment = fastbootTransform(new Funnel(this.pathBase('moment'), {
      destDir: 'moment'
    }));
    var datepicker = fastbootTransform(new Funnel(this.pathBase('eonasdan-bootstrap-datetimepicker'), {
      destDir: 'eonasdan-bootstrap-datetimepicker'
    }));
    trees = trees.concat([moment, datepicker]);
    if (tree) {
      trees.push(tree);
    }
    return mergeTrees(trees);
  },

  pathBase: function(packageName) {
    return path.dirname(resolve.sync(packageName + '/package.json', { basedir: __dirname }));
  },
};
