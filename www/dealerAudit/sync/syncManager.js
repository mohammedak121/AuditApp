/**
 * @class dealerAudit.syncModule
 * @param {Module} ionic defines ionic specific functionalities or services.
 * @param {Module} ngCordova defines cordova specific functionalities or services.
 * @description This module includes functionalities to sync data from dB.
 */
/**
 * @function syncModule
 * @param {ScopeElemet} $rootScope defines scope of an elemet or function.
 * @param {Factory} syncManageDbfctry defines database related functionalities used for sync.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @param {Service} $q  it helps to run functions asynchronously.
 * @param {Service} $cordovaSQLite provides db storage.
 * @param {Service} $filter used for formatting data displayed to the user.
 * @param {Service} toastFctry used for displaying toast messages.
 * @param {Service} logsFctry used for logging information.
 * @description Function to check whether download is needed and to download the data.
 */
var syncModule = angular.module('dealerAudit.syncModule', ['ngCordova', 'ionic']);

syncModule.factory('syncModuleFactory', function($rootScope, syncManageDbfctry, dealerAudit_ConstantsConst, $q, $cordovaSQLite, $filter, toastFctry, logsFctry) {

	var TagName = 'syncModuleFactory';
	logsFctry.logsDisplay('DEBUG', TagName, 'Entered in module dealerAudit.syncModule');

	return {

		/**
		 * @function downloadMasterData
		 * @description Download all the master data required for the application.
		 */
		downloadMasterData: function() {
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function downloadMasterData');

			return new Promise(function(resolve, reject) {
				return downloadDealerData().then(function(dealerResponse) {
					if(dealerResponse) {
						resolve(true);
					} else {
						resolve(false);
					}
				}, function(error) {
					reject(false);
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting dealers - downloadMasterData' + JSON.stringify(error));
				})
			})
		},

		/**
		 * @function getDealerData
		 * @description Fucntion to download dealer information from Halomem.
		 */
		downloadDealerData: function downloadDealerData() {
			var dealerList = [];
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function downloadDealerData');

			return $rootScope.session.getClientObjectType("dealers").then(function(clientObjectType) {
				return clientObjectType.search("dealers", 0, -1, null, null, null, null, null, null, false).then(function(response) {
					logsFctry.logsDisplay('INFO', TagName, 'Client object dealers search get successful');
					console.log("Dealer data successfully downloaded -- ");
					console.log("Numer of dealers -- " + response.length);
					//toastFctry.showToast("Number of dealers " + response.length);
					// Insert dealer data in local DB only if there are dealers present.
					if(response.length > 0) {
						if(syncManageDbfctry.deleteDealerData()) {
							syncManageDbfctry.insertDealerData(response);
							return true;
						}
					}

					// If there are no dealers to download the user should still be allowed to login.
					// Because the user can create dealers in offline mode.
					if(response.length == 0) {
						return true;
					}

					return false;
				}, function(error) {

					var message = "";
					//console.log("Error in getClientObjectType dealers ::" + JSON.stringify(error));
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object dealers' + JSON.stringify(error));

					// This message will be displayed if no dealers are present. Else a generic message is displayed.
					if(error.code == 55 && error.message == "No Content") {
						//message = $filter('translate')('lblNoDealersFound');
						return true;
					}
					// else {
					// 	message = $filter('translate')('lblServerDataDownloadError');
					// }
					//toastFctry.showToast(message);
					return false;
				})
			}, function(error) {
				//console.log("Error in getClientObjectType dealers ::" + JSON.stringify(error));
				logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));
				//var message = $filter('translate')('lblServerDataDownloadError');
				//toastFctry.showToast(message);
				return false;
			})
		},

		/**
		 * @function getDealerData
		 * @description Fucntion to download dealer information from Halomem.
		 */
		uploadDealerData: function() {
			var dealerData = [];
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function uploadDealerData');

			return new Promise(function(resolve, reject) {
				$rootScope.session.getClientObjectType("dealers").then(function(clientObjectType) {
					console.log("Get client dealers object successful");

					// Get dealer information from localDatabase first. If there are no records then dont proceed further.
					syncManageDbfctry.getDealerData().then(function(response) {
						if(response.length > 0) {
							console.log("Dealer information " + JSON.stringify(response));

							// Parse all the dealer info and send it to the server.
							// Make sure the values are not undefined.
							for(var i = 0; i < response.length; i++) {

								if(response[i].participating_tf == 0) {
									response[i].participating_tf = false;
								} else {
									response[i].participating_tf = true;
								}

								// After getting the data , populate the data and send it to the backend.
								clientObjectType.create(response[i]).then(function(response) {
									if(response != null && typeof(response) != "undefined") {
										//console.log("Dealer data uploaded successfully");
										logsFctry.logsDisplay('INFO', TagName, 'Dealer data successfully uploaded.');
										//return true;
										resolve(true);
									} else {
										reject(false);
									}
								}, function(error) {
									var message = "";
									//console.log("Error in getClientObjectType dealers ::" + JSON.stringify(error));
									logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object dealers' + JSON.stringify(error));
									// This message will be displayed if no dealers are present. Else a generic message is displayed.
									if(error.code == 55 && error.message == "No Content") {
										message = $filter('translate')('lblNoDealersFound');
									} else {
										message = $filter('translate')('lblServerDataUploadError');
									}
									console.log("Data could not be uploaded" + error + message);
									//toastFctry.showToast(message);
									reject(message);
								})
							}
						} else {
							resolve(false);
						}
					})
				}, function(error) {
					//console.log("Error in getClientObjectType dealers ::" + JSON.stringify(error));
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));
					var message = $filter('translate')('lblServerDataUploadError');
					//toastFctry.showToast(message);
					console.log("Data could not be uploaded" + error + message);
					reject(message);
				})
			});
		},

		/**
		 * @function isFirstOnlineLoginOfTheDay
		 * @description fucntion to check whether it is first login of the calendar day
		 */
		isFirstOnlineLoginOfTheDay: function() {
			console.log('is First Login Of The Day');
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function isFirstOnlineLoginOfTheDay');
			var lastLogin_Date;
			return syncManageDbfctry.getOnlineLoginInfo().then(function(res) {
				if(res.rows.length > 0) {
					for(var i = 0; i < res.rows.length; i++) {
						lastLogin_Date = new Date(res.rows.item(i).AppKeyValue);
					}
				} else {
					console.log("App Data no results found");
					return true;
				}
				if(lastLogin_Date == undefined || lastLogin_Date == null) {
					// Since this variable is undefined or null, it is the first login of the app
					return true;
				}
				// Check if it is first online login of the day
				var currentDate = new Date();
				if(currentDate.getDate() == lastLogin_Date.getDate() && currentDate.getFullYear() == lastLogin_Date.getFullYear() && currentDate.getMonth() == lastLogin_Date.getMonth()) {
					return false;
				} else {
					return true;
				}
			});
		},

		/**
		 * @function isFirstOfflineLoginOfTheDay
		 * @description fucntion to check whether it is first login of the calendar day
		 */
		isFirstOfflineLoginOfTheDay: function isFirstOfflineLoginOfTheDay() {
			console.log('is First offline Login Of The Day');
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function isFirstOfflineLoginOfTheDay');
			var lastOfflineLogin_Date;

			return syncManageDbfctry.getOfflineLoginInfo().then(function(res) {
				if(res.rows.length > 0) {
					for(var i = 0; i < res.rows.length; i++) {
						lastOfflineLogin_Date = new Date(res.rows.item(i).AppKeyValue);
					}
				} else {
					console.log("No results found test");
					return true;
				}
				if(lastOfflineLogin_Date == undefined || lastOfflineLogin_Date == null) {
					// Since this variable is undefined or null, it is the first login of the app.
					return true;
				}

				// Check if it is first online login of the day.
				var currentDate = new Date();
				if(currentDate.getDate() == lastOfflineLogin_Date.getDate() && currentDate.getFullYear() == lastOfflineLogin_Date.getFullYear() && currentDate.getMonth() == lastOfflineLogin_Date.getMonth()) {
					return false;
				} else {
					return true;
				}
			});
		},

		/**
		 * @function howManyDaysOldData
		 * @description functoin to check whether sync is required and when was the last sync
		 */
		howManyDaysOldData: function() {
			console.log("Entered into function howManyDaysOldData");
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function howManyDaysOldData');
			var currentDate = new Date();
			console.log("getTime :::" + currentDate.getTime());
			var lastLoginDate;

			// return new Promise(function(resolve, reject) {
			//
			// });

			return new Promise(function(resolve, reject) {
				syncManageDbfctry.getOnlineLoginInfo().then(function(res) {
					if(res.rows.length > 0) {
						for(var i = 0; i < res.rows.length; i++) {
							console.log("res :::" + res.rows.item(i).AppKeyValue);
							lastLoginDate = new Date(res.rows.item(i).AppKeyValue);
							console.log("lastonlineLoginDate------" + lastLoginDate.getTime());
						}
						console.log("lastonlineLoginDate------" + lastLoginDate.getTime());

						var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
						var diffDays = Math.round(Math.abs((currentDate.getTime() - lastLoginDate.getTime()) / (oneDay)));
						//return diffDays;
						resolve(diffDays);
						console.log("Difference number of days" + diffDays);
					} else {
						console.log("No records found getOnlineLoginInfo()");
						reject(false);
					}
				});
			});
		},
	};
});
