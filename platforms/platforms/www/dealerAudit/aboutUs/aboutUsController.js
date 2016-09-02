/**
* @class dealerAudit.aboutUsModule
* @description This module includes functionalities for displaying version of the build.
*/

 var aboutUsModule = angular.module('dealerAudit.aboutUsModule', []);

/**
* @function AboutUsController
* @param {ScopeElemet} $scope defines scope of an elemet or function.
* @param {Service} $location  provides interface to default state.
* @param {Constants} dealerAudit_AssetsConst  provides all the constants.
* @param {Constants} dealerAudit_AssetsConst provides all the assets.
* @param {Service} $filter used for formatting data displayed to the user.
*/

 aboutUsModule.controller('AboutUsController', function($scope, $location, dealerAudit_AssetsConst, dealerAudit_ConstantsConst,$filter,logsFctry) {

	var isIOS = ionic.Platform.isIOS();
	var isAndroid = ionic.Platform.isAndroid();

  $scope.TagName = 'AboutUsController';
	$scope.copyright = $filter('translate')('lblCopyright');
	$scope.allRightsReserved = $filter('translate')('lblAllRightsReserved');
	$scope.aboutUS = $filter('translate')('lblAboutUs');

	// Images
	$scope.backIcon = dealerAudit_AssetsConst.backIcon;
	$scope.goodyeardunLogo = dealerAudit_AssetsConst.goodyeardunLogo;
	$scope.loglogo = dealerAudit_AssetsConst.loglogo;

	// Constants
	$scope.androidVersion = dealerAudit_ConstantsConst.androidVersion;
	$scope.iosVersion = dealerAudit_ConstantsConst.iosVersion;
	$scope.Version = $scope.androidVersion;

	// Platform check.
	if (isIOS) {
		$scope.Version = $scope.iosVersion;

	} else {
		$scope.Version = $scope.androidVersion;
	}

/**
* @function NavigateToDashBoard
* @description function for navigating to dashboard on back button click of the app
*/
	$scope.NavigateBackToDashboard = function() {

		try {
			console.log('Entered into function NavigateToDashBoard');
      	logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into function NavigateToDashBoard');
			$location.path('/dashBoard');
		} catch(e) {
			console.log('Error in the  function NavigateToDashBoard::' + e);
      	logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in the  function NavigateToDashBoard::' + e);

		}
		console.log('Exit from function NavigateToDashBoard');
    	logsFctry.logsDisplay('INFO', $scope.TagName, 'Exit from function NavigateToDashBoard');

	}

 });
