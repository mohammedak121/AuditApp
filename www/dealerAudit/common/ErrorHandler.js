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

			if(typeof(error) != "undefined") {
				// HaloMem error code can come in either error.code or error.data.code.
				// error.status is for generic http status codes.
				var errorCode = error.code || error.data.code || error.status;
			} else {
				var errorCode = "";
			}

			// When the Wi-Fi is switched of during the sync the switch condition is not executed.
			// Hence a generic message is given.
			var failureTitle = "Error";
			var failureMessage = "There is some problem with the connection. Please try again.";

			if(errorCode.toString().length) {
				switch(errorCode) {
					case 0:
					case 5:
						failureTitle = "Login failed";
						failureMessage = "Unable to login. Please try with valid credentials ";
						break;

					case 11:
						// App verification failed.
						failureTitle = "Access denied";
						failureMessage = "Server error: Unable to access the server due to network issue";
						break;

					case 13:
						failureTitle = "Login failed";
						failureMessage = "Authentication failure. Please make sure the credentials are correct";
						break;
						// return "Authentication failure. Please make sure the credentials are correct";

						// case 55:
						// 	failureTitle = "Sync error";
						// 	failureMessage = "Data could not be synced due to";
						// 	break;

					case 51:
						failureTitle = "Token expired";
						failureMessage = "Session expired. Please login again.";
						break;

					case 400:
						failureTitle = "Login failed";
						failureMessage = "Unable to download data due to network issues.";
						break;

					case 401:
						failureTitle = "Login failed";
						failureMessage = "Please enter valid credentials.";
						break;

					case 504:
						failureTitle = "Server Error";
						failureMessage = "Server did not repond due to internal error.";
						break;

					default:
						failureTitle = "Error";
						failureMessage = "Some error occured. Please try again.";
						break;
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
