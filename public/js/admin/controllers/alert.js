'use strict';

controllers.controller('AlertCtrl', ['AlertService',
  function(AlertService) {
    this.test ="sdfsqdf";
    this.alerts = AlertService.alerts;
  }
]);
