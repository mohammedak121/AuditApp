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

confirmDealerModule.controller('confirmDealerController', ['$scope','$location', 'dealerAudit_AssetsConst', 'logsFctry', 'dealerAudit_ConstantsConst',  'passParameterFctry','$ionicPopup', '$filter',function($scope,  $location, dealerAudit_AssetsConst, logsFctry, dealerAudit_ConstantsConst, passParameterFctry,$ionicPopup,$filter) {
	try {
		$scope.TagName = 'confirmDealerController';
    $scope.confirmDealerNavigationIcon = dealerAudit_AssetsConst.confirmDealerNavigationIcon;
		$scope.editIcon = dealerAudit_AssetsConst.edit;
		$scope.dealerData = {};
		$scope.companyName = true;
		$scope.email = true;
		$scope.phone = true;
		$scope.network = true;
		$scope.address = true;
		$scope.zipCode = true;
		$scope.country = true;
		$scope.city = true;
		$scope.holdingName = true;
		$scope.payerCode = true;
		$scope.posCode = true;
		$scope.tts = true;

		$scope.editIconVisibility = true;
		// Translation labels
		$scope.yesLabel = $filter('translate')('lblYes');
		$scope.noLabel = $filter('translate')('lblNo');
		$scope.warningTitle = $filter('translate')('lblWarning');
		$scope.confirmMsg = $filter('translate')('lblconfirmMsg');

		console.log("Entered into controller confirmDealerController");
		logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into controller confirmDealerController');




		/**
		 * @function on
		 * @description after load of page function retrieves the data to bind to dealer.
		 */
		$scope.$on('$ionicView.afterEnter', function() {
			//console.log("INFO" + $scope.TagName + "Entered into $ionicView.afterEnter");
			console.log("Entered into $ionicView.afterEnter");
			logsFctry.logsDisplay('INFO', $scope.TagName, 'Entered into $ionicView.afterEnter');
			$scope.dealerData = {};
			//$scope.date = new Date();

				var dealerInfo = passParameterFctry.getDealerInformation();
				console.log("Dealer information : " + JSON.stringify(dealerInfo));

				console.log("confirm dealer form search" + $location.search().confirmDealerFromSearch);
				console.log("confirm dealer form search" + $location.search().confirmDealer);

				if($location.search().confirmDealerFromSearch == "true") {
						$scope.editIconVisibility = true;
				}
				else{
					$scope.editIconVisibility = false;
				}


				$scope.dealerData = {
					dealer_id: (typeof(dealerInfo.dealer_id) == "undefined" || dealerInfo.dealer_id == null) ? "" : dealerInfo.dealer_id,
					dealer_name: (typeof(dealerInfo.dealer_name) == "undefined" || dealerInfo.dealer_name == null) ? "" : dealerInfo.dealer_name,
					email: (typeof(dealerInfo.email) == "undefined" || dealerInfo.email == null) ? "" : dealerInfo.email,
					phone: (typeof(dealerInfo.phone) == "undefined" || dealerInfo.phone == null) ? "" : dealerInfo.phone,
					network: (typeof(dealerInfo.network) == "undefined" || dealerInfo.network == null) ? "" : dealerInfo.network,
					//network: 	dealerInfo.network,
					//network:$scope.networkOptions.value,
					address: (typeof(dealerInfo.address) == "undefined" || dealerInfo.address == null) ? "" : dealerInfo.address,
					post_code: (typeof(dealerInfo.post_code) == "undefined" || dealerInfo.post_code == null) ? "" : dealerInfo.post_code,
					city_name: (typeof(dealerInfo.city_name) == "undefined" || dealerInfo.city_name == null) ? dealerInfo.city_name = "" : dealerInfo.city_name,
					province: (typeof(dealerInfo.province) == "undefined" || dealerInfo.province == null) ? dealerInfo.province = "" : dealerInfo.province,
					country_name: (typeof(dealerInfo.country_name) == "undefined" || dealerInfo.country_name == null) ? dealerInfo.country_name = "" : dealerInfo.country_name,
					holding_name: (typeof(dealerInfo.holding_name) == "undefined" || dealerInfo.holding_name == null) ? "" : dealerInfo.holding_name,
					//holding_code: (typeof(dealerInfo.holding_code) == "undefined" || dealerInfo.holding_code == null) ? "" : dealerInfo.holding_code,
					payer_code: (typeof(dealerInfo.payer_code) == "undefined" || dealerInfo.payer_code == null) ? "" : dealerInfo.payer_code,
					pos_code: (typeof(dealerInfo.pos_code) == "undefined" || dealerInfo.pos_code == null) ? "" : dealerInfo.pos_code,
					tts_name: dealerAudit_ConstantsConst.TTS_Name
				}



			logsFctry.logsDisplay('DEBUG', $scope.TagName, " get Dealer data " + $scope.dealerData);
		});



		/**
		 * @function backButtonClicked
		 * @description Back button click on the header.
		 */
		$scope.navigateToModifyDealer = function() {
			console.log("inside navigateToModifyDealer ");

			//if(dealerData != null || typeof(dealerData) != "undefined") {
				//passParameterFctry.setDealerInformation(dealerData);
				$location.path('/modifyDealer').search({
					addDealer: 'false',
					auditProgress: 'false'
				});
			//}
		}

		/**
		 * @function backButtonClicked
		 * @description Back button click on the footer.
		 */
		$scope.navigateTosearchorModifyDealer = function() {
			console.log("inside navigateTosearchorModifyDealer ");
			if($location.search().confirmDealerFromSearch == "true") {
					$location.path('/searchDealer');

				}else {
					$location.path('/modifyDealer');
			}

		}



		

		/**
		 * @function confirmButtonClicked
		 * @description confirm button click on the footer.
		 */
		$scope.navigatetoAuditDealers = function() {
			var confirmPopup = $ionicPopup.confirm({
						title: $scope.warningTitle,
						template: $scope.confirmMsg,
						cancelText: $scope.noLabel,
						okText: $scope.yesLabel,
						cssClass: 'customAlertConfirmation'
					});
					confirmPopup.then(function(res) {
						if(res) {
							$location.path('/auditDetails');
					}else{
						  $location.path('/dashBoard');
					}
			});
		}

	} catch(error) {
		//logsFctry.logsDisplay('ERROR', $scope.TagName, 'Error in entering into confirmDealerController' + JSON.stringify(error));
		console.log("Error in loading module dealerAudit.confirmDealerControllers" + error);
	}
}])
