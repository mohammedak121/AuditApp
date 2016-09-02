/**
 * @class dealerAudit.pageParameterPass
 * @description This module includes functionalities to pass parameters from one page to another
 */
/**
 * @function passParameterFctry
 * @description Function for passing parameters.
 */
angular.module('dealerAudit.pageParameterPass', []).factory('passParameterFctry', function() {
	try {
		var dealerInformation = {};
		var isDealerDataSynced = false;

		function setDealerInformation(data) {
			dealerInformation = data;
		}

		function getDealerInformation() {
			return dealerInformation;
		}

		function setDealerSyncInformation(value) {
			isDealerDataSynced = value;
		}

		function getDealerSyncInformation() {
			return isDealerDataSynced;
		}

		return {
			setDealerInformation: setDealerInformation,
			getDealerInformation: getDealerInformation,
			setDealerSyncInformation: setDealerSyncInformation,
			getDealerSyncInformation: getDealerSyncInformation
		};
	} catch(error) {

	}
})
