/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addBowerPackageToProject('moment', '2.10.6')
      .then(function() {
        return this.addBowerPackageToProject('eonasdan-bootstrap-datetimepicker', '4.17.37')
      }.bind(this));
  }
};
