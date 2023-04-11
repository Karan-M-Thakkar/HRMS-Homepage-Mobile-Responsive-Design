const alertsModule = angular.module("alertsModule", [
    "ngAnimate",
    "ngSanitize",
    "ui.bootstrap",
  ]);

alertsModule.service('alertService', function($log, $uibModal, $timeout, $sce) {
    this.showAlert = (alertType, description, time, buttonText, buttonCallback) => {
        let alertInstance = $uibModal.open({
            templateUrl: `../app/alerts/templates/${alertType}.alert.html`,
            controller: function() {
              this.display = {
                alertType: alertType,
                description: description,
                buttonText: buttonText,
                buttonCallbacFn: function() {
                  if (angular.isFunction(buttonCallback)) {
                    buttonCallback();
                  }
                }
              }
              this.close = function() {
                alertInstance.dismiss()
              }
              if (time != undefined && time != null && time) {    
                $timeout(function() {
                alertInstance.dismiss();
                }, time);
              }
              /* to implement html string */
              this.trustAsHtml = function(str) {
                return $sce.trustAsHtml(str);
              };
            },
            controllerAs: 'alert',
            backdrop: true,
            keyboard: false,
            size:'sm'
          });
    }
});
