/**

 * @class dealerAudit.loginControllers

 * @param {Module} ionic defines ionic specific functionalities or services.

 * @param {Module} ngCordova defines cordova specific functionalities or services.

 * @description This module includes functionalities for login and prepopulation of userName.

 */

var loginControllers = angular.module('dealerAudit.loginControllers', ['ngCordova', 'ionic'])
	/**
	 * @function LoginCtrl
	 * @param {ScopeElemet} $scope defines scope of an elemet or function.
	 * @param {ScopeElemet} $rootScope defines scope of an elemet or function.
	 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
	 * @param {Service} $filter used for formatting data displayed to the user.
	 * @param {Service} $location  provides interface to default state.
	 * @param {Constants} dealerAudit_AssetsConst provides all the assets.
	 * @param {Service} $timeout provides timeout function.
	 * @param {Service} $ionicPopUp provides popUp message boxes.
	 * @param {Factory} settingsDbfctry provides the database related functionalities.
	 * @param {Service} $cordovaNetwork provides information about the device�s cellular and wifi connection, and whether the device has an internet connection.
	 * @param {Service} $ionicPlatform to detect current platform.
	 * @description functionalities for login and prepopulation of userName.
	 */

loginControllers.controller('LoginCtrl', function($scope, $rootScope, $location, dealerAudit_ConstantsConst, dealerAudit_AssetsConst, settingsDbfctry, $ionicPlatform, $cordovaNetwork, $ionicPopup, $filter, $timeout, logsFctry, syncModuleFactory, syncManageDbfctry, toastFctry, passParameterFctry, $cordovaDevice, loginDbfctry, ErrorHandlerService) {

	$scope.TagName = 'LoginCtrl';

	$scope.x = $filter('translate')('lblPassword')

	console.log('lblPassword::' + $scope.x);

	$scope.succesTitle = $filter('translate')('lblSuccess');

	$scope.succesContent = $filter('translate')('lblLoginSucceeded');

	$scope.failureTitle = $filter('translate')('lblLoginFailed');

	$scope.failureContent = $filter('translate')('lblValidCredentials');

	$scope.SessionfailedToInitializeMsg = $filter('translate')('lblSessionfailedtoinitialize');

	$scope.logo = dealerAudit_AssetsConst.logo;

	$scope.enterUsnPswdPin = $filter('translate')('lblEnterUsnPswdPin');

	$scope.enterUsn = $filter('translate')('lblEnterUsn');

	$scope.enterPswdPin = $filter('translate')('lblEnterPswdPin');

	$scope.invalidUsnAndPswd = $filter('translate')('lblInvalidUsnAndPswd');

	$scope.validPinErrorContent = $filter('translate')('lblValidPinErrorContent');

	$scope.tireLodingImage = dealerAudit_AssetsConst.tireLodingImage;
	$scope.shouldShowTyreImage = false;
	$scope.goPressedFlag = false;
	// NOTE : This is used for development only. Should be commented for release.
	$scope.username = "testuser_audit_mobile_user";
	$scope.password = "123456";

	var isIPad = ionic.Platform.isIPad();

	var isIOS = ionic.Platform.isIOS();

	var isAndroid = ionic.Platform.isAndroid();

	/* @function init
	 * @description action defined on on load of a login page for prepopulating the username.
	 */

	var init = function() {

		//screenOrientation.setOrientation('portrait');
		//screen.lockOrientation('portrait');
		// var so = cordova.plugins.screenorientation;
		// so.setOrientation(so.Orientation.PORTRAIT);

		var userNameVal = [];

		var recordsCount = [];

		var previousUser;

		setTimeout(function() {

			settingsDbfctry.countRecords().then(function(arrayMe) {

				try {

					console.log('Entered into countRecords');
					logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into countRecords');

					recordsCount = arrayMe;
					console.log('countRecords stringified::' + JSON.stringify(recordsCount));
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'countRecords stringified::' + JSON.stringify(recordsCount));

					console.log('countRecords without stringified::' + recordsCount);
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'countRecords without stringified::' + recordsCount);


					if(checkForNullOrUndefined(recordsCount)) {

						settingsDbfctry.getStatus('').then(function(arrayMe) {

							try {

								userNameVal = arrayMe;

								if(checkForNullOrUndefined(userNameVal)) {

									previousUser = userNameVal[0].TTS_Name;
									$scope.username = previousUser;
									dealerAudit_ConstantsConst.loginId = $scope.username;
									console.log('dealerAudit_ConstantsConst.loginId =>' + dealerAudit_ConstantsConst.loginId);
									//logsFctry.logsDisplay('DEBUG', $scope.TagName,'dealerAudit_ConstantsConst.loginId =>'+dealerAudit_ConstantsConst.loginId);

									console.log('$scope.username ==>' + $scope.username);
									//logsFctry.logsDisplay('DEBUG', $scope.TagName,'$scope.username ==>'+$scope.username);


								}

							} catch(e) {

								console.log('errorrrr::' + JSON.stringify(e));
								//logsFctry.logsDisplay('ERROR', $scope.TagName,'errorrrr::' + JSON.stringify(e));



							}

						}).catch(function(error) {
							console.log('errorrrr::' + JSON.stringify(error));
							//logsFctry.logsDisplay('ERROR', $scope.TagName,'errorrrr::' + JSON.stringify(error));



							// Handle the error here

						});

					}

				} catch(e) {

					//console.log('errorrrr::' + e);


				}

			}).catch(function(error) {

				// Handle the error here

			});

		}, 2000);

	};

	//Fire the init function onLoad of the login page to prepoulate the username

	init();



	/**

	 * @function logsDisplayInitialise

	 * @description This module includes functionalities fior initialising logsModule.

	 */
	var logsDisplayInitialise = function() {
		try {
			//console.log('Entered to the function logsDisplay');
			logsFctry.dealerLogs_Inititalise();
		} catch(e) {
			//console.log('Error in thre function logsDisplay::' + e);
		}
		//console.log('Exit from the function logsDisplay');
	};

	/**
	 * @memberof LoginCtrl
	 * @function checkForNullOrUndefined
	 * @desc function to check for the null or undefined,its an non scope level function.
	 */


	var checkForNullOrUndefined = function(variableCheck) {

		if(variableCheck != null && variableCheck != undefined && variableCheck != 'undefined' && variableCheck != '') {
			return true;
		} else {
			return false;
		}

	};


	/**
	 * @function closeKeyBoard
	 * @param {string} event holds the KeyCode of the keyboard.
	 * @description function to close the keyboard on click of keyboard GO/Next Key
	 */
	$scope.closeKeyBoard = function(event) {
		console.log("key pressed");
		logsFctry.logsDisplay('DEBUG', $scope.TagName, "key pressed");

		console.log("event.keyCode" + event.keyCode);
		logsFctry.logsDisplay('DEBUG', $scope.TagName, "event.keyCode" + event.keyCode);

		if(event.keyCode == 13) { // '13' is the key code for enter
			//console.log("Go pressed");
			cordova.plugins.Keyboard.close();
			$scope.goPressedFlag = true;
		}
	};


	/**
	 * @memberof loginscreen
	 * @function nextbutton
	 * @desc action defined on Login button user input get username and password.
	 */

	$scope.login = function(username, password) {



		$scope.shouldShowTyreImage = true;
		$scope.buttonDisabled = true;

		$scope.password = password;

		var isIPad = ionic.Platform.isIPad();

		var isIOS = ionic.Platform.isIOS();

		var isAndroid = ionic.Platform.isAndroid();

		//The userName is stored to some constant variable and same const variable is used in settings


		dealerAudit_ConstantsConst.TTS_Name = username;

		if(checkForNullOrUndefined(username) && checkForNullOrUndefined(password)) {

			if($cordovaNetwork.isOnline() === true) {

				var uiPassword = Encrypt($scope.password);

				console.log("uiPassword" + uiPassword);
				logsFctry.logsDisplay('DEBUG', $scope.TagName, "uiPassword" + uiPassword);

				var CustomerName = dealerAudit_ConstantsConst.TTS_Name;

				var pinVal = [];

				if(isIPad || isIOS) {

					console.log("IOS Platform");

					ISession.initialize(dealerAudit_ConstantsConst.AppKeyIOS, dealerAudit_ConstantsConst.SecretIOS, dealerAudit_ConstantsConst.HybrisLocalSonataInstance, true);

				} else if(isAndroid) {

					console.log("Android Platform");
					logsFctry.logsDisplay('DEBUG', $scope.TagName, "Android Platform");

					ISession.initialize(dealerAudit_ConstantsConst.AppKeyAndroid, dealerAudit_ConstantsConst.SecretAndroid, dealerAudit_ConstantsConst.HybrisLocalSonataInstance, true);

				}

				ISession.getInstance().then(function(session) {

					console.log("Inside getInstance");
					//logsFctry.logsDisplay('DEBUG', $scope.TagName,"Android Platform");


					$rootScope.session = session;

					console.log("root Scope.session::" + $rootScope.session);

					var model = $cordovaDevice.getModel();
					//console.log("model:" + model);
					model = model.split("-");
					model = model[0];

					var platform = $cordovaDevice.getPlatform();
					var version = $cordovaDevice.getVersion();
					var uuid = $cordovaDevice.getUUID();
					console.log("Model " + model + " Platform " + platform + " Version " + version + " UUID " + uuid);

					$rootScope.session.login(username, password, null, version, platform, model, uuid).then(function(response) {


						settingsDbfctry.getLogsStatus(dealerAudit_ConstantsConst.TTS_Name).then(function(LogsStatus) {
							//console.log('LogsStatus from db::' + LogsStatus);
							var logsStatus = LogsStatus;
							if((logsStatus !== '') && (logsStatus != 'null') && (logsStatus != null) && (logsStatus != 'undefined') && (logsStatus != undefined)) {
								//console.log('something is present');
								if(logsStatus == dealerAudit_ConstantsConst.logs.LogsEnable) {
									//	eCasing_ConstantsConst.logs.logStatusInConst = eCasing_ConstantsConst.logs.LogsEnable;
									//console.log('logs enabled if ');
									logsDisplayInitialise();
								} else {
									//console.log('logs disabled else');
									//eCasing_ConstantsConst.logs.logStatusInConst = eCasing_ConstantsConst.logs.LogsDisable;
								}

							} else {
								//eCasing_ConstantsConst.logs.logStatusInConst = eCasing_ConstantsConst.logs.LogsDisable;
								//console.log('logs disabled else else');
							}

						});

						$scope.status = 'success';

						// Sync the data only in case of first login for a day.
						//syncModuleFactory.isFirstOnlineLoginOfTheDay().then(function(response) {
						//if(response) {
						// Sync dealer data.
						syncModuleFactory.downloadMasterData().then(function(response) {
							if(response == (dealerAudit_ConstantsConst.success || dealerAudit_ConstantsConst.noContent)) {
								// if(response) {

								loginDbfctry.insertLastOnlineLoginDateForUser();
								//passParameterFctry.setDealerSyncInformation(true);
								//toastFctry.showToast("Dealers synced successfully");

								// syncModuleFactory.downloadQuestionnaireData().then(function(response) {
								// 	if(response == dealerAudit_ConstantsConst.success) {
								// 		toastFctry.showToast("Questionnaire synced successfully");
								// 	}
								// })

								$scope.handleSetPin();

								// Upload local dealer information to server.
								syncModuleFactory.uploadDealerData().then(function(response) {
									if(response) {
										//toastFctry.showToast("Dealer uploaded successfully");

										// Once the locally created dealer is synced , remove the flag which indicates it is a local record.
										modifyDealerDbFactory.modifyDealerInformation().then(function(response) {
											if(response) {
												logsFctry.logsDisplay('INFO', $scope.TagName, 'Offline dealers isServerRecord value successfully changed.');
											}
										});
									} else {
										console.log("No records for upload sync.");
									}
								}, function(error) {
									$scope.buttonDisabled = false;
									$scope.shouldShowTyreImage = false;
									logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in login function upload dealer data.' + JSON.stringify(error));
									console.log("Error during upload", error);
								});

								// Get pin only after dealer sync is succesful.
								settingsDbfctry.getPin(CustomerName).then(function(arrayMe) {

									try {

										console.log('Entered into the getPin function')
										logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into the getPin function');
										// No need to stringify it again

										pinVal = arrayMe;

										console.log('pinVal::' + JSON.stringify(pinVal));
										logsFctry.logsDisplay('DEBUG', $scope.TagName, 'pinVal::' + JSON.stringify(pinVal));

										console.log('pinVal::' + pinVal)

										if(checkForNullOrUndefined(pinVal)) {

											var User_Pin = pinVal[0].User_Pin;

											if(checkForNullOrUndefined(User_Pin)) {
												$scope.shouldShowTyreImage = false;
												$location.path('/dashBoard');

											}

										} else {
											$scope.shouldShowTyreImage = false;
											$location.path('/settings');

										}

									} catch(e) {

										console.log('errorrrr::' + e);
										logsFctry.logsDisplay('ERROR', $scope.TagName, 'errorrrr::' + e);

									}

								}).catch(function(error) {
									$scope.shouldShowTyreImage = false;
									conosle.log("Error in the getpin function call or Error in getpin function");
									logsFctry.logsDisplay('ERROR', $scope.TagName, "Error in the getpin function call or Error in getpin function");
								});

							} else {

								$scope.buttonDisabled = false;
								$scope.shouldShowTyreImage = false;
								cordova.plugins.Keyboard.close();
								$scope.status = 'session_failed';

								// Upload local dealer information to server.
								syncModuleFactory.uploadDealerData().then(function(response) {
									if(response) {
										//toastFctry.showToast("Dealer uploaded successfully");

										// Once the locally created dealer is synced , remove the flag which indicates it is a local record.
										modifyDealerDbFactory.modifyDealerInformation().then(function(response) {
											if(response) {
												logsFctry.logsDisplay('INFO', $scope.TagName, 'Offline dealers isServerRecord value successfully changed.');
												// $scope.buttonDisabled = false;
												// $scope.shouldShowTyreImage = false;
												// cordova.plugins.Keyboard.close();
												// $scope.status = 'session_failed';
											}
										}, function(error) {
											$scope.buttonDisabled = false;
											$scope.shouldShowTyreImage = false;
											console.log("Unable to modify dealer DB info " + error);
											logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in function login modify dealer information' + JSON.stringify(error));
										});
									} else {
										//toastFctry.showToast("Dealer data could not be uploaded due to server error.");
										console.log("No records for upload sync.");
									}
								}, function(error) {
									$scope.buttonDisabled = false;
									$scope.shouldShowTyreImage = false;
									console.log("Error during upload", error);
									logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in function login upload dealer data' + JSON.stringify(error));
								});

								//return;
							}
						}, function(error) {
							$scope.buttonDisabled = false;
							$scope.shouldShowTyreImage = false;
							ErrorHandlerService.showError(error);
							console.log("Dealers not downloaded " + error);
							logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in function login downloadDealerData' + JSON.stringify(error));
						});
						// 	} else {
						//
						// 		// For subsequent online login's after first login just navigate to dashboard.
						// 		$location.path('/dashBoard');
						// 		$scope.buttonDisabled = false;
						// 		$scope.shouldShowTyreImage = false;
						// 		cordova.plugins.Keyboard.close();
						// 		$scope.status = 'session_failed';
						// 	}
						// })
					}, function(error) {

						// $ionicPopup.alert({
						//
						// 	title: $scope.failureTitle,
						//
						// 	content: $scope.failureContent,
						//
						// 	cssClass: 'customAlert'
						//
						// });
						ErrorHandlerService.showError(error);
						logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in function $rootScope.login' + JSON.stringify(error));

						$scope.password = "";

						$scope.buttonDisabled = false;

						cordova.plugins.Keyboard.close();

						$scope.status = 'failed';

						$scope.shouldShowTyreImage = false;

					});

				}, function(error) {

					console.log(error);

					// $ionicPopup.alert({
					//
					// 	title: $scope.failureTitle,
					//
					// 	content: $scope.SessionfailedToInitializeMsg,
					//
					// 	cssClass: 'customAlert'
					//
					// });

					ErrorHandlerService.showError(error);

					$scope.buttonDisabled = false;

					$scope.shouldShowTyreImage = false;

					cordova.plugins.Keyboard.close();

					$scope.status = 'session_failed';

				});

			} else {

				console.log("Offline Mode");
				logsFctry.logsDisplay('DEBUG', $scope.TagName, "Offline Mode");

				console.log('$scope.password ==>' + $scope.password);
				logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.password ==>' + $scope.password);


				var uiPassword = Encrypt($scope.password);


				var CustomerName = dealerAudit_ConstantsConst.TTS_Name;

				var pinVal = [];

				settingsDbfctry.getPin(CustomerName).then(function(arrayMe) {

					try {

						pinVal = arrayMe;

						console.log('pinVal is ::' + JSON.stringify(pinVal));
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'pinVal is ::' + JSON.stringify(pinVal));

						var User_Pin = '';

						if(checkForNullOrUndefined(pinVal)) {

							User_Pin = pinVal[0].User_Pin;
						}
						if(checkForNullOrUndefined(User_Pin)) {

							if(uiPassword === User_Pin) {

								syncModuleFactory.isFirstOfflineLoginOfTheDay().then(function(response) {
									if(response) {
										loginDbfctry.insertLastOfflineLoginDateForUser();
										syncModuleFactory.howManyDaysOldData().then(function(data) {
											console.log("Inside howManyDaysOldData()");

											var syncAlertTitle = $filter('translate')('lblSyncAlertTitle');
											var syncAlertMessage;

											var numberofDays_DataOld = data;

											if(numberofDays_DataOld == 1) {
												syncAlertMessage = $filter('translate')('lblSyncAlertForDay1');
											} else if(numberofDays_DataOld == 2) {
												syncAlertMessage = $filter('translate')('lblSyncAlertForDay2');
											} else if(numberofDays_DataOld == 3) {
												syncAlertMessage = $filter('translate')('lblSyncAlertForDay3');
											} else if(numberofDays_DataOld == 4) {
												syncAlertMessage = $filter('translate')('lblSyncAlertForDay4');
											} else if(numberofDays_DataOld == 5) {
												syncAlertMessage = $filter('translate')('lblSyncAlertForDay5');
											}

											if(syncAlertMessage == undefined || syncAlertMessage == null) {

												$scope.buttonDisabled = false;
												$scope.shouldShowTyreImage = false;
												cordova.plugins.Keyboard.close();

												if(numberofDays_DataOld == 0) {
													$location.path('/dashBoard');
													$scope.buttonDisabled = false;
													$scope.shouldShowTyreImage = false;
													cordova.plugins.Keyboard.close();
													$scope.$apply();
													// return;
												} else if(numberofDays_DataOld >= 6) {

													// If it has been 6 or more days since the user has gone online dont let him login into the app.
													syncAlertMessage = $filter('translate')('lblSyncAlertForDay6');

													$ionicPopup.alert({
														title: syncAlertTitle,
														content: syncAlertMessage,
														cssClass: 'customAlert'
													});

													return;
												}
											} else {
												$ionicPopup.alert({
													title: syncAlertTitle,
													content: syncAlertMessage,
													cssClass: 'customAlert'
												}).then(function(res) {
													$location.path('/dashBoard');
													$scope.buttonDisabled = false;
													$scope.shouldShowTyreImage = false;
													cordova.plugins.Keyboard.close();
												})
											}
										}, function(error) {
											logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in login function howManyDaysOldData.' + JSON.stringify(error));
											console.log("Error in function howManyDaysOldData" + error);
										});
									} else {

										loginDbfctry.insertLastOfflineLoginDateForUser();

										syncModuleFactory.howManyDaysOldData().then(function(data) {
											if(data >= 6) {

												$scope.buttonDisabled = false;
												$scope.shouldShowTyreImage = false;
												cordova.plugins.Keyboard.close();

												var syncAlertTitle = $filter('translate')('lblSyncAlertTitle');
												var syncAlertMessage = $filter('translate')('lblSyncAlertForDay6');

												$ionicPopup.alert({
													title: syncAlertTitle,
													content: syncAlertMessage,
													cssClass: 'customAlert'
												});

												return;
											} else {
												// Navigate to the dashboard for subsequent offline logins after first offline login.
												$location.path('/dashBoard');

												$scope.buttonDisabled = false;
												$scope.shouldShowTyreImage = false;
												cordova.plugins.Keyboard.close();
												$scope.$apply();
											}
										}, function(error) {
											logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in login function howManyDaysOldData.' + JSON.stringify(error));
											console.log("Error in function howManyDaysOldData" + error);
										});
									}
								})
							} else {

								console.log("wrong item from database");
								logsFctry.logsDisplay('DEBUG', $scope.TagName, "wrong item from database");

								$ionicPopup.alert({

									title: $scope.failureTitle,

									content: $scope.validPinErrorContent,

									cssClass: 'customAlert'

								});

								$scope.password = "";

								cordova.plugins.Keyboard.close();

								$scope.buttonDisabled = false;

								$scope.shouldShowTyreImage = false;

							}

						} else {

							console.log("no username found in the database");
							logsFctry.logsDisplay('DEBUG', $scope.TagName, "no username found in the database");


							$ionicPopup.alert({

								title: $scope.failureTitle,

								content: $scope.invalidUsnAndPswd,

								cssClass: 'customAlert'

							});

							$scope.buttonDisabled = false;

							$scope.shouldShowTyreImage = false;

							cordova.plugins.Keyboard.close();

						}

					} catch(e) {

						console.log('errorrrr::' + e);
						logsFctry.logsDisplay('ERROR', $scope.TagName, 'errorrrr::' + e);


					}

				}).catch(function(error) {

					// Handle the error here

				});

				//}, 1000)

			}

		} else {

			if(checkForNullOrUndefined(username)) {

				$ionicPopup.alert({

					title: $scope.failureTitle,

					content: $scope.enterPswdPin,

					cssClass: 'customAlert'

				});

				$scope.buttonDisabled = false;

				$scope.shouldShowTyreImage = false;

				cordova.plugins.Keyboard.close();

			} else if(checkForNullOrUndefined(password)) {

				$ionicPopup.alert({

					title: $scope.failureTitle,

					content: $scope.enterUsn,

					cssClass: 'customAlert'

				});

				$scope.buttonDisabled = false;
				$scope.shouldShowTyreImage = false;

				cordova.plugins.Keyboard.close();

			} else {

				$ionicPopup.alert({

					title: $scope.failureTitle,

					content: $scope.enterUsnPswdPin,

					cssClass: 'customAlert'

				});

				$scope.buttonDisabled = false;
				$scope.shouldShowTyreImage = false;
				cordova.plugins.Keyboard.close();

			}

		}

	};


	/**
	 * @function $watch
	 * @description disbale the screen whenlogin is in progress
	 */
	$scope.$watch(function() {
		return $scope.shouldShowTyreImage;
	}, function() {

		if($scope.shouldShowTyreImage == true) {

			angular.element('#disableBgIDDiv').show();

			angular.element('#useranameTxt').css({
				"opacity: ": "",
				"pointer-events": "none"
			});
			angular.element('#passwordTxt').css({
				"opacity: ": "",
				"pointer-events": "none"
			});
			angular.element('#rememberPasswordAlertLink').css({
				"opacity: ": "",
				"pointer-events": "none"
			});
			angular.element('#useranameTxt').blur();
			angular.element('#useranameTxt').blur();
		} else {

			angular.element('#disableBgIDDiv').hide();

			angular.element('#useranameTxt').css({
				"opacity: ": "",
				"pointer-events": ""
			});
			angular.element('#passwordTxt').css({
				"opacity: ": "",
				"pointer-events": ""
			});
			angular.element('#rememberPasswordAlertLink').css({
				"opacity: ": "",
				"pointer-events": ""
			});
			$scope.goPressedFlag = false;
		}
	}, true);


	/**

	 * @function handleSetPin

	 * @description function to check and set pin if required

	 */

	$scope.handleSetPin = function() {

		var CustomerName = dealerAudit_ConstantsConst.TTS_Name;

		var pinVal = [];

		$scope.status = 'sucess';
		settingsDbfctry.getPin(CustomerName).then(function(arrayMe) {

			try {

				//console.log('Entered into the getPin function')
				//logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into the getPin function');

				// No need to stringify it again

				pinVal = arrayMe;

				//console.log('aaa::' + JSON.stringify(pinVal));
				//logsFctry.logsDisplay('DEBUG', $scope.TagName, 'aaa::' + JSON.stringify(pinVal));

				//console.log('bbb::' + pinVal)
				//logsFctry.logsDisplay('DEBUG', $scope.TagName, 'bbb::' + pinVal);

				if(checkForNullOrUndefined(pinVal)) {
					//Bug fix-Duplication of the customerMasterTable once date is changed
					dealerAudit_ConstantsConst.UserID = pinVal[0].UserID;
					var userPin = pinVal[0].User_Pin;

					if(checkForNullOrUndefined(userPin)) {

						//$scope.shouldShowTyreImage = false;
						//logsDisplayInitialise();();

						var overViewTimeOut = 5000;


					}

				} else {

					$scope.shouldShowTyreImage = false;
					settingsDbfctry.insertLiveTutorialFlag('0|0|0|0|0|0|0|0', CustomerName);
					//logsDisplayInitialise();();
					$location.path('/settings');

				}

			} catch(e) {

				//console.log('errorrrr::' + e);
				//logsFctry.logsDisplay('ERROR', $scope.TagName, 'errorrrr::' + e);
			}

		}).catch(function(error) {

			//console.log("Error in the getpin function call or Error in getpin function");
			//logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in the getpin function call or Error in getpin function');

		});

	};








	/**
	 * @memberof LoginCtrl
	 * @function forgotten password
	 */

	$scope.openInAppBrowser = function() {
		logsFctry.logsDisplay('INFO', $scope.TagName, "Entered into forgot password");

		// Open in app browser
		$scope.password = "";
		window.open('https://myway.goodyear.com/login/pw/request', '_system');
	};

}).factory('broadcast', function($rootScope, $document) {

	var _events = {

		onPause: 'onPause',

		onResume: 'onResume'

	};

	$document.bind('resume', function() {

		_publish(_events.onResume, null);

	});

	$document.bind('pause', function() {

		_publish(_events.onPause, null);

	});

	function _publish(eventName, data) {

		$rootScope.$broadcast(eventName, data)

	}

	return {

		events: _events

	}

})
