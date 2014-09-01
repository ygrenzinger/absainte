'use strict';

controllers.controller('AlertCtrl', ['AlertService',
  function(AlertService) {
    this.close = AlertService.close;
    this.alerts = AlertService.alerts;
  }
]);
