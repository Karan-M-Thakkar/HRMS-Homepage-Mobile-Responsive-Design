const dashboardApp = angular.module("dashboardApp", []);
dashboardApp.controller("dashboardCtrl", function ($scope, $log, $http, $sce) {
  $log.info("Controller loaded successfully!");

  $scope.dashboardItemTypesConstants = {
    NEWS: "T_DASHBOARD_NEWS_ADMIN",
    EVENT: "T_DASHBOARD_EVENT_ADMIN",
    CAROUSEL: "T_DASHBOARD_CAROUSEL_ADMIN",
    GALLERY: "T_DASHBOARD_GALLERY_ADMIN",
    CULTURE_TAB: "T_DASHBOARD_CULTURETAB_ADMIN",
    LINKEDIN: "T_DASHBOARD_LINKEDIN_ADMIN",
  };

  /* for getting year to display in footer */
  $scope.copyrightYear = new Date().getFullYear().toString();

  /* for initializing tooltips (recommended by BootStrap) */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /* for initializing popovers (recommended by BootStrap) */
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );

  /* intializations */
  var matches = window.location.pathname.match(/\/(.*?)\//);
  var $appName = matches && matches.length ? matches[1] : "";
  var $appPathName = "/" + $appName + "/";
  document.title = $appName;
  $scope.categories = [];
  $scope.napierCultureTabsData = [];
  $scope.eventAndNewsData = [];
  $scope.galleryData = [];
  $scope.carouselImagesData = [];
  $scope.napierCultureTabsData = [];
  $scope.renderCAToolsBtn = false;
  $scope.renderPolicyBtn = false;
  $scope.renderVOCBtn = false;
  $scope.renderReporteesBtn = false;
  $scope.renderProdTrackingBtn = false;
  $scope.renderPrsBtn = false;
  $scope.renderAdministrationBtn = false;
  $scope.isChatBoxOpened = false;
  $scope.linkedInData = [];

  /* for getting month in 'mmm' format for events thumbnail */
  $scope.getFormattedMonth = function (dateString) {
    const formatter = new Intl.DateTimeFormat("en", { month: "short" });
    return formatter.format(new Date(dateString));
  };

  /* for getting date for events thumbnail */
  $scope.getFormattedDate = function (dateString) {
    return new Date(dateString).getDate();
  };

  $scope.redirectToNewsOrEvent = function (redirectionLink) {
    window.open(redirectionLink);
  };

  $scope.changeNapierCultureTab = (tabId) => {
    $scope.currentTab = tabId;
    $scope.modalTabText = $scope.napierCultureTabsData.filter(
      (obj) => obj.dashboardDataSeqId === tabId
    )[0].description;
    $scope.cultureTabReadMoreLink = $scope.napierCultureTabsData.filter(
      (obj) => obj.dashboardDataSeqId === tabId
    )[0].redirectionUrl;
  };

  $scope.toggleChatbox = () => {
    $scope.isChatBoxOpened = !$scope.isChatBoxOpened;
  };

  $scope.openZohoTicketForm = function () {
    const empObj = JSON.parse(commonSessionstorage.sessionStorage.data1).data
      .userRoles[0].employee;
    const userFullName =
      (empObj.firstname ? empObj.firstname.trim() : "") +
      " " +
      (empObj.lastname ? empObj.lastname.trim() : "");
    const emailId = empObj.oemailid ? empObj.oemailid.trim() : "";
    let hostname = window.location.hostname.split(".")[0];
    if (hostname === "napierhrms") {
      window.open(
        "resources/templates/zoho-ticket-creation-form-production.html?userFullName=" +
          userFullName +
          "&emailId=" +
          emailId,
        "_blank"
      );
    } else {
      window.open(
        "resources/templates/zoho-ticket-creation-form-staging.html?userFullName=" +
          userFullName +
          "&emailId=" +
          emailId,
        "_blank"
      );
    }
  };

  $scope.do_logout = function () {
    window.location.href = "logout.action";
  };

  $scope.loadRatingModal = function () {
    function datediff(first, second) {
      return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    var ratingModules_HRMS = [3, 26];
    var ratingModules_PPMS = [68, 50, 40, 58];
    var isRatted = false;
    var ratingEligible = false;
    var ratingModuleId =
      commonSessionstorage.sessionStorage.getItem("currentModuleID");

    if (
      $appName == "HRMS" &&
      ratingModules_HRMS.indexOf(parseInt(ratingModuleId)) >= 0
    ) {
      ratingEligible = true;
    } else if (
      $appName == "PPMS" &&
      ratingModules_PPMS.indexOf(parseInt(ratingModuleId)) >= 0
    ) {
      ratingEligible = true;
    }
    var ratingInfo = commonSessionstorage.sessionStorage.getItem("RatingInfo");
    if (ratingModuleId && ratingInfo && ratingInfo.length) {
      for (var i = 0; i < ratingInfo.length; i++) {
        console.log(submitted_on);
        var submitted_on = new Date(ratingInfo[i].createdOn);
        console.log(submitted_on);
        if (
          ratingInfo[i].moduleId == parseInt(ratingModuleId) &&
          datediff(submitted_on, new Date()) < 15
        ) {
          isRatted = true;
          break;
        }
      }
    }
    if (ratingModuleId && !isRatted && ratingEligible) {
      $("#myRatingModal").modal({
        backdrop: "static",
      });
      $("#myRatingModal").modal();
    }
  };

  $scope.fetchUserTasks = function () {
    let response = {
      data: {
        data: {
          userRoles: [
            {
              emproles_id: 81014,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 5,
              ds: "Admin",
              roles: {
                roles_id: 5,
                ds: "Admin",
                dsl: "Admin",
                view_defined: "Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81015,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 107,
              ds: "Homepage Carousel Admin",
              roles: {
                roles_id: 107,
                ds: "Homepage Carousel Admin",
                dsl: "Homepage Carousel Admin",
                view_defined: "Homepage Carousel Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81016,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 109,
              ds: "Homepage Culture Tab Admin",
              roles: {
                roles_id: 109,
                ds: "Homepage Culture Tab Admin",
                dsl: "Homepage Culture Tab Admin",
                view_defined: "Homepage Culture Tab Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81017,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 106,
              ds: "Homepage Event Admin",
              roles: {
                roles_id: 106,
                ds: "Homepage Event Admin",
                dsl: "Homepage Event Admin",
                view_defined: "Homepage Event Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81018,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 108,
              ds: "Homepage Gallery Admin",
              roles: {
                roles_id: 108,
                ds: "Homepage Gallery Admin",
                dsl: "Homepage Gallery Admin",
                view_defined: "Homepage Gallery Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81019,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 110,
              ds: "Homepage LinkedIn Admin",
              roles: {
                roles_id: 110,
                ds: "Homepage LinkedIn Admin",
                dsl: "Homepage LinkedIn Admin",
                view_defined: "Homepage LinkedIn Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81020,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 105,
              ds: "Homepage News Admin",
              roles: {
                roles_id: 105,
                ds: "Homepage News Admin",
                dsl: "Homepage News Admin",
                view_defined: "Homepage News Admin",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81021,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 1,
              ds: "Employee",
              roles: {
                roles_id: 1,
                ds: "Employee",
                dsl: "Employee View",
                view_defined: "empView",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81022,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 55,
              ds: "HRF X0PA Role",
              roles: {
                roles_id: 55,
                ds: "HRF X0PA Role",
                dsl: "HRF X0PA",
                view_defined: "HRF",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
            {
              emproles_id: 81023,
              fromdate: null,
              todate: null,
              emp_id: 129340,
              firstname: "EMP1499",
              lastname: "LA",
              employee: {
                emp_id: 129340,
                firstname: "EMP1499",
                middlename: "",
                lastname: "LA",
                fathername: "FN",
                extention_date: "",
                userId: "1499",
                username: "NAP1499",
                designation_id: 80,
                designation_name: "Development Manager",
                designations: {
                  designation_id: 80,
                  designation_name: "Development Manager",
                  datastatus: "A",
                },
                officeId: 1,
                status_id: 1,
                status_name: "Active",
                status: {
                  status_id: 1,
                  status_name: "Active",
                  status_type: "employee_status",
                },
                probationStatus: "Confirmed",
                oemailid: "XXXBC@napierhealthcare.com",
                joiningDate: "2021-12-08",
              },
              roles_id: 2,
              ds: "Reporting Manager",
              roles: {
                roles_id: 2,
                ds: "Reporting Manager",
                dsl: "Reporting Manager View",
                view_defined: "rmview",
                datastatus: "A",
                isBranchAdmin: null,
                isSelected: null,
                empRoleMapID: null,
                isHRMSorPPMS: 1,
              },
            },
          ],
          roleTasks: [],
          moduleTasks: [
            {
              moduleId: 1,
              moduleName: "Apply Leave",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Apply Leave",
                  moduleID: 1,
                  inheritRole: null,
                  taskId: "T_E_LM_APPLY_LEAVE",
                  permissionPattern: null,
                  taskGrpID: 29,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Leave Balance",
                  moduleID: 1,
                  inheritRole: null,
                  taskId: "T_E_LM_LEAVE_BALANCE",
                  permissionPattern: null,
                  taskGrpID: 29,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Comp Off Request",
                  moduleID: 1,
                  inheritRole: null,
                  taskId: "T_E_LM_COMPOFF_REQ",
                  permissionPattern: null,
                  taskGrpID: 29,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Leave History",
                  moduleID: 1,
                  inheritRole: null,
                  taskId: "T_E_LM_EMP_LEAVE_HISTORY",
                  permissionPattern: null,
                  taskGrpID: 29,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
              ],
              moduleCategory: "Leave & Attendance",
            },
            {
              moduleId: 2,
              moduleName: "Approve Attendance Regularization",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Approve Attendance Regularization",
                  moduleID: 2,
                  inheritRole: null,
                  taskId: "T_MNG_ATTEN_REGLZN",
                  permissionPattern: null,
                  taskGrpID: 21,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Attendance Regularization",
                },
              ],
              moduleCategory: "Leave & Attendance",
            },
            {
              moduleId: 3,
              moduleName: "Approve Leave",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Pending Approval",
                  moduleID: 3,
                  inheritRole: null,
                  taskId: "T_RM_PENDING_APPROVAL",
                  permissionPattern: null,
                  taskGrpID: 20,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reportee Leaves",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Approved/Rejected/Canceled",
                  moduleID: 3,
                  inheritRole: null,
                  taskId: "T_RM_APPR_REJ_CANC",
                  permissionPattern: null,
                  taskGrpID: 20,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reportee Leaves",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Comp Off Requests",
                  moduleID: 3,
                  inheritRole: null,
                  taskId: "T_RM_COMPOFF_REQS",
                  permissionPattern: null,
                  taskGrpID: 20,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reportee Leaves",
                },
              ],
              moduleCategory: "Leave & Attendance",
            },
            {
              moduleId: 5,
              moduleName: "Approve Resignation/Probation",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Approve Resignation ",
                  moduleID: 5,
                  inheritRole: null,
                  taskId: "T_HR_RESIGN_APPROVE",
                  permissionPattern: null,
                  taskGrpID: 27,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Resignation/Probation",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Admin Probation List",
                  moduleID: 5,
                  inheritRole: null,
                  taskId: "ADMIN_PROBATION_LIST",
                  permissionPattern: null,
                  taskGrpID: 27,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Resignation/Probation",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Approve Probation Confirmation",
                  moduleID: 5,
                  inheritRole: null,
                  taskId: "T_MNG_PROBATION",
                  permissionPattern: null,
                  taskGrpID: 23,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Resignation/Probation",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Approve Resignation - Reporting Manager",
                  moduleID: 5,
                  inheritRole: null,
                  taskId: "T_MNG_RESIGNATION",
                  permissionPattern: null,
                  taskGrpID: 23,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Resignation/Probation",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 6,
              moduleName: "Attendance",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Attendance Regularization",
                  moduleID: 6,
                  inheritRole: null,
                  taskId: "T_EMP_ATTEN_REGLZN",
                  permissionPattern: null,
                  taskGrpID: 16,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Attendance",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Attendance Calendar",
                  moduleID: 6,
                  inheritRole: null,
                  taskId: "T_EMP_CALENDAR",
                  permissionPattern: null,
                  taskGrpID: 16,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Attendance",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Reportees Attendance & Leaves",
                  moduleID: 6,
                  inheritRole: null,
                  taskId: "REPORTEES_ATTENDANCE_RM",
                  permissionPattern: null,
                  taskGrpID: 16,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Attendance",
                },
              ],
              moduleCategory: "Leave & Attendance",
            },
            {
              moduleId: 68,
              moduleName: "Calendar Automation",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Activity Configuration",
                  moduleID: 68,
                  inheritRole: null,
                  taskId: "Activity_Configuration",
                  permissionPattern: null,
                  taskGrpID: 118,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Activity Configuration",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Activity Dashboard",
                  moduleID: 68,
                  inheritRole: null,
                  taskId: "Activity_Dashboard",
                  permissionPattern: null,
                  taskGrpID: 118,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Activity Configuration",
                },
                {
                  id: null,
                  role: null,
                  taskName: "My Primary Activities",
                  moduleID: 68,
                  inheritRole: null,
                  taskId: "MY_HOST_MEETINGS",
                  permissionPattern: null,
                  taskGrpID: 122,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: " CA MY ACTIVITIES DASHBOARD",
                },
                {
                  id: null,
                  role: null,
                  taskName: "My Secondary Activities",
                  moduleID: 68,
                  inheritRole: null,
                  taskId: "MY_SCHEDULED_MEETINGS",
                  permissionPattern: null,
                  taskGrpID: 122,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: " CA MY ACTIVITIES DASHBOARD",
                },
                {
                  id: null,
                  role: null,
                  taskName: "View/Approve Activity(s)",
                  moduleID: 68,
                  inheritRole: null,
                  taskId: "View_Approve_Activity",
                  permissionPattern: null,
                  taskGrpID: 133,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "View/Approve Activity(s)",
                },
              ],
              moduleCategory: null,
            },
            {
              moduleId: 28,
              moduleName: "COBC & CGLR Report",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "COBC Quiz Report",
                  moduleID: 28,
                  inheritRole: null,
                  taskId: "T_RPT_QUIZ_REPORT",
                  permissionPattern: null,
                  taskGrpID: 38,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "COBC Report",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Coding Guidelines Refresher-Report",
                  moduleID: 28,
                  inheritRole: null,
                  taskId: "COBC_Technical_Quiz_Report",
                  permissionPattern: null,
                  taskGrpID: 38,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "COBC Report",
                },
              ],
              moduleCategory: "Reports",
            },
            {
              moduleId: 26,
              moduleName: "COBC Quiz",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Quiz",
                  moduleID: 26,
                  inheritRole: null,
                  taskId: "T_QUIZ",
                  permissionPattern: null,
                  taskGrpID: 31,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Quiz",
                },
              ],
              moduleCategory: "Performance",
            },
            {
              moduleId: 73,
              moduleName: "Coding Guidelines Refresher (CGLR)",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Coding Guidelines Refresher",
                  moduleID: 73,
                  inheritRole: null,
                  taskId: "COBC_Technical_Quiz",
                  permissionPattern: null,
                  taskGrpID: 129,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Coding Guidelines Refresher",
                },
              ],
              moduleCategory: "Performance",
            },
            {
              moduleId: 7,
              moduleName: "Direct Reportee Details",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Basic Details",
                  moduleID: 7,
                  inheritRole: null,
                  taskId: "T_RM_EMP_BASIC_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 19,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Direct Reportee Details",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Qualification",
                  moduleID: 7,
                  inheritRole: null,
                  taskId: "T_RM_EMP_QUALIFICATION",
                  permissionPattern: null,
                  taskGrpID: 19,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Direct Reportee Details",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employment History",
                  moduleID: 7,
                  inheritRole: null,
                  taskId: "T_RM_EMP_EMP_HISTORY",
                  permissionPattern: null,
                  taskGrpID: 19,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Direct Reportee Details",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Skills",
                  moduleID: 7,
                  inheritRole: null,
                  taskId: "T_RM_EMP_SKILLS",
                  permissionPattern: null,
                  taskGrpID: 19,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Direct Reportee Details",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Project",
                  moduleID: 7,
                  inheritRole: null,
                  taskId: "T_RM_EMP_PROJECT",
                  permissionPattern: null,
                  taskGrpID: 19,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Direct Reportee Details",
                },
              ],
              moduleCategory: null,
            },
            {
              moduleId: 71,
              moduleName: "Employee Exit Interview",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Exit Interview",
                  moduleID: 71,
                  inheritRole: null,
                  taskId: "EXIT_INTERVIEW_EMP",
                  permissionPattern: null,
                  taskGrpID: 127,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Exit Interview",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 21,
              moduleName: "Employee Probation",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Probation Confirmation",
                  moduleID: 21,
                  inheritRole: null,
                  taskId: "T_EMP_PROBATION",
                  permissionPattern: null,
                  taskGrpID: 17,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Probation Confirmation",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 76,
              moduleName: "Homepage Settings",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "carousel",
                  moduleID: 76,
                  inheritRole: null,
                  taskId: "T_DASHBOARD_CAROUSEL_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 135,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Homepage Settings",
                },
                {
                  id: null,
                  role: null,
                  taskName: "culture tab",
                  moduleID: 76,
                  inheritRole: null,
                  taskId: "T_DASHBOARD_CULTURETAB_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 135,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Homepage Settings",
                },
                {
                  id: null,
                  role: null,
                  taskName: "event",
                  moduleID: 76,
                  inheritRole: null,
                  taskId: "T_DASHBOARD_EVENT_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 135,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Homepage Settings",
                },
                {
                  id: null,
                  role: null,
                  taskName: "gallery",
                  moduleID: 76,
                  inheritRole: null,
                  taskId: "T_DASHBOARD_GALLERY_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 135,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Homepage Settings",
                },
                {
                  id: null,
                  role: null,
                  taskName: "linkedIn",
                  moduleID: 76,
                  inheritRole: null,
                  taskId: "T_DASHBOARD_LINKEDIN_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 135,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Homepage Settings",
                },
                {
                  id: null,
                  role: null,
                  taskName: "news",
                  moduleID: 76,
                  inheritRole: null,
                  taskId: "T_DASHBOARD_NEWS_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 135,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Homepage Settings",
                },
              ],
              moduleCategory: "Master",
            },
            {
              moduleId: 9,
              moduleName: "HRIS",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Basic Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_BASIC_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Contact Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_CONT_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Other Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_OTHER_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Qualification",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_QUALIFICATION",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employment History",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_EMP_HISTORY",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Bank Details/Statutory Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_STATUTORY",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Skills",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_SKILLS",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Project",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_PROJECT",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Certifications",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_CERTIFICATIONS",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Create CEO",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_CREATE_CEO",
                  permissionPattern: null,
                  taskGrpID: 8,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "CEO Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Basic Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_BASIC_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Contact Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_CONT_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Other Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_OTHER_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Qualification",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_QUALIFICATION",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employment History",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_EMP_HISTORY",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Bank Details/Statutory Details",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_STATUTORY",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Skills",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_SKILLS",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Project",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_PROJECT",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Certifications",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_DU_CERTIFICATION",
                  permissionPattern: null,
                  taskGrpID: 9,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Data Upload",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Change Reporting Manager",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_CHNGE_REPRT_MNGR",
                  permissionPattern: null,
                  taskGrpID: 10,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Change Reporting Manager",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Admin Probation List",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_ADMIN_PROB_LIST",
                  permissionPattern: null,
                  taskGrpID: 11,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Admin Probation List",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Change Functional Manager",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_CHNGE_FUNC_MANAGER",
                  permissionPattern: null,
                  taskGrpID: 12,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Change Functional Manager",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Change Project",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_ADM_CHANGE_PROJ",
                  permissionPattern: null,
                  taskGrpID: 13,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Change Project",
                },
                {
                  id: null,
                  role: null,
                  taskName: "SRM Configuration",
                  moduleID: 9,
                  inheritRole: null,
                  taskId: "T_EMP_SRM_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 28,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 10,
              moduleName: "Leave Management",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Leave Type",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_LM_LEAVETYPE",
                  permissionPattern: null,
                  taskGrpID: 15,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Leave Policy",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_LM_LEAVEPOLICY",
                  permissionPattern: null,
                  taskGrpID: 15,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Leave Balance",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_LM_EMP_LEAVE_BAL",
                  permissionPattern: null,
                  taskGrpID: 15,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Leave History",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_LM_EMP_LEAVE_HIST",
                  permissionPattern: null,
                  taskGrpID: 15,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Holiday Calendar",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_M_HOLIDAY_CLNDR",
                  permissionPattern: null,
                  taskGrpID: 15,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Leave Management",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Special Leaves Approval",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_ADMIN_APPR_SPL_LEAVE",
                  permissionPattern: null,
                  taskGrpID: 14,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Special Leave request",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Mass Leave Approval",
                  moduleID: 10,
                  inheritRole: null,
                  taskId: "T_ADM_MASS_LEAVE_APPROVAL",
                  permissionPattern: null,
                  taskGrpID: 14,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Approve Special Leave request",
                },
              ],
              moduleCategory: "Leave & Attendance",
            },
            {
              moduleId: 12,
              moduleName: "Masters",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Employee Type",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_EMP_TYPE",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Department",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_DP_DEPT",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Functions",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_DP_FUNCTNS",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Sub-Functions",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_DP_SB_FNTNS",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Country",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_LC_COUNTRY",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "State",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_LC_STATE",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "City",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_LC_CITY",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Branch",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_LC_BRANCH",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Designation",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_DESIGNATION",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Qualification-Master",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_QUALIFICATION",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Skills-Master",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_SKILLS",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Functional Master",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_FUNCTIONAL",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Cost Center",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_CC_COST_CNTR",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Profit Center",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_CC_PROFIT_CNTR",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Grade/Band",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_GB_GRADE_BRAND",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Sub-Grade/Sub-Band",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_GB_SGRDE_SBRND",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Email Templates",
                  moduleID: 12,
                  inheritRole: null,
                  taskId: "T_M_EMAIL_TMPLTS",
                  permissionPattern: null,
                  taskGrpID: 1,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Master Data",
                },
              ],
              moduleCategory: "Master",
            },
            {
              moduleId: 75,
              moduleName: "Napier License Control System (LCS)",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Napier LCS",
                  moduleID: 75,
                  inheritRole: null,
                  taskId: "NLCS",
                  permissionPattern: null,
                  taskGrpID: 134,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Napier LCS",
                },
              ],
              moduleCategory: "Product & Project",
            },
            {
              moduleId: 62,
              moduleName: "Napier Recruitment Portal (ATS)",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "HRF X0PA",
                  moduleID: 62,
                  inheritRole: null,
                  taskId: "T_HRF_PEOPLEWORKS_INTEGRATION",
                  permissionPattern: null,
                  taskGrpID: 96,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "HRF X0PA",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 63,
              moduleName: "New Hire Survey",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Survey Question Posting",
                  moduleID: 63,
                  inheritRole: null,
                  taskId: "SURVEY_QUES_POSTING",
                  permissionPattern: null,
                  taskGrpID: 99,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Survey Masters",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Survey Questions Dashboard",
                  moduleID: 63,
                  inheritRole: null,
                  taskId: "SURVEY_QUES_DASHBOARD",
                  permissionPattern: null,
                  taskGrpID: 99,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Survey Masters",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Survey Analytics Dashboard",
                  moduleID: 63,
                  inheritRole: null,
                  taskId: "SURVEY_ANALYTICS_DASHBOARD",
                  permissionPattern: null,
                  taskGrpID: 100,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Survey Dashboard",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Survey Q & A Dashboard",
                  moduleID: 63,
                  inheritRole: null,
                  taskId: "SURVEY_EMP_QA_DASHBOARD",
                  permissionPattern: null,
                  taskGrpID: 100,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Survey Dashboard",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Survey",
                  moduleID: 63,
                  inheritRole: null,
                  taskId: "NEW_EMPLOYEE_SURVEY",
                  permissionPattern: null,
                  taskGrpID: 98,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "New Hire Survey",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 61,
              moduleName: "Onboard",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Onboard Task",
                  moduleID: 61,
                  inheritRole: null,
                  taskId: "ONBOARD_TASK",
                  permissionPattern: null,
                  taskGrpID: 95,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Onboard Group",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 49,
              moduleName: "Performance Review System(PRS)",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "PMS",
                  moduleID: 49,
                  inheritRole: null,
                  taskId: "PMS",
                  permissionPattern: null,
                  taskGrpID: 74,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "PMS",
                },
              ],
              moduleCategory: "Performance",
            },
            {
              moduleId: 20,
              moduleName: "Personal Data",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Basic Details",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_BASIC_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Contact Details",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_CONT_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Other Details",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_OTHER_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Qualification",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_QUALIFICATION",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employment History",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_EMP_HISTORY",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Bank Details/Statutory Details",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_STATUTORY",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Skills",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_SKILLS",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Project",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_PROJECT",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Certifications",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_E_EMP_CERTIFICATIONS",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Parents Details",
                  moduleID: 20,
                  inheritRole: null,
                  taskId: "T_EMP_FAM_HIST",
                  permissionPattern: null,
                  taskGrpID: 7,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Employee-Employee",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 57,
              moduleName: "Policy Documents",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Upload Policy Documents",
                  moduleID: 57,
                  inheritRole: null,
                  taskId: "POLICY_DOCUMENTS_ADMIN",
                  permissionPattern: null,
                  taskGrpID: 83,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Policy Documents",
                },
                {
                  id: null,
                  role: null,
                  taskName: "View Policy Documents",
                  moduleID: 57,
                  inheritRole: null,
                  taskId: "POLICY_DOCUMENTS_EMPLOYEE",
                  permissionPattern: null,
                  taskGrpID: 83,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Policy Documents",
                },
              ],
              moduleCategory: null,
            },
            {
              moduleId: 67,
              moduleName: "Productivity Tracking",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "MY DAILY STATUS",
                  moduleID: 67,
                  inheritRole: null,
                  taskId: "MY_DAILY_STATUS",
                  permissionPattern: null,
                  taskGrpID: 123,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "MY DAILY STATUS",
                },
                {
                  id: null,
                  role: null,
                  taskName: "MY DAILY STATUS DASHBOARD",
                  moduleID: 67,
                  inheritRole: null,
                  taskId: "MY_DAILY_STATUS_DASHBOARD",
                  permissionPattern: null,
                  taskGrpID: 123,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "MY DAILY STATUS",
                },
                {
                  id: null,
                  role: null,
                  taskName: "My Daily Status Bulk Upload",
                  moduleID: 67,
                  inheritRole: null,
                  taskId: "EMP_DAILY_STATUS_UPLOAD",
                  permissionPattern: null,
                  taskGrpID: 123,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "MY DAILY STATUS",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Pending Approval Daily Status",
                  moduleID: 67,
                  inheritRole: null,
                  taskId: "APPROVAL_PENDING_TEAM_DAILY_STATUS",
                  permissionPattern: null,
                  taskGrpID: 124,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "APPROVE TEAM DAILY STATUS",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Verified Daily Status",
                  moduleID: 67,
                  inheritRole: null,
                  taskId: "APPROVED_TEAM_DAILY_STATUS",
                  permissionPattern: null,
                  taskGrpID: 124,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "APPROVE TEAM DAILY STATUS",
                },
              ],
              moduleCategory: "Performance",
            },
            {
              moduleId: 22,
              moduleName: "Record Resignation",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Record Resignation",
                  moduleID: 22,
                  inheritRole: null,
                  taskId: "T_EMP_RESIGNATION",
                  permissionPattern: null,
                  taskGrpID: 18,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Record Resignation",
                },
              ],
              moduleCategory: "HRMS",
            },
            {
              moduleId: 74,
              moduleName: "Report Builder",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Report Builder",
                  moduleID: 74,
                  inheritRole: null,
                  taskId: "Report_Builder",
                  permissionPattern: null,
                  taskGrpID: 130,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Report Builderr",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Report Render",
                  moduleID: 74,
                  inheritRole: null,
                  taskId: "Report_Render",
                  permissionPattern: null,
                  taskGrpID: 131,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Report Render",
                },
              ],
              moduleCategory: "Reports",
            },
            {
              moduleId: 23,
              moduleName: "Reports",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Employee Master Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_EMP_MASTER",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Attendance Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_EMP_ATTENDANCE",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Leave Balance Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_EMP_LEAVE_BAL",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Joining Or Separation Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_EMP_JOIN_SEPARTN",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "LOP Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_LOP_REPORT",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "COBC Quiz Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_QUIZ_REPORT",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Employee Attendance Report Quick",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_RPT_EMP_ATTENDANCE_QUICK",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Peopleworks Integration Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_PW_INTEGRATION_REPORT",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Leave History Report",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_LEAVE_HISTORY_REPORT",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Bulk Regularization",
                  moduleID: 23,
                  inheritRole: null,
                  taskId: "T_BIOMETRIC_REGULARIZATION",
                  permissionPattern: null,
                  taskGrpID: 26,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Reports",
                },
              ],
              moduleCategory: "Reports",
            },
            {
              moduleId: 25,
              moduleName: "Security Masters",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Employee Role Mapping",
                  moduleID: 25,
                  inheritRole: null,
                  taskId: "T_RT_EMP_ROLE_MAP",
                  permissionPattern: null,
                  taskGrpID: 30,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Security Masters",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Module Group Mapping",
                  moduleID: 25,
                  inheritRole: null,
                  taskId: "T_RT_MOD_GRP_MAP",
                  permissionPattern: null,
                  taskGrpID: 30,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Security Masters",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Group Task Mapping",
                  moduleID: 25,
                  inheritRole: null,
                  taskId: "T_RT_GRP_TASK_MAP",
                  permissionPattern: null,
                  taskGrpID: 30,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Security Masters",
                },
                {
                  id: null,
                  role: null,
                  taskName: "Role Task Mapping",
                  moduleID: 25,
                  inheritRole: null,
                  taskId: "T_RT_ROLE_TASK_MAP",
                  permissionPattern: null,
                  taskGrpID: 30,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "Security Masters",
                },
              ],
              moduleCategory: "Master",
            },
            {
              moduleId: 72,
              moduleName: "SRM Master",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "SRM Configuration",
                  moduleID: 72,
                  inheritRole: null,
                  taskId: "T_EMP_SRM_DETAILS",
                  permissionPattern: null,
                  taskGrpID: 128,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "SRM Master",
                },
              ],
              moduleCategory: null,
            },
            {
              moduleId: 58,
              moduleName: "VOC",
              moduleLevel: null,
              roleTasks: [
                {
                  id: null,
                  role: null,
                  taskName: "Employee Feedback",
                  moduleID: 58,
                  inheritRole: null,
                  taskId: "VOC_INTERNAL_FEEDBACK",
                  permissionPattern: null,
                  taskGrpID: 84,
                  roleSeqID: null,
                  roleTaskPermissions: null,
                  taskList: null,
                  groupName: "VOC",
                },
              ],
              moduleCategory: null,
            },
          ],
        },
        total: 1,
        success: true,
      },
      status: 200,
      config: {
        method: "GET",
        transformRequest: [null],
        transformResponse: [null],
        jsonpCallbackParam: "callback",
        url: "user/loadtasks.action",
        params: {
          empID: "129340",
        },
        headers: {
          "x-auth-token":
            "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
          "X-XSS-Protection": "1; mode=block",
          Accept: "application/json, text/plain, */*",
        },
      },
      statusText: "",
      xhrStatus: "complete",
    };
    let data = response.data;
    let moduleMap = new Map();
    let modMap = new Object();
    /* commonSessionstorage.sessionStorage.setItem("data1", JSON.stringify(data)); */

    /* for generating list of catrgories and respective modules for generating navbar menu items */
    for (let module of data.data.moduleTasks) {
      let moduleName = module.moduleName;
      let moduleId = module.moduleId;

      modMap[moduleId] = module.roleTasks;

      if (moduleName == "New Hire Survey") {
        let roleTasks = new Object();
        roleTasks[moduleId] = modMap[moduleId];
        /* getPendingTasks(empID, moduleId, roleTasks); */
      }

      switch (module.moduleId) {
        case 76: // Dashboard Administration
          $scope.renderAdministrationBtn = true;
        case 68: // Calendar Automation
          $scope.renderCAToolsBtn = true;
          break;
        case 57: // Policy Documents
          $scope.renderPolicyBtn = true;
          break;
        case 58: // VOC
          $scope.renderVOCBtn = true;
          break;
        case 7: // Direct Reportee Details
          $scope.renderReporteesBtn = true;
          break;
        case 67: // Productivity Tracking
          $scope.renderProdTrackingBtn = true;
        case 27:
        case 72:
          break; // in previous versions of code, 27 and 72 were omitted, hence implemented the same
        default:
          /* if (
            module.moduleId === 73 &&
            !document.getElementById("catgoryName").value
          ) {
            // in previous versions of code 73 were omitted, if categoryName element had no value, hence implemented the same
            break;
          } */
          // PRS (49) module has a button as well as a menu item hence added this if block here instead of standalone case as for other buttons
          if (module.moduleId === 49) {
            $scope.renderPrsBtn = true;
          }
          let categoryExists = false;
          if ($scope.categories.length > 0) {
            for (let i = 0; i < $scope.categories.length; i++) {
              if ($scope.categories[i].category === module.moduleCategory) {
                categoryExists = true;
                $scope.categories[i].modules.push({
                  moduleId: module.moduleId,
                  moduleName: module.moduleName,
                });
                break;
              }
            }
            if (!categoryExists && module.moduleCategory != null) {
              $scope.categories.push({
                category: module.moduleCategory,
                modules: [
                  {
                    moduleId: module.moduleId,
                    moduleName: module.moduleName,
                  },
                ],
              });
            }
          } else {
            if (module.moduleCategory != null) {
              $scope.categories.push({
                category: module.moduleCategory,
                modules: [
                  {
                    moduleId: module.moduleId,
                    moduleName: module.moduleName,
                  },
                ],
              });
            }
          }
      }
    }
    $log.log($scope.categories);

    /* commonSessionstorage.sessionStorage.setItem(
      "modMap",
      JSON.stringify(modMap)
    ); */
  };

  $scope.fetchDashboardData = function () {
    data = {
      data: {
        data: [
          {
            dashboardDataSeqId: 30,
            typeId: "T_DASHBOARD_NEWS_ADMIN",
            itemDate: 1680256333860,
            expiryDate: 1681496999000,
            thumbnailUrl:
              "https://res.cloudinary.com/dczjyucne/image/upload/v1680256171/1_yjiwin.jpg",
            title: "Iftar Party ( In - Office )  - 14th April 2023",
            description: "Iftar Party",
            redirectionUrl:
              "https://res.cloudinary.com/dczjyucne/image/upload/v1680256171/1_yjiwin.jpg",
            status: "active",
            createdOn: 1680256311627,
            createdBy: 129340,
            editedOn: 1680415591837,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 28,
            typeId: "T_DASHBOARD_GALLERY_ADMIN",
            itemDate: 1680255760373,
            expiryDate: 1682879399000,
            thumbnailUrl:
              "https://www.yammer.com/api/v1/uploaded_files/1638494158848/preview/?client_application_id=40443904&fallback_to_icon=false&file_type=image&network_id=243901&storage=AZURE&uid=281942892544",
            title: "Ugadi Celebration",
            description: "Ugadi @ office",
            redirectionUrl:
              "https://web.yammer.com/main/org/napierhealthcare.com/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjE5MDk0NjUwMTc3MTI2NCJ9",
            status: "active",
            createdOn: 1680255738157,
            createdBy: 129340,
            editedOn: 1680264038817,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 26,
            typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
            itemDate: 1680255069257,
            expiryDate: 1681496999000,
            thumbnailUrl:
              "https://res.cloudinary.com/dczjyucne/image/upload/v1680255001/semi_finalists_2_1_vw6gwi.jpg",
            title: "Mentor Support",
            description: "Mentor support for the Inovate",
            redirectionUrl:
              "https://res.cloudinary.com/dczjyucne/image/upload/v1680255001/semi_finalists_2_1_vw6gwi.jpg",
            status: "active",
            createdOn: 1680255047130,
            createdBy: 129340,
            editedOn: null,
            editedBy: null,
          },
          {
            dashboardDataSeqId: 25,
            typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
            itemDate: 1676623216653,
            expiryDate: 1739384999000,
            thumbnailUrl:
              "https://napierhrms.napierhealthcare.com/Dashboard_resoures/DB-1.jpg",
            title: "Inovate",
            description: "Inovate",
            redirectionUrl:
              "https://napierhrms.napierhealthcare.com/Dashboard_resoures/DB-1.jpg",
            status: "active",
            createdOn: 1676623203817,
            createdBy: 129014,
            editedOn: 1676623694167,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 5,
            typeId: "T_DASHBOARD_NEWS_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              "https://res.cloudinary.com/karanthakkar/image/upload/v1669181153/pexels-andrea-piacquadio-3760067_wlzhky.jpg",
            title: "New Client - APIC",
            description:
              "We've onboarded new client with our organizations, get to know about them here.",
            redirectionUrl: "https://apichospital.com/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677485058257,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 9,
            typeId: "T_DASHBOARD_LINKEDIN_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7004344112762015746" height="720" width="100%" frameborder="0" allowfullscreen="true" title="Embedded post"></iframe>',
            title: "Happy National Day LinkedIn Post",
            description: "Happy National Day LinkedIn Post",
            redirectionUrl: "",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677653992843,
            editedBy: 129340,
          },
          {
            dashboardDataSeqId: 10,
            typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              "https://res.cloudinary.com/karanthakkar/image/upload/v1671083089/banner-carousel-slide-1_nr467c.jpg",
            title: "Carousel - 1",
            description: "Carousel - 1",
            redirectionUrl:
              "https://www.linkedin.com/company/napierhealthcare/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1675225448887,
            editedBy: 129340,
          },
          {
            dashboardDataSeqId: 11,
            typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              "https://res.cloudinary.com/karanthakkar/image/upload/v1671697016/Banner_1_cvxr4c.jpg",
            title: "Carousel - 2",
            description: "Carousel - 2",
            redirectionUrl:
              "https://www.linkedin.com/company/napierhealthcare/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1675225523903,
            editedBy: 129340,
          },
          {
            dashboardDataSeqId: 13,
            typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl: "https://www.linkedin.com/company/napierhealthcare/",
            title: "Work Culture",
            description:
              "<p>Welcome to the Napier Family!! A well know brand in healthcare IT industry in APAC, SEA, India and Middle East region.</p><p><br></p><p>We are a startup which is 25 years old. Seems contradicting? Wait!!</p><p><br></p><p>We have been serving healthcare industry with our legacy solutions for more than 25 years now. However, in our hearts, we are a startup with leaders from strong clinical, tech and business background embarking on to create intelligent IT solution for efficient healthcare delivery. Why a start-up? We want to harness the energy, dynamism and innovation that start-ups bring to the business. Yet, we will retain the legacy of our past, our secret sauce, that has resulted in our success. That way, we will have the best of both worlds!</p><p><br></p><p>Napierites take pride in creating something which directly impacts the way services are delivered by secondary and tertiary healthcare providers. Making a difference in the life of our end consumers - doctors and patients - is our motto in life.</p><p><br></p><p>Napier is committed to creating a diverse environment. It is our policy to provide equal opportunity to all people without regard to race, color, religion, national origin, ancestry, marital status, veteran status, age, disability, pregnancy, genetic information, citizenship status, sex, sexual orientation, gender identity or any other legally protected category.</p><p><br></p><p>Every day, we push the boundaries of our industry, and we encourage our employees to share their ideas, take initiative and be accountable for their work.</p><p><br></p><p>We are excited to have you as part of our incredible journey!!</p>",
            redirectionUrl: "https://www.napierhealthcare.com/home/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677484148730,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 14,
            typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl: "https://www.linkedin.com/company/napierhealthcare/",
            title: "DNA",
            description:
              '<p><strong style=\\"color: rgb(24, 24, 24);\\"><em>"Don\'t do to others what you don\'t want done to you"</em></strong></p><p>-- <span style=\\"color: rgb(32, 33, 36);\\">Confucius</span></p><p><br></p><p><strong>Honesty, Integrity, Transparency (HIT)&nbsp;</strong></p><ul><li>Be honest and truthful, maintain Integrity in all transactions, keep total transparency in communicating.&nbsp;</li></ul><p>&nbsp;</p><p><strong>Respect for each other&nbsp;</strong></p><ul><li>Value your co-workers&nbsp;</li><li>Treat all the employees in same manner irrespective of their level in the organization.</li><li>Never miss out to recognize and appreciate good performance&nbsp;</li></ul><p><br></p><p><strong>Revenue Focus&nbsp;</strong></p><ul><li>Be revenue/Cost conscious and not miss out on any opportunity&nbsp;</li><li>Complete the tasks with minimum turnaround time&nbsp;</li><li>Leverage on cross functional strengths</li><li>Increase productivity through value addition&nbsp;</li></ul><p><br></p><p><strong>Pride in Work&nbsp;</strong></p><ul><li>Be proud to be a Napierite&nbsp;</li><li>Be accountable and take ownership</li><li>Enjoy your work</li></ul>',
            redirectionUrl: "https://www.napierhealthcare.com/home/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677484160910,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 15,
            typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl: "https://www.linkedin.com/company/napierhealthcare/",
            title: "Strategy",
            description:
              "<p>With a new business model centered on myNapier, we are creating a portfolio of products to support Hospitals, Nursing homes, Medical board and Homecare services leveraging cloud, AI and analytics wherever possible.</p><p><br></p><p>The 3 key focus area shaping our business strategy are: </p><p><br></p><p>1. Performance Driven Organization(PDO) aimed towards </p><ul><li><strong>Driving an entrepreneurial culture within Napier with due empowerment </strong></li><li><strong>Providing lasting careers not just jobs </strong></li><li><strong>Creating a world class talent organisation in health tech</strong></li></ul><p><br></p><p>2. myNapier business </p><ul><li>Moving to cloud implementation </li><li>Providing customer a bundle of services not just product </li><li>Building scalable business </li></ul><p><br></p><p>3. Artificial Intelligence</p><ul><li>Innovation and AI to be integral part of everyday work </li><li>Making every part of the product intelligent</li></ul>",
            redirectionUrl: "https://www.napierhealthcare.com/home/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677484191640,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 16,
            typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl: "https://www.linkedin.com/company/napierhealthcare/",
            title: "Vision",
            description:
              "To deliver most value to Healthcare providers by providing highest quality Cloud based implementations leveraging Artificial Intelligence in the shortest possible time.",
            redirectionUrl: "https://www.napierhealthcare.com/home/",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677484202670,
            editedBy: 129014,
          },
          {
            dashboardDataSeqId: 17,
            typeId: "T_DASHBOARD_LINKEDIN_ADMIN",
            itemDate: 1669660200000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7001074296357867520" height="650" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>',
            title: "Business Leader LinkedIn Post",
            description: "Business Leader LinkedIn Post",
            redirectionUrl: "",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: 1677654032127,
            editedBy: 129340,
          },
          {
            dashboardDataSeqId: 8,
            typeId: "T_DASHBOARD_GALLERY_ADMIN",
            itemDate: 1669487400000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              "https://res.cloudinary.com/karanthakkar/image/upload/v1669270385/HIS_GA_Team_iwyvib.jpg",
            title: "HIS GA dev team members at office",
            description: null,
            redirectionUrl:
              "https://web.yammer.com/main/org/napierhealthcare.com/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjAwMDcyODQ4ODY1Njg5NiJ9",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: null,
            editedBy: null,
          },
          {
            dashboardDataSeqId: 7,
            typeId: "T_DASHBOARD_GALLERY_ADMIN",
            itemDate: 1669314600000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              "https://res.cloudinary.com/karanthakkar/image/upload/v1669270384/32cee1f7-5586-4b2a-8d9d-46cb35d77728_l8axik.jpg",
            title: "Training fuels performance!",
            description: null,
            redirectionUrl:
              "https://web.yammer.com/main/org/napierhealthcare.com/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMTk5NjgzMjI5MDc5OTYxNiJ9",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: null,
            editedBy: null,
          },
          {
            dashboardDataSeqId: 6,
            typeId: "T_DASHBOARD_GALLERY_ADMIN",
            itemDate: 1669228200000,
            expiryDate: 1704047399000,
            thumbnailUrl:
              "https://res.cloudinary.com/karanthakkar/image/upload/v1669270422/WhatsApp_Image_2022-11-21_at_11.26.31_AM_hfsdip.jpg",
            title: "Lunch with CEO @ Singapore",
            description: null,
            redirectionUrl:
              "https://web.yammer.com/main/org/napierhealthcare.com/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjAxNDA5ODQzOTM0MDAzMiJ9",
            status: "active",
            createdOn: 1673558694360,
            createdBy: 1,
            editedOn: null,
            editedBy: null,
          },
        ],
        total: 16,
        success: true,
      },
      status: 200,
      config: {
        method: "GET",
        transformRequest: [null],
        transformResponse: [null],
        jsonpCallbackParam: "callback",
        url: "getDashboardData.action",
        headers: {
          "x-auth-token":
            "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
          "X-XSS-Protection": "1; mode=block",
          Accept: "application/json, text/plain, */*",
        },
      },
      statusText: "",
      xhrStatus: "complete",
    };
    $log.log(data);

    $scope.eventAndNewsData = [];
    $scope.galleryData = [];
    $scope.linkedInData = [];
    $scope.carouselImagesData = [];
    $scope.napierCultureTabsData = [];

    const response =
      data.data.data instanceof Array ? data.data.data : [data.data.data];

    let colorIndex = 0;
    let backgroundClasses = ["bg-primary", "bg-success", "bg-danger"];

    for (let object of response) {
      if (
        object.typeId === $scope.dashboardItemTypesConstants.EVENT ||
        object.typeId === $scope.dashboardItemTypesConstants.NEWS
      ) {
        if (object.typeId === $scope.dashboardItemTypesConstants.EVENT) {
          object.backgroundColorClass = backgroundClasses[colorIndex];
          colorIndex =
            colorIndex === backgroundClasses.length - 1 ? 0 : colorIndex + 1;
        }
        $scope.eventAndNewsData.push(object);
      } else if (object.typeId === $scope.dashboardItemTypesConstants.GALLERY) {
        $scope.galleryData.push(object);
      } else if (
        object.typeId === $scope.dashboardItemTypesConstants.LINKEDIN
      ) {
        $scope.linkedInData.push(object);
      } else if (
        object.typeId === $scope.dashboardItemTypesConstants.CAROUSEL
      ) {
        $scope.carouselImagesData.push(object);
      } else if (
        object.typeId === $scope.dashboardItemTypesConstants.CULTURE_TAB
      ) {
        $scope.napierCultureTabsData.push(object);
      }
    }

    $scope.changeNapierCultureTab(
      $scope.napierCultureTabsData[0].dashboardDataSeqId
    );
  };

  $scope.fetchRatingData = function () {
    $http({
      method: "GET",
      url: "getUserFeedbackRatings.action",
      headers: {
        "x-auth-token":
          "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
        "X-XSS-Protection": "1; mode=block",
      },
    }).then(function (data, textStatus, jqXHR) {
      commonSessionstorage.sessionStorage.setItem("RatingInfo", data.data);
      $scope.loadRatingModal();
    });
  };

  $scope.init = function () {
    $scope.fetchUserTasks();
    $scope.fetchDashboardData();
  };

  function logintoAppraisalSystemWithSSO() {
    var rooturl =
      "https://hrms-stag.napierhealthcare.com:9443/appraisal_service/";
    if (window.location.hostname == "napierhrms.napierhealthcare.com") {
      rooturl = "https://pms.napierhealthcare.com:7070/appraisal_service/";
    }
    window.open(rooturl);
  }

  function logintoAppraisalSystem() {
    var empcode = document.getElementById("currentuser1").value;
    var rooturl = "https://hrms-stag.napierhealthcare.com:9443/";
    if (window.location.hostname == "napierhrms.napierhealthcare.com") {
      rooturl = "https://pms.napierhealthcare.com:7070/";
    }

    $http({
      method: "GET",
      url: "getAuthenticationKey.action",
      headers: {
        "x-auth-token":
          "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
        "X-XSS-Protection": "1; mode=block",
      },
    }).then(function (response, textStatus, jqXHR) {
      window.open(
        rooturl +
          "PRS/#!/doauth.action?empcode=" +
          empcode +
          "&auth_key=" +
          response.message
      );
    });
  }

  function logintoCareers() {
    var rooturl = "https://hrms-stag.napierhealthcare.com:9443/JOBS";
    if (window.location.hostname == "napierhrms.napierhealthcare.com") {
      rooturl = "https://careers.napierhealthcare.com:9292";
    } else if (window.location.hostname == "localhost") {
      rooturl = window.location.origin + "/Napier_Careers";
    }

    $http({
      method: "GET",
      url: "validateUser.action",
      headers: {
        "x-auth-token":
          "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
        "X-XSS-Protection": "1; mode=block",
      },
    }).then(function (response, textStatus, jqXHR) {
      window.open(
        rooturl +
          "/#!/doauth.action?registrationId=" +
          response.data.registrationId +
          "&token=" +
          response.data.token
      );
    });
  }

  function getPendingTasks(empId, unqiueId, modMap) {
    $http({
      method: "GET",
      url: "survey/getPendingTasks.action?empCode=" + empId,
      headers: {
        "x-auth-token":
          "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
        "X-XSS-Protection": "1; mode=block",
      },
    }).then(function (data) {
      if (data.data != null && data.data.status == 1) {
        var pendingsurveys = "Hi " + data.data.empName + ", Your ";
        var pendingsurvey = "";
        var firstPendingSurvey = null;
        if (data.data.surveyOne == 30) {
          pendingsurvey = "30";
          if (firstPendingSurvey == null) {
            firstPendingSurvey = "30";
          }
        }
        if (data.data.surveyTwo == 60) {
          pendingsurvey += ",60";
          if (firstPendingSurvey == null) {
            firstPendingSurvey = "60";
          }
        }
        if (data.data.surveyThree == 90) {
          pendingsurvey += ",90";
          if (firstPendingSurvey == null) {
            firstPendingSurvey = "90";
          }
        }
        if (pendingsurvey.startsWith(",")) {
          pendingsurvey = pendingsurvey.slice(1);
        }

        if (pendingsurvey.endsWith(",")) {
          pendingsurvey = pendingSurvey.slice(0, -1);
        }
        if (pendingsurveys != null) {
          pendingsurveys +=
            pendingsurvey +
            " days surveys are pending. Kindly complete the survey to use the HRMS tool.";
          $("#pendingSurveys").html(pendingsurveys);
          $("#surveymodal").modal({
            backdrop: "static",
          });
          $("#surveymodal").modal();
          commonSessionstorage.sessionStorage.setItem(
            "pendingSurvey",
            JSON.stringify(firstPendingSurvey)
          );
          commonSessionstorage.sessionStorage.setItem(
            "modMap",
            JSON.stringify(modMap)
          );
          commonSessionstorage.sessionStorage.setItem(
            "currentModuleID",
            unqiueId
          );
          commonSessionstorage.sessionStorage.setItem(
            "moduleID",
            JSON.stringify(modMap[unqiueId])
          );
        }
      }
    });
  }

  $scope.redirectToNHS = function () {
    var folder = JSON.parse(localStorage.getItem("moduleVersion"));
    window.location.href =
      ".." +
      $appPathName +
      folder.survey_version +
      "/index.html#!/newHireSurvey";
  };

  $scope.respondToMenuItemClick = function (moduleID) {
    let modMap = JSON.parse(
      commonSessionstorage.sessionStorage.getItem("modMap")
    );
    let folder = JSON.parse(localStorage.getItem("moduleVersion"));
    commonSessionstorage.sessionStorage.setItem("currentModuleID", moduleID);
    commonSessionstorage.sessionStorage.setItem(
      "moduleID",
      JSON.stringify(modMap[moduleID])
    );
    if (moduleID == 9 || moduleID == 10 || moduleID == 11 || moduleID == 12) {
      window.location.href = "adminhomepage.jsp";
    } else if (
      moduleID == 1 ||
      moduleID == 3 ||
      moduleID == 7 ||
      moduleID == 20
    ) {
      window.location.href = "employeehomepage.jsp";
    } else if (moduleID == 26) {
      window.location.href =
        ".." + $appPathName + folder.hrms_apps_version + "/indexquiz.jsp";
    } else if (moduleID == 27) {
      window.location.href =
        ".." + $appPathName + folder.hrms_apps_version + "/indexhrf.jsp";
    } else if (moduleID == 40 || moduleID == 41) {
      window.location.href =
        ".." + $appPathName + folder.rtm_version + "/index.html";
    } else if (moduleID == 47) {
      window.location.href =
        ".." +
        $appPathName +
        'webapp/voc/frameSet_Ideation.jsp?username=<%= session.getAttribute("username")%>';
    } else if (moduleID == 48 || moduleID == 55) {
      window.location.href =
        ".." + $appPathName + folder.cs_version + "/index.html";
    } else if (moduleID == 49) {
      var isssoEnabled = localStorage.getItem("isssoEnabled");
      if (isssoEnabled == "Y") {
        logintoAppraisalSystemWithSSO();
      } else {
        logintoAppraisalSystem();
      }
    } else if (moduleID == 50) {
      window.location.href =
        ".." + $appPathName + folder.cs_version + "/index.html";
    } else if (
      moduleID == 51 ||
      moduleID == 52 ||
      moduleID == 53 ||
      moduleID == 54 ||
      moduleID == 60
    ) {
      window.location.href =
        ".." + $appPathName + folder.bd_version + "/index.html";
    } else if (moduleID == 56) {
      window.location.href =
        ".." + $appPathName + folder.qgate_version + "/index.html";
    } else if (moduleID == 57) {
      window.location.href =
        ".." + $appPathName + folder.PlcyDoc_version + "/index.html";
    } else if (moduleID == 58) {
      window.location.href =
        ".." + $appPathName + folder.voc_version + "/index.html";
    } else if (moduleID == 59) {
      window.location.href =
        ".." + $appPathName + folder.prc_version + "/index.html";
    } else if (moduleID == 61) {
      window.open("https://napierhrms.napierhealthcare.com/ONBOARD");
    } else if (moduleID == 62) {
      window.open("https://napier.x0pa.ai/recruiter/login");
    } else if (moduleID == 63 || moduleID == 71) {
      window.location.href =
        ".." + $appPathName + folder.survey_version + "/index.html";
    } else if (moduleID == 64) {
      window.location.href =
        ".." + $appPathName + folder.purchase_version + "/index.html";
    } else if (moduleID == 65) {
      logintoCareers(); //Carrier Portal
    } else if (moduleID == 66) {
      //HRF
      window.location.href =
        ".." + $appPathName + folder.hrf_version + "/index.html";
    } else if (moduleID == 67) {
      // productivity
      window.location.href =
        ".." + $appPathName + folder.productivity_version + "/index.html";
    } else if (moduleID == 68) {
      // CA
      window.location.href =
        ".." + $appPathName + folder.calender_version + "/index.html";
    } else if (moduleID == 69) {
      // org tree
      window.location.href =
        ".." + $appPathName + folder.hrms_apps_version + "/index.jsp";
    } else if (moduleID == 70) {
      // MIS reports
      window.location.href =
        ".." + $appPathName + folder.hrms_apps_version + "/index.jsp";
    } else if (moduleID == 73) {
      // Tech quiz
      window.location.href =
        ".." + $appPathName + folder.hrms_apps_version + "/indexquiz.jsp";
    } else if (moduleID == 74) {
      // Report-Builder
      window.location.href = ".." + $appPathName + "Report-Builder/index.html";
    } else if (moduleID == 75) {
      window.open("https://lcs.napierhealthcare.com/lcs-service/");
    } else {
      window.location.href =
        ".." + $appPathName + folder.hrms_apps_version + "/index.jsp";
    }
  };

  // /* hide any open popovers when anywhere else in the body is clicked */
  // $("body").on("click", function (e) {
  //   $("[data-bs-toggle=popover]").each(function () {
  //     if (
  //       !$(this).is(e.target) &&
  //       $(this).has(e.target).length === 0 &&
  //       $(".popover").has(e.target).length === 0
  //     ) {
  //       $(this).popover("hide");
  //     }
  //   });
  // });

  /* to implement html string */
  $scope.trustAsHtml = function (str) {
    return $sce.trustAsHtml(str);
  };

  $scope.openDashboardAdmin = () => {
    /* let modMap = JSON.parse(
      commonSessionstorage.sessionStorage.getItem("modMap")
    );
    commonSessionstorage.sessionStorage.setItem("currentModuleID", 76);
    commonSessionstorage.sessionStorage.setItem(
      "moduleID",
      JSON.stringify(modMap[76])
    ); */
    window.open("dashboard/views/dashboard.administration.html", "_self");
  };

  $scope.init();
});
dashboardApp.directive("apiCallLoader", [
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
