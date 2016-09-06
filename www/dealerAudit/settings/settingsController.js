/**
 * @class dealerAudit.settingsModule
 * @description This module includes functionalities and validations used for  setting pin.
 */
 var settingsModule = angular.module('dealerAudit.settingsModule', ['ngDropdowns'])

 /**
* @function SettingsCtrl
* @param {ScopeElemet} $scope defines scope of an elemet or function.
* @param {Service} $location  provides interface to default state.
* @param {Service} $cordovaSQLite provides db storage.
* @param {Service} $ionicPopUp provides popUp message boxes.
* @param {Constants} dealerAudit_ConstantsConst  provides all the constants.
* @param {Constants} dealerAudit_AssetsConst provides all the assets.
* @param {Factory} settingsDbfctry provides the database related functionalities.
* @param {Service} $filter used for formatting data displayed to the user.
* @param {Service} $timeout provides timeout function.
* @param {ScopeElemet} $rootScope defines scope of an elemet or function.
* @description Function to Set Pin,show hide password.
*/
 settingsModule.controller('SettingsCtrl', function($scope, $location, $cordovaSQLite, $ionicPopup, dealerAudit_ConstantsConst, dealerAudit_AssetsConst, settingsDbfctry, $ionicPopup, $filter, $timeout,$rootScope,focus,logsFctry,$cordovaNetwork) {

        $scope.TagName = 'SettingsCtrl';

		console.log('Entered into SettingsCtrl');

		//These are the Labels used in the Settings page
		$scope.User_PinFailureTitle = $filter('translate')('lblFailed');
		$scope.User_PininFailureContent = $filter('translate')('lblUser_PinFailureContent');
		$scope.User_PininFailureContent1= $filter('translate')('lblUser_PinFailureContent1');
		$scope.yesLabel = $filter('translate')('lblYes');
		$scope.noLabel = $filter('translate')('lblNo');
		$scope.alertMsg = $filter('translate')('lblAlertMsg');
		$scope.User_PinCompulsoryContent = $filter('translate')('lblUser_PinCompulsoryContent');
		$scope.errorTitle = $filter('translate')('lblError');
		$scope.warningTitle = $filter('translate')('lblWarning');
		$scope.User_PinFailureContent=$filter('translate')('lblErrorMesg');
		$scope.User_PinSuccessTitle = $filter('translate')('lblSuccess');
		$scope.User_PinSuccessContent = $filter('translate')('lblUser_PinSuccess');
		$scope.User_PinSuccess1Content = $filter('translate')('lblUser_PinSuccess1');
		$scope.User_PinSuccess1Title = $filter('translate')('lblSuccess1');


		$scope.backIcon = dealerAudit_AssetsConst.backIcon;
		$scope.setPinUpdateContent = $filter('translate')('lblSetPinUpdateSuccess');

		//getPin
		//These are the Assets used in the Settings page
		$scope.passwordType = dealerAudit_AssetsConst.invisible;
		$scope.save = dealerAudit_AssetsConst.save;
		$scope.User_PinLength = dealerAudit_ConstantsConst.User_PinLength;
    $rootScope.logoutPopupFlag = false;
		var isAlertFlag = false;


		var displayMessage = null;
		var navigateBackPopup = true;

    var logsEnable = $filter('translate')('lblEnable');
		var logsDisable = $filter('translate')('lblDisable');



		//These are the ng-model variables used in the Settings page
		$scope.settings = {

			TTS_Name : "",

			User_Pin : ""

		};
		var isIPad = ionic.Platform.isIPad();
		var isIOS = ionic.Platform.isIOS();


		$scope.changedtxtVal = "";
		$scope.pinDetails = [];

		//This holds TTS_Name used in the Settings page
		$scope.settings.TTS_Name = dealerAudit_ConstantsConst.TTS_Name;
		$scope.settings.User_Pin="";
		//password
		$scope.inputType = 'password';
		$scope.inputSecurityStyle = 'disc';

		$scope.languageSelected = {

          text : dealerAudit_ConstantsConst.languag.Englishlanguage
				};

		$scope.languageOptions =
        [{
          	text:dealerAudit_ConstantsConst.languag.Englishlanguage

          },

        {
        	text : dealerAudit_ConstantsConst.languag.Frenchlanguage
        },
        {
        text :  dealerAudit_ConstantsConst.languag.Germanlanguage

      }];


        $scope.logsSelected = {
        			text : dealerAudit_ConstantsConst.logs.logsDisable
        		};
        		$scope.logsOptions = [{
        			text : logsEnable,
        			value : logsEnable
        		}, {
        			text : logsDisable,
        			value : logsDisable
        		}];



            $scope.$on('$ionicView.afterEnter', function() {
          			try {
          				if ($cordovaNetwork.isOnline() === true) {
          					console.log("online");

          				} else {
          					console.log("offline");


          				}
          				try {
          					settingsDbfctry.getLiveTutorialFlag($scope.settings.TTS_Name).then(function(TutorialFlag) {
          						var TutorialFlagFromDB = TutorialFlag;
          						console.log('TutorialFlagFromDB ::' + TutorialFlagFromDB);
          						$scope.TutorialFlagArray = TutorialFlagFromDB.split('|');

          						if ($scope.TutorialFlagArray[0] == 0) {
          							if ($cordovaNetwork.isOnline() === true) {
                          	console.log("inside if");
          								//var message=$filter('translate')('lblSyncStarts');
          								//toastFctry.showToast(message);
          								$rootScope.logoutPopupFlag = true;
                          	console.log('$rootScope.logoutPopupFlag'+$rootScope.logoutPopupFlag);
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
          		});


	$scope.$on('$ionicView.beforeEnter', function() {

    settingsDbfctry.getLogsStatus(dealerAudit_ConstantsConst.TTS_Name).then(function(LogsStatus) {
  				logsFctry.logsDisplay('DEBUG', $scope.TagName, 'LogsStatus from db::' + LogsStatus);
  				var logsStatus = LogsStatus;
  				if ((logsStatus !== '') && (logsStatus != 'null') && (logsStatus != null) && (logsStatus != 'undefined') && (logsStatus != undefined)) {

  					if (logsStatus == dealerAudit_ConstantsConst.logs.LogsEnable) {
  						dealerAudit_ConstantsConst.logs.logStatusInConst = dealerAudit_ConstantsConst.logs.LogsEnable;
  						$scope.logsSelected.text = logsEnable;
  						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'logs enabled if ');
  						$scope.shouldShowTyreImage = false;
  						angular.element('#pinSaveBtn').css({
  							"pointer-events" : ""
  						});
  						angular.element('#settingBackBtn').css({
  							"pointer-events" : ""
  						});
  						angular.element('#settingsContentDivID').css({
  							"pointer-events" : ""
  						});
  					} else {
  						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'logs disabled else');
  						dealerAudit_ConstantsConst.logs.logStatusInConst =	dealerAudit_ConstantsConst.logs.LogsDisable;
  						$scope.logsSelected.text = logsDisable;
  						$scope.shouldShowTyreImage = false;
  						angular.element('#pinSaveBtn').css({
  							"pointer-events" : ""
  						});
  						angular.element('#settingBackBtn').css({
  							"pointer-events" : ""
  						});
  						angular.element('#settingsContentDivID').css({
  							"pointer-events" : ""
  						});
  					}
  				} else {
  					//settingsDbfctry.setLogsStatus(dealerAudit_ConstantsConst.LogsStatus.logsDisable);
  						dealerAudit_ConstantsConst.logs.logStatusInConst = 	dealerAudit_ConstantsConst.logs.LogsDisable;
  					$scope.logsSelected.text = logsDisable;
  					$scope.shouldShowTyreImage = false;
  					angular.element('#pinSaveBtn').css({
  						"pointer-events" : ""
  					});
  					angular.element('#settingBackBtn').css({
  						"pointer-events" : ""
  					});
  					angular.element('#settingsContentDivID').css({
  						"pointer-events" : ""
  					});
  					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'logs disabled else else');
  				}
  			});


        //$scope.firstTimeEntry += 1;
  settingsDbfctry.getLiveTutorialFlag($scope.settings.TTS_Name).then(function(TutorialFlag) {
    var TutorialFlagFromDB = TutorialFlag;
    console.log("in settings getLiveTutorial");
    console.log("TutorialFlagFromDB is --->"+ TutorialFlagFromDB);
    console.log("TutorialFlag is "+ TutorialFlag);
    logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagFromDB ::' + TutorialFlagFromDB);
    $scope.TutorialFlagArray = TutorialFlagFromDB.split('|');

    logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray ::' + $scope.TutorialFlagArray);
    logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArrayLength ::' + $scope.TutorialFlagArray.length);
    if ($scope.TutorialFlagArray[0] == 0) {
      logsFctry.logsDisplay('DEBUG', $scope.TagName, 'need to open live tutorial view here');

      angular.element('#settingBackBtn').css({
        "pointer-events" : "none"
      });
      angular.element('#pinSaveBtn').css({
        "pointer-events" : "none"
      });
      isAlertFlag = true;
      //	$scope.shouldShowTyreImage = true;
      angular.element('#over_map1').show();
    } else if ($scope.TutorialFlagArray[0] == 1) {
      logsFctry.logsDisplay('DEBUG', $scope.TagName, 'no need to open live tutorial view here');
      console.log("tutorial array ==1")
      angular.element('#settingBackBtn').css({
        "pointer-events" : ""
      });
      angular.element('#pinSaveBtn').css({
        "pointer-events" : ""
      });
      isAlertFlag = false;

      //	$scope.shouldShowTyreImage = false;
      angular.element('#over_map1').hide();


    }

     else {
      angular.element('#settingBackBtn').css({
        "pointer-events" : ""
      });
      angular.element('#pinSaveBtn').css({
        "pointer-events" : ""
      });
      isAlertFlag = false;

      //	$scope.shouldShowTyreImage = false;
      angular.element('#over_map1').hide();


      //do nothing
    }
  });

  });



  /**
  		 * @function afterLeave
  		 * @description afterleaving th page set the submit alert message to false
  		 */
  		$scope.$on('$ionicView.afterLeave', function() {

          angular.element('#over_map1').hide();


  		});

  /**
  * @memberof SettingsCtrl
  * @function hideOverLay
  * @desc for LiveTutorial
  */

  $scope.hideOverLay = function() {
			try {
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered in to hideOverLay');
				if ($scope.TutorialFlagArray[0] == 0) {
					$scope.TutorialFlagArray[0] = 1;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, '$scope.TutorialFlagArray:: before closing modal' + $scope.TutorialFlagArray);
					var TutorialFlagArray = '';
					var lastString = $scope.TutorialFlagArray[$scope.TutorialFlagArray.length - 1];
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray:: lastString before closing modal' + lastString);
					for (var i = 0; i < $scope.TutorialFlagArray.length - 1; i++) {
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + '$scope.TutorialFlagArray[i]::' + $scope.TutorialFlagArray[i]);
						TutorialFlagArray = TutorialFlagArray + $scope.TutorialFlagArray[i] + "|";
						logsFctry.logsDisplay('DEBUG', $scope.TagName, 'i::' + i + 'TutorialFlagArray::' + TutorialFlagArray);
					}
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: out side for loop::' + TutorialFlagArray);
					TutorialFlagArray = TutorialFlagArray + lastString;
					logsFctry.logsDisplay('DEBUG', $scope.TagName, 'TutorialFlagArray :: after adding last string::' + TutorialFlagArray);
					settingsDbfctry.setLiveTutorialFlag(TutorialFlagArray,  dealerAudit_ConstantsConst.TTS_Name);
					angular.element('#settingBackBtn').css({
						"pointer-events" : ""
					});
					angular.element('#pinSaveBtn').css({
						"pointer-events" : ""
					});
					isAlertFlag = false;
            angular.element('#over_map1').hide();


				}
			} catch(e) {

				logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error  in  hideOverLay::' + e);
			}

			logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit from hideOverLay');
		};

/**
* @memberof SettingsCtrl
* @function hideShowPassword
* @desc for hidding and showing passwords along with image change
*/

    $scope.hideShowPassword = function() {

			try {

                focus("focusMe");
                if (isIOS || isIPad) {}
                console.log('Entered into function hideShowPassword');
                logsFctry.logsDisplay('INFO', $scope.TagName,'Entered into function hideShowPassword');


				if ($scope.passwordType == dealerAudit_AssetsConst.invisible) {

					$scope.passwordType = dealerAudit_AssetsConst.visible;

					$scope.inputSecurityStyle = 'none';

					$scope.inputType = 'tel';

				} else if ($scope.passwordType == dealerAudit_AssetsConst.visible) {

					$scope.passwordType = dealerAudit_AssetsConst.invisible;

					$scope.inputType = 'password';

					$scope.inputSecurityStyle = 'disc';

				}


			} catch(e) {

				console.log('Errors in  function hideShowPassword::' + e);
        logsFctry.logsDisplay('ERROR', $scope.TagName,'Errors in  function hideShowPassword::' + e);

			}

			console.log('Exit  from  function hideShowPassword');
        logsFctry.logsDisplay('INFO', $scope.TagName,'Exit  from  function hideShowPassword');

			console.log($scope.inputType);



		};



    /**
    		 * @function logsDisplayInitialise
    		 * @description This module includes functionalities fior initialising logsModule.
    		 */
    		var logsDisplayInitialise = function() {
    			try {
    				logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered to the function logsDisplay');
    				logsFctry.dealerLogs_Inititalise();
    			} catch(e) {
    				logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in thre function logsDisplay::' + e);
    			}
    			logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit from the function logsDisplay');
    		};
    		$scope.logInformationChange = function(data) {
    			logsFctry.logsDisplay('DEBUG', $scope.TagName, 'logInformationChange::' + data.text);
    			if (data.text == logsEnable) {
    				logsDisplayInitialise();
    				 dealerAudit_ConstantsConst.logs.logStatusInConst =  dealerAudit_ConstantsConst.logs.LogsEnable;
    			} else {
    				settingsDbfctry.setLogsStatus( dealerAudit_ConstantsConst.logs.LogsDisable,  dealerAudit_ConstantsConst.TTS_Name);
    				 dealerAudit_ConstantsConst.logs.logStatusInConst =  dealerAudit_ConstantsConst.logs.LogsDisable;
    			}
    		};

        /**
        * @memberof SettingsCtrl
        * @function setLanguage
        * @param {String} data Holds selected language
        * @desc function for storing the language
        */

        $scope.setLanguage = function(data) {
          logsFctry.logsDisplay('DEBUG', $scope.TagName, 'setLanguage::' + data.text);
          if (data.text == dealerAudit_ConstantsConst.languag.Englishlanguage  || data.text == dealerAudit_ConstantsConst.languag.Frenchlanguage || data.text == dealerAudit_ConstantsConst.languag.Germanlanguage) {
	             settingsDbfctry.SetLanguage($scope.settings.TTS_Name, data.text);


          }
        };





/**
* @memberof SettingsCtrl
* @function SetPin
* @param {String} TTS_Name Holds TTS_Name
* @param {Intiger} User_Pin  Holds the Entered pin
* @desc function for setting pin which inturn calls db function associated with settingsDbfctry and navigates the User_Master  to dashboard on succes of pin set
*/

		$scope.SetPin = function(TTS_Name, User_Pin) {

			try {


				var TTS_Name = dealerAudit_ConstantsConst.TTS_Name;

				dealerAudit_ConstantsConst.loginId = TTS_Name;

				console.log('Entered into function SetPin');
        logsFctry.logsDisplay('INFO', $scope.TagName,'Entered into function SetPin');


				console.log("TTS_Name inside SetPin  :::" + TTS_Name);
        logsFctry.logsDisplay('DEBUG', $scope.TagName,"TTS_Name inside SetPin  :::" + TTS_Name);


				console.log('dealerAudit_ConstantsConst.loginId ==>'+dealerAudit_ConstantsConst.loginId);
        logsFctry.logsDisplay('DEBUG', $scope.TagName,'dealerAudit_ConstantsConst.loginId ==>'+dealerAudit_ConstantsConst.loginId);


				console.log("PinNo inside SetPin :::" + User_Pin);
        	logsFctry.logsDisplay('USERENTRIES', $scope.TagName, 'Entered Pin::' + User_Pin + "---" + 'UserName ::' + TTS_Name);

				//Array to hold PinVal array from database
				var pinVal = [];
				//Get Pin from database
				settingsDbfctry.getPin(TTS_Name).then(function(arrayMe) {

					try {

						pinVal = arrayMe;

						console.log('pinVal-->' + JSON.stringify(pinVal));
              logsFctry.logsDisplay('DEBUG', $scope.TagName,'pinVal-->' + JSON.stringify(pinVal));

						console.log('pinValue::::' + pinVal);

						var val = 0;

                      	if (pinVal != '' && pinVal != undefined && pinVal != 'null' && pinVal != 'undefined' && pinVal != null) {

							val = pinVal[0].User_Pin ;

							console.log('val' + pinVal);


						} else {
							val = 0;
						}

						console.log('val' + val);
              logsFctry.logsDisplay('DEBUG', $scope.TagName,'val' + val);


						var insertUpdateFlag = 0;

						if (val != 0) {

							insertUpdateFlag = dealerAudit_ConstantsConst.User_PinStausUpdate;

						} else {

							insertUpdateFlag = dealerAudit_ConstantsConst.User_PinStausInsert;

						}



						// For first time set pin
						if(insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausInsert){
							                      if(User_Pin == ''){
							                      	showAlert($scope.errorTitle, $scope.User_PininFailureContent1, '');

							                      }



												var valid = $scope.ValidateSetPin(User_Pin, insertUpdateFlag);

												console.log('insertUpdateFlag ===>'+insertUpdateFlag);
                          logsFctry.logsDisplay('DEBUG', $scope.TagName,'insertUpdateFlag ===>'+insertUpdateFlag);
										        console.log('User_Pin ===>'+User_Pin);


												if (valid == false) {

												if (TTS_Name != '' && TTS_Name != null && TTS_Name != 'null') {

					                           		if (User_Pin != '' && User_Pin != 'undefined' && User_Pin != undefined && User_Pin != 'null' && User_Pin != null) {

					                           			//console.log('TTS_Name =>'+TTS_Name);

					                           			//console.log('User_Pin ==>'+User_Pin);


														settingsDbfctry.SetPin(TTS_Name, User_Pin, insertUpdateFlag);


														showAlert($scope.User_PinSuccessTitle, $scope.User_PinSuccessContent, '/dashBoard');
													 }

				                                 	if (insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausInsert) {
														displayMessage = $scope.User_PinSuccessContent;
													} else {
														displayMessage = $scope.setPinUpdateContent;
													}
													insertUpdateFlag = dealerAudit_ConstantsConst.User_PinStausUpdate;
													if (isIPad || isIOS) {
														$scope.inputType = 'password';
													} else {

														$scope.inputSecurityStyle = 'disc';

													}
													$scope.passwordType =  dealerAudit_AssetsConst.invisible;
													$scope.settings.User_Pin = '';
												}else {
													console.log( 'TTS_Name is empty');

												}
											}

				                             else {
												showAlert($scope.errorTitle, $scope.User_PininFailureContent, '');
											}


								}else{

												var valid = $scope.ValidateSetPin(User_Pin, insertUpdateFlag);
												console.log('insertUpdateFlag ===>'+insertUpdateFlag);
                            logsFctry.logsDisplay('DEBUG', $scope.TagName,'insertUpdateFlag ===>'+insertUpdateFlag);

											    //console.log('User_Pin ===>'+User_Pin);

												if (valid == false) {

														if (TTS_Name != '' && TTS_Name != null && TTS_Name != 'null') {

							                           		if (User_Pin != '' && User_Pin != 'undefined' && User_Pin != undefined && User_Pin != 'null' && User_Pin != null) {

							                           			console.log('TTS_Name =>'+TTS_Name);
                                              logsFctry.logsDisplay('DEBUG', $scope.TagName,'TTS_Name =>'+TTS_Name);

							                           			console.log('User_Pin ==>'+User_Pin);
                                              logsFctry.logsDisplay('DEBUG', $scope.TagName,'User_Pin ==>'+User_Pin);

																settingsDbfctry.SetPin(TTS_Name, User_Pin, insertUpdateFlag);


																showAlert($scope.User_PinSuccessTitle, $scope.User_PinSuccessContent, '/dashBoard');


							                                }else{
							                                	showAlert($scope.User_PinSuccess1Title, $scope.User_PinSuccess1Content, '/settings');
							                                }


						                                 	if (insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausInsert) {

																 displayMessage = $scope.User_PinSuccess1Content;
															} else {

																displayMessage = $scope.setPinUpdateContent;
															}

															insertUpdateFlag = dealerAudit_ConstantsConst.User_PinStausUpdate;

															if (isIPad || isIOS) {

						                                        $scope.inputType = 'password';
															} else {

																$scope.inputSecurityStyle = 'disc';

															}
															$scope.passwordType =  dealerAudit_AssetsConst.invisible;

															$scope.settings.User_Pin = '';
														}else {

															console.log( 'TTS_Name is empty');
                                logsFctry.logsDisplay('DEBUG', $scope.TagName,'TTS_Name is empty');

														}
													}

						                             else {

														showAlert($scope.errorTitle, $scope.User_PininFailureContent, '');
													}

								 }


						 }catch(e) {
							console.log( 'errorrrr::' + e);
                    logsFctry.logsDisplay('ERROR', $scope.TagName, 'errorrrr::' + e);

						}
					},function(error) {
						// Handle the error here
						console.log('error in setPin controller method ==>'+JSON.stringify(error));
              logsFctry.logsDisplay('ERROR', $scope.TagName, 'error in setPin controller method ==>'+JSON.stringify(error));

					});

			} catch(e) {
				console.log( 'Errors in  function SetPin::' + e);
          logsFctry.logsDisplay('ERROR', $scope.TagName, 'Errors in  function SetPin::' + e);

			}
			console.log( 'Exit  from  function SetPin');
      logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit  from  function SetPin');

		};


/**
* @memberof SettingsCtrl
* @function TxtChange
* @desc function for watching setPin input field change
*/

		$scope.TxtChange = function() {

			try {

				console.log('Entered into function TxtChange');
        logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into function TxtChange');


				$scope.changedtxtVal = $scope.settings.User_Pin;

				console.log('changedtxtVal::' + $scope.changedtxtVal);
        logsFctry.logsDisplay('DEBUG', $scope.TagName, 'changedtxtVal::' + $scope.changedtxtVal);

				if($scope.settings.User_Pin =='' || $scope.settings.User_Pin == undefined || $scope.settings.User_Pin == null){
					$scope.settings.User_Pin='';
				}

            } catch(e) {

				console.log('Errors in  function TxtChange::' + e);
          logsFctry.logsDisplay('ERROR', $scope.TagName, 'Errors in  function TxtChange::' + e);


				//handle exception here

			}

			console.log('Exit  from  function TxtChange');
      logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit  from  function TxtChange');


		}

/**
* @memberof SettingsCtrl
* @function NavigateToDashBoard
* @desc function for navigating to dashboard on back button click of the app
*/

		//Back button handle in settings
		$rootScope.NavigateToDashBoard = function() {

			try {

                console.log('Entered into function NavigateToDashBoard');
                  logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into function NavigateToDashBoard');


				 var CustomerName = dealerAudit_ConstantsConst.TTS_Name;

				var pinVal = [];

				settingsDbfctry.getPin(CustomerName).then(function(arrayMe) {

					try {


						console.log(' In NavigateToDashBoard');
              logsFctry.logsDisplay('INFO', $scope.TagName, ' In NavigateToDashBoard');



						// No need to stringify it again

						pinVal = arrayMe;

						console.log('pinVal::' + JSON.stringify(pinVal));
            logsFctry.logsDisplay('DEBUG', $scope.TagName,'pinVal::' + JSON.stringify(pinVal));


						//console.log('pinVal::' + pinVal)

						var dbPinVal = 0;

						var encPin = Encrypt($scope.settings.User_Pin);

						console.log('encPin::' + encPin);
              logsFctry.logsDisplay('DEBUG', $scope.TagName,'encPin::' + encPin);

						if (pinVal != '' && pinVal != undefined && pinVal != 'null' && pinVal != 'undefined' && pinVal != null) {

							dbPinVal = pinVal[0].User_Pin;

						} else {

							dbPinVal = 0;

						}

						console.log('dbPinVal::' + dbPinVal);
              logsFctry.logsDisplay('DEBUG', $scope.TagName,'dbPinVal::' + dbPinVal);


						var insertUpdateFlag = 0;

						console.log('dbPinVal::' + dbPinVal);
            logsFctry.logsDisplay('DEBUG', $scope.TagName,'dbPinVal::' + dbPinVal);

						if (dbPinVal != 0) {

							insertUpdateFlag = dealerAudit_ConstantsConst.User_PinStausUpdate;

						} else {

							insertUpdateFlag = dealerAudit_ConstantsConst.User_PinStausInsert;

						}

						console.log('insertUpdateFlag in back button press::' + insertUpdateFlag);
              logsFctry.logsDisplay('DEBUG', $scope.TagName,'insertUpdateFlag in back button press::' + insertUpdateFlag);


                        if (insertUpdateFlag === dealerAudit_ConstantsConst.User_PinStausInsert) {
							if(navigateBackPopup == true){


							navigateBackPopup = false;

							var compulsoryPinPopUp =$ionicPopup.alert({

								title : $scope.errorTitle,

								content : $scope.User_PinCompulsoryContent,

								cssClass : 'customAlert'
							});
							compulsoryPinPopUp.then(function(res) {
								navigateBackPopup= true;
							});
						}

						} else if (insertUpdateFlag === dealerAudit_ConstantsConst.User_PinStausUpdate) {

							if ($scope.settings.User_Pin != '') {

								if(navigateBackPopup == true){

								navigateBackPopup = false;

								var confirmPopup = $ionicPopup.confirm({

									title : $scope.warningTitle,

									template : $scope.alertMsg,

									cancelText : $scope.noLabel,

									okText : $scope.yesLabel,

									cssClass : 'customAlertConfirmation'

								});

								confirmPopup.then(function(res) {

									if (res) {

											console.log("App gonna exit");
                        logsFctry.logsDisplay('DEBUG', $scope.TagName,"App gonna exit");

											if (isIPad || isIOS) {
												console.log('show ios textField backbtn');
                          logsFctry.logsDisplay('DEBUG', $scope.TagName,'show ios textField backbtn');


											$scope.inputType = 'password';
										}else {

												console.log('show android textField backbtn');
                        logsFctry.logsDisplay('DEBUG', $scope.TagName,'show android textField backbtn');

												$scope.inputSecurityStyle = 'disc';

											}
											$scope.passwordType = dealerAudit_AssetsConst.invisible;
											$scope.settings.User_Pin = '';

										$location.path('/dashBoard');

									} else {

										console.log('App not gonna exit');
                      logsFctry.logsDisplay('DEBUG', $scope.TagName,'App not gonna exit');


									}
									navigateBackPopup = true;

								});
							 }
							}else{
									$location.path('/dashBoard');
							}
						} else {

								$location.path('/dashBoard');

						}

					}

					catch(e) {

						console.log('errorrrr::' + e);
              logsFctry.logsDisplay('ERROR', $scope.TagName,'errorrrr::' + e);


					}

				}).catch(function(error) {


					// Handle the error here

				});

				//}, 1000);

			} catch(e) {

				console.log('Errors in  function NavigateToDashBoard::' + e);
        logsFctry.logsDisplay('ERROR', $scope.TagName,'Errors in  function NavigateToDashBoard::' + e);


				//handle exception here

			}

			console.log('Exit  from  function NavigateToDashBoard');
        logsFctry.logsDisplay('INFO', $scope.TagName,'Exit  from  function NavigateToDashBoard');

            console.log("pinvalue ::" + pinVal);


		};



/**
* @function showAlert
* @description function for showing alert messages
* @param {String } titleMsg -Holds title message to be displayed
* @param {String } contentMsg -Holds Message content to be displayed
* @param {String } navigationPath -Path for navigation
*/
		var showAlert = function(titleMsg, contentMsg, navigationPath) {
			try {

				if (isAlertFlag == false) {

					isAlertFlag = true;
					alertPopup = $ionicPopup.alert({
						title : titleMsg,
						content : contentMsg,
						cssClass : 'customAlert'
					});
				}

				alertPopup.then(function(res) {

					isAlertFlag = false;
					if (navigationPath != '' && navigationPath != dealerAudit_ConstantsConst.setPinClearFlagTrue) {
						$location.path(navigationPath);
					}
					//To clear set pin field if pin is wrong
					if (navigationPath == dealerAudit_ConstantsConst.setPinClearFlagTrue) {
						$scope.settings.User_Pin = '';
					}

				});
			} catch(e) {
				console.log( "error in showAlert ::" + e);
          logsFctry.logsDisplay('ERROR', $scope.TagName,"error in showAlert ::" + e);

			}
		};


/**
* @function ValidateSetPin
* @description This module validates the  setPin field .
*/


		$scope.ValidateSetPin = function(text, Flag) {
			try {
				console.log("in validate set pin function");
          logsFctry.logsDisplay('INFO', $scope.TagName,"in validate set pin function");
      	console.log( 'ValidateSetPin:::Flag::' + Flag + "text::" + text);
          logsFctry.logsDisplay('DEBUG', $scope.TagName,'ValidateSetPin:::Flag::' + Flag + "text::" + text);


				var validate = false;

		        if (Flag == dealerAudit_ConstantsConst.User_PinStausInsert) {

					console.log('InsertFlag');
            logsFctry.logsDisplay('DEBUG', $scope.TagName,'InsertFlag');

					if (text.length != $scope.User_PinLength) {
						console.log(' validation failed');
              logsFctry.logsDisplay('DEBUG', $scope.TagName,' validation failed');


						validate = true;

					}
				}else{

					if(Flag == dealerAudit_ConstantsConst.User_PinStausUpdate){

						if (text == 'null' || text == null || text == 'undefined' || text == undefined) {
								console.log('text is null , validation failed');
								validate = true;
							}

						if (text.length != $scope.User_PinLength) {
							// for the second time set pin we should allow empty pin (old pin will be saved)
							if(text.length == ''){
								validate= false;
							}else{
								validate = true;
							}
						}
					}
				}
				console.log('validate before return :::' + validate);
          logsFctry.logsDisplay('DEBUG', $scope.TagName,'validate before return :::' + validate);

				return validate;
			} catch(e) {
				console.log('Error in ValidateSetPin::' + e);
          logsFctry.logsDisplay('ERROR', $scope.TagName,'Error in ValidateSetPin::' + e);

			}
		};




})


/**
 * @function numbersOnly
 * @description Function to validate the setPin text field for accepting only digits.
 */

settingsModule.directive('numbersOnly', function() {

	try {

		console.log('Entered into numbersOnly directive');
    //logsFctry.logsDisplay('INFO', $scope.TagName,'Entered into numbersOnly directive');


		return {

			require : 'ngModel',

			link : function(scope, element, attr, ngModelCtrl) {

				function fromUser_Master (text) {

					if (text) {

						var transformedInput = text.replace(/[^0-9]/g, '');

						if (transformedInput !== text) {

							ngModelCtrl.$setViewValue(transformedInput);

							ngModelCtrl.$render();

						}

						return transformedInput;

					}

					return undefined;

				}


				ngModelCtrl.$parsers.push(fromUser_Master );

			}
		};

	} catch(e) {

		console.log('Errors in numbersOnly directive::' + e);
      //logsFctry.logsDisplay('ERROR', $scope.TagName,'Errors in numbersOnly directive::' + e);

	}

})
