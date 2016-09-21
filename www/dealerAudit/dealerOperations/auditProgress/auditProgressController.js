/**
 * @class dealerAudit.auditProgressDealerControllers
 * @description Functions related to modfying a dealer.
 */

/**
 * @function AuditProgressDealerController
 * @param {ScopeElemet} $scope defines scope of an elemet or function.
 * @param {Service} $location Used for navigation between pages.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @param {Service} logsFctry Provides logging mechanism.
 * @param {Service} $cordovaNetwork Checking online connectivity.
 * @description Show the audit progress and search UI for dealer.
 */

var auditProgressDealerModule = angular.module('dealerAudit.auditProgressDealerControllers', ['ionic', 'ngCordova']);

auditProgressDealerModule.controller('AuditProgressDealerController', ['$scope', '$location', 'dealerAudit_AssetsConst', 'logsFctry', '$cordovaNetwork', 'syncModuleFactory', 'loginDbfctry', 'dealerAudit_ConstantsConst', function($scope, $location, dealerAudit_AssetsConst, logsFctry, $cordovaNetwork, syncModuleFactory, loginDbfctry, dealerAudit_ConstantsConst) {
	try {
		$scope.TagName = 'AuditProgressDealerController';
		$scope.backIcon = dealerAudit_AssetsConst.backIcon;
		$scope.dealerNavigationIcon = dealerAudit_AssetsConst.dealerNavigation;
		$scope.addNewDealer = dealerAudit_AssetsConst.addNewDealer;
		$scope.searchDealerLine = dealerAudit_AssetsConst.searchDealerLine;
		$scope.dealerSearchIcon = dealerAudit_AssetsConst.dealerSearchIcon;

		console.log("Entered into controller AuditProgressDealerController");
		logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into controller AuditProgressDealerController');

		/**
		 * @name navigateToSearch
		 * @desc on focus of input box navigate to search screen.
		 */
		$scope.navigateToSearch = function() {
			$location.path('/searchDealer');
		}

		/**
		 * @function on
		 * @description before load of page function retrieves the data to bind to search dealer.
		 */
		$scope.$on('$ionicView.beforeEnter', function() {
			try {

				//console.log("Info" + $scope.TagName + "Enter into search View $ionicView.beforeEnter" );
				logsFctry.logsDisplay('INFO', $scope.TagName, 'Enter into search View $ionicView.beforeEnter');

				// Download the data only when the user is online.
				if($cordovaNetwork.isOnline()) {

					// Download master data if the user is online.
					syncModuleFactory.downloadDealerData().then(function(response) {
						if(response == dealerAudit_ConstantsConst.success) {
							// $scope.getDealerInformation();
							//loginDbfctry.insertLastOnlineLoginDateForUser();
						}
					}, function(error) {
						logsFctry.logsDisplay('ERROR', $scope.TagName, "Error in audit progress View downloadDealerData" + JSON.stringify(error));
						console.log("Dealers not downloaded " + error);
					});
				}
			} catch(error) {
				//console.log("Error" + $scope.TagName + "Error in search View $ionicView.beforeEnter" + error);
				logsFctry.logsDisplay('ERROR', $scope.TagName, "Error in audit progress View $ionicView.beforeEnter" + JSON.stringify(error));
			}
			//console.log("Info" + $scope.TagName + "Exit from search View $ionicView.beforeEnter" );
			logsFctry.logsDisplay('INFO', $scope.TagName, "Exit from audit progress View $ionicView.beforeEnter");
		});

		/**
		 * @name navigateToAddDealer
		 * @desc on clicking add dealers navigate to dealer screen screen.
		 */
		$scope.navigateToAddDealer = function() {

			$location.path('/modifyDealer').search({
				addDealer: 'true',
				auditProgress: 'true'
			});
		}

		/**
		 * @function backButtonClicked
		 * @description Back button click on the header.
		 */
		$scope.backButtonClicked = function() {
			$location.path('/dashBoard');
		}

	} catch(error) {
		logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in entering into AuditProgressDealerController' + JSON.stringify(error));
	}
}])
