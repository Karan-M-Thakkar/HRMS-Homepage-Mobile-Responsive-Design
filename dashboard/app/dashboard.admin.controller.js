const dashboardAdminApp = angular.module("dashboardAdminApp", [
  "ngAnimate",
  "ngSanitize",
  "ui.bootstrap",
  "ui.grid",
  "ui.grid.resizeColumns",
  "ui.grid.pagination",
  "ui.grid.pinning",
  'alertsModule'
]);

dashboardAdminApp.controller(
  "DashboardAdminController",
  function ($scope, $log, $http, $timeout, alertService) {
    $log.log("DashboardAdminController loaded successfully!");
    $scope.dashboardItemTypesConstants = {
      NEWS: "T_DASHBOARD_NEWS_ADMIN",
      EVENT: "T_DASHBOARD_EVENT_ADMIN",
      CAROUSEL: "T_DASHBOARD_CAROUSEL_ADMIN",
      GALLERY: "T_DASHBOARD_GALLERY_ADMIN",
      CULTURE_TAB: "T_DASHBOARD_CULTURETAB_ADMIN",
      LINKEDIN: "T_DASHBOARD_LINKEDIN_ADMIN",
    };
    const matches = window.location.pathname.match(/\/(.*?)\//);
    const $appName = matches && matches.length ? matches[1] : "";
    const $appPathName = "/" + $appName + "/";
    const httpReqBaseURL = window.location.origin + $appPathName;
    $scope.formData = {};
    $scope.searchFormData = {};
    $scope.selectedRecordForUpdate = {};
    $scope.formData.activeFormType = '';
    $scope.searchFormData.searchType = "";
    $scope.formMode = "search";
    $scope.searchFormData.fromDate = null;
    $scope.searchFormData.toDate = null;
    $scope.formData.expiryDate = null;
    $scope.formData.eventDate = null;
    $scope.formData.status = "active";
    $scope.submitAttempted = false;
    $scope.formData.title = "";
    $scope.formData.description = "";
    $scope.formData.thumbnailURL = "";
    $scope.formData.redirectionURL = "";

    $scope.fromDateOptions = {};
    $scope.toDateOptions = {};
    $scope.expiryDateOptions = {
      minDate: new Date()
    };
    $scope.eventDateOptions = {
      minDate: new Date()
    };

    $scope.fromDatePopup = {
      opened: false,
    };

    $scope.toDatePopup = {
      opened: false,
    };

    $scope.expiryDatePopup = {
      opened: false,
    };

    $scope.eventDatePopup = {
      opened: false,
    };

    $scope.searchGridOptions = {
      enableSorting: true,
      enableColumnMenus: false,
      paginationPageSizes: [10, 20, 30],
      paginationPageSize: 10,
      columnDefs: [
        { name: "Type",
          field: "type",
          width: "96",
          cellFilter: 'capitalize'
        },
        {
          name: "Applicable Date",
          field: "itemDate",
          width: "144",
          type: "date",
          cellFilter: 'date:"dd-MMM-yyyy"',
        },
        { name: "Title", field: "title", width: "272" },
        {
          name: "Description",
          field: "description",
          width: "320",
          cellToolTip: function (row) {
            return row.entity.description;
          },
        },
        {
          name: "Expiration Date",
          field: "expiryDate",
          width: "144",
          type: "date",
          cellFilter: 'date:"dd-MMM-yyyy"',
        },
        { name: "Status", field: "status", width: "96" },
        {
          name: "Action",
          cellTemplate:
            '<div class="edit-icon-wrapper"><img src="../images/pencil.png" title="Edit" alt="" srcset="" ng-click="grid.appScope.edit(row)"></div>',
          width: "80",
          pinnedRight: true,
          enableSorting: false,
        },
      ],
      onRegisterApi: function (gridApi) {
        $scope.searchGridApi = gridApi;
      },
    };

    $scope.dashboardItemTypes = commonSessionstorage.sessionStorage.getItem('moduleID') ? JSON.parse(commonSessionstorage.sessionStorage.getItem('moduleID')) : [];

    $scope.openFromDatepicker = function () {
      $scope.fromDatePopup.opened = true;
    };

    $scope.openToDatepicker = function () {
      $scope.toDatePopup.opened = true;
    };

    $scope.openExpiryDatepicker = function () {
      $scope.expiryDatePopup.opened = true;
    };

    $scope.openEventDatepicker = function () {
      $scope.eventDatePopup.opened = true;
    };

    $scope.restrictToDate = () => {
      $scope.toDateOptions = {
        minDate: new Date($scope.searchFormData.fromDate),
      };
    };

    $scope.clearSearchInputs = () => {
      $scope.searchFormData.searchType = '';
      $scope.searchFormData.fromDate = null;
      $scope.searchFormData.toDate = null;
      $scope.fromDateOptions = {};
      $scope.toDateOptions = {};
    }

    $scope.redirectToDashboard = () => {
      window.open("../../dashboard.jsp", "_self");
    };

    $scope.saveOrUpdate = () => {
      $scope.submitAttempted = true;
      const data = [
        {
          dashboardDataSeqId: $scope.selectedRecordForUpdate
            ? $scope.selectedRecordForUpdate.dashboardDataSeqId
            : "",
          typeId: $scope.formData.activeFormType,
          itemDate: $scope.formData.eventDate
            ? $scope.formData.eventDate.getTime()
            : new Date().getTime(),
          expiryDate: $scope.formData.expiryDate
            ? $scope.formData.expiryDate.setHours(23,59,59)
            : new Date(2099, 11, 31, 23, 59, 59, 999).getTime(),
          thumbnailUrl: $scope.formData.thumbnailURL
            ? $scope.formData.thumbnailURL
            : "",
          title: $scope.formData.title ? $scope.formData.title : "",
          description: $scope.formData.description
            ? $scope.formData.description
            : "",
          redirectionUrl: $scope.formData.redirectionURL
            ? $scope.formData.redirectionURL
            : "",
          status:
            $scope.formMode === "create"
              ? "active"
              : $scope.formData.status
              ? $scope.formData.status
              : "",
          createdOn: $scope.selectedRecordForUpdate
            ? $scope.selectedRecordForUpdate.createdOn
            : "",
          createdBy: $scope.selectedRecordForUpdate
            ? $scope.selectedRecordForUpdate.createdBy
            : "",
        },
      ];
      if ($scope.saveOrUpdateForm.$valid) {
        $http({
          method: "POST",
          url: httpReqBaseURL + "saveDashboardData.action",
          data: data,
          headers: {
            "x-auth-token":
              "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
          },
        }).then(
          function (data) {
            if (data.data.success) {
              const response =
                data.data.data instanceof Array
                  ? data.data.data
                  : [data.data.data];
              $scope.clear();
              alertService.showAlert('success', `${$scope.formMode === 'create' ? 'Saved' : 'Updated'} successfully`, 3000);
              $timeout(() => {
                $scope.backToSearch();
              }, 3000);
            } else {
              alertService.showAlert('failure', `Something went wrong, please try again! <br/> or <br/>`, 4000, 'Contact Support', $scope.openZohoTicketForm);
            }
          },
          function (error) {
            alertService.showAlert('failure', `Something went wrong, please try again! <br/> or <br/>`, 4000, 'Contact Support', $scope.openZohoTicketForm);
            $log.log("Failure");
            $log.log(error);
          }
        );
      }
    };

    $scope.clear = function () {
      $scope.selectedRecordForUpdate = {};
      $scope.formData.title = "";
      $scope.formData.description = "";
      $scope.formData.thumbnailURL = "";
      $scope.formData.redirectionURL = "";
      $scope.formData.expiryDate = null;
      $scope.formData.eventDate = null;
      $scope.formData.status = "active";
      $scope.formData.activeFormType = '';
      $scope.submitAttempted = false;
    };

    $scope.onActiveFormTypeChange = () => {
      $scope.selectedRecordForUpdate = {};
      $scope.formData.title = "";
      $scope.formData.description = "";
      $scope.formData.thumbnailURL = "";
      $scope.formData.redirectionURL = "";
      $scope.formData.expiryDate = null;
      $scope.formData.eventDate = null;
      $scope.formData.status = "active";
      $scope.submitAttempted = false;
    }

    $scope.search = function () {
      $scope.searchGridOptions.data = [];
      $http({
        method: "GET",
        url: httpReqBaseURL + "searchDashboardData.action",
        params: {
          type: $scope.searchFormData.searchType,
          status: "",
          fromDate: $scope.searchFormData.fromDate
            ? $scope.searchFormData.fromDate.getFullYear() +
              "-" +
              ($scope.searchFormData.fromDate.getMonth() + 1) +
              "-" +
              $scope.searchFormData.fromDate.getDate() +
              " " +
              "00:00:00"
            : "1800-01-01 00:00:00",
          toDate: $scope.searchFormData.toDate
            ? $scope.searchFormData.toDate.getFullYear() +
              "-" +
              ($scope.searchFormData.toDate.getMonth() + 1) +
              "-" +
              $scope.searchFormData.toDate.getDate() +
              " " +
              "23:59:59"
            : "9999-12-31 23:59:59",
          empId: commonSessionstorage.sessionStorage.getItem("empSESSION")
        },
        headers: {
          "x-auth-token":
            "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
        },
      }).then(
        function (response) {
          if (response.data.success) {
            const data = response.data.data;
            $scope.searchGridOptions.data = data;
          } else {
            alertService.showAlert('failure', `Something went wrong, please try again! <br/> or <br/>`, 4000, 'Contact Support', $scope.openZohoTicketForm);
          }
        },
        function (error) {
          alertService.showAlert('failure', `Something went wrong, please try again! <br/> or <br/>`, 4000, 'Contact Support', $scope.openZohoTicketForm);
          $log.log(error);
        }
      );
    };

    $scope.edit = (row) => {
      $scope.formMode = "update";
      const rowData = row.entity;
      $scope.selectedRecordForUpdate = rowData;
      $scope.formData.activeFormType = rowData.typeId;
      $scope.formData.eventDate = rowData.itemDate
        ? new Date(rowData.itemDate)
        : null;
      $scope.formData.expiryDate = rowData.expiryDate
        ? new Date(rowData.expiryDate)
        : null;
      $scope.formData.thumbnailURL = rowData.thumbnailUrl
        ? rowData.thumbnailUrl
        : "";
      $scope.formData.title = rowData.title ? rowData.title : "";
      $scope.formData.description = rowData.description
        ? rowData.description
        : "";
      $scope.formData.redirectionURL = rowData.redirectionUrl
        ? rowData.redirectionUrl
        : "";
      $scope.formData.status = rowData.status ? rowData.status : "";
      $log.log(row);
    };

    $scope.addNew = () => {
      $scope.formMode = "create";
    };

    $scope.backToSearch = () => {
      $scope.formMode = "search";
      $scope.clear();
      $scope.clearSearchInputs();
      $scope.search();
    };

    $scope.openZohoTicketForm = function () {
      const empObj = JSON.parse(commonSessionstorage.sessionStorage.getItem('data1')).data
        .userRoles[0].employee;
      const userFullName =
        (empObj.firstname ? empObj.firstname.trim() : "") +
        " " +
        (empObj.lastname ? empObj.lastname.trim() : "");
      const emailId = empObj.oemailid ? empObj.oemailid.trim() : "";
      let hostname = window.location.hostname.split(".")[0];
      if (hostname === "napierhrms") {
        window.open(
          "../../resources/templates/zoho-ticket-creation-form-production.html?userFullName=" +
            userFullName +
            "&emailId=" +
            emailId,
          "_blank"
        );
      } else {
        window.open(
          "../../resources/templates/zoho-ticket-creation-form-staging.html?userFullName=" +
            userFullName +
            "&emailId=" +
            emailId,
          "_blank"
        );
      }
    };

    /* to load grid data on load with no filters */
    $scope.search();
  }
);

dashboardAdminApp.filter("capitalize", function () {
  return function (input) {
    return angular.isString(input) && input.length > 0
      ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase()
      : input;
  };
});

dashboardAdminApp.directive("apiCallLoader", [
  "$http",
  function ($http) {
    return {
      restrict: "A",
      link: function (scope, elem, attrs) {
        scope.isLoading = isLoading;

        scope.$watch(scope.isLoading, toggleElement);

        function toggleElement(loading) {
          if (loading) {
            elem[0].style.display = "flex";
          } else {
            elem[0].style.display = "none";
          }
        }

        function isLoading() {
          return $http.pendingRequests.length > 0;
        }
      },
    };
  },
]);
