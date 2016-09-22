/**
 * @class dealerAudit.confirmDealerControllers
 * @description Functions related to confirmDealer a dealer.
 */

/**
 * @function confirmDealerControllers
 * @param {ScopeElemet} $scope defines scope of an elemet or function.
 * @param {Service} $location Used for navigation between pages.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @param {Service} logsFctry Provides logging mechanism.

 * @description Show the confirmDealer view.
 */

var confirmDealerModule = angular.module('dealerAudit.confirmDealerControllers', ['ionic']);

confirmDealerModule.controller('confirmDealerController', ['$scope', '$location', 'dealerAudit_AssetsConst', 'logsFctry',  'dealerAudit_ConstantsConst', function($scope, $location, dealerAudit_AssetsConst, logsFctry,  loginDbfctry, dealerAudit_ConstantsConst) {
	try {
		$scope.TagName = 'confirmDealerController';
    $scope.confirmDealerNavigationIcon = dealerAudit_AssetsConst.confirmDealerNavigationIcon;

		console.log("Entered into controller confirmDealerController");
		logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into controller confirmDealerController');



	} catch(error) {
		logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in entering into confirmDealerController' + JSON.stringify(error));
	}
}])
