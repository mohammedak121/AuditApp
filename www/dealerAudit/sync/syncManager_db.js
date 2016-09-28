/**
 * @class dealerAudit.syncManagerModuleDB
 * @description This module includes functionalities for fetching data from Hallomem and inserting it into local DB.
 */
/**
 * @function syncManageDbfctry
 * @param {ScopeElemet} $rootScope defines scope of an elemet or function.
 * @param {Service} $cordovaSQLite provides db storage.
 * @param {Service} $q  it helps to run functions asynchronously.
 * @param {Service} $timeout provides timeout execution.
 * @param {Constants} dealerAudit_ConstantsConst provides all the constants.
 * @param {Service} logsFctry used for logging information.
 * @description Function to inserting data to db.
 */

angular.module('dealerAudit.syncManagerModuleDB', []).factory('syncManageDbfctry', function($rootScope, $cordovaSQLite, $q, $timeout, dealerAudit_ConstantsConst, logsFctry) {
	try {
		var TagName = "syncManageDbfctry";
		console.log('Entered into module eCasing.syncManagerModuleDB');
		logsFctry.logsDisplay('INFO', TagName, 'Entered in module dealerAudit.syncManagerModuleDB');

		/**
		 * @function groupByMultipleFields
		 * @description Function to group elements by values.
		 */
		_.groupByMultipleFields = function(obj, values, context) {
			if(!values.length)
				return obj;
			var byFirst = _.groupBy(obj, values[0], context),
				rest = values.slice(1);
			for(var prop in byFirst) {
				byFirst[prop] = _.groupByMultipleFields(byFirst[prop], rest, context);
			}
			return byFirst;
		};

		return {
			/**
			 * @function insertDealerData
			 * @param {String} dealerData returned by the HaloMEM.
			 * @description function which inserts Dealer data to "dealers" table.
			 */
			insertDealerData: function(dealerData) {
				try {

					var tempLoop = 0;
					console.log("Entered into function insertDealerData");
					logsFctry.logsDisplay('INFO', TagName, 'Entered in function insertDealerData');

					// var insertQuery = "INSERT OR REPLACE INTO dealers(dealer_Id, dealer_name, address, postcode, province, email, phone, network, pos_code, payee_code, holding_name, city, country, participating_tf, createdBy , modified_date , modified_time , payer_code , isServerRecord ) VALUES";

					return new Promise(function(resolve, reject) {
						for(var i = 0; i < dealerData.length; i++) {

							var insertQuery = "INSERT OR REPLACE INTO dealers(dealer_Id, dealer_name, address, post_code, province, email, phone, network, pos_code,tts_name, payee_code, holding_name, city_name, country_name, participating_tf, createdBy , modified_date , modified_time , payer_code , isServerRecord ) VALUES";

							if(typeof(dealerData[i].data.tts_name) == "undefined" || dealerData[i].data.tts_name == null) {
								dealerData[i].data.tts_name = "";
							}

							if(typeof(dealerData[i].data.country_name) == "undefined" || dealerData[i].data.country_name == null) {
								dealerData[i].data.country_name = "";
							}
							if(typeof(dealerData[i].data.city_name) == "undefined" || dealerData[i].data.city_name == null) {
								dealerData[i].data.city_name = "";
							}
							if(typeof(dealerData[i].data.address) == "undefined" || dealerData[i].data.address == null) {
								dealerData[i].data.address = "";
							}
							if(typeof(dealerData[i].data.post_code) == "undefined" || dealerData[i].data.post_code == null) {
								dealerData[i].data.post_code = "";
							}
							if(typeof(dealerData[i].data.province) == "undefined" || dealerData[i].data.province == null) {
								dealerData[i].data.province = "";
							}
							if(typeof(dealerData[i].data.email) == "undefined" || dealerData[i].data.email == null) {
								dealerData[i].data.email = "";
							}
							if(typeof(dealerData[i].data.phone) == "undefined" || dealerData[i].data.phone == null) {
								dealerData[i].data.phone = "";
							}
							if(typeof(dealerData[i].data.phone) == "undefined" || dealerData[i].data.phone == null) {
								dealerData[i].data.phone = "";
							}
							if(typeof(dealerData[i].data.network) == "undefined" || dealerData[i].data.network == null) {
								dealerData[i].data.network = "";
							}
							if(typeof(dealerData[i].data.pos_code) == "undefined" || dealerData[i].data.pos_code == null) {
								dealerData[i].data.pos_code = "";
							}
							if(typeof(dealerData[i].data.payee_code) == "undefined" || dealerData[i].data.payee_code == null) {
								dealerData[i].data.payee_code = "";
							}
							if(typeof(dealerData[i].data.holding_name) == "undefined" || dealerData[i].data.holding_name == null) {
								dealerData[i].data.holding_name = "";
							}
							if(typeof(dealerData[i].data.createdBy) == "undefined" || dealerData[i].data.createdBy == null) {
								dealerData[i].data.createdBy = "";
							}
							if(typeof(dealerData[i].data.modified_date) == "undefined" || dealerData[i].data.modified_date == null) {
								dealerData[i].data.modified_date = "";
								// var insertQuery = "INSERT OR REPLACE INTO dealers(dealer_Id, dealer_name, address, postcode, province, email, phone, network, pos_code, payee_code, holding_name, city, country, participating_tf, createdBy , modified_time , payer_code , isServerRecord ) VALUES";
								// insertQuery += "('" + dealerData[i].getData().dealer_id + "','" + dealerData[i].getData().dealer_name + "','" + dealerData[i].getData().address + "','" + dealerData[i].getData().postcode + "','" + dealerData[i].getData().province + "','" +
								// 	dealerData[i].getData().email + "','" + dealerData[i].getData().phone + "','" + dealerData[i].getData().network + "','" + dealerData[i].getData().pos_code + "','" +
								// 	dealerData[i].getData().payee_code + "','" + dealerData[i].getData().holding_name + "','" + dealerData[i].getData().city + "','" + dealerData[i].getData().country + "','" + dealerData[i].getData().participant_TF + "','" +
								// 	dealerData[i].getData().createdBy + "','" + dealerData[i].getData().modified_time + "','" + dealerData[i].getData().payer_code + "','" + 1 + "')";
							}

							if(typeof(dealerData[i].data.modified_time) == "undefined" || dealerData[i].data.modified_time == null) {
								dealerData[i].data.modified_time = "";
							}
							if(typeof(dealerData[i].data.payer_code) == "undefined" || dealerData[i].data.payer_code == null) {
								dealerData[i].data.payer_code = "";
							}

							insertQuery += "('" + dealerData[i].getData().dealer_id + "','" + dealerData[i].getData().dealer_name + "','" + dealerData[i].getData().address + "','" + dealerData[i].getData().post_code + "','" + dealerData[i].getData().province + "','" +
								dealerData[i].getData().email + "','" + dealerData[i].getData().phone + "','" + dealerData[i].getData().network + "','" + dealerData[i].getData().pos_code + "','" + dealerData[i].getData().tts_name + "','" +
								dealerData[i].getData().payee_code + "','" + dealerData[i].getData().holding_name + "','" + dealerData[i].getData().city_name + "','" + dealerData[i].getData().country_name + "','" + dealerData[i].getData().participant_TF + "','" +
								dealerData[i].getData().createdBy + "','" + dealerData[i].getData().modified_date + "','" + dealerData[i].getData().modified_time + "','" + dealerData[i].getData().payer_code + "','" + 1 + "')";

							$cordovaSQLite.execute(db, insertQuery).then(function(res) {
								insertQuery = "";
								tempLoop = tempLoop + 1;
								//console.log("insertQueryExecuteCount success response" + JSON.stringify(res));
								logsFctry.logsDisplay('DEBUG', TagName, 'insertQueryExecuteCount success response');

								if(tempLoop == dealerData.length) {
									resolve(dealerAudit_ConstantsConst.success);
								}

							}, function(error) {
								console.log("insertQueryExecuteCount error response" + JSON.stringify(error));
								logsFctry.logsDisplay('DEBUG', TagName, 'insertQueryExecuteCount error response');

								if(tempLoop < dealerData.length) {
									reject(dealerAudit_ConstantsConst.failure);
								}
							});
						}
					})
				} catch(error) {
					//console.log("Error in function insertDealerData " + error);
					logsFctry.logsDisplay('ERROR', TagName, 'Error in function insertDealerData' + JSON.stringify(error));
					return error;
				}
			},

			/**
			 * @function getDealerData
			 * @description function which gets all Dealer data from local dealers table.
			 */
			getDealerData: function() {
				try {

					var dealerData = [];
					console.log("Entered into function getDealerData");
					logsFctry.logsDisplay('INFO', TagName, 'Entered into function getDealerData');

					// Fetch all the dealer records which are local DB records.
					var selectQuery = "SELECT * from dealers where isServerRecord =" + 0;
					return $q.when($cordovaSQLite.execute(db, selectQuery).then(function(res) {
						if(res.rows.length > 0) {

							for(var i = 0; i < res.rows.length; i++) {
								dealerData.push(res.rows.item(i));
							}

							return dealerData;
						} else {
							return dealerData;
						}
					}))

				} catch(error) {
					//console.log("Error in function getDealerData " + error);
					logsFctry.logsDisplay('ERROR', TagName, 'Error in function getDealerData' + JSON.stringify(error));
					return error;
				}
			},

			/**
			 * @function getOfflineLoginInfo
			 * @description function will return offline date and time information
			 */
			getOfflineLoginInfo: function() {
				var query = "SELECT * FROM AppData WHERE UserID LIKE '" + dealerAudit_ConstantsConst.TTS_Name + "%' AND AppKey LIKE'" + dealerAudit_ConstantsConst.lastOfflineLoginKey + "%'";
				return $q.when($cordovaSQLite.execute(db, query));

			},

			/**
			 * @function getOnlineLoginInfo
			 * @description function will return online date and time information
			 */
			getOnlineLoginInfo: function() {
				var query = "SELECT * FROM AppData WHERE UserID LIKE '" + dealerAudit_ConstantsConst.TTS_Name + "%' AND AppKey LIKE'" + dealerAudit_ConstantsConst.lastOnlineLoginKey + "%'";
				return $q.when($cordovaSQLite.execute(db, query));

			},

			/**
			 * @function deleteDealerData
			 * @description Functoin to delete data locally from DB.
			 */
			deleteDealerData: function() {

				logsFctry.logsDisplay('INFO', TagName, "Entered into the function deleteDealerData");
				var deleteQuery = "DELETE FROM dealers WHERE isServerRecord=" + 1;

				$cordovaSQLite.execute(db, deleteQuery);
				return true;
			},

			/**
			 * @function insertQuestionnaireData
			 * @description Insert Questionnaire data.
			 */
			insertQuestionnaireData: function(questionnaireData) {

				var tempLoop = 0;
				logsFctry.logsDisplay('INFO', TagName, "Entered into the function insertQuestionnaireData");

				return new Promise(function(resolve, reject) {
					for(var i = 0; i < questionnaireData.length; i++) {

						var insertQuery = "INSERT OR REPLACE INTO question_master(question_text , header_text , sub_header_text , question_version , question_id , position_id ,template_id ,question_typ ,mandatory_field ,status ,minimum_value ,maximum_value ) VALUES";

						var questionText = questionnaireData[i].data.question_text;
						questionText = questionText.replace(/'/g, "");

						insertQuery += "('" + questionText + "','" + questionnaireData[i].getData().header_text + "','" + questionnaireData[i].getData().sub_header_text + "','" + questionnaireData[i].getData().question_version + "','" + questionnaireData[i].getData().question_id + "','" +
							questionnaireData[i].getData().position_id + "','" + questionnaireData[i].getData().template_id + "','" + questionnaireData[i].getData().question_typ + "','" + questionnaireData[i].getData().mandatory_field + "','" + questionnaireData[i].getData().status + "','" +
							questionnaireData[i].getData().minimum_value + "','" + questionnaireData[i].getData().maximum_value + "')";

						$cordovaSQLite.execute(db, insertQuery).then(function(res) {
							insertQuery = "";
							tempLoop = tempLoop + 1;

							logsFctry.logsDisplay('DEBUG', TagName, 'insertQueryExecuteCount success response');

							if(tempLoop == questionnaireData.length) {
								resolve(dealerAudit_ConstantsConst.success);
							}

						}, function(error) {
							console.log("insertQueryExecuteCount error response" + JSON.stringify(error));
							logsFctry.logsDisplay('DEBUG', TagName, 'insertQueryExecuteCount error response');

							if(tempLoop < questionnaireData.length) {
								reject(dealerAudit_ConstantsConst.failure);
							}
						});
					}
				});
			},

			/**
			 * @function deleteQuestionnaireData
			 * @description If in case the insert fails , delete the data which is already present.
			 */
			deleteQuestionnaireData: function() {
				logsFctry.logsDisplay('INFO', TagName, "Entered into the function deleteQuestionnaireData");
				var deleteQuery = "DELETE FROM question_master";

				$cordovaSQLite.execute(db, deleteQuery);
				return true;
			},

			/**
			 * @function insertTamInformation
			 * @description Insert TAM information based on the logged in TTS.
			 */
			insertTTSInformation: function(tamData) {

				var tempLoop = 0;
				logsFctry.logsDisplay('INFO', TagName, "Entered into the function insertTTSInformation");
				console.log("Entered into the function insertTTSInformation");

				return new Promise(function(resolve, reject) {
					for(var i = 0; i < tamData.length; i++) {
						var insertQuery = "INSERT OR REPLACE INTO  TTS_master(first_name , last_name , email , tam_name , tts_name ) VALUES";

						insertQuery += "('" + tamData[i].getData().first_name + "','" + tamData[i].getData().last_name + "','" + tamData[i].getData().email + "','" + tamData[i].getData().tam_name + "','" +
							tamData[i].getData().tts_name + "')";

						var tamName = tamData[i].getData().tam_name;

						$cordovaSQLite.execute(db, insertQuery).then(function(res) {
							insertQuery = "";
							tempLoop = tempLoop + 1;

							logsFctry.logsDisplay('DEBUG', TagName, 'insertQueryExecuteCount success response');

							if(tempLoop == tamData.length) {
								console.log("Tam name before resolving " + tamName);
								resolve(tamName);
							}

						}, function(error) {
							console.log("insertQueryExecuteCount error response" + JSON.stringify(error));
							logsFctry.logsDisplay('DEBUG', TagName, 'insertQueryExecuteCount error response');

							if(tempLoop < tamData.length) {
								reject(dealerAudit_ConstantsConst.failure);
							}
						});
					}
				})
			},

			/**
			 * @function insertTemplateInformation
			 * @description Insert Template information based on the logged in TTS and the template status published.
			 */
			insertTemplateInformation: function(templateData) {

				var tempLoop = 0;
				logsFctry.logsDisplay('INFO', TagName, "Entered into the function insertTemplateInformation");

				return new Promise(function(resolve, reject) {
					for(var i = 0; i < templateData.length; i++) {
						var insertQuery = "INSERT OR REPLACE INTO template_master(country_id , country_name , creation_date , language_id , language_name , status, tam_id , tam_name , template_id , template_name) VALUES";

						insertQuery += "('" + templateData[i].getData().country_id + "','" + templateData[i].getData().country_name + "','" + templateData[i].getData().creation_date + "','" + templateData[i].getData().language_id + "','" + templateData[i].getData().language_name + "','" + templateData[i].getData().status + "','" +
							templateData[i].getData().tam_id + "','" + templateData[i].getData().tam_name + "','" + templateData[i].getData().template_id + "','" + templateData[i].getData().template_name + "')";

						$cordovaSQLite.execute(db, insertQuery).then(function(res) {
							insertQuery = "";
							tempLoop = tempLoop + 1;

							logsFctry.logsDisplay('DEBUG', TagName, 'insertTemplateInformation QueryExecuteCount success response');

							if(tempLoop == templateData.length) {
								resolve(dealerAudit_ConstantsConst.success);
							}

						}, function(error) {
							console.log("insertTemplateInformation query error response" + JSON.stringify(error));
							logsFctry.logsDisplay('DEBUG', TagName, 'insertTemplateInformation query error response');

							if(tempLoop < templateData.length) {
								reject(dealerAudit_ConstantsConst.failure);
							}
						});
					}
				})
			}
		}

	} catch(error) {
		//console.log("Error in module dealerAudit.syncManagerModuleDB " + error);
		logsFctry.logsDisplay('ERROR', TagName, 'Error in module dealerAudit.syncManagerModuleDB' + JSON.stringify(error));
		return error;
	}
});
