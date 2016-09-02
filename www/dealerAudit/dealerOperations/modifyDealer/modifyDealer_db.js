/**

 * @class dealerAudit.ModifyDealerModuleDB
 * @description This module includes database functionalities for searching a dealer.
 */

/**
 * @function modifyDealerDbFactory
 * @param {Service} $cordovaSQLite  provides db storage
 * @param {Service} $q It helps to run functions asynchronously.
 * @param {Service} $timeout provides timeout function.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @description Function to search a dealer from DB.
 */

angular.module('dealerAudit.ModifyDealerModuleDB', []).factory('modifyDealerDbFactory', ['$cordovaSQLite', '$q', '$timeout', 'dealerAudit_ConstantsConst', 'logsFctry', function($cordovaSQLite, $q, $timeout, dealerAudit_ConstantsConst, logsFctry) {
	try {
		var TagName = "modifyDealerDbFactory";
		//console.log("Info" + TagName + " Entered in the module dealerAudit.ModifyDealerModuleDB");
		logsFctry.logsDisplay('INFO', TagName, 'Entered in the module dealerAudit.ModifyDealerModuleDB');

		return {
			/**
			 * @function saveDealerInfo
			 * @description Function which saves the dealer information in local DB.
			 */
			saveDealerInfo: function(dealerData) {

				//console.log("Info " + TagName + "Entered into saveDealerInfo");
				logsFctry.logsDisplay('INFO', TagName, 'Entered into saveDealerInfo');
				//console.log("Debug " + TagName + "Dealer data information" + JSON.stringify(dealerData));
				logsFctry.logsDisplay('DEBUG', TagName, "Dealer data information" + JSON.stringify(dealerData));

				var insertQuery = "INSERT OR REPLACE INTO Dealer_Master(dealer_name ,address ,post_code ,province , email ,phone ,network ,pos_code , holding_code,tts_name, payee_code ,holding_name ,city_name ,country_name ,participating_tf , createdBy , modified_date , modified_time, payer_code, isServerRecord) VALUES";

				if(typeof(dealerData.participating_tf) == "undefined" || dealerData.participating_tf == null) {
					dealerData.participating_tf = 0;
				} else {
					if(dealerData.participating_tf == "" || dealerData.participating_tf == "No") {
						dealerData.participating_tf = 0;
					} else {
						dealerData.participating_tf = 1;
					}
				}

				if(typeof(dealerData.holding_code) == undefined || dealerData.holding_code == null) {
					dealerData.holding_code = "";
				}

				if(typeof(dealerData.tts_name) == undefined || dealerData.tts_name == null) {
					dealerData.tts_name = "";
				}

				if(typeof(dealerData.country_name) == undefined || dealerData.country_name == null) {
					dealerData.country_name = "";
				}
				if(typeof(dealerData.city_name) == undefined || dealerData.city_name == null) {
					dealerData.city_name = "";
				}
				if(typeof(dealerData.address) == undefined || dealerData.address == null) {
					dealerData.address = "";
				}
				if(typeof(dealerData.post_code) == undefined || dealerData.post_code == null) {
					dealerData.post_code = "";
				}
				if(typeof(dealerData.province) == undefined || dealerData.province == null) {
					dealerData.province = "";
				}
				if(typeof(dealerData.email) == undefined || dealerData.email == null) {
					dealerData.email = "";
				}
				if(typeof(dealerData.phone) == undefined || dealerData.phone == null) {
					dealerData.phone = "";
				}
				if(typeof(dealerData.network) == undefined || dealerData.network == null) {
					dealerData.network = "";
				}
				if(typeof(dealerData.pos_code) == undefined || dealerData.pos_code == null) {
					dealerData.pos_code = "";
				}
				if(typeof(dealerData.payee_code) == undefined || dealerData.payee_code == null) {
					dealerData.payee_code = "";
				}
				if(typeof(dealerData.holding_name) == undefined || dealerData.holding_name == null) {
					dealerData.holding_name = "";
				}
				if(typeof(dealerData.createdBy) == undefined || dealerData.createdBy == null) {
					dealerData.createdBy = "";
				} else {
					dealerData.createdBy = dealerAudit_ConstantsConst.TTS_Name;
				}
				if(typeof(dealerData.modified_date) == undefined || dealerData.modified_date == null) {
					dealerData.modified_date = null;
				}
				if(typeof(dealerData.modified_time) == undefined || dealerData.modified_time == null) {
					dealerData.modified_time = "";
				}
				if(typeof(dealerData.payer_code) == undefined || dealerData.payer_code == null) {
					dealerData.payer_code = "";
				}

				insertQuery += "('" + dealerData.dealer_name.toLowerCase() + "','" + dealerData.address + "','" + dealerData.post_code + "','" + dealerData.province + "','" +
					dealerData.email + "','" + dealerData.phone + "','" + dealerData.network + "','" + dealerData.pos_code + "','" + dealerData.holding_code + "','" + dealerData.tts_name + "','" +
					dealerData.payee_code + "','" + dealerData.holding_name + "','" + dealerData.city_name + "','" + dealerData.country_name + "','" + dealerData.participating_tf + "','" +
					dealerData.createdBy + "','" + dealerData.modified_date + "','" + dealerData.modified_time + "','" + dealerData.payer_code + "','" + 0 + "')";

				return $q.when($cordovaSQLite.execute(db, insertQuery).then(function(res) {
					insertQuery = "";
					//console.log("Insert into DB successful" + JSON.stringify(res));
					logsFctry.logsDisplay('DEBUG', TagName, "Insert into Dealer_Master DB successful" + JSON.stringify(res));
					return true;

				}, function(error) {
					//console.log("Insert into DB failed" + JSON.stringify(error));
					logsFctry.logsDisplay('DEBUG', TagName, "Insert into Dealer_Master DB failed" + JSON.stringify(error));
					return false;
				}));
			},

			/**
			 * @function modifyDealerInformation
			 * @description Once the locally created dealer is synced , remove the flag which indicates it is a local record.
			 */
			modifyDealerInformation: function() {
				logsFctry.logsDisplay('INFO', TagName, 'Entered into modifyDealerInformation');

				var selectItemQuery = "SELECT * from Dealer_Master where isServerRecord=" + 0;
				//var selectItemQuery = "SELECT * from Dealer_Master";

				return new Promise(function(resolve, reject) {
					$cordovaSQLite.execute(db, selectItemQuery).then(function(res) {

						console.log("Result value " + res);
						console.log("Result value " + JSON.stringify(res));

						if(res.rows.length > 0) {

							logsFctry.logsDisplay('DEBUG', TagName, 'Number of offline created records :' + res.rows.length);

							dealerArray = [];

							for(var i = 0; i < res.rows.length; i++) {

								dealerArray.push(res.rows.item(i));

								console.log("Dealer Array values : " + dealerArray[i]);
								console.log("Dealer Array values : " + JSON.stringify(dealerArray[i]));
								console.log("Dealer ID : " + dealerArray[i].dealer_id);

								var updateQuery = "UPDATE Dealer_Master SET isServerRecord=" + 1 + " WHERE dealer_id=" + dealerArray[i].dealer_id;

								$cordovaSQLite.execute(db, updateQuery).then(function(res) {
									updateQuery = "";
									resolve(true);
								}, function(error) {
									logsFctry.logsDisplay('DEBUG', TagName, "Update Dealer_Master DB failed" + JSON.stringify(error));
									reject(false);
								});
							}
						} else {
							reject(false);
						}
					}, function(error) {
						logsFctry.logsDisplay('DEBUG', TagName, "SELECT Dealer_Master DB failed" + JSON.stringify(error));
						reject(false);
					})
				})
			},

			/**
			 * @function checkIfDealerExists
			 * @description Function to avoid dealer duplication in local DB.
			 */
			checkIfDealerExists: function(dealerName) {
				logsFctry.logsDisplay('INFO', TagName, 'Entered into function checkIfDealerExists');
				console.log("Entered into function checkIfDealerExists");

				var selectItemQuery = "SELECT * FROM Dealer_Master WHERE dealer_name= '" + dealerName.toLowerCase() + "'";

				// "SELECT UserID FROM User WHERE EmailAddress = '" + eCasing_ConstantsConst.userName + "' ";

				return new Promise(function(resolve, reject) {
					$cordovaSQLite.execute(db, selectItemQuery).then(function(res) {
						if(res.rows.length > 0) {
							console.log("There is a dealer present with that name");
							resolve(true);
						} else {
							console.log("No dealer present with that name");
							resolve(false);
						}
					}, function(error) {
						logsFctry.logsDisplay('DEBUG', TagName, "SELECT Dealer_Master DB failed in checkIfDealerExists" + JSON.stringify(error));
						reject(false);
					})
				})
			}
		};

	} catch(error) {
		//console.log("Error" + TagName + "Error in the module dealerAudit.ModifyDealerModuleDB");
		logsFctry.logsDisplay('Error', TagName, "Error in the module dealerAudit.ModifyDealerModuleDB" + error);
	}
}])