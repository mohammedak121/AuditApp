/**

 * @class dealerAudit.settingsDbModuleDB

 * @description This module includes database functionalities for setting pin.

 */



 /**

  * @function settingsDbfctry

  * @param {Service} $cordovaSQLite  provides db storage

  * @param {Service} $q  it helps to run functions asynchronously.

  * @param {Service} $timeout provides timeout function

  * @param {Constants} dealerAudit_ConstantsConst  provides all the constants.

  * @description Function to storing pin to db

  */
angular.module('dealerAudit.settingsDbModuleDB', []).factory('settingsDbfctry', function($cordovaSQLite, $q, $timeout, dealerAudit_ConstantsConst,$rootScope) {

	try {

		console.log('Entered into module dealerAudit.settingsDbModuleDB');


		return {




			/**

			 * @memberof settingsDbfctry

			 * @function countRecords

			 * @param {String} callback Holds fucntion to call back after executing getPin function

			 * @desc function which gets the number of records in the User_Master  table  to check the one of the condition for first time login

			 */

			countRecords : function(callback) {

				try {

					var count = [];


					console.log('Entered into funtion countRecords');

					var query = "SELECT  COUNT(TTS_Name) as UserName FROM  User_Master ";

					return $q.when($cordovaSQLite.execute(db, query).then(function(res) {

						if (res.rows.length > 0) {



							for (var i = 0; i < res.rows.length; i++) {



								count.push(res.rows.item(i));

							}


						} else {

							console.log("No results found");

						}


						console.log('here::' + JSON.stringify(count));

						return count;



					}));

				} catch(e) {

					console.log('Error in countRecords:: ' + e);

				}

				console.log("Exited countRecords");

			},


			/**

			 * @memberof settingsDbfctry

			 * @function SetLanguage

			 * @param {String} TTS_Name Holds TTS_Name

			 * @param {Intiger} Language Holds the selected Language

			 * @desc function which inserts TTS_Name and Language to  Language  table

			 */

			SetLanguage : function(TTS_Name, Language) {

				try {

					console.log('Entered into function SetLanguage');


					var executeQuerry;

					var dbArray = [];
					//var UserID = null;

					//$timeout(function() {

						// var encryptedTTS_Name = Encrypt(TTS_Name);

					//	var Status = 0;


						//var encryptedPin = Encrypt(User_Pin);

						//$rootScope.EncryptedBytes = encryptedPin;
						//console.log("Encrypted Bytes" + $rootScope.EncryptedBytes);

						//var decryptedpin = Decrypt(encryptedPin);

						console.log('Entered into function SetLanguage');


						//console.log('insertUpdateFlag::' + insertUpdateFlag);



						var insertQuerry = "INSERT OR REPLACE INTO Language(Language,TTS_Name)";

												insertQuerry += " VALUES ('" + Language + "','" + TTS_Name + "') ";

												console.log("Insert query" + insertQuerry);

						//Querry to update a record of User_Master  Table for particular TTS_Name

						//var upDateQuerry = "UPDATE  Language  SET Language = '" + Language + "' WHERE TTS_Name = '" + TTS_Name + "' ";

					//	if (insertUpdateFlag != 0) {

						//	if (insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausInsert) {

								executeQuerry = insertQuerry;

						//	} else if (insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausUpdate) {

						//		executeQuerry = upDateQuerry;

					//		}

					//	}

						$cordovaSQLite.execute(db, executeQuerry).then(function(response){
							console.log('response ==>'+JSON.stringify(response));

						},function(e){
							console.log('error in set Language ===>'+JSON.stringify(e));

						});

						console.log("executeQuerry::" + executeQuerry);

				//	}, 4000)

					//Delay changed to 4000

				} catch(e) {

					console.log('Error in function SetLanguage' + e);


					//Handle error here

				}

				console.log('Exit from function SetLanguage');

			},

			/**

			 * @memberof settingsDbfctry

			 * @function SetPin

			 * @param {String} TTS_Name Holds TTS_Name

			 * @param {Intiger} User_Pin Holds the Entered pin

			 * @desc function which inserts TTS_Name and User_Pin to User_Master  table

			 */

			SetPin : function(TTS_Name, User_Pin,insertUpdateFlag) {

				try {

					console.log('Entered into function SetPin');


					var executeQuerry;

					var dbArray = [];
					var UserID = null;

					//$timeout(function() {

						// var encryptedTTS_Name = Encrypt(TTS_Name);

						var Status = 0;


						var encryptedPin = Encrypt(User_Pin);

						//$rootScope.EncryptedBytes = encryptedPin;
						//console.log("Encrypted Bytes" + $rootScope.EncryptedBytes);

						//var decryptedpin = Decrypt(encryptedPin);

						console.log('Entered into function SetPin');


						console.log('insertUpdateFlag::' + insertUpdateFlag);



						var insertQuerry = "INSERT OR REPLACE INTO User_Master(UserID,TTS_Name, TAM_ID,TAM_Name,User_Pin,Status)";

                        insertQuerry += " VALUES ('" + 2 + "','" + TTS_Name + "','" + 2  + "','" + "TAMName"  + "','" + encryptedPin + "','" + Status + "') ";

                        console.log("Insert query" + insertQuerry);

						//Querry to update a record of User_Master  Table for particular TTS_Name

						var upDateQuerry = "UPDATE  User_Master  SET User_Pin = '" + encryptedPin + "' WHERE TTS_Name = '" + TTS_Name + "' ";

						if (insertUpdateFlag != 0) {

							if (insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausInsert) {

								executeQuerry = insertQuerry;

							} else if (insertUpdateFlag == dealerAudit_ConstantsConst.User_PinStausUpdate) {

								executeQuerry = upDateQuerry;

							}

						}

						$cordovaSQLite.execute(db, executeQuerry).then(function(response){
							console.log('response ==>'+JSON.stringify(response));

						},function(e){
							console.log('error in set pin ===>'+JSON.stringify(e));

						});

						console.log("executeQuerry::" + executeQuerry);

				//	}, 4000)

					//Delay changed to 4000

				} catch(e) {

					console.log('Error in function SetPin' + e);


					//Handle error here

				}

				console.log('Exit from function SetPin');

			},

			/**

			 * @memberof settingsDbfctry

			 * @function CheckPin

			 * @param {String} TTS_Name Holds TTS_Name

			 * @desc function which checks for TTS_Name from User_Master  table

			 */

			 CheckPin : function(TTS_Name) {

				try {

					console.log('Entered into function CheckPin');


					query = "SELECT DISTINCT User_Pin FROM Customer WHERE TTS_Name = '" + TTS_Name + "' ";

					$cordovaSQLite.execute(db, query);

					console.log("Inserted the TTS_Name and  User_Pin into table User_Master  of the DB");


				} catch(e) {

					console.log('Error in function CheckPin' + e);


					//Handle error here

				}

				console.log('Exit from function CheckPin');


			},


			/**

			 * @memberof settingsDbfctry

			 * @function getPin

			 * @param {String} TTS_Name Holds TTS_Name

			 * @param {String} callback Holds fucntion to call back after executing getPin function

			 * @desc function return User_Master  pin for the TTS_Name passed from User_Master  table

			 */
			getPin : function(TTS_Name, callback) {

				try {

					var pinVal = [];

					console.log("Entered Into Function getPin");

					console.log('TTS_Name Inside getPin ::' + TTS_Name);

					var query = "SELECT  User_Pin FROM User_Master  WHERE TTS_Name = '" + TTS_Name + "' ";
					console.log("getpin query is"+ query);


					return $q.when($cordovaSQLite.execute(db, query).then(function(res) {

						if (res.rows.length > 0) {

							for (var i = 0; i < res.rows.length; i++) {
								pinVal.push(res.rows.item(i));
							}
							console.log('records found in getPin ==>'+JSON.stringify(pinVal));

						} else {
							console.log("No results found");

						}
						console.log('here::' + JSON.stringify(pinVal));


						return pinVal;

					},function(error){
						console.log('error in get pin===>'+JSON.stringify(error));

					}));

				} catch(e) {

					console.log("Error in getPin::" + e);


				}

			},

			/**

			 * @memberof settingsDbfctry

			 * @function updatePin

			 * @param {String} TTS_Name Holds TTS_Name

			 * @desc function which updates TTS_Name and User_Pin to User_Master  table

			 */

			updatePin : function(TTS_Name, callback) {

				var query = "SELECT  * FROM User_Master  WHERE TTS_Name = '" + TTS_Name + "' ";



				$cordovaSQLite.execute(db, query).then(function(res) {

					console.log("result :::" + res.rows.length);

					callback(res);

				}, function(err) {

					console.log('Function Failed getPin' + err);


					console.error(err);

				});

			},




			/**
						 * @function insertFileCreationTime
						 * @param {String} date log file creation date
						 * @description for saving log file creation date in the database.
						 */
						insertFileCreationTime : function(date, fileName, EmailAddress) {
							try {
								console.log('Entered into funtion insertOrUpdateLogFileCreationTime');
								LogStatus = 1;
								//if (CRN_Number == null || CRN_Number == '' || CRN_Number == undefined) {
								var insertLogFileCreationQuery = "INSERT OR REPLACE INTO Logs(LogFileCrationTime,LogFileName,EmailAddress,LogStatus) VALUES ";
								insertLogFileCreationQuery += "(" + date + " , '" + fileName + "','" + EmailAddress + "','" + LogStatus + "')";
								console.log("insertLogFileCreationQuery :::" + insertLogFileCreationQuery);

								$cordovaSQLite.execute(db, insertLogFileCreationQuery);

							} catch(e) {
								console.log('Error in insertOrUpdateLogFileCreationTime:: ' + e);

								return e;
							}
							console.log("Exited insertOrUpdateLogFileCreationTime");


						},

						/**
						 * @function updateFileCreationTime
						 * @param {String} liveTutotorialFlag holds updateFileCreationTime status
						 * @param {String} UserName holds  UserName
						 * @description for updating creation time in the database and this is for per user.
						 */
						updateFileCreationTime : function(date, fileName, EmailAddress) {
							try {
								console.log('Entered into funtion updateFileCreationTime::' + date);
								console.log('Entered into funtion updateFileCreationTime::' + EmailAddress);
								LogStatus = 1;
								//if (CRN_Number == null || CRN_Number == '' || CRN_Number == undefined) {
								var query = "UPDATE Logs SET LogFileCrationTime = '" + date + "', LogFileName ='" + fileName + "',LogStatus ='" + LogStatus + "' WHERE  EmailAddress =   '" + EmailAddress + "' ";
								console.log("updateFileCreationTimeQuerry :::" + query);
								$cordovaSQLite.execute(db, query);
							} catch(e) {
								console.log('Error in updateFileCreationTime:: ' + e);
								return e;
							}
							console.log("Exited updateFileCreationTime");

						},

						/**
						 * @function getLogFileCreationTime
						 * @description function for getting log file creation time from database.
						 */
						getLogFileCreationTime : function(EmailAddress) {
							try {
								console.log('Entered into funtion getLogFileCreationTime');
								var data = [];
								var query = "SELECT LogFileCrationTime FROM Logs WHERE EmailAddress = '" + EmailAddress + "'";

								return $q.when($cordovaSQLite.execute(db, query).then(function(res) {
									if (res.rows.length > 0) {
										data = res.rows.item(0).LogFileCrationTime;
									} else {
										console.log("No results found");
									}
									console.log('Countries::' + JSON.stringify(data));
									return data;
								}));
							} catch(e) {
								console.log('Error in getLogFileCreationTime:: ' + e);
							}
							console.log("Exited getLogFileCreationTime");

						},

						/**
						 * @function getLogsFileName
						 * @description function for getting log file name  from database.
						 */
						getLogsFileName : function(EmailAddress) {
							try {
								console.log('Entered into funtion getLogsFileName');
								var data = [];
								var query = "SELECT LogFileName FROM Logs WHERE EmailAddress = '" + EmailAddress + "'";
								console.log('query::getLogsFileName' + query);
								return $q.when($cordovaSQLite.execute(db, query).then(function(res) {
									if (res.rows.length > 0) {
										data = res.rows.item(0).LogFileName;
									} else {
										console.log("No results found");
									}
									console.log('getLogsFileName::' + JSON.stringify(data));
									return data;
								}));
							} catch(e) {
								console.log('Error in getLogsFileName:: ' + e);
							}
							console.log("Exited getLogsFileName");

						},

						/**
						 * @function setLogsStatus
						 * @param {String} logStatus holds logs status
						 * @description for saving logStatus in the database.
						 */
						setLogsStatus : function(LogStatus, EmailAddress) {
							try {
								console.log('Entered into funtion setLogsStatus::' + LogStatus);

								//if (CRN_Number == null || CRN_Number == '' || CRN_Number == undefined) {
								var updateStatusLogsQuery = "UPDATE Logs SET LogStatus =' " + LogStatus + " ' WHERE EmailAddress = '" + EmailAddress + "'";
								console.log("updateStatusLogsQuery :::" + updateStatusLogsQuery);
								$cordovaSQLite.execute(db, updateStatusLogsQuery);
								/*} else {
								 console.log("else part");
								 var updateCRNQuery = "UPDATE SaveCRNHeader SET HeaderComment = '" + Comment + "', SubmissionStatus = '" + SubmissionStatus + "', SubmissionCode = '" + SubmissionCode + "', PickupAddress_Name = '" + PickupAddress_Name + "', PickupAddress_Street = '" + PickupAddress_Street + "', PickupAddress_PostalCode = '" + PickupAddress_PostalCode + "', PickupAddress_City = '" + PickupAddress_City + "', PickupAddress_Country = '" + PickupAddress_Country + "' WHERE CRN_Number = '" + CRN_Number + "' ";
								 console.log("updateCRNQuery :::" + updateCRNQuery);
								 $cordovaSQLite.execute(db, updateCRNQuery);
								 }*/
							} catch(e) {
								console.log('Error in setLogsStatus:: ' + e);
								return e;
							}
							console.log("Exited setLogsStatus");

						},

						/**
						 * @function getLogsStatus
						 * @description function for getting LogsStatus  from database.
						 */
						getLogsStatus : function(EmailAddress) {
							try {
								console.log('Entered into funtion getLogsStatus');
								var data = [];
								var query = "SELECT LogStatus FROM Logs WHERE EmailAddress = '" + EmailAddress + "'";
								console.log('query::getLogsStatus' + query);
								return $q.when($cordovaSQLite.execute(db, query).then(function(res) {
									if (res.rows.length > 0) {
										data = res.rows.item(0).LogStatus;
									} else {
										console.log("No results found");
									}
									console.log('getLogsStatus::' + JSON.stringify(data));
									return data;
								}));
							} catch(e) {
								console.log('Error in getLogsStatus:: ' + e);
							}
							console.log("Exited getLogsStatus");

						},
/**
* @function insertLiveTutorialFlag
* @param {String} liveTutotorialFlag holds liveTutotorialFlag status
* @param {String} UserName holds  UserName
* @description for saving liveTutotorialFlag in the database and this is for per user.
*/
									insertLiveTutorialFlag : function(liveTutotorialFlag, TTS_Name) {
										try {
											console.log('Entered into funtion insertLiveTutorialFlag::' + liveTutotorialFlag);
											console.log('Entered into funtion insertLiveTutorialFlag::' + liveTutotorialFlag);

											//if (CRN_Number == null || CRN_Number == '' || CRN_Number == undefined) {
											var insertLiveTutorialFlag = "INSERT OR REPLACE INTO LiveTutorial(LiveTutorialFlag,TTS_Name) ";
											insertLiveTutorialFlag += "VALUES('" + liveTutotorialFlag + "', '" + TTS_Name + "') ";
											console.log("insertLiveTutorialFlagQuerry :::" + insertLiveTutorialFlag);
											$cordovaSQLite.execute(db, insertLiveTutorialFlag);
										} catch(e) {
											console.log('Error in insertLiveTutorialFlag:: ' + e);
											return e;
										}
										console.log("Exited insertLiveTutorialFlag");

									},
									/**
									 * @function setLiveTutorialFlag
									 * @param {String} liveTutotorialFlag holds liveTutotorialFlag status
									 * @param {String} UserName holds  UserName
									 * @description for saving liveTutotorialFlag in the database and this is for per user.
									 */
									setLiveTutorialFlag : function(liveTutotorialFlag, TTS_Name) {
										try {
											console.log('Entered into funtion setLiveTutorialFlagFirstTime::' + liveTutotorialFlag);
											console.log('Entered into funtion setLiveTutorialFlagFirstTime::' + TTS_Name);

											//if (CRN_Number == null || CRN_Number == '' || CRN_Number == undefined) {
											var setLiveTutorialFlag = "UPDATE LiveTutorial SET LiveTutorialFlag = '" + liveTutotorialFlag + "'  WHERE  TTS_Name =   '" + TTS_Name + "' ";
											console.log("setLiveTutorialFlagQuerry :::" + setLiveTutorialFlag);
											$cordovaSQLite.execute(db, setLiveTutorialFlag);
										} catch(e) {
											console.log('Error in setLiveTutorialFlag:: ' + e);
											return e;
										}
										console.log("Exited setLiveTutorialFlag");

									},

									/**
									 * @function getLiveTutorialFlag
									 * @description function for getting LogsStatus  from database.
									 */
									getLiveTutorialFlag : function(TTS_Name) {
										try {
											console.log('Entered into funtion getLiveTutorialFlag');
											var data = [];
											var query = "SELECT LiveTutorialFlag FROM LiveTutorial  WHERE TTS_Name = '" + TTS_Name + "'";
											console.log('query::getLiveTutorialFlag' + query);
											return $q.when($cordovaSQLite.execute(db, query).then(function(res) {
												if (res.rows.length > 0) {
													data = res.rows.item(0).LiveTutorialFlag;
												} else {
													console.log("No results found");
												}
												console.log('getLogsStatus::' + JSON.stringify(data));
												return data;
											}));
										} catch(e) {
											console.log('Error in getLiveTutorialFlag:: ' + e);
										}
										console.log("Exited getLiveTutorialFlag");

									},


		};

	} catch(e) {

		console.log('Error in the   module dealerAudit.settingsDbModuleDB::' + e);


		//handle exception here

	}

	console.log('Exit from  module dealerAudit.settingsDbModuleDB');


});
