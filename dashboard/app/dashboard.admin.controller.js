const dashboardAdminApp = angular.module("dashboardAdminApp", [
  "ngAnimate",
  "ngSanitize",
  "ui.bootstrap",
  "ui.grid",
  "ui.grid.resizeColumns",
  "ui.grid.pagination",
  "ui.grid.pinning",
  "alertsModule",
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
    $scope.formData.activeFormType = "";
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
      minDate: new Date(),
    };
    $scope.eventDateOptions = {
      minDate: new Date(),
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
        { name: "Type", field: "type", width: "96", cellFilter: "capitalize" },
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

    $scope.dashboardItemTypes = [
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
    ];

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
      $scope.searchFormData.searchType = "";
      $scope.searchFormData.fromDate = null;
      $scope.searchFormData.toDate = null;
      $scope.fromDateOptions = {};
      $scope.toDateOptions = {};
    };

    $scope.redirectToDashboard = () => {
      window.open("../../index.html", "_self");
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
            ? $scope.formData.expiryDate.setHours(23, 59, 59)
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
              alertService.showAlert(
                "success",
                `${
                  $scope.formMode === "create" ? "Saved" : "Updated"
                } successfully`,
                3000
              );
              $timeout(() => {
                $scope.backToSearch();
              }, 3000);
            } else {
              alertService.showAlert(
                "failure",
                `Something went wrong, please try again! <br/> or <br/>`,
                4000,
                "Contact Support",
                $scope.openZohoTicketForm
              );
            }
          },
          function (error) {
            alertService.showAlert(
              "failure",
              `Something went wrong, please try again! <br/> or <br/>`,
              4000,
              "Contact Support",
              $scope.openZohoTicketForm
            );
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
      $scope.formData.activeFormType = "";
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
    };

    $scope.search = function () {
      /* $scope.searchGridOptions.data = [];
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
        function (response) { */
      let response = {
        data: {
          data: [
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
              type: "carousel",
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
              type: "carousel",
            },
            {
              dashboardDataSeqId: 12,
              typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
              itemDate: 1669660200000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1671620255/1a237d08-e04c-4ef9-9bc8-9a151c4cde65_ehe4w9.jpg",
              title: "Carousel - 3",
              description: "Carousel - 3",
              redirectionUrl:
                "https://www.linkedin.com/company/napierhealthcare/",
              status: "inactive",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677147914873,
              editedBy: 129340,
              type: "carousel",
            },
            {
              dashboardDataSeqId: 24,
              typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
              itemDate: 1675329452023,
              expiryDate: 1675708199000,
              thumbnailUrl:
                "https://res.cloudinary.com/dczjyucne/image/upload/v1675329414/IJP_1_3_g2v43r.jpg",
              title: "IJRP",
              description: "Internal job rotation prog",
              redirectionUrl:
                "https://res.cloudinary.com/dczjyucne/image/upload/v1675329414/IJP_1_3_g2v43r.jpg",
              status: "inactive",
              createdOn: 1675329440903,
              createdBy: 129340,
              editedOn: 1677147952933,
              editedBy: 129340,
              type: "carousel",
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
              type: "carousel",
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
              type: "carousel",
            },
            {
              dashboardDataSeqId: 27,
              typeId: "T_DASHBOARD_CAROUSEL_ADMIN",
              itemDate: 1680255212267,
              expiryDate: 1680546599000,
              thumbnailUrl:
                "https://res.cloudinary.com/dczjyucne/image/upload/v1680255155/6_fi7fjl.jpg",
              title: "Happy Hour",
              description: "In Person engagement",
              redirectionUrl:
                "https://res.cloudinary.com/dczjyucne/image/upload/v1680255155/6_fi7fjl.jpg",
              status: "active",
              createdOn: 1680255190067,
              createdBy: 129340,
              editedOn: null,
              editedBy: null,
              type: "carousel",
            },
            {
              dashboardDataSeqId: 13,
              typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
              itemDate: 1669660200000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://www.linkedin.com/company/napierhealthcare/",
              title: "Work Culture",
              description:
                "<p>Welcome to the Napier Family!! A well know brand in healthcare IT industry in APAC, SEA, India and Middle East region.</p><p><br></p><p>We are a startup which is 25 years old. Seems contradicting? Wait!!</p><p><br></p><p>We have been serving healthcare industry with our legacy solutions for more than 25 years now. However, in our hearts, we are a startup with leaders from strong clinical, tech and business background embarking on to create intelligent IT solution for efficient healthcare delivery. Why a start-up? We want to harness the energy, dynamism and innovation that start-ups bring to the business. Yet, we will retain the legacy of our past, our secret sauce, that has resulted in our success. That way, we will have the best of both worlds!</p><p><br></p><p>Napierites take pride in creating something which directly impacts the way services are delivered by secondary and tertiary healthcare providers. Making a difference in the life of our end consumers - doctors and patients - is our motto in life.</p><p><br></p><p>Napier is committed to creating a diverse environment. It is our policy to provide equal opportunity to all people without regard to race, color, religion, national origin, ancestry, marital status, veteran status, age, disability, pregnancy, genetic information, citizenship status, sex, sexual orientation, gender identity or any other legally protected category.</p><p><br></p><p>Every day, we push the boundaries of our industry, and we encourage our employees to share their ideas, take initiative and be accountable for their work.</p><p><br></p><p>We are excited to have you as part of our incredible journey!!</p>",
              redirectionUrl: "https://www.napierhealthcare.com/home/",
              status: "active",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677484148730,
              editedBy: 129014,
              type: "culture tab",
            },
            {
              dashboardDataSeqId: 14,
              typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
              itemDate: 1669660200000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://www.linkedin.com/company/napierhealthcare/",
              title: "DNA",
              description:
                '<p><strong style=\\"color: rgb(24, 24, 24);\\"><em>"Don\'t do to others what you don\'t want done to you"</em></strong></p><p>-- <span style=\\"color: rgb(32, 33, 36);\\">Confucius</span></p><p><br></p><p><strong>Honesty, Integrity, Transparency (HIT)&nbsp;</strong></p><ul><li>Be honest and truthful, maintain Integrity in all transactions, keep total transparency in communicating.&nbsp;</li></ul><p>&nbsp;</p><p><strong>Respect for each other&nbsp;</strong></p><ul><li>Value your co-workers&nbsp;</li><li>Treat all the employees in same manner irrespective of their level in the organization.</li><li>Never miss out to recognize and appreciate good performance&nbsp;</li></ul><p><br></p><p><strong>Revenue Focus&nbsp;</strong></p><ul><li>Be revenue/Cost conscious and not miss out on any opportunity&nbsp;</li><li>Complete the tasks with minimum turnaround time&nbsp;</li><li>Leverage on cross functional strengths</li><li>Increase productivity through value addition&nbsp;</li></ul><p><br></p><p><strong>Pride in Work&nbsp;</strong></p><ul><li>Be proud to be a Napierite&nbsp;</li><li>Be accountable and take ownership</li><li>Enjoy your work</li></ul>',
              redirectionUrl: "https://www.napierhealthcare.com/home/",
              status: "active",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677484160910,
              editedBy: 129014,
              type: "culture tab",
            },
            {
              dashboardDataSeqId: 15,
              typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
              itemDate: 1669660200000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://www.linkedin.com/company/napierhealthcare/",
              title: "Strategy",
              description:
                "<p>With a new business model centered on myNapier, we are creating a portfolio of products to support Hospitals, Nursing homes, Medical board and Homecare services leveraging cloud, AI and analytics wherever possible.</p><p><br></p><p>The 3 key focus area shaping our business strategy are: </p><p><br></p><p>1. Performance Driven Organization(PDO) aimed towards </p><ul><li><strong>Driving an entrepreneurial culture within Napier with due empowerment </strong></li><li><strong>Providing lasting careers not just jobs </strong></li><li><strong>Creating a world class talent organisation in health tech</strong></li></ul><p><br></p><p>2. myNapier business </p><ul><li>Moving to cloud implementation </li><li>Providing customer a bundle of services not just product </li><li>Building scalable business </li></ul><p><br></p><p>3. Artificial Intelligence</p><ul><li>Innovation and AI to be integral part of everyday work </li><li>Making every part of the product intelligent</li></ul>",
              redirectionUrl: "https://www.napierhealthcare.com/home/",
              status: "active",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677484191640,
              editedBy: 129014,
              type: "culture tab",
            },
            {
              dashboardDataSeqId: 16,
              typeId: "T_DASHBOARD_CULTURETAB_ADMIN",
              itemDate: 1669660200000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://www.linkedin.com/company/napierhealthcare/",
              title: "Vision",
              description:
                "To deliver most value to Healthcare providers by providing highest quality Cloud based implementations leveraging Artificial Intelligence in the shortest possible time.",
              redirectionUrl: "https://www.napierhealthcare.com/home/",
              status: "active",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677484202670,
              editedBy: 129014,
              type: "culture tab",
            },
            {
              dashboardDataSeqId: 1,
              typeId: "T_DASHBOARD_EVENT_ADMIN",
              itemDate: 1669141800000,
              expiryDate: 1704047399000,
              thumbnailUrl: "",
              title: "CCO & ICIO Townhall",
              description:
                "Briefing on Strategic Business Focus for CCO and ICIO",
              redirectionUrl:
                "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ODVhMzAyNjQtN2I5Mi00YjQwLWE0NTEtYzc5MjY4N2NhY2U4%40thread.v2/0?context=%7b%22Tid%22%3a%22fbefa5de-8192-4522-b70b-e765e95acc5d%22%2c%22Oid%22%3a%224d09e04e-598f-47b8-b0f7-c9bf99d856b2%22%7d",
              status: "inactive",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677147751563,
              editedBy: 129340,
              type: "event",
            },
            {
              dashboardDataSeqId: 3,
              typeId: "T_DASHBOARD_EVENT_ADMIN",
              itemDate: 1669314600000,
              expiryDate: 1704047399000,
              thumbnailUrl: "",
              title: "Orientation on POSH at Work",
              description:
                "POSH Law (Sexual Harassment of Women at Workplace Act 2013) mandates every Employer to provide a safe working environment at the workplace.",
              redirectionUrl:
                "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZThlY2QwM2EtMmUxNy00MWRmLWEwNzQtZjgxYjc4ZGY1ODg0%40thread.v2/0?context=%7b%22Tid%22%3a%22fbefa5de-8192-4522-b70b-e765e95acc5d%22%2c%22Oid%22%3a%22ee572cd9-8ca4-4143-8c11-b136db485816%22%7d",
              status: "inactive",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677483368833,
              editedBy: 129014,
              type: "event",
            },
            {
              dashboardDataSeqId: 4,
              typeId: "T_DASHBOARD_EVENT_ADMIN",
              itemDate: 1669487400000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1669181076/pexels-leeloo-thefirst-7163955_ydrra8.jpg",
              title: "Enroll for Parental Insurance",
              description:
                "A parental insurance policy covers pre-existing diseases, albeit with a waiting period of 24 to 48 months.",
              redirectionUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1669181076/pexels-leeloo-thefirst-7163955_ydrra8.jpg",
              status: "inactive",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677147783307,
              editedBy: 129340,
              type: "event",
            },
            {
              dashboardDataSeqId: 18,
              typeId: "T_DASHBOARD_EVENT_ADMIN",
              itemDate: 1674412200000,
              expiryDate: 1704047399000,
              thumbnailUrl: "",
              title: "Demo",
              description: "demo123",
              redirectionUrl:
                "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ODVhMzAyNjQtN2I5Mi00YjQwLWE0NTEtYzc5MjY4N2NhY2U4%40thread.v2/0?context=%7b%22Tid%22%3a%22fbefa5de-8192-4522-b70b-e765e95acc5d%22%2c%22Oid%22%3a%224d09e04e-598f-47b8-b0f7-c9bf99d856b2%22%7d",
              status: "inactive",
              createdOn: 1674459375850,
              createdBy: 107641,
              editedOn: 1677147540600,
              editedBy: 129340,
              type: "event",
            },
            {
              dashboardDataSeqId: 29,
              typeId: "T_DASHBOARD_EVENT_ADMIN",
              itemDate: 1681410600000,
              expiryDate: 1681496999000,
              thumbnailUrl: "",
              title: "Iftar Party",
              description: "Invitation for Iftar party",
              redirectionUrl:
                "https://res.cloudinary.com/dczjyucne/image/upload/v1680256171/1_yjiwin.jpg",
              status: "inactive",
              createdOn: 1680256221693,
              createdBy: 129340,
              editedOn: 1680256278253,
              editedBy: 129340,
              type: "event",
            },
            {
              dashboardDataSeqId: 32,
              typeId: "T_DASHBOARD_EVENT_ADMIN",
              itemDate: 1682620200000,
              expiryDate: 1682706599000,
              thumbnailUrl: "",
              title: "Happy Hours Engineering Team",
              description: "Happy Hours",
              redirectionUrl:
                "https://www.yammer.com/api/v1/uploaded_files/1649678073856/preview/?client_application_id=40443904&fallback_to_icon=false&file_type=image&network_id=243901&storage=AZURE&uid=1503763709952",
              status: "inactive",
              createdOn: 1680569903500,
              createdBy: 129340,
              editedOn: 1680569930057,
              editedBy: 129340,
              type: "event",
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
              type: "gallery",
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
              type: "gallery",
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
              type: "gallery",
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
              type: "gallery",
            },
            {
              dashboardDataSeqId: 33,
              typeId: "T_DASHBOARD_GALLERY_ADMIN",
              itemDate: 1680570021857,
              expiryDate: 1682706599000,
              thumbnailUrl:
                "https://www.yammer.com/api/v1/uploaded_files/1649678073856/preview/?client_application_id=40443904&fallback_to_icon=false&file_type=image&network_id=243901&storage=AZURE&uid=1503763709952",
              title: "Happy Hours Engineering Team",
              description: "Happy Hour",
              redirectionUrl:
                "https://web.yammer.com/main/org/napierhealthcare.com/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjIwNzE2OTkzODEyMDcwNCJ9",
              status: "active",
              createdOn: 1680569999180,
              createdBy: 129340,
              editedOn: null,
              editedBy: null,
              type: "gallery",
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
              type: "linkedIn",
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
              type: "linkedIn",
            },
            {
              dashboardDataSeqId: 20,
              typeId: "T_DASHBOARD_LINKEDIN_ADMIN",
              itemDate: 1674464619013,
              expiryDate: 1704047399000,
              thumbnailUrl:
                '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Video: Elderly Teacher Falls From Cycle, Cops Thrash Him For Being Slow <a href="https://t.co/2xpQWfmLxJ">https://t.co/2xpQWfmLxJ</a> <a href="https://t.co/tftAsTQ5Oz">pic.twitter.com/tftAsTQ5Oz</a></p>&mdash; NDTV (@ndtv) <a href="https://twitter.com/ndtv/status/1616812381883215875?ref_src=twsrc%5Etfw">January 21, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
              title: "New Post",
              description: "New post",
              redirectionUrl: "",
              status: "inactive",
              createdOn: 1674464607757,
              createdBy: 129340,
              editedOn: 1674464665733,
              editedBy: 129340,
              type: "linkedIn",
            },
            {
              dashboardDataSeqId: 21,
              typeId: "T_DASHBOARD_LINKEDIN_ADMIN",
              itemDate: 1674465644493,
              expiryDate: 1704047399000,
              thumbnailUrl:
                '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7001074296357867520" height="700" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>',
              title: "tutyutyu",
              description: "yjhgjghjghj",
              redirectionUrl: "",
              status: "inactive",
              createdOn: 1674465633247,
              createdBy: 129340,
              editedOn: 1677147714680,
              editedBy: 129340,
              type: "linkedIn",
            },
            {
              dashboardDataSeqId: 23,
              typeId: "T_DASHBOARD_LINKEDIN_ADMIN",
              itemDate: 1674467312357,
              expiryDate: 1704047399000,
              thumbnailUrl:
                '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7012722448181723136" height="700" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>',
              title: "Linked IN demo",
              description: "Linked IN demo Description",
              redirectionUrl: "",
              status: "inactive",
              createdOn: 1674467301127,
              createdBy: 129340,
              editedOn: 1677147499140,
              editedBy: 129340,
              type: "linkedIn",
            },
            {
              dashboardDataSeqId: 2,
              typeId: "T_DASHBOARD_NEWS_ADMIN",
              itemDate: 1669228200000,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1669180834/ceo-avatar_qykw4n.jpg",
              title: "Leader's Voice",
              description: "See what our CEO has to say to all employees",
              redirectionUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1669180834/ceo-avatar_qykw4n.jpg",
              status: "inactive",
              createdOn: 1673558694360,
              createdBy: 1,
              editedOn: 1677496957480,
              editedBy: 129014,
              type: "news",
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
              type: "news",
            },
            {
              dashboardDataSeqId: 19,
              typeId: "T_DASHBOARD_NEWS_ADMIN",
              itemDate: 1674461027817,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://c.ndtvimg.com/2023-01/ap1bgm1o_pm-modi-ndtv-650_650x400_23_January_23.jpg",
              title: "Todays news headline",
              description: "Description",
              redirectionUrl:
                "https://www.linkedin.com/company/napierhealthcare/",
              status: "inactive",
              createdOn: 1674461018803,
              createdBy: 107641,
              editedOn: 1675225481007,
              editedBy: 129340,
              type: "news",
            },
            {
              dashboardDataSeqId: 22,
              typeId: "T_DASHBOARD_NEWS_ADMIN",
              itemDate: 1674467146927,
              expiryDate: 1704047399000,
              thumbnailUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1609399056/vr-img_vuka5u.png",
              title: "News Demo",
              description: "Description",
              redirectionUrl:
                "https://res.cloudinary.com/karanthakkar/image/upload/v1609399056/vr-img_vuka5u.png",
              status: "inactive",
              createdOn: 1674467135850,
              createdBy: 129340,
              editedOn: 1677147469993,
              editedBy: 129340,
              type: "news",
            },
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
              type: "news",
            },
            {
              dashboardDataSeqId: 31,
              typeId: "T_DASHBOARD_NEWS_ADMIN",
              itemDate: 1680415196563,
              expiryDate: 1681064999000,
              thumbnailUrl:
                "https://napierhrms.napierhealthcare.com/Dashboard_resoures/JIRA-Training-db.png",
              title: "Jira training powered by NapierEdx.",
              description:
                "NAPIER EdX - Jira Training - 03/04/2023 to 07/04/2023 - 11:30 AM to 12:30 PM",
              redirectionUrl:
                "https://web.yammer.com/main/org/napierhealthcare.com/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjIwMjY0NDUwMjQ3MDY1NiJ9",
              status: "active",
              createdOn: 1680415177073,
              createdBy: 129014,
              editedOn: 1680498837963,
              editedBy: 129014,
              type: "news",
            },
          ],
          total: 33,
          success: true,
        },
        status: 200,
        config: {
          method: "GET",
          transformRequest: [null],
          transformResponse: [null],
          jsonpCallbackParam: "callback",
          url: "https://hrms-stag.napierhealthcare.com:9443/HRMS/searchDashboardData.action",
          params: {
            type: "",
            status: "",
            fromDate: "1800-01-01 00:00:00",
            toDate: "9999-12-31 23:59:59",
            empId: "129014",
          },
          headers: {
            "x-auth-token":
              "ZkLWU4NjJkZTg1N2E3MCIsImlhdCI6MTU3NzQzODc3NiwiZXhwIjoxNTc3NDQyMzc2fQ",
            Accept: "application/json, text/plain, */*",
          },
        },
        statusText: "",
        xhrStatus: "complete",
      };
      if (response.data.success) {
        const data = response.data.data;
        $scope.searchGridOptions.data = data;
      } else {
        alertService.showAlert(
          "failure",
          `Something went wrong, please try again! <br/> or <br/>`,
          4000,
          "Contact Support",
          $scope.openZohoTicketForm
        );
      }
      /*         },
        function (error) {
          alertService.showAlert('failure', `Something went wrong, please try again! <br/> or <br/>`, 4000, 'Contact Support', $scope.openZohoTicketForm);
          $log.log(error);
        } */
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
      const empObj = JSON.parse(
        commonSessionstorage.sessionStorage.getItem("data1")
      ).data.userRoles[0].employee;
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
