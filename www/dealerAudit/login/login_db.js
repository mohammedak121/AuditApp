/**
 * @class dealerAudit.loginModuleDB
 * @description This module includes functionalities for fetching data from Hallomem and inserting it into local DB.
 */
/**
 * @function loginDbfctry
 * @param {Service} $cordovaSQLite  provides db storage.
 * @param {Service} $q  it helps to run functions asynchronously.
 * @param {Service} $timeout provides timeout function.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @description Function to inserting data to db.
 */

var loginModule = angular.module('dealerAudit.loginModuleDB', [])

loginModule.factory('loginDbfctry', function($cordovaSQLite, $q, $timeout, dealerAudit_ConstantsConst) {
	try {
		var TagName = "loginDbfctry";
		console.log("Info " + TagName + "Entered into module loginDbfctry");

		return {
			/**
			 * @function insertLastLoginDateForUser
			 * @description function which inserts lastlogindate for a particular user to AppData
			 */
			insertLastOnlineLoginDateForUser: function() {

				try {
					var lastOnlineLoginDate = new Date();
					var appKey = dealerAudit_ConstantsConst.lastOnlineLoginKey;
					$cordovaSQLite.execute(db, "INSERT OR REPLACE INTO AppData(AppKey,AppKeyValue,UserID) VALUES ('" + appKey + "','" + lastOnlineLoginDate.getTime() + "','" + dealerAudit_ConstantsConst.TTS_Name + "')");
				} catch(error) {
					console.log("Error " + TagName + "Error in function insertLastOnlineLoginDateForUser");
				}
			},
			/**
			 * @function insertLastLoginDateForUser
			 * @description function which inserts lastlogindate for a particular user to AppData
			 */
			insertLastOfflineLoginDateForUser: function() {
				try {
					var appKey = dealerAudit_ConstantsConst.lastOfflineLoginKey;
					var lastOfflineLoginDate = new Date();
					$cordovaSQLite.execute(db, "INSERT OR REPLACE INTO AppData(Appkey,AppkeyValue,UserID) VALUES ('" + appKey + "','" + lastOfflineLoginDate.getTime() + "','" + dealerAudit_ConstantsConst.TTS_Name + "')");
				} catch(error) {
					console.log("Error " + TagName + "Error in function insertLastOfflineLoginDateForUser");
				}
			}
		};

	} catch(error) {
		console.log("Error" + TagName + "Error in module dealerAudit.loginModuleDB");
	}

})
