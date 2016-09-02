/**
 * @class dealerAudit.dashBoardControllers
 * @description Function to login.
 */

var dashBoardControllers = angular.module('dealerAudit.dashBoardControllers', ['ionic'])
/**
 * @function CustomerInfoController
 * @param {ScopeElemet} $scope defines scope of an elemet or function.
 * @param {Constants} dealerAudit_ConstantsConst  provides all the constants.
 * @param {Service} $location  provides interface to default state.
 * @param {Service} $filter used for formatting data displayed to the user.
 * @param {Service} $ionicPopUp provides popUp message boxes.
 * @description controller for handling dashboard functionalities
 */
dashBoardControllers.controller('CustomerInfoController', function($scope,$rootScope, dealerAudit_ConstantsConst, settingsDbfctry,$location,$ionicPopup,$filter,logsFctry) {
	$scope.TagName = 'dashBoardController';
    var errorLogsTitle = $filter('translate')('lblWarning');
	var errorLogMsg = $filter('translate')('lblLogEnableError');
	$scope.home = $filter('translate')('lblhome');
	$scope.startLabel1 = $filter('translate')('lblstartLabel1 ');
	$scope.savedLabel1 = $filter('translate')('lblsavedLabel1');
	$scope.reportsLabel1 = $filter('translate')('lblreportsLabel1');
	$scope.settingsLabel1 = $filter('translate')('lblsettingsLabel1');
	$rootScope.popUpFlag = false;



	try{
	console.log('Entered into CustomerInfoController');
		logsFctry.logsDisplay('INFO', $scope.TagName,'Entered into CustomerInfoController');
	var statusVal = [];
	$scope.loginID = dealerAudit_ConstantsConst.loginId;
	console.log('$scope.loginID ==>'+$scope.loginID);
	logsFctry.logsDisplay('DEBUG', $scope.TagName,'$scope.loginID ==>'+$scope.loginID);

	var logOutPopup = true;



	$scope.sendMail = function() {
			try {
				console.log( 'in send mail');
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into $scope.sendMail');
				settingsDbfctry.getLogsStatus(dealerAudit_ConstantsConst.TTS_Name).then(function(LogsStatus) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'LogsStatus from db::' + LogsStatus);
					var logsStatus = LogsStatus;
					if ((logsStatus != '') && (logsStatus != 'null') && (logsStatus != null) && (logsStatus != 'undefined') && (logsStatus != undefined)) {
						if (logsStatus == 1) {
							logsFctry.sendMail();
						} else {
							showAlert(errorLogsTitle, errorLogMsg);
						}
					} else {
						showAlert(errorLogsTitle, errorLogMsg);
					}
				});
			} catch(e) {
				logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error  in $scope.sendMail::' + e);
			}
			logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit from $scope.sendMail');
		};

/**
* @function showAlert
* @description Function displaying alerts.
*/
	var showAlert = function(titleMsg, contentMsg) {
		try {
			if ($rootScope.popUpFlag == false) {
				$rootScope.popUpFlag = true;
				var alertPopup = $ionicPopup.alert({
					title : titleMsg,
					content : contentMsg,
					cssClass : 'customAlert'
				});
			}
			alertPopup.then(function(res) {
				$rootScope.popUpFlag = false;
				//To clear set pin field if pin is wrong

			});
		} catch(e) {
			console.log("error in showAlert ::" + e);
			logsFctry.logsDisplay('ERROR', $scope.TagName,"error in showAlert ::" + e);
		}
	};


/**
* @memberof dealerAudit.dashBoardControllers
* @ngdoc controller
* @name signOut
* @desc signout function for the dashboard
*/
	$scope.signOut = function() {

		try {

			console.log('Entered in signOut function ::');
			logsFctry.logsDisplay('INFO', $scope.TagName,'Entered in signOut function ::');

			var userName = dealerAudit_ConstantsConst.TTS_Name;

			console.log("username for logout:" + userName);
			logsFctry.logsDisplay('DEBUG', $scope.TagName,"username for logout:" + userName);

			ISession.getInstance().then(function(session) {

				session.logout();

				//sessionObj={};

				console.log(session);

			});

			if(logOutPopup == true){
				logOutPopup = false;
			var confirmPopup = $ionicPopup.confirm({

				title : "Logout",

				template : 'Do you want to logout?',

				cancelText : "No",

				okText : "Yes",

				cssClass : 'customAlertConfirmation'

			});
			confirmPopup.then(function(res) {
				if (res) {
						$location.path('/Login');

				}
				logOutPopup = true;
			});
	    	}


		} catch(e) {

			console.log('Error in signOut function ::' + e);

		}

		console.log('Exit from signOut function');

	}

	}catch(e){
		console.log('error in dashboard'+ JSON.stringify(e));
	}
});
