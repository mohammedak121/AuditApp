/**

 * @class dealerAudit.searchDealerModuleDB
 * @description This module includes database functionalities for searching a dealer.
 */

/**
 * @function searchDealerDbfactory
 * @param {Service} $cordovaSQLite  provides db storage
 * @param {Service} $q  it helps to run functions asynchronously.
 * @param {Service} logsFctry it helps to in logging mechanism. 
 * @description Function to search a dealer from DB.
 */

angular.module('dealerAudit.searchDealerModuleDB', []).factory('searchDealerDbfactory', ['$cordovaSQLite', '$q', 'logsFctry', function($cordovaSQLite, $q, logsFctry) {
	try {
		var TagName = "searchDealerDbfactory";
		//console.log("INFO" + TagName + "Entered into module dealerAudit.searchDealerDbfactory");
		logsFctry.logsDisplay('INFO', TagName, 'Entered into module dealerAudit.searchDealerDbfactory');

		return {
			/**
			 * @function getAllDealers
			 * @description function which fetches the dealer information.
			 */
			getAllDealers: function() {
				try {

					var dealerData = [];
					logsFctry.logsDisplay('INFO', TagName, 'Entered into function getAllDealers');

					var fetchQueryDealer = "SELECT * FROM Dealer_Master";
					//console.log('DEBUG'+ TagName + 'fetchQueryDealer' + fetchQueryDealer);					
					logsFctry.logsDisplay('DEBUG', TagName, 'fetchQueryDealer' + fetchQueryDealer);

					return $q.when($cordovaSQLite.execute(db, fetchQueryDealer).then(function(res) {
						if(res.rows.length > 0) {
							for(var i = 0; i < res.rows.length; i++) {
								dealerData.push(res.rows.item(i));
								//console.log("DEBUG" + TagName + "push dealer data" + JSON.stringify(dealerData));
								logsFctry.logsDisplay('DEBUG', TagName, "push dealer data" + JSON.stringify(dealerData));
							}
						} else {
							console.log("DEBUG" + TagName + "No data found");
							logsFctry.logsDisplay('DEBUG', TagName, "No dealer data found");
						}

						return dealerData;
					}));

					return dealerData;
				} catch(error) {
					//console.log("Error" + TagName  + "Error in function getAllDealers" + error);
					logsFctry.logsDisplay('Error', TagName, "Error in function getAllDealers" + error);
				}
			}
		};
	} catch(error) {
		//console.log("Error " + TagName + " Error in the module dealerAudit.searchDealerDbfactory" + error);
		logsFctry.logsDisplay('Error', TagName, "Error in the module dealerAudit.searchDealerDbfactory" + error);
		return error;
	}
}])
