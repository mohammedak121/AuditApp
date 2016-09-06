/**

 * @class dealerAudit.modifyDealerControllers
 * @description Functions related to modfying a dealer.
 */

/**
 * @function ModifyDealerController
 * @param {ScopeElemet} $scope defines scope of an elemet or function.
 * @param {Service} passParameterFctry Used to pass parameters between controllers.
 * @param {Service} $location Used for navigation between pages.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @param {Service} modifyDealerDbFactory Provides all local DB functions.
 * @param {Service} toastFctry Provides toast notifications.
 * @param {Service} logsFctry Provides logging mechanism.
 * @description Function to modify a dealer.
 */

var modifyDealerModule = angular.module('dealerAudit.modifyDealerControllers', ['ionic', 'ngDropdowns']);

modifyDealerModule.controller('ModifyDealerController', ['$scope', 'passParameterFctry', '$location', 'dealerAudit_AssetsConst', 'modifyDealerDbFactory', 'toastFctry', 'logsFctry', 'syncModuleFactory', '$cordovaNetwork', 'dealerAudit_ConstantsConst', '$filter', '$ionicPopup', '$rootScope', '$cordovaDatePicker', function($scope, passParameterFctry, $location, dealerAudit_AssetsConst, modifyDealerDbFactory, toastFctry, logsFctry, syncModuleFactory, $cordovaNetwork, dealerAudit_ConstantsConst, $filter, $ionicPopup, $rootScope, $cordovaDatePicker) {
	try {
		$scope.TagName = 'ModifyDealerController';
		$scope.dealerData = {};
		$scope.buttonVisibility = false;
		$scope.backIcon = dealerAudit_AssetsConst.backIcon;
		$scope.isFormValid = false;
		$scope.formDisable = false;
		$scope.calender = dealerAudit_AssetsConst.calender;
		$scope.nextFieldFocus = true;
		$scope.email = true;
		$scope.phone = true;
		$scope.network = true;
		$scope.address = true;
		$scope.zipCode = true;
		$scope.city = true;
		$scope.holdingName = true;
		// $scope.dealerScreenInputMaxLength = dealerAudit_ConstantsConst.dealerScreenInputMaxLength;

		$scope.yesLabel = $filter('translate')('lblYes');
		$scope.noLabel = $filter('translate')('lblNo');
		$scope.alertMsg = $filter('translate')('lblAlertMsg');
		$scope.warningTitle = $filter('translate')('lblWarning');

		$scope.dealerDetailsLength = {
			dealerScreenInputMaxLength: dealerAudit_ConstantsConst.dealerScreenInputMaxLength
		};

		$scope.dealerErrorMsg = {
			companyNameErr: false,
			addressErr: false,
			postCodeErr: false,
			cityErr: false,
			posCodeErr: false,
			ttsErr: false
		};

		$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

		$scope.phoneFormat = /(7|8|9)\d{9}/
		$scope.international = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

		// if($scope.dealerErrorMsg != null) {
		// 	$scope.dealerErrorMsg = {
		// 		companyNameErr: false
		// 	};
		// }

		$scope.companyNameError = $filter('translate')('companyNameRequired');
		$scope.addressError = $filter('translate')('addressRequired');
		$scope.postCodeError = $filter('translate')('postCodeRequired');
		$scope.cityError = $filter('translate')('cityRequired');
		$scope.posCodeError = $filter('translate')('posCodeRequired');
		$scope.ttsError = $filter('translate')('ttsRequired');
		$scope.phoneError = $filter('translate')('lblPhoneFormat');
		$scope.emailError = $filter('translate')('lblEmailFormat');

		$scope.failureTitle = $filter('translate')('lblAddDealerFailed');
		$scope.failureContent = $filter('translate')('lblValidDealer');

		// Initialize dropdown values.
		$scope.participantOptions = [{
			text: "Yes"
		}, {
			text: "No"

		}];
		$scope.participantSelected = {
			text: "Please select"
		};

		//console.log("INFO" + $scope.TagName + "Entered into ModifyDealerController");
		logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into ModifyDealerController');

		$scope.focusDate = function() {
			// angular.element('#auditDate').focus();

			var options = {
				date: new Date(),
				mode: 'date', // or 'time'
				minDate: new Date() - 10000,
				allowOldDates: true,
				allowFutureDates: false,
				doneButtonLabel: 'DONE',
				doneButtonColor: '#F2F3F4',
				cancelButtonLabel: 'CANCEL',
				cancelButtonColor: '#000000'
			};

			$cordovaDatePicker.show(options).then(function(date) {
				//alert(date);
				// $scope.date = date;
				console.log("Date value from date picker" + date);

				var dateValue = date.getDate();
				var month = date.getMonth() + 1;
				var year = date.getFullYear();

				var fullDate = dateValue + "/" + month + "/" + year;

				console.log("Formatted date date: " + dateValue);
				console.log("Formatted date month: " + month);
				console.log("Formatted date year: " + year);

				// $scope.dateData = {};
				// $scope.dateData = "";
				console.log("Full date " + fullDate);
				$scope.dateData = fullDate;
				// $scope.dateData = new Date();
			});
		}

		/**
		 * @function on
		 * @description after load of page function retrieves the data to bind to dealer.
		 */
		$scope.$on('$ionicView.afterEnter', function() {
			//console.log("INFO" + $scope.TagName + "Entered into $ionicView.afterEnter");
			logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into $ionicView.afterEnter');
			$scope.dealerData = {};
			$scope.date = new Date();

			console.log("Location search value" + $location.search());
			console.log("Location search value" + JSON.stringify($location.search()));

			if($location.search().addDealer == "false") {
				console.log("Dealer data present");
				//$scope.dealerData = setDefaultValues(passParameterFctry.getDealerInformation());
				console.log("Parameter data" + JSON.stringify(passParameterFctry.getDealerInformation()));

				var dealerInfo = passParameterFctry.getDealerInformation();
				console.log("Dealer information : " + JSON.stringify(dealerInfo));

				$scope.formDisable = true;

				$scope.dealerData = {
					dealer_name: (typeof(dealerInfo.dealer_name) == "undefined" || dealerInfo.dealer_name == null) ? "" : dealerInfo.dealer_name,
					email: (typeof(dealerInfo.email) == "undefined" || dealerInfo.email == null) ? "" : dealerInfo.email,
					phone: (typeof(dealerInfo.phone) == "undefined" || dealerInfo.phone == null) ? "" : dealerInfo.phone,
					network: (typeof(dealerInfo.network) == "undefined" || dealerInfo.network == null) ? "" : dealerInfo.network,
					address: (typeof(dealerInfo.address) == "undefined" || dealerInfo.address == null) ? "" : dealerInfo.address,
					post_code: (typeof(dealerInfo.post_code) == "undefined" || dealerInfo.post_code == null) ? "" : dealerInfo.post_code,
					city_name: (typeof(dealerInfo.city_name) == "undefined" || dealerInfo.city_name == null) ? dealerInfo.city_name = "" : dealerInfo.city_name,
					province: (typeof(dealerInfo.province) == "undefined" || dealerInfo.province == null) ? dealerInfo.province = "" : dealerInfo.province,
					country_name: (typeof(dealerInfo.country_name) == "undefined" || dealerInfo.country_name == null) ? dealerInfo.country_name = "" : dealerInfo.country_name,
					holding_name: (typeof(dealerInfo.holding_name) == "undefined" || dealerInfo.holding_name == null) ? "" : dealerInfo.holding_name,
					holding_code: (typeof(dealerInfo.holding_code) == "undefined" || dealerInfo.holding_code == null) ? "" : dealerInfo.holding_code,
					payer_code: (typeof(dealerInfo.payer_code) == "undefined" || dealerInfo.payer_code == null) ? "" : dealerInfo.payer_code,
					pos_code: (typeof(dealerInfo.pos_code) == "undefined" || dealerInfo.pos_code == null) ? "" : dealerInfo.pos_code,
					tts_name: dealerAudit_ConstantsConst.TTS_Name
						//participating_tf: (typeof($scope.participant.value) == "" || $scope.participant.value == null || $scope.participant.value == "No") ? $scope.participant.value = false  : $scope.participant.value = true,
						//audit_date: (typeof(dealerInfo.modified_date) == "undefined" || dealerInfo.modified_date == null) ? Date.now() : dealerInfo.modified_date,
				}
			} else {
				$scope.dealerData = {};
				if(dealerAudit_ConstantsConst.TTS_Name != null || typeof(dealerAudit_ConstantsConst.TTS_Name) != "undefined") {
					$scope.dealerData.tts_name = dealerAudit_ConstantsConst.TTS_Name;
				}
				$scope.buttonVisibility = true;
			}

			console.log("Dealer data empty");

			//console.log("DEBUG " + $scope.TagName + " get Dealer data " + $scope.dealerData);
			logsFctry.logsDisplay('DEBUG', $scope.TagName, " get Dealer data " + $scope.dealerData);
		});

		//bugfix-To get focus on next input field

		// $(document).keypress(function(e) {
		//
		// 				    if(e.which == 13) {
		//
		// 						console.log(" key pressed");
		// 		          textboxe1 = $("input.class1");
		// 							textboxe2 = $("input.class2");
		// 				    	textboxe3 = $("input.class3");
		// 							textboxe4 = $("input.class4");
		// 							textboxe5 = $("input.class5");
		// 							textboxe6 = $("input.class6");
		// 							textboxe7 = $("input.class7");
		// 							textboxe8 = $("input.class8");
		// 							textboxe9 = $("input.class9");
		// 							textboxe10 = $("input.class10");
		// 							textboxe11 = $("input.class11");
		//
		//                if($scope.nextFieldFocus && textboxe1[0].id =="companyName"){
		// 						      angular.element("#email").focus();
		// 						      $scope.nextFieldFocus=false;
		// 				 		     }
		//               else if($scope.email && textboxe2[0].id =="email"){
		// 					            angular.element("#phone").focus();
		// 									    $scope.email=false;
		// 			  			   }
		// 					    	else if($scope.phone && textboxe3[0].id =="phone"){
		// 								     	angular.element("#network").focus();
		// 									    $scope.phone=false;
		// 						  	}
		// 							else if($scope.network && textboxe4[0].id =="network"){
		// 								      angular.element("#address").focus();
		// 									   	$scope.network=false;
		// 								}
		// 							else if($scope.address && textboxe5[0].id =="address"){
		// 											angular.element("#zipCode").focus();
		// 											$scope.address=false;
		// 								}
		// 				      else if($scope.zipCode && textboxe6[0].id =="zipCode"){
		// 											angular.element("#city").focus();
		// 											$scope.zipCode=false;
		// 								}
		//      	        else if($scope.holdingName && textboxe10[0].id =="holdingName"){
		// 											angular.element("#holdingCode").focus();
		// 											$scope.holdingName=false;
		// 								}
		// 							else if($scope.holdingCode && textboxe11[0].id =="holdingCode"){
		// 											angular.element("#payerCode").focus();
		// 											$scope.holdingCode=false;
		// 								}
		// 			}
		// });
		//
		//
		//   	$scope.companyNameFocus=function(){
		// 				$scope.nextFieldFocus = true;
		// 			}
		//     	$scope.emailFocus=function(){
		// 				$scope.email = true;
		// 			}
		//     	$scope.phoneFocus=function(){
		// 				$scope.phone = true;
		// 			}
		// 			$scope.networkFocus=function(){
		// 			 $scope.network = true;
		// 			}
		// 	  	$scope.addressFocus=function(){
		// 				$scope.address = true;
		// 			}
		// 			$scope.zipCodeFocus=function(){
		// 				$scope.zipCode = true;
		// 			}
		// 			$scope.cityFocus=function(){
		// 				$scope.city = true;
		// 			}
		// 			$scope.holdingNameFocus=function(){
		// 				$scope.holdingName = true;
		// 			}


		/**
		 * @function backButtonClicked
		 * @description Back button click on the header.
		 */
		$rootScope.auditPagebackButtonClicked = function() {

			console.log("Form value" + $scope.myForm);

			console.log("$scope.myForm.$valid " + $scope.myForm.$valid);
			console.log("$scope.myForm.$invalid " + $scope.myForm.$invalid);

			console.log("$scope.myForm.$pristine " + $scope.myForm.$pristine);
			console.log("$scope.myForm.$dirty " + $scope.myForm.$dirty);

			if($scope.myForm.$dirty) {
				var confirmPopup = $ionicPopup.confirm({
					title: $scope.warningTitle,
					template: $scope.alertMsg,
					cancelText: $scope.noLabel,
					okText: $scope.yesLabel,
					cssClass: 'customAlertConfirmation'
				});

				confirmPopup.then(function(res) {
					if(res) {
						if($location.search().auditProgress == "true") {
							$location.path('/auditProgressDealer');
						} else {
							$location.path('/searchDealer');
						}
					}
				})
			} else {
				if($location.search().auditProgress == "true") {
					$location.path('/auditProgressDealer');
				} else {
					$location.path('/searchDealer');
				}
			}

			// if($location.search().auditProgress == "true") {
			// 	$location.path('/auditProgressDealer');
			// } else {
			// 	$location.path('/searchDealer');
			// }
		}

		/**
		 * @function setForm
		 * @description Get the form instance.
		 */
		$scope.setForm = function(form) {
			$scope.myForm = form;
		}

		/**
		 * @function backButtonClicked
		 * @description Back button click on the header.
		 */
		$scope.setParticipant = function(value) {
			if(value != null || typeof(value) != "undefined") {
				console.log("Value text", value.text);
				$scope.dealerData.participating_tf = value.text;
			}
		}

		/**
		 * @function validateForm
		 * @description Form validation.
		 */
		$scope.validateForm = function() {
			if($scope.dealerData.dealer_name == "" || typeof($scope.dealerData.dealer_name) == "undefined") {
				$scope.dealerErrorMsg.companyNameErr = true;
				//return false;
				$scope.isFormValid = false;
			} else {
				$scope.dealerErrorMsg.companyNameErr = false;
			}
			if($scope.dealerData.address == "" || typeof($scope.dealerData.address) == "undefined") {
				$scope.dealerErrorMsg.addressErr = true;
				$scope.isFormValid = false;
			} else {
				$scope.dealerErrorMsg.addressErr = false;
			}
			if($scope.dealerData.post_code == "" || typeof($scope.dealerData.post_code) == "undefined") {
				$scope.dealerErrorMsg.postCodeErr = true;
				$scope.isFormValid = false;
				// return false;
			} else {
				$scope.dealerErrorMsg.postCodeErr = false;
			}
			if($scope.dealerData.city_name == "" || typeof($scope.dealerData.city_name) == "undefined") {
				$scope.dealerErrorMsg.cityErr = true;
				$scope.isFormValid = false;
				// return false;
			} else {
				$scope.dealerErrorMsg.cityErr = false;
			}
			if($scope.dealerData.pos_code == "" || typeof($scope.dealerData.pos_code) == "undefined") {
				$scope.dealerErrorMsg.posCodeErr = true;
				$scope.isFormValid = false;
				// return false;
			} else {
				$scope.dealerErrorMsg.posCodeErr = false;
			}
			if($scope.dealerData.tts_name == "" || typeof($scope.dealerData.tts_name) == "undefined") {
				$scope.dealerErrorMsg.ttsErr = true;
				$scope.isFormValid = false;
				// return false;
			} else {
				$scope.dealerErrorMsg.ttsErr = false;
			}

			if($scope.dealerErrorMsg.companyNameErr == false && $scope.dealerErrorMsg.addressErr == false && $scope.dealerErrorMsg.postCodeErr == false &&
				$scope.dealerErrorMsg.cityErr == false && $scope.dealerErrorMsg.posCodeErr == false && $scope.dealerErrorMsg.ttsErr == false) {
				$scope.isFormValid = true;
			}

			return $scope.isFormValid;
		}

		/**
		 * @function saveDealerInformation
		 * @description Save the dealer informatio on local storage.
		 */
		$scope.saveDealerInformation = function() {
			//console.log("INFO" + $scope.TagName + "Entered into function saveDealerInformation");
			logsFctry.logsDisplay('INFO', $scope.TagName, "Entered into function saveDealerInformation");
			//console.log("DEBUG" + $scope.TagName + "Dealer information " + JSON.stringify($scope.dealerData));
			logsFctry.logsDisplay('DEBUG', $scope.TagName, "Dealer information " + JSON.stringify($scope.dealerData));

			console.log("Dealer information before saving" + JSON.stringify($scope.dealerData));
			$scope.dealerData.modified_date = new Date().toISOString();
			$scope.dealerData.modified_time = new Date().toISOString().split('.')[0].replace('T', " ");

			console.log("Modified Time :: " + $scope.dealerData.modified_time);

			if(!$scope.validateForm()) {
				return;
			}

			console.log("Dealer name entered " + $scope.dealerData.dealer_name);

			// Check for dealer duplication based on dealer_name.
			// modifyDealerDbFactory.checkIfDealerExists($scope.dealerData.dealer_name, $scope.dealerData.country_name).then(function(response) {
			modifyDealerDbFactory.checkIfDealerExists($scope.dealerData.dealer_name).then(function(response) {
				console.log("Response from checkIfDealerExists" + response)
				if(!response) {
					// Save dealer information into local DB.
					modifyDealerDbFactory.saveDealerInfo($scope.dealerData).then(function(data) {
						if(data) {
							//console.log("INFO" + $scope.TagName + "Data saved successfully");
							logsFctry.logsDisplay('INFO', $scope.TagName, "Dealer data saved successfully");
							toastFctry.showToast("Dealer succesfully added.");

							// Check if there is online connectivity , then trigger an upload sync for the added dealer.
							// This sync should happen in background.
							if($cordovaNetwork.isOnline()) {

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
										//toastFctry.showToast("Dealer data could not be uploaded due to server error.");
										console.log("Dealer not uploaded");
									}
								}, function(error) {
									logsFctry.logsDisplay('ERROR', $scope.TagName, "Dealer Data could not be uploaded " + JSON.stringify(error));
									console.log("Dealer not uploaded" + error);
								});
							}

							$location.path('/searchDealer');

						} else {
							//console.log("INFO" + $scope.TagName + " Dealer Data could not be saved");
							logsFctry.logsDisplay('INFO', $scope.TagName, "Dealer Data could not be saved");
						}
					}, function(error) {
						logsFctry.logsDisplay('ERROR', $scope.TagName, "Dealer Data could not be saved due to error " + JSON.stringify(error));
					})
				} else {

					// This will executed if a dealer already is present in the DB.
					$ionicPopup.alert({
						title: $scope.failureTitle,
						content: $scope.failureContent,
						cssClass: 'customAlert'
					});
				}
			}, function(error) {
				logsFctry.logsDisplay('ERROR', $scope.TagName, "Error from checkIfDealerExists" + JSON.stringify(error));
			});
		}

	} catch(error) {
		//console.log("ERROR" + $scope.TagName + "Error loading ModifyDealerController" + error);
		logsFctry.logsDisplay('ERROR', $scope.TagName, "Error loading ModifyDealerController" + JSON.stringify(error));
	}
}])
