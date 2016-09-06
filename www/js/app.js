// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module dealerAudit (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

/**
* kick-start of the app.

* @nameSpace dealerAudit

* @ngdoc module

* @name dealerAudit

* @param {Service} ionic

* @param {Service} pascalprecht.translate

* @param {Service} dealerAudit.loginControllers

* @param {Service} dealerAudit.dashBoardControllers

* @param {Service} dealerAudit.ModuleConstants

* @param {Service} dealerAudit.ModuleFileList

* @param {Service} dealerAudit.ModuleAssets

* @param {Service} dealerAudit.settingsModule

* @param {Service} dealerAudit.settingsDbModuleDB

* @desc Function to login.

*/

//$ionicPopup: To use the ionic popup's like alert,confirm functions
//$state: To define and get the status of the html pages and its controllers
//$cordovaSQLite: For the databse operations,It is a dependecy of cordovasQLite plugin\
//$Location: To navigate between the screen
//$interval: To define the interval to execute functions after some time
//broadcast: It's an service dependecy to broadcast it to the current module
//$filter: Filters are used to change modify the data and can be clubbed in expression or directives using pipe character
//settingsDbfctry: Factory service of the database for function like getPin,setStaus,countRecords
//dealerAudit_ConstantsConst: Its an dependency to access the constants defined globally

