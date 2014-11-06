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

function DescriptionsService(_) {

    this.convertArrayToObject = function (descriptionsArray) {
        var descriptions = {};
        _.each(descriptionsArray, function(description) {
            descriptions[description.language] = description.content;
        });
        return descriptions;
    };

    this.convertObjectToArray = function (descriptionsObject) {
        var descriptions = [];
        for (var key in descriptionsObject) {
            descriptions.push({
                'language': key,
                'content': descriptionsObject[key]
            });
        }
        return descriptions;
    };
}


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('absainteAdmin.services', [])
    .value('version', '0.1')
    .service('AlertService', AlertService)
    .service('DescriptionsService', DescriptionsService);
