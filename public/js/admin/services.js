'use strict';

/* Services */
function AlertService($timeout) {

  this.alerts = [];

  this.addError = function(msg) {
    this.alerts.push({type: 'alert round', msg: msg});
  };

  this.addInfo = function(msg) {
    this.alerts.push({type: 'info radius', msg: msg});
  };

  this.addSuccess = function(msg) {
    this.alerts.push({type: 'success radius', msg: msg});
  };

  this.close = function(index) {
    this.alerts.splice(index, 1);
  };
}


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('absainteAdmin.services', [])
  .value('version', '0.1')
  .service('AlertService', AlertService);
