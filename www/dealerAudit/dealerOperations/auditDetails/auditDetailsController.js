var auditDetailsModule = angular.module('dealerAudit.auditDetailsControllers', ['ionic', 'ngDropdowns']);

auditDetailsModule.controller('AuditDetailsController', ['$scope','dealerAudit_AssetsConst',
'$cordovaDatePicker', '$ionicPopup','dealerAudit_ConstantsConst','$filter','auditDetailsDbFactory',
'toastFctry', 'logsFctry','$location',
 function($scope,dealerAudit_AssetsConst,$cordovaDatePicker,$ionicPopup,dealerAudit_ConstantsConst,$filter,
 auditDetailsDbFactory,toastFctry,logsFctry,$location){

$scope.TagName = 'AuditDetailsController';
$scope.calender = dealerAudit_AssetsConst.calender;
//Set the default date to current date
var date = new Date();
var dateValue = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var defaultDate = dateValue + "/" + month + "/" + year;
$scope.dateData = defaultDate;
$scope.auditDetails = {};
$scope.audit = {};
$scope.backIcon = dealerAudit_AssetsConst.backIcon;
$scope.isFormValid = false;

$scope.yesLabel = $filter('translate')('lblYes');
$scope.noLabel = $filter('translate')('lblNo');
$scope.warningTitle = $filter('translate')('lblWarning');
$scope.alertMsg = $filter('translate')('lblGoBackAlert');

//Set the date using datepicker
$scope.openDatePicker = function() {
  var dateOptions = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    maxDate: new Date() + 10,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  $cordovaDatePicker.show(dateOptions).then(function(date) {
    console.log("Date value from date picker" + date);
    var dateValue = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var fullDate = dateValue + "/" + month + "/" + year;
    console.log("Formatted date date: " + dateValue);
    console.log("Formatted date month: " + month);
    console.log("Formatted date year: " + year);
    console.log("Full date " + fullDate);
    $scope.dateData = fullDate;
  });
}

//Screen validation error messages.
$scope.auditDetailsErrorMsg = {
  auditPerson: false,
  auditDoneBy: false
};

$scope.auditPersonError = $filter('translate')('auditPersonRequired');
$scope.auditDoneByError = $filter('translate')('auditDoneByRequired');

$scope.validateForm = function() {
  if($scope.audit.auditPerson == "" || typeof($scope.audit.auditPerson) == "undefined") {
    $scope.auditDetailsErrorMsg.auditPerson = true;
    $scope.isFormValid = false;
  } else {
    $scope.auditDetailsErrorMsg.auditPerson = false;
  }
  if($scope.audit.auditDoneBy == "" || typeof($scope.audit.auditDoneBy) == "undefined") {
    $scope.auditDetailsErrorMsg.auditDoneBy = true;
    $scope.isFormValid = false;
  } else {
    $scope.auditDetailsErrorMsg.auditDoneBy = false;
  }
  if($scope.auditDetailsErrorMsg.auditPerson == false && $scope.auditDetailsErrorMsg.auditDoneBy == false) {
    $scope.isFormValid = true;
  }
  return $scope.isFormValid;
}

$scope.saveAuditDetails = function(){
  if(!$scope.validateForm()) {
    return;
  }
  $scope.auditDetails = {
    audit_date:(typeof($scope.dateData) == "undefined" || $scope.dateData == null) ? "" : $scope.dateData,
    audit_person:(typeof($scope.audit.auditPerson) == "undefined" || $scope.audit.auditPerson == null) ? "" : $scope.audit.auditPerson,
    audit_done_by:(typeof($scope.audit.auditDoneBy) == "undefined" || $scope.audit.auditDoneBy == null) ? "" : $scope.audit.auditDoneBy
  }
  logsFctry.logsDisplay('INFO', $scope.TagName, "Entered into function saveAuditDetails");
  //console.log("DEBUG" + $scope.TagName + "Dealer information " + JSON.stringify($scope.dealerData));
  logsFctry.logsDisplay('DEBUG', $scope.TagName, "Audit details " + JSON.stringify($scope.auditDetails));
  console.log("Audit details information before saving" + JSON.stringify($scope.auditDetails));

  auditDetailsDbFactory.saveAuditDetailsInfo($scope.auditDetails).then(function(data) {
        if(data) {
          logsFctry.logsDisplay('INFO', $scope.TagName, "Audit details saved successfully");
          //toastFctry.showToast("Audit details succesfully added.");
          console.log("Audit details information after saving" + JSON.stringify($scope.auditDetails));
          $location.path('/auditQuestionnaire');

        } else {
          logsFctry.logsDisplay('INFO', $scope.TagName, "Audit details could not be saved");
        }
      }, function(error) {
        logsFctry.logsDisplay('ERROR', $scope.TagName, "Audit details could not be saved due to error " + JSON.stringify(error));
        console.log("Catch error in db ----" + JSON.stringify(error));
      })
    }

    /**
     * @function backButtonClicked
     * @description Back button click on the header.
     */
    $scope.backButtonClicked = function() {
      var confirmPopup = $ionicPopup.confirm({
      			title: $scope.warningTitle,
      			template: $scope.alertMsg,
      			cancelText: $scope.noLabel,
      			okText: $scope.yesLabel,
      			cssClass: 'customAlertConfirmation'
      		});
      		confirmPopup.then(function(res) {
      			if(res) {
      			  $location.path('/dashBoard');
      		}
    	});
    }
}])
