var errorHandlerModule = angular.module('dealerAudit.errorHandlerModule', []);

errorHandlerModule.factory('ErrorHandlerService', ['$ionicPopup', '$filter', 'logsFctry', function($ionicPopup, $filter, logsFctry) {

	var TagName = 'ErrorHandlerService';

	return {

		/**
		 * @function showError
		 * @param {String} error Error object which has the error information.		 		 
		 * @description Function for displaying server error messages.
		 */
		showError: function(error) {

			logsFctry.logsDisplay('INFO', TagName, 'Entered in module dealerAudit.errorHandlerModule');
			logsFctry.logsDisplay('DEBUG', TagName, 'Error information : ' + error);

			console.log("Error information " + JSON.stringify(error));

			// HaloMem error code can come in either error.code or error.data.code.
			// error.status is for generic http status codes.
			var errorCode = error.code || error.data.code || error.status;
			var failureTitle = "";
			var failureMessage = "";

			if(errorCode) {
				switch(errorCode) {
					case 0:
						failureTitle = "Login failed";
						failureMessage = "Unable to login. Please try with valid credentials ";

					case 11:
						failureTitle = "Access denied";
						failureMessage = "Unable to login. Please try with valid credentials ";

					case 13:
						failureTitle = "Login failed";
						failureMessage = "Authentication failure. Please make sure the credentials are correct";
						// return "Authentication failure. Please make sure the credentials are correct";

					case 55:
						failureTitle = "Sync error";
						failureMessage = "Data could not be synced due to";

					case 51:
						failureTitle = "Token expired";
						failureMessage = "Session expired. Please login again.";

					case 400:
						failureTitle = "Login failed";
						failureMessage = "Unable to download data due to network issues.";

					case 401:
						failureTitle = "Login failed";
						failureMessage = "Please enter valid credentials.";

					default:
						failureTitle = "Error";
						failureMessage = "Some error occured. Please contact your administrator.";
				}
			}

			$ionicPopup.alert({
				title: failureTitle,
				content: failureMessage,
				cssClass: 'customAlert'
			});

		}
	}
}])
