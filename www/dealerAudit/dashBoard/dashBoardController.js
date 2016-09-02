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
dashBoardControllers.controller('CustomerInfoController', function($scope, $rootScope, dealerAudit_ConstantsConst, settingsDbfctry, $location, $ionicPopup, $filter, logsFctry, $cordovaNetwork, passParameterFctry, syncModuleFactory, toastFctry, modifyDealerDbFactory) {
	$scope.TagName = 'dashBoardController';
	var errorLogsTitle = $filter('translate')('lblWarning');
	var errorLogMsg = $filter('translate')('lblLogEnableError');
	$scope.home = $filter('translate')('lblhome');
	$scope.startLabel1 = $filter('translate')('lblstartLabel1 ');
	$scope.savedLabel1 = $filter('translate')('lblsavedLabel1');
	$scope.reportsLabel1 = $filter('translate')('lblreportsLabel1');
	$scope.settingsLabel1 = $filter('translate')('lblsettingsLabel1');
	$rootScope.popUpFlag = false;
	$rootScope.logoutPopupFlag = false;
	var isAlertFlag = false;
	var isAlertFlag1 = false;
	var isAlertFlag2 = false;
	var isAlertFlag3 = false;

	try {

		$scope.$on('$ionicView.beforeEnter', function() {
			settingsDbfctry.getLiveTutorialFlag(dealerAudit_ConstantsConst.TTS_Name).then(function(TutorialFlag) {
				var TutorialFlagFromDB = TutorialFlag;
				logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagFromDB ::' + TutorialFlagFromDB);

				$scope.TutorialFlagArray = TutorialFlagFromDB.split('|');
				logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray ::' + $scope.TutorialFlagArray);
				logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArrayLength ::' + $scope.TutorialFlagArray.length);

				if($scope.TutorialFlagArray[1] == 0) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'need to open live tutorial view here');
					angular.element('#drawerButton').css({
						"pointer-events": "none"
					});


					isAlertFlag = true;
					angular.element('#over_mapStart').show();
				} else if($scope.TutorialFlagArray[1] == 1) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'no need to open live tutorial view here');
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag = false;
					isAlertFlag1 = true;
					angular.element('#over_mapStart').hide();
					angular.element('#over_mapSave').show();

				} else if($scope.TutorialFlagArray[1] == 2) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'no need to open live tutorial view here');
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag1 = false;
					isAlertFlag2 = true;
					angular.element('#over_mapSave').hide();
					angular.element('#over_mapReport').show();

				} else if($scope.TutorialFlagArray[1] == 3) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'no need to open live tutorial view here');
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag3 = false;
					angular.element('#over_mapReport').hide();
					angular.element('#over_mapSettings').show();

				} else if($scope.TutorialFlagArray[1] == 4) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'no need to open live tutorial view here');
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag4 = false;
					angular.element('#over_mapSettings').hide();

				} else {
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag = false;
					isAlertFlag2 = false;
					isAlertFlag3 = false;
					isAlertFlag4 = false;
					angular.element('#over_mapStart').hide();
					angular.element('#over_mapSave').hide();
					angular.element('#over_mapReport').hide();
					angular.element('#over_mapSettings').hide();
					//do nothing
				}
				//if(TutorialFlagFromDB == '0|0|0|0|0|0'){
				//}else{
				//don't open
				//	angular.element('#rightNameLabelID').hide();
				//$scope.firstTimeEntry += 1;

				//}
			});
		});
		console.log('Entered into CustomerInfoController');
		logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into CustomerInfoController');
		var statusVal = [];
		$scope.loginID = dealerAudit_ConstantsConst.loginId;
		$scope.failureTitle = $filter('translate')('lblSyncFailed');
		$scope.failureContent = $filter('translate')('lblUploadSyncFailed');

		console.log('$scope.loginID ==>' + $scope.loginID);
		logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.loginID ==>' + $scope.loginID);

		var logOutPopup = true;

		$scope.sendMail = function() {
			try {
				console.log('in send mail');
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into $scope.sendMail');
				settingsDbfctry.getLogsStatus(dealerAudit_ConstantsConst.TTS_Name).then(function(LogsStatus) {
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'LogsStatus from db::' + LogsStatus);
					var logsStatus = LogsStatus;
					if((logsStatus != '') && (logsStatus != 'null') && (logsStatus != null) && (logsStatus != 'undefined') && (logsStatus != undefined)) {
						if(logsStatus == 1) {
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
				if($rootScope.popUpFlag == false) {
					$rootScope.popUpFlag = true;
					var alertPopup = $ionicPopup.alert({
						title: titleMsg,
						content: contentMsg,
						cssClass: 'customAlert'
					});
				}
				alertPopup.then(function(res) {
					$rootScope.popUpFlag = false;
					//To clear set pin field if pin is wrong

				});
			} catch(e) {
				console.log("error in showAlert ::" + e);
				logsFctry.logsDisplay('ERROR', $scope.TagName, "error in showAlert ::" + e);
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
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered in signOut function ::');

				var userName = dealerAudit_ConstantsConst.TTS_Name;

				console.log("username for logout:" + userName);
				logsFctry.logsDisplay('DEBUG', $scope.TagName, "username for logout:" + userName);

				ISession.getInstance().then(function(session) {

					session.logout();
					$rootScope.session = null;

					//sessionObj={};

					console.log(session);

				});

				if(logOutPopup == true) {
					logOutPopup = false;
					var confirmPopup = $ionicPopup.confirm({

						title: "Logout",

						template: 'Do you want to logout?',

						cancelText: "No",

						okText: "Yes",

						cssClass: 'customAlertConfirmation'

					});
					confirmPopup.then(function(res) {
						if(res) {
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

		/*	$scope.$on('$ionicView.afterEnter', function() {
					try {
						if ($cordovaNetwork.isOnline() === true) {
							console.log("online");

						} else {
							console.log("offline");


						}
						try {
							settingsDbfctry.getLiveTutorialFlag(dealerAudit_ConstantsConst.TTS_Name).then(function(TutorialFlag) {
								var TutorialFlagFromDB = TutorialFlag;
								console.log('TutorialFlagFromDB ::' + TutorialFlagFromDB);
								$scope.TutorialFlagArray = TutorialFlagFromDB.split('|');
		              console.log('	$scope.TutorialFlagArray' +	$scope.TutorialFlagArray);

								if ($scope.TutorialFlagArray[1] == 0) {
									console.log('$scope.TutorialFlagArray[1] ::' + $scope.TutorialFlagArray[1]);

									if ($cordovaNetwork.isOnline() === true) {

										console.log("inside if");
										//var message=$filter('translate')('lblSyncStarts');
										//toastFctry.showToast(message);
										$rootScope.logoutPopupFlag = true;
										console.log("$rootScope.logoutPopupFlag "+ $rootScope.logoutPopupFlag);
									//Bug Fix-9896(Loading screen should be present in all the page when page loads slowly)
									//	angular.element('#disableBgIDDiv').show();

									}
								}
							});
						} catch(e) {
							console.log('Errors in  after Enter inner try ::' + e);
						}
						//logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered in to  settings $ionicView.afterEnter');
					} catch(e) {

						//logsFctry.logsDisplay('ERROR', $scope.TagName, 'Errror in settings $ionicView.afterEnter::'+e);
					}
					//logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit from  settings $ionicView.afterEnter');
				}); */


		/**
		 * @memberof dealerAudit.dashBoardControllers
		 * @name getDealerInformation
		 * @desc functionality to get all dealers.
		 */
		$scope.getDealerInformation = function() {
			console.log(" Get Dealer information");

			//if(passParameterFctry.getDealerSyncInformation()) {
			// Navigate to search dealer page.
			//$location.path('/searchDealer');
			$location.path('/auditProgressDealer');
			//$location.path('/Login');
			//} else {
			//toastFctry.showToast("Dealer data sync in progress . Please wait for some more time.");
			//}
		}


		//Thise are the live tutorial changes
		$scope.hideOverLay = function() {
			try {
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered in to hideOverLay');
				if($scope.TutorialFlagArray[1] == 0) {
					$scope.TutorialFlagArray[1] = 1;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.TutorialFlagArray:: before closing modal' + $scope.TutorialFlagArray);
					var TutorialFlagArray = '';
					var lastString = $scope.TutorialFlagArray[$scope.TutorialFlagArray.length - 1];
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray:: lastString before closing modal' + lastString);
					for(var i = 0; i < $scope.TutorialFlagArray.length - 1; i++) {
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + '$scope.TutorialFlagArray[i]::' + $scope.TutorialFlagArray[i]);
						TutorialFlagArray = TutorialFlagArray + $scope.TutorialFlagArray[i] + "|";
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + 'TutorialFlagArray::' + TutorialFlagArray);

					}
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: out side for loop::' + TutorialFlagArray);
					TutorialFlagArray = TutorialFlagArray + lastString;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: after adding last string::' + TutorialFlagArray);
					settingsDbfctry.setLiveTutorialFlag(TutorialFlagArray, dealerAudit_ConstantsConst.TTS_Name);
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag = false;
					angular.element('#over_mapStart').hide();
					angular.element('#over_mapSave').show();

				} else if($scope.TutorialFlagArray[1] == 1) {
					$scope.TutorialFlagArray[1] = 2;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.TutorialFlagArray:: before closing modal' + $scope.TutorialFlagArray);
					var TutorialFlagArray = '';
					var lastString = $scope.TutorialFlagArray[$scope.TutorialFlagArray.length - 1];
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray:: lastString before closing modal' + lastString);
					for(var i = 0; i < $scope.TutorialFlagArray.length - 1; i++) {
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + '$scope.TutorialFlagArray[i]::' + $scope.TutorialFlagArray[i]);
						TutorialFlagArray = TutorialFlagArray + $scope.TutorialFlagArray[i] + "|";
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + 'TutorialFlagArray::' + TutorialFlagArray);
					}
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: out side for loop::' + TutorialFlagArray);
					TutorialFlagArray = TutorialFlagArray + lastString;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: after adding last string::' + TutorialFlagArray);
					settingsDbfctry.setLiveTutorialFlag(TutorialFlagArray, dealerAudit_ConstantsConst.TTS_Name);
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag1 = false;

					angular.element('#over_mapSave').hide();
					angular.element('#over_mapReport').show();

				} else if($scope.TutorialFlagArray[1] == 2) {
					$scope.TutorialFlagArray[1] = 3;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.TutorialFlagArray:: before closing modal' + $scope.TutorialFlagArray);
					var TutorialFlagArray = '';
					var lastString = $scope.TutorialFlagArray[$scope.TutorialFlagArray.length - 1];
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray:: lastString before closing modal' + lastString);
					for(var i = 0; i < $scope.TutorialFlagArray.length - 1; i++) {
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + '$scope.TutorialFlagArray[i]::' + $scope.TutorialFlagArray[i]);
						TutorialFlagArray = TutorialFlagArray + $scope.TutorialFlagArray[i] + "|";
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + 'TutorialFlagArray::' + TutorialFlagArray);
					}
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: out side for loop::' + TutorialFlagArray);
					TutorialFlagArray = TutorialFlagArray + lastString;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: after adding last string::' + TutorialFlagArray);
					settingsDbfctry.setLiveTutorialFlag(TutorialFlagArray, dealerAudit_ConstantsConst.TTS_Name);
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag1 = false;

					angular.element('#over_mapReport').hide();
					angular.element('#over_mapSettings').show();

				} else if($scope.TutorialFlagArray[1] == 3) {
					$scope.TutorialFlagArray[1] = 4;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.TutorialFlagArray:: before closing modal' + $scope.TutorialFlagArray);
					var TutorialFlagArray = '';
					var lastString = $scope.TutorialFlagArray[$scope.TutorialFlagArray.length - 1];
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray:: lastString before closing modal' + lastString);
					for(var i = 0; i < $scope.TutorialFlagArray.length - 1; i++) {
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + '$scope.TutorialFlagArray[i]::' + $scope.TutorialFlagArray[i]);
						TutorialFlagArray = TutorialFlagArray + $scope.TutorialFlagArray[i] + "|";
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + 'TutorialFlagArray::' + TutorialFlagArray);
					}
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: out side for loop::' + TutorialFlagArray);
					TutorialFlagArray = TutorialFlagArray + lastString;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: after adding last string::' + TutorialFlagArray);
					settingsDbfctry.setLiveTutorialFlag(TutorialFlagArray, dealerAudit_ConstantsConst.TTS_Name);
					angular.element('#drawerButton').css({
						"pointer-events": ""
					});

					isAlertFlag1 = false;

					angular.element('#over_mapSettings').hide();

				}



			} catch(e) {
				logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error  in  hideOverLay');
			}
			logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit from hideOverLay');
		};
		/**
		 * @memberof dealerAudit.dashBoardControllers
		 * @name syncDealerInformation
		 * @desc functionality to sync all dealers which are created from the application.
		 */
		// $scope.syncDealerInformation = function(){
		// 		console.log("Inside sync dealer information");
		//
		// 		// Check if the application is online.
		// 		if ($cordovaNetwork.isOnline() === true){
		//
		// 				// If there are any dealers to be synced only then sync the dealers.
		// 				syncModuleFactory.uploadDealerData().then(function(response){
		// 						if(response){
		// 								toastFctry.showToast("Dealer uploaded successfully");
		//
		// 								// Once the locally created dealer is synced , remove the flag which indicates it is a local record.
		//                 modifyDealerDbFactory.modifyDealerInformation().then(function(response){
		//                     if(response){
		// 												logsFctry.logsDisplay('INFO', $scope.TagName,'Offline dealer_master isServerRecord value successfully changed.');
		//                     }
		//                 });
		// 						}
		// 						else{
		// 								toastFctry.showToast("Dealer data could not be uploaded due to server error.");
		// 						}
		// 				});
		// 		}
		// 		else{
		// 			$ionicPopup.alert({
		// 				title : $scope.failureTitle,
		// 				content : $scope.failureContent,
		// 				cssClass : 'customAlert'
		// 			});
		// 		}
		// }

	} catch(e) {
		console.log('error in dashboard' + JSON.stringify(e));
	}
});
