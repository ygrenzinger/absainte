'use strict';

/* Services */
function AlertService() {

  this.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success round', msg: 'Well done! You successfully read this important alert message.' }
  ];

  this.addError = function(msg) {
    this.alerts.push({type: 'danger round', msg: msg});
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
