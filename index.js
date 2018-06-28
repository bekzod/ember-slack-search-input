/* jshint node: true */
'use strict';
const path = require('path');
const resolve = require('resolve');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-slack-search-input',

  included(app) {
    this._super.included.apply(this, arguments);
    app.import('vendor/moment/moment.js');
    app.import('vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');
    app.import('vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');
  },

  treeForVendor(tree) {
    let trees = [];
    let moment = fastbootTransform(new Funnel(this.pathBase('moment'), {
      destDir: 'moment'
    }));
    let datepicker = fastbootTransform(new Funnel(this.pathBase('eonasdan-bootstrap-datetimepicker'), {
      destDir: 'eonasdan-bootstrap-datetimepicker'
    }));
    trees = trees.concat([moment, datepicker]);
    if (tree) {
      trees.push(tree);
    }
    return mergeTrees(trees);
  },

  pathBase(packageName) {
    return path.dirname(resolve.sync(packageName + '/package.json', { basedir: __dirname }));
  },
};