var dealerAudit =
	angular.module('dealerAudit', ['ngCordova', 'ionic', 'pascalprecht.translate', 'dealerAudit.loginControllers', 'dealerAudit.dashBoardControllers', 'dealerAudit.ModuleConstants', 'dealerAudit.ModuleFileList', 'dealerAudit.ModuleAssets', 'dealerAudit.settingsModule', 'dealerAudit.settingsDbModuleDB', 'dealerAudit.aboutUsModule', 'dealerAudit.logsModule', 'dealerAudit.pageParameterPass', 'dealerAudit.syncModule', 'dealerAudit.syncManagerModuleDB', 'dealerAudit.toastModule', 'dealerAudit.searchDealerControllers', 'dealerAudit.searchDealerModuleDB', 'dealerAudit.ModifyDealerModuleDB', 'dealerAudit.modifyDealerControllers', 'dealerAudit.loginModuleDB', 'dealerAudit.auditProgressDealerControllers', 'dealerAudit.errorHandlerModule'])
	.run(function($ionicPlatform, $ionicPopup, $state, $cordovaSQLite, $rootScope, $location, $interval, broadcast, $filter, settingsDbfctry, dealerAudit_ConstantsConst, syncModuleFactory, toastFctry, modifyDealerDbFactory, loginDbfctry) {
		/**
		 * Basic ready configuration includes disabling default functionalities such as hidding accessorybar and handling keyboards
		 * @memberof dealerAudit
		 * @ngdoc config
		 * @name ready
		 */
		var pauseTime = null;
		var resumeTime = null;

		var dashBoardAlertFlag = true;

		$ionicPlatform.ready(function() {

			if(window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don't remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}
			setTimeout(function() {
				if(window.StatusBar) {
					//Status for the Application. Android: Status will be there in all screen IOS:Status bar will not be there in login screen
					StatusBar.backgroundColorByHexString('#1385cb');
				}
			}, 300);

			/**
			 * @memberof dealerAudit
			 * @name swipeCall
			 * @desc Function to swipe
			 */
			$rootScope.swipeCall = function swipeCall(pathOfFile) {

				console.log("swipe action called");
				$location.path(pathOfFile);
			};

			/**
			 * @memberof dealerAudit
			 * @ngdoc EventListener
			 * @name pause
			 * @desc Function to storing the current time when the app is paused
			 */
			document.addEventListener("pause", function() {

				console.log("pause event");
				pauseTime = new Date();

			}, false);

			/**
			 * @function callBack for network online.
			 * @description Function that gets called when the device comes online .
			 */
			window.addEventListener("online", function() {
				console.log('You are online');

				// If there is no session then get the session once again. Else continue with the same session.
				//if(typeof($rootScope.session) == "undefined" || $rootScope.session == null) {

				var isIPad = ionic.Platform.isIPad();
				var isIOS = ionic.Platform.isIOS();
				var isAndroid = ionic.Platform.isAndroid();

				if(isIPad || isIOS) {
					ISession.initialize(dealerAudit_ConstantsConst.AppKeyIOS, dealerAudit_ConstantsConst.SecretIOS, dealerAudit_ConstantsConst.HybrisLocalSonataInstance, true);
				} else if(isAndroid) {
					ISession.initialize(dealerAudit_ConstantsConst.AppKeyAndroid, dealerAudit_ConstantsConst.SecretAndroid, dealerAudit_ConstantsConst.HybrisLocalSonataInstance, true);
				}

				ISession.getInstance().then(function(session) {

					$rootScope.session = session;

					// Download master data if the user is online.
					syncModuleFactory.downloadDealerData().then(function(response) {
						if(response) {
							loginDbfctry.insertLastOnlineLoginDateForUser();
						}
					}, function(error) {
						console.log("Dealers not downloaded " + error);
					});

					// Sync the locally present dealer data.
					syncModuleFactory.uploadDealerData().then(function(response) {
						if(response) {
							//toastFctry.showToast("Dealer uploaded successfully");

							// Once the locally created dealer is synced , remove the flag which indicates it is a local record.
							modifyDealerDbFactory.modifyDealerInformation().then(function(response) {
								if(response) {
									logsFctry.logsDisplay('INFO', $scope.TagName, 'Offline dealers isServerRecord value successfully changed.');
								}
							}, function(error) {
								console.log("Error in app.js module function modifyDealerInformation " + JSON.stringify(error));
								logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in app.js module function modifyDealerInformation.' + JSON.stringify(error));
							});
						} else {
							console.log("No records for upload sync.");
						}
					}, function(error) {
						console.log("Error during upload", error);
						logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in app.js module function uploadeDealerData.' + JSON.stringify(error));
					});
				}, function(error) {
					//toastFctry.showToast("Session failed to initialize");
					console.log("Session failed to initialize" + error);
					logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in app.js module function Isession.Initialize.' + JSON.stringify(error));
				});
				//}
				// else {
				// 	// Sync the locally present dealer data.
				// 	syncModuleFactory.uploadDealerData().then(function(response) {
				// 		if(response) {
				// 			//toastFctry.showToast("Dealer uploaded successfully");
				//
				// 			// Once the locally created dealer is synced , remove the flag which indicates it is a local record.
				// 			modifyDealerDbFactory.modifyDealerInformation().then(function(response) {
				// 				if(response) {
				// 					logsFctry.logsDisplay('INFO', $scope.TagName, 'Offline dealers isServerRecord value successfully changed.');
				// 				}
				// 			});
				// 		} else {
				// 			console.log("No records for upload sync.");
				// 		}
				// 	}, function(error) {
				// 		console.log("Error during upload", error);
				// 	});
				// }
			}, false);

			/**
			 * @memberof dealerAudit
			 * @ngdoc EventListener
			 * @name resume
			 * @desc Function to compare pause time and the current time when the app is resumed for the auto app logout after 90 seconds
			 */
			document.addEventListener("resume", function() {

				var sessonExpiredTitle = $filter('translate')('lblSessonExpiredTitle');
				var sessonExpiredContent = $filter('translate')('lblSessonExpiredContent');

				console.log("resume event");
				resumeTime = Date.now();
				if(resumeTime - pauseTime > 90 * 60 * 1000) {

					console.log("app exit event");

					//Logout the session
					ISession.getInstance().then(function(session) {                
						session.logout();                 //sessionObj={};  
						console.log(session);        
					});

					$ionicPopup.alert({

						title: sessonExpiredTitle,

						content: sessonExpiredContent,

						cssClass: 'customAlert'

					});

					var statusVal = [];

					var TTS_Name = dealerAudit_ConstantsConst.TTS_Name;

					console.log("TTS_Name for logout:" + TTS_Name);

					//Set the status while logging out from the application

					$location.path('/Login');

				}

			}, false);


			var query = "";
			console.log("start db");
			if(window.cordova) {

				try {
					// App syntax
					console.log("App syntax");
					db = $cordovaSQLite.openDB("dealerAudit.db");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS User_Master (UserID INTEGER PRIMARY KEY NOT NULL , TTS_Name VARCHAR(250) NOT NULL ,TAM_ID INTEGER NOT NULL, TAM_Name VARCHAR(250) NOT NULL,User_Pin INTEGER NOT NULL ,Status TINYINT(1) NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Form_Response_Master (Id INTEGER PRIMARY KEY NOT NULL ,question_Id INTEGER NOT NULL, response_text VARCHAR(250), question_max_score BIGINT NOT NULL,question_result BIGINT NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Question_Type_Master (question_type_Id INTEGER PRIMARY KEY NOT NULL, question_type_text VARCHAR(250) NOT NULL )");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Question_Type_IdIndex ON Question_Type_Master (question_type_Id ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Question_Master (question_Id INTEGER PRIMARY KEY NOT NULL,form_Id INTEGER NOT NULL,question_type_Id INTEGER NOT NULL, Question_text VARCHAR(250) NOT NULL, Header_text  VARCHAR(250) NOT NULL, sub_header_text  VARCHAR(250) NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Question_IdIndex ON Question_Master (question_Id  ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Audit_Form_Master (form_Id  INTEGER PRIMARY KEY NOT NULL,form_name VARCHAR(250) NOT NULL,UserID INTEGER NOT NULL,total_score BIGINT NOT NULL,total_result BIGINT NOT NULL,comments_text VARCHAR(250) NULL)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Form_IdIndex ON Audit_Form_Master (form_Id ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Audit_master (audit_Id INTEGER PRIMARY KEY NOT NULL,audit_date Date NOT NULL,audit_person_onsite VARCHAR(250) NOT NULL,TTS_Name VARCHAR(250) NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Audit_IdIndex ON Audit_master(audit_Id ASC)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS TTS_NameIndex ON Audit_master(TTS_Name ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Dealer_info_Transaction (dealer_Id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,network  VARCHAR(250) NOT NULL,address  VARCHAR(250) NOT NULL,zipcode  VARCHAR(250) NOT NULL,city  VARCHAR(250) NOT NULL,holding_name  VARCHAR(250) NOT NULL, holding_code  VARCHAR(250) NOT NULL, pos_code BIGINT NULL,TAM_Name  VARCHAR(250) NULL,TTS_Name VARCHAR(250) NULL )");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS TTS_NameIndex ON Dealer_info_Transaction(TTS_Name ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Logs (LogID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,LogFileName VARCHAR(250) NOT NULL, LogFileCrationTime LONG NOT NULL,LogStatus INTEGER ,EmailAddress VARCHAR(250) NOT NULL )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS LiveTutorial (LiveTutorialID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,LiveTutorialFlag VARCHAR(250) NOT NULL,TTS_Name VARCHAR(250) NOT NULL )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Language (Language VARCHAR(250) NOT NULL,TTS_Name VARCHAR(250) NOT NULL)");
					// $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dealers (dealer_id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,address VARCHAR(250),postcode VARCHAR(250),province VARCHAR(250) , email VARCHAR(250) ,phone VARCHAR(250) ,network VARCHAR(250) ,pos_code VARCHAR(250),payee_code VARCHAR(250) ,holding_name VARCHAR(250) ,city  VARCHAR(250) ,country VARCHAR(250),participating_tf TINYINT(1), createdBy VARCHAR(250), modified_date DATE , modified_time VARCHAR(250), payer_code VARCHAR(250) , isServerRecord TINYINT(1) )");
					// $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dealers (dealer_id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,address VARCHAR(250),postcode VARCHAR(250),province VARCHAR(250) , email VARCHAR(250) ,phone VARCHAR(250) ,network VARCHAR(250) ,pos_code VARCHAR(250),payee_code VARCHAR(250) ,holding_name VARCHAR(250) ,city_name  VARCHAR(250) ,country_name VARCHAR(250),participating_tf TINYINT(1), createdBy VARCHAR(250), modified_date DATE , modified_time VARCHAR(250), payer_code VARCHAR(250) , isServerRecord TINYINT(1) )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dealers (dealer_id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,address VARCHAR(250),post_code VARCHAR(250),province VARCHAR(250) , email VARCHAR(250) ,phone VARCHAR(250) ,network VARCHAR(250) ,pos_code VARCHAR(250),holding_code VARCHAR(250),tts_name VARCHAR(250),payee_code VARCHAR(250) ,holding_name VARCHAR(250) ,city_name  VARCHAR(250) ,country_name VARCHAR(250),participating_tf TINYINT(1), createdBy VARCHAR(250), modified_date DATE , modified_time VARCHAR(250), payer_code VARCHAR(250) , isServerRecord TINYINT(1) )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS AppData (AppKey LONG NOT NULL , AppKeyValue LONG NOT NULL , UserID VARCHAR(250),PRIMARY KEY(UserID, AppKey))");
				} catch(error) {
					console.log("Table not created" + error);
				}

			} else {

				try {

					// Ionic serve syntax
					console.log("Ionic serve syntax");
					db = window.openDatabase("dealerAudit.db", "1.0", "Goodyear", -1);
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS User_Master (UserID INTEGER PRIMARY KEY NOT NULL , TTS_Name VARCHAR(250) NOT NULL ,TAM_ID INTEGER NOT NULL, TAM_Name VARCHAR(250) NOT NULL,User_Pin INTEGER NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Form_Response_Master (Id INTEGER PRIMARY KEY NOT NULL ,question_Id INTEGER NOT NULL, response_text VARCHAR(250), question_max_score BIGINT NOT NULL,question_result BIGINT NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Question_Type_Master (question_type_Id INTEGER PRIMARY KEY NOT NULL, question_type_text VARCHAR(250) NOT NULL )");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Question_Type_IdIndex ON Question_Type_Master (question_type_Id ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Question_Master (question_Id INTEGER PRIMARY KEY NOT NULL,form_Id INTEGER NOT NULL,question_type_Id INTEGER NOT NULL, Question_text VARCHAR(250) NOT NULL, Header_text  VARCHAR(250) NOT NULL, sub_header_text  VARCHAR(250) NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Question_IdIndex ON Question_Master (question_Id  ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Audit_Form_Master (form_Id  INTEGER PRIMARY KEY NOT NULL,form_name VARCHAR(250) NOT NULL,UserID INTEGER NOT NULL,total_score BIGINT NOT NULL,total_result BIGINT NOT NULL,comments_text VARCHAR(250) NULL)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Form_IdIndex ON Audit_Form_Master (form_Id ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Audit_master (audit_Id INTEGER PRIMARY KEY NOT NULL,audit_date Date NOT NULL,audit_person_onsite VARCHAR(250) NOT NULL,TTS_Name VARCHAR(250) NOT NULL)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS Audit_IdIndex ON Audit_master(audit_Id ASC)");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS TTS_NameIndex ON Audit_master(TTS_Name ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Dealer_info_Transaction (dealer_Id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,network  VARCHAR(250) NOT NULL,address  VARCHAR(250) NOT NULL,zipcode  VARCHAR(250) NOT NULL,city  VARCHAR(250) NOT NULL,holding_name  VARCHAR(250) NOT NULL, holding_code  VARCHAR(250) NOT NULL, pos_code BIGINT NULL,TAM_Name  VARCHAR(250) NULL,TTS_Name VARCHAR(250) NULL )");
					$cordovaSQLite.execute(db, "CREATE INDEX IF NOT EXISTS TTS_NameIndex ON Dealer_info_Transaction(TTS_Name ASC)");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Logs (LogID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,LogFileName VARCHAR(250) NOT NULL, LogFileCrationTime LONG NOT NULL,LogStatus INTEGER ,EmailAddress VARCHAR(250) NOT NULL )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS LiveTutorial (LiveTutorialID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,LiveTutorialFlag VARCHAR(250) NOT NULL,TTS_Name VARCHAR(250) NOT NULL )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Language (Language VARCHAR(250) NOT NULL,TTS_Name VARCHAR(250) NOT NULL)");
					// $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dealers (dealer_id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,address VARCHAR(250),postcode VARCHAR(250),province VARCHAR(250) , email VARCHAR(250) ,phone VARCHAR(250) ,network VARCHAR(250) ,pos_code VARCHAR(250),payee_code VARCHAR(250) ,holding_name VARCHAR(250) ,city  VARCHAR(250) ,country VARCHAR(250),participating_tf TINYINT(1), createdBy VARCHAR(250), modified_date DATE , modified_time VARCHAR(250), payer_code VARCHAR(250) , isServerRecord TINYINT(1) )");
					// $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dealers (dealer_id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,address VARCHAR(250),postcode VARCHAR(250),province VARCHAR(250) , email VARCHAR(250) ,phone VARCHAR(250) ,network VARCHAR(250) ,pos_code VARCHAR(250),payee_code VARCHAR(250) ,holding_name VARCHAR(250) ,city_name  VARCHAR(250) ,country_name VARCHAR(250),participating_tf TINYINT(1), createdBy VARCHAR(250), modified_date DATE , modified_time VARCHAR(250), payer_code VARCHAR(250) , isServerRecord TINYINT(1) )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dealers (dealer_id INTEGER PRIMARY KEY NOT NULL,dealer_name  VARCHAR(250) NOT NULL,address VARCHAR(250),post_code VARCHAR(250),province VARCHAR(250) , email VARCHAR(250) ,phone VARCHAR(250) ,network VARCHAR(250) ,pos_code VARCHAR(250),holding_code VARCHAR(250),tts_name VARCHAR(250),payee_code VARCHAR(250) ,holding_name VARCHAR(250) ,city_name  VARCHAR(250) ,country_name VARCHAR(250),participating_tf TINYINT(1), createdBy VARCHAR(250), modified_date DATE , modified_time VARCHAR(250), payer_code VARCHAR(250) , isServerRecord TINYINT(1) )");
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS AppData (AppKey LONG NOT NULL , AppKeyValue LONG NOT NULL , UserID VARCHAR(250),PRIMARY KEY(UserID, AppKey))");
				} catch(error) {
					console.log("Table not created" + error);
				}
			}

		});

		/**
		 * @memberof dealerAudit
		 * @ngdoc registerBackButton
		 * @name registerBackButton
		 * @desc Function for the back button action
		 */

		$ionicPlatform.registerBackButtonAction(function(event) {

			console.log("Back button registered");

			var logOutTitle = $filter('translate')('lblLogOutTitle');
			var logOutOutWarning = $filter('translate')('lblLogOutWarning');
			var noLabel = $filter('translate')('lblNo');
			var yesLabel = $filter('translate')('lblYes');


			if($state.current.name == "dashBoard") {

				if(dashBoardAlertFlag) {
					dashBoardAlertFlag = false;
					var confirmPopup = $ionicPopup.confirm({
						title: logOutTitle,
						template: logOutOutWarning,
						cancelText: noLabel,
						okText: yesLabel,
						cssClass: 'customAlertConfirmation'
					});

					confirmPopup.then(function(res) {

						if(res) {
							console.log("App gonna exit");
							var statusVal = [];

							var TTS_Name = dealerAudit_ConstantsConst.TTS_Name;

							console.log("TTS_Name for logout:" + TTS_Name);

							ISession.getInstance().then(function(session) {                
								session.logout();                 //sessionObj={};  
								console.log(session);

								        
							});

							$location.path('/Login');
							dashBoardAlertFlag = true;
							//navigator.app.exitApp();
						} else {
							dashBoardAlertFlag = true;
							console.log('App not gonna exit');
						}
					})
				}
			} else if($state.current.name == "Login") {

				var statusVal = [];

				var TTS_Name = dealerAudit_ConstantsConst.TTS_Name;

				console.log("TTS_Name for logout:" + TTS_Name);
				ISession.getInstance().then(function(session) {                
					session.logout();                
					console.log(session);        
				});

				navigator.app.exitApp();

			} else if($state.current.name == "settings") {
				//BackButton handle in settings
				$rootScope.NavigateToDashBoard();

			} else if($state.current.name == "searchDealer") {
				$location.path('/auditProgressDealer');
				$rootScope.$apply();
			} else if($state.current.name == "modifyDealer") {
				$rootScope.auditPagebackButtonClicked();
				$rootScope.$apply();
			} else {

				navigator.app.backHistory();

			}
		}, 500);
	}).config(function($translateProvider) {

		/**
		 * configure the languages according to the keyValue
		 * @memberof dealerAudit
		 * @ngdoc function
		 * @param {Service} $translateProvider
		 */
		$translateProvider.translations('en', translations_en);
		$translateProvider.preferredLanguage('en');
		console.log("$translateProvider initialized");

	}).config(function($stateProvider, $urlRouterProvider, dealerAudit_FileListsConst) {
		/**
		 * @memberof dealerAudit
		 * @function config
		 * @param {Service} $stateProvider
		 * @param {Service} $urlRouterProvider
		 * @param {Constant} dealerAudit_FileListsConst containing urls
		 * @desc function to configure the routes.
		 */

		$stateProvider

		//State Provider for Login Screen
			.state('Login', {
			cache: false,
			url: "/Login",
			templateUrl: dealerAudit_FileListsConst.loginHtml,
			controller: "LoginCtrl"
		})


		//State Provider for dashBoard Screen
		.state('dashBoard', {
			url: "/dashBoard",
			templateUrl: dealerAudit_FileListsConst.dashBoardHtml,
			controller: "CustomerInfoController"
		})

		//State Provider for settings Screen
		.state('settings', {
			url: "/settings",
			templateUrl: dealerAudit_FileListsConst.settingsHtml,
			controller: "SettingsCtrl"
		})

		//State Provider for aboutUs Screen
		.state('aboutUs', {
			cache: false,
			url: "/aboutUs",
			templateUrl: dealerAudit_FileListsConst.aboutUsHtml,
			controller: "AboutUsController"
		})

		//State Provider for search dealer screen.
		.state('searchDealer', {
			cache: false,
			url: "/searchDealer",
			templateUrl: dealerAudit_FileListsConst.searchDealerViewHtml,
			controller: "SearchDealerController"
		})

		//State Provider for modify dealer screen.
		.state('modifyDealer', {
			cache: false,
			url: "/modifyDealer",
			templateUrl: dealerAudit_FileListsConst.modifyDealerViewHtml,
			controller: "ModifyDealerController"
		})

		//State Provider for modify dealer screen.
		.state('auditProgressDealer', {
			cache: false,
			url: "/auditProgressDealer",
			templateUrl: dealerAudit_FileListsConst.auditProgressView,
			controller: "AuditProgressDealerController"
		})

		$urlRouterProvider.otherwise('/Login');

	});


//dircetive to programatically call focus function on an element
//used for refoucsing on settings pin when eye is clicked
dealerAudit.directive('focusOn', function() {
	return function(scope, elem, attr) {
		scope.$on('focusOn', function(e, name) {
			console.log("called equal out");

			if(name === attr.focusOn) {
				console.log("called equal");
				elem[0].focus();
			}
		});
	};
});

//factory to programatically call focus function on an element
//used for refoucsing on settings pin when eye is clicked
dealerAudit.factory('focus', function($rootScope, $timeout) {
	return function(name) {
		$timeout(function() {
			$rootScope.$broadcast('focusOn', name);
		});
	}
});

dealerAudit.directive('googleplace', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			var options = {
				types: ['(cities)'],
				componentRestrictions: {}
			};
			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				scope.$apply(function() {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});

dealerAudit.directive('googleregion', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			var options = {
				types: ['(regions)'],
				componentRestrictions: {}
			};
			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				scope.$apply(function() {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});

// Disable data-tap property which google dynamically adds.
// After disabling the autocomplete values get populated in input box.
dealerAudit.directive('disabletap', function($timeout) {
	return {
		link: function() {
			$timeout(function() {
				container = document.getElementsByClassName('pac-container');
				// disable ionic data tab
				angular.element(container).attr('data-tap-disabled', 'true');
				// leave input field if google-address-entry is selected
				angular.element(container).on("click", function() {
					document.getElementById('type-selector').blur();
				});

			}, 500);

		}
	};
});

// // Auto focus on input elements.
// dealerAudit.directive('focusOn', function() {
// 	return function(scope, elem, attr) {
// 		scope.$on('focusOn', function(e, name) {
// 			if(name === attr.focusOn) {
// 				elem[0].focus();
// 			}
// 		});
// 	};
// });
//
// dealerAudit.factory('focus', function($rootScope, $timeout) {
// 	return function(name) {
// 		$timeout(function() {
// 			$rootScope.$broadcast('focusOn', name);
// 		});
// 	}
// });

dealerAudit.directive('focusMe', function($timeout) {
	return {
		link: function(scope, element, attrs) {
			$timeout(function() {
				element[0].focus();
				if(ionic.Platform.isAndroid()) {
					cordova.plugins.Keyboard.show();
				}
			}, 1);
		}
	};
});
