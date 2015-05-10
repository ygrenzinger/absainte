'use strict';

/* Services */
function AlertService($timeout) {

    this.alerts = [];

    this.addError = function (msg) {
        this.alerts.push({type: 'alert round', msg: msg});
    };

    this.addInfo = function (msg) {
        this.alerts.push({type: 'info radius', msg: msg});
    };

    this.addSuccess = function (msg) {
        this.alerts.push({type: 'success radius', msg: msg});
    };

    this.close = function (index) {
        this.alerts.splice(index, 1);
    };
}

function PermalinkService() {

    this.createPermalink = function (str) {
        var permalink = str.trim();
        permalink = permalink.toLowerCase();
        permalink = permalink.replace(/\s{1,}/g, '-');
        return encodeURIComponent( permalink );
    };
}


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('absainteAdmin.services', [])
    .value('version', '1.0.1')
    .service('AlertService', AlertService)
    .service('PermalinkService', PermalinkService);
