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

	function downloadDealer() {
		return new Promise(function(resolve, reject) {
			$rootScope.session.getClientObjectType("dealers").then(function(clientObjectType) {
				clientObjectType.search("dealers", 0, -1, null, null, null, null, null, null, false).then(function(response) {
					logsFctry.logsDisplay('INFO', TagName, 'Client object dealers search get successful');
					console.log("Dealer data successfully downloaded -- ");
					console.log("Numer of dealers -- " + response.length);

					// Insert dealer data in local DB only if there are dealers present.
					if(response.length > 0) {
						if(syncManageDbfctry.deleteDealerData()) {
							syncManageDbfctry.insertDealerData(response).then(function(dealerResponse) {
								if(dealerResponse === dealerAudit_ConstantsConst.success) {
									resolve(dealerAudit_ConstantsConst.success);
								}
							});
						}
					}

					// If there are no dealers to download the user should still be allowed to login.
					// Because the user can create dealers in offline mode.
					else if(response.length == 0) {

						// Delete data from the local DB when there are no dealers found.
						syncManageDbfctry.deleteDealerData();
						resolve(dealerAudit_ConstantsConst.noContent);
					} else {
						reject(dealerAudit_ConstantsConst.failure);
					}

				}, function(error) {

					var message = "";
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object dealers' + JSON.stringify(error));

					// This message will be displayed if no dealers are present. Else a generic message is displayed.
					if(error.code == 55 && error.message == "No Content") {
						syncManageDbfctry.deleteDealerData();
						resolve(dealerAudit_ConstantsConst.noContent);
					} else {
						reject(dealerAudit_ConstantsConst.failure);
					}
				})
			}, function(error) {
				logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));
				reject(dealerAudit_ConstantsConst.failure);
			})
		});
	}

	function downloadQuestionnaire(templateId) {
		return new Promise(function(resolve, reject) {
			$rootScope.session.getClientObjectType("question").then(function(clientObjectType) {

				var filterParams = {
					"template_id": templateId,
				};

				clientObjectType.search("question", 0, -1, filterParams, null, null, null, null, null, false).then(function(response) {

					console.log("Get client object questions successful");
					console.log("Number of questionnaire's for template id " + templateId + " are " + response.length);

					if(response.length > 0) {

						if(syncManageDbfctry.deleteQuestionnaireData()) {
							syncManageDbfctry.insertQuestionnaireData(response).then(function(response) {
								if(response == dealerAudit_ConstantsConst.success) {
									resolve(dealerAudit_ConstantsConst.success);
								} else {
									resolve(dealerAudit_ConstantsConst.failure);
								}
							}, function(error) {
								console.log("records not inserted into Questionnaire table due to error" + JSON.stringify(error));
								logsFctry.logsDisplay('ERROR', TagName, 'Error in inserting questionnaires' + JSON.stringify(error));

								syncManageDbfctry.deleteQuestionnaireData();
								reject(dealerAudit_ConstantsConst.failure);
							});
						}
					}

					// If there are no questions then the below condition will execute.
					if(response.length == 0) {
						resolve(dealerAudit_ConstantsConst.noContent);
					}

				}, function(error) {
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));

					if(error.code == 55 && error.message == "No Content") {
						resolve(dealerAudit_ConstantsConst.noContent);
					} else {
						reject(dealerAudit_ConstantsConst.failure);
					}

				})
			}, function(error) {
				logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));
				console.log("Data could not be uploaded" + error + message);
				reject(dealerAudit_ConstantsConst.failure);
			})
		});
	}

	function downloadTTSInformation() {
		return new Promise(function(resolve, reject) {
			$rootScope.session.getClientObjectType("TTS_master").then(function(clientObjectType) {

				var filterParams = {
					"tts_name": dealerAudit_ConstantsConst.TTS_Name,
				};

				clientObjectType.search("TTS_master", 0, -1, filterParams, null, null, null, null, null, false).then(function(response) {

					console.log("Get client object TTS_master successful");
					console.log("Number of TAM's " + response.length);
					console.log("TAM information " + response);

					if(response.length > 0) {
						syncManageDbfctry.insertTTSInformation(response).then(function(response) {
							if(response.toString().length > 0) {
								resolve(response);
							} else {
								resolve(dealerAudit_ConstantsConst.failure);
							}

						}, function(error) {
							console.log("Records not inserted into TTS_master table due to error" + JSON.stringify(error));
							logsFctry.logsDisplay('ERROR', TagName, 'Error in inserting TTS information' + JSON.stringify(error));

							reject(dealerAudit_ConstantsConst.failure);
						})
					}

				}, function(error) {
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));

					if(error.code == 55 && error.message == "No Content") {
						resolve(dealerAudit_ConstantsConst.noContent);
					} else {
						reject(dealerAudit_ConstantsConst.failure);
					}

				})
			}, function(error) {
				logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));
				console.log("Data could not be uploaded" + error + message);
				reject(dealerAudit_ConstantsConst.failure);
			})
		});
	}

	function downloadTemplateInformation(tam_name) {
		return new Promise(function(resolve, reject) {
			$rootScope.session.getClientObjectType("template_master").then(function(clientObjectType) {
				var filterParams = {
					"tam_name": tam_name,
					"status": "Published"
				};

				clientObjectType.search("template_master", 0, -1, filterParams, null, null, null, null, null, false).then(function(response) {
					console.log("Get client object template_master successful");
					console.log("Number of Templates : " + response.length);

					if(response.length > 0) {
						syncManageDbfctry.insertTemplateInformation(response).then(function(templateResponse) {
							if(templateResponse == dealerAudit_ConstantsConst.success) {
								resolve(dealerAudit_ConstantsConst.success);
							}
						}, function(error) {
							console.log("Records not inserted into template_master table due to error" + JSON.stringify(error));
							logsFctry.logsDisplay('ERROR', TagName, 'Error in inserting template_master information' + JSON.stringify(error));

							reject(dealerAudit_ConstantsConst.failure);
						})
					}
				}, function(error) {
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));

					if(error.code == 55 && error.message == "No Content") {
						resolve(dealerAudit_ConstantsConst.noContent);
					} else {
						reject(dealerAudit_ConstantsConst.failure);
					}

				})

			}, function(error) {
				logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type template_master' + JSON.stringify(error));
				reject(dealerAudit_ConstantsConst.failure);
			})
		})
	}

	return {

		/**
		 * @function getDealerData
		 * @description Fucntion to download dealer information from Halomem.
		 */
		downloadDealerData: function() {
			var dealerList = [];
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function downloadDealerData');

			return new Promise(function(resolve, reject) {
				downloadDealer().then(function(response) {
					if(response == dealerAudit_ConstantsConst.success) {
						resolve(dealerAudit_ConstantsConst.success);
					}

					if(response == dealerAudit_ConstantsConst.noContent) {
						resolve(dealerAudit_ConstantsConst.noContent);
					}

				}, function(error) {
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type dealers' + JSON.stringify(error));
					reject(dealerAudit_ConstantsConst.failure);
				})
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
		 * @function updateDealerData
		 * @description Fucntion to update dealer information from Halomem.
		 */
		updateDealerData: function(dealerData) {
			//var dealerData = [];
			// var dealer_id= $rootScope.dealerData.dealer_id;
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function updateDealerData');

			$rootScope.session.getClientObjectType("dealers").then(function(clientObjectType) {
					console.log("Client object type acquired.");
					console.log("Creating/updating data ...");


					clientObjectType.get(dealerData.dealer_id).then(function(response) {
							console.log('response inside update==>' + JSON.stringify(response));

							console.log('dealerData ==>' + JSON.stringify(dealerData));
							response.update(dealerData).then(function(success) {
									if(success) {

										console.log("Dealer information Could updated" + success);
									} else {


										console.log("Dealer information Could not be updated" + success);
									}
								},
								function(error) {

									console.log("Update dealer information failed " + JSON.stringify(error));
								})
						},
						function(error) {
							//$rootScope.shouldShowTyre = false;
							console.log("Could not get the client obejct" + JSON.stringify(error));
						});

				},
				function(error) {
					//$rootScope.shouldShowTyre = false;
					console.log("Could not get the client obejct" + JSON.stringify(error));
				})

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

		/**
		 * @function howManyDaysOldData
		 * @description Download questionnaire data required for Audit.
		 */
		downloadQuestionnaireData: function(templateId) {
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function downloadQuestionnaire');

			return new Promise(function(resolve, reject) {
				downloadQuestionnaire(templateId).then(function(response) {
					if(response == dealerAudit_ConstantsConst.success || response == dealerAudit_ConstantsConst.noContent) {
						// resolve(dealerAudit_ConstantsConst.success);
						// This is a test method to populate the questionnaire result in JSON format.
						// syncManageDbfctry.getQuestionnaireObject().then(function(response) {
						// 	if(response.length > 0) {
						// 		resolve(response);
						// 	}
						// })

						resolve(response);

					}

					if(response == dealerAudit_ConstantsConst.noContent) {
						resolve(response);
					}
				}, function(error) {
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting client object type question' + JSON.stringify(error));
					reject(dealerAudit_ConstantsConst.failure);
				})
			})
		},

		/**
		 * @function downloadMasterData
		 * @description Download all the master data required for the application.
		 */
		downloadMasterData: function() {
			logsFctry.logsDisplay('INFO', TagName, 'Entered into function downloadMasterData');

			return new Promise(function(resolve, reject) {
				downloadTTSInformation().then(function(ttsResponse) {
					if(ttsResponse.toString().length > 0) {
						console.log("Successfully inserted TTS information");
						console.log("The TTS belongs to TAM  " + ttsResponse);

						downloadTemplateInformation(ttsResponse).then(function(templateResponse) {
							if(templateResponse == dealerAudit_ConstantsConst.success) {
								downloadDealer().then(function(dealerResponse) {
									if(dealerResponse == dealerAudit_ConstantsConst.success || dealerResponse == dealerAudit_ConstantsConst.noContent) {
										// downloadQuestionnaire().then(function(questionnaireResponse) {
										// 	console.log("Questionnaire response" + questionnaireResponse);
										// 	if(questionnaireResponse == dealerAudit_ConstantsConst.success || questionnaireResponse == dealerAudit_ConstantsConst.noContent) {
										// 		resolve(dealerAudit_ConstantsConst.success);
										// 	}
										// }, function(error) {
										// 	console.log("Download questionnaire failed." + JSON.stringify(error));
										// 	logsFctry.logsDisplay('ERROR', TagName, 'Error in downloading questionnaire' + JSON.stringify(error));
										// 	reject(dealerAudit_ConstantsConst.failure);
										// })
										resolve(dealerAudit_ConstantsConst.success);
									} else {
										resolve(dealerAudit_ConstantsConst.failure);
									}
								}, function(error) {
									logsFctry.logsDisplay('ERROR', TagName, 'Error in getting dealers - downloadMasterData' + JSON.stringify(error));
									reject(dealerAudit_ConstantsConst.failure);
								})
							}
						}, function(error) {
							logsFctry.logsDisplay('ERROR', TagName, 'Error in getting Template information' + JSON.stringify(error));
							reject(dealerAudit_ConstantsConst.failure);
						})
					}
				}, function(error) {
					reject(dealerAudit_ConstantsConst.failure);
					logsFctry.logsDisplay('ERROR', TagName, 'Error in getting TTS information' + JSON.stringify(error));
				})
			})
		},
	};
});
