/**
 * @class dealerAudit.searchDealerControllers
 * @description Function to search dealer.
 */

/**
 * @function SearchDealerController
 * @param {ScopeElemet} $scope defines scope of an element or function.
 * @param {Service} dealerAudit_AssetsConst Used for defining asset constants.
 * @param {Service} $location Used for navigation between pages.
 * @param {Service} $filter Used for translation of labels.
 * @param {Service} $ionicPopup Used to display alert messages.
 * @param {Service} searchDealerDbfactory Provides all local DB functions.
 * @param {Service} logsFctry Provides logging mechanism.
 * @param {Service} passParameterFctry Used to pass parameters between controllers.
 * @description Function to modify a dealer.
 */

var searchDealerModule = angular.module('dealerAudit.searchDealerControllers', ['ionic','ngCordova']);

searchDealerModule.controller('SearchDealerController', ['$scope', 'dealerAudit_AssetsConst', '$location', '$filter', '$ionicPopup', 'searchDealerDbfactory', 'logsFctry', 'passParameterFctry', 'focus', function($scope, dealerAudit_AssetsConst, $location, $filter, $ionicPopup, searchDealerDbfactory, logsFctry, passParameterFctry, focus,broadcast,$rootScope) {
		$scope.TagName = 'SearchDealerController';
		$scope.searchByDealerName = {};
		$scope.dealerList = [];
		$scope.searchDealerQuery = {};
		$scope.searchByDealerName.dealer_name = "";
		$scope.dealerFound = false;

		$scope.yesLabel = $filter('translate')('lblYes');
		$scope.noLabel = $filter('translate')('lblNo');
		$scope.errorTitle = $filter('translate')('lblError');
		$scope.warningTitle = $filter('translate')('lblWarning');
		$scope.alertMsg = $filter('translate')('lblSearchDealerAlert');
		$scope.cancelLabel = $filter('translate')('lblLtcancel');

		//Variable for search image icon
		$scope.searchIcon = dealerAudit_AssetsConst.searchIcon;
		$scope.backIcon = dealerAudit_AssetsConst.backIcon;
		$scope.noDealersImg = dealerAudit_AssetsConst.noDealersImg;
		$scope.addNewDealer = dealerAudit_AssetsConst.addNewDealer;
		$scope.cancelImg = dealerAudit_AssetsConst.cancelImg;
		$scope.rightArrow = dealerAudit_AssetsConst.rightArrow;
		$scope.searchIconWhite = dealerAudit_AssetsConst.searchIconWhite;
		$scope.tireLodingImage = dealerAudit_AssetsConst.tireLodingImage;
		$scope.shouldShowTyreImage = false;

		logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into module dealerAudit.searchDealerControllers');

		/**
		 * @function on
		 * @description before load of page function retrieves the data to bind to search dealer.
		 */
		$scope.$on('$ionicView.beforeEnter', function() {
			try {
      // focus('focusMe');
				//cordova.plugins.Keyboard.show();

				//console.log("Info" + $scope.TagName + "Enter into search View $ionicView.beforeEnter" );
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Enter into search View $ionicView.beforeEnter');
				$scope.shouldShowTyreImage = true;
				$scope.getDealerInformation();
			} catch(error) {
				//console.log("Error" + $scope.TagName + "Error in search View $ionicView.beforeEnter" + error);
				logsFctry.logsDisplay('ERROR', $scope.TagName, "Error in search View $ionicView.beforeEnter" + error);
			}
			//console.log("Info" + $scope.TagName + "Exit from search View $ionicView.beforeEnter" );
			logsFctry.logsDisplay('INFO', $scope.TagName, "Exit from search View $ionicView.beforeEnter");
		});

		/**
		 * @function applyDealerFilter
		 * @description Filter the dealer screen based on dealer name.
		 */
		$scope.applyDealerFilter = function(dealer) {
			// console.log("Dealer name" + dealer.dealer_name);
			// console.log("Input type value " + $scope.searchByDealerName.dealer_name);

			logsFctry.logsDisplay('INFO', $scope.TagName, "Enter into function applyDealerFilter");

			if(!$scope.searchByDealerName.dealer_name || (dealer.dealer_name.toLowerCase().indexOf($scope.searchByDealerName.dealer_name.toLowerCase()) != -1)) {
				// $scope.dealerFound = false;
				return true;
			} else {
				// $scope.dealerFound = true;
				return false;
			}
		}

		/**
		 * @function getDealerInformation
		 * @description retrieving all dealer information and binding the UI
		 */
		$scope.getDealerInformation = function() {
			//console.log("Info" + $scope.TagName + "Enter into getDealerInformation");
    	//$scope.shouldShowTyreImage = true;
			logsFctry.logsDisplay('INFO', $scope.TagName, "Enter into getDealerInformation");

			try {
					//$scope.shouldShowTyreImage = false;
				searchDealerDbfactory.getAllDealers().then(function(data) {
					//console.log("Info" + $scope.TagName + "dealer data" + JSON.stringify(data));
					logsFctry.logsDisplay('DEBUG', $scope.TagName, "dealer data" + JSON.stringify(data));

					// Make sure the dealer list is empty before populating it.
					$scope.dealerList = [];

					if(data.length != 0) {
						for(var i = 0; i < data.length; i++) {
							$scope.dealerList.push(data[i]);
						}
            $scope.shouldShowTyreImage = false;
						cordova.plugins.Keyboard.show();
						angular.element('#searchDealerInput').focus();
						// if($scope.shouldShowTyreImage == false){
						// 	// Focus the input field by default after the data is bound.
						// 	//focus('focusMe');
						//
						// }

					} else {
						$scope.dealerFound = true;
						//console.log("Info" + $scope.TagName + "dealer data is empty" + JSON.stringify(data));
						logsFctry.logsDisplay('DEBUG', $scope.TagName, "dealer data is empty" + JSON.stringify(data));
					}
				})

			} catch(error) {
				//console.log("Error" + $scope.TagName + "Error in getDealerInformation" + error);
				logsFctry.logsDisplay('ERROR', $scope.TagName, "Error in getDealerInformation" + error);
			}

			console.log("Info" + $scope.TagName + "Exit from getDealerInformation");
			logsFctry.logsDisplay('INFO', $scope.TagName, "Exit from getDealerInformation");
				//$scope.shouldShowTyreImage = false;
		}


		/**
		 * @function isAnyItemMatchWithTheQuery
		 * @param event :context of the html displayed
		 * @description checking if no items matching the search query
		 */
		$scope.isAnyItemMatchWithTheQuery = function(event) {


			//console.log("INFO" + $scope.TagName + "Entered into isAnyItemMatchWithTheQuery");
			logsFctry.logsDisplay('INFO', $scope.TagName, "Entered into isAnyItemMatchWithTheQuery");
			try {
				//angular.element('#rightArrow').show();
				//Retrieves the query searched in search bar
				if(event.searchByDealerName.dealer_name != null) {
					$scope.searchDealerQuery = event.searchByDealerName.dealer_name;

					if($scope.dealerList.length != 0) {

						for(var i = 0; i < $scope.dealerList.length; i++) {
							var str = $scope.dealerList[i].dealer_name.toLowerCase();

							//console.log("DEBUG" + $scope.TagName + "Dealer name : " + $scope.dealerList[i].dealer_name);
							logsFctry.logsDisplay('DEBUG', $scope.TagName, "Dealer name : " + $scope.dealerList[i].dealer_name);
							var index = str.search(event.searchByDealerName.dealer_name.toString().toLowerCase());
							if(index >= 0) {
								$scope.dealerFound = false;
								break;

							} else {
								$scope.dealerFound = true;
							}
							//If no match found , Displays a Pop Up
							// if($scope.dealerList[i].dealer_name != event.searchByDealerName.dealer_name) {
							// 	if(i == $scope.dealerList.length - 1) {
							// 		event.searchByDealerName.dealer_name = "";
							// 		//console.log("DEBUG" + $scope.TagName + "event.searchByDealerName.dealer_name" + event.searchByDealerName.dealer_name);
							// 		logsFctry.logsDisplay('DEBUG', $scope.TagName, "event.searchByDealerName.dealer_name" + event.searchByDealerName.dealer_name);
							//
							// 		var message = $filter('translate')('lblSearchForSomethingElse');
							// 		cordova.plugins.Keyboard.close();
							//
							// 		var confirmPopup = $ionicPopup.confirm({
							// 			title: $scope.warningTitle,
							// 			template: $scope.alertMsg,
							// 			cancelText: $scope.noLabel,
							// 			okText: $scope.yesLabel,
							// 			cssClass: 'customAlertConfirmation'
							// 		});
							//
							// 		confirmPopup.then(function(res) {
							//
							// 			if(res) {
							//
							// 				$location.path('/modifyDealer').search({
							// 					addDealer: 'true'
							// 				});
							// 			}
							// 		});
							// 	}
							// }
						}
					}
				}

			} catch(error) {
				//console.log("ERROR" + $scope.TagName + "Error in isAnyItemMatchWithTheQuery" + error);
				logsFctry.logsDisplay('ERROR', $scope.TagName, "Error in isAnyItemMatchWithTheQuery" + error);
			}
		}

		/**
		 * @function clearSearch
		 * @description Clear the search field.
		 */
		$scope.clearSearch = function() {
			console.log("in clearsearch");
			$scope.searchByDealerName.dealer_name = "";
			$scope.dealerFound = false;
			console.log("Cleared value " + $scope.searchByDealerName.dealer_name);
		}

		/**
		 * @function navigateToProgressScreen
		 * @description Navigate to the previous screen.
		 */
		$scope.navigateToProgressScreen = function() {
			$location.path('/auditProgressDealer');
		}

		/**
		 * @function backButtonClicked
		 * @description Back button click on the header.
		 */
		$scope.navigateToModifyDealer = function(dealerData) {

			if(dealerData != null || typeof(dealerData) != "undefined") {
				passParameterFctry.setDealerInformation(dealerData);
				$location.path('/modifyDealer').search({
					addDealer: 'false',
					auditProgress: 'false'
				});
			}
		}


		/**
		 * @name navigateToAddDealer
		 * @desc on clicking add dealers navigate to dealer screen screen.
		 */
		$scope.navigateToAddDealer = function() {
			// $location.path('/modifyDealer');
			$location.path('/modifyDealer').search({
				addDealer: 'true',
				auditProgress: 'false'
			});
		}

	}])
	.filter('highlight', function($sce) {
		return function(text, phrase) {
			if(phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
				'<span class="highlighted">$1</span>')
			return $sce.trustAsHtml(text)
		}
	})
