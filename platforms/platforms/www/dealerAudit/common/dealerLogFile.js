/**

 * @class dealerAudit.logsModule

 * @description This module includes functionalities for reading the logs and writting them to a textfile.

 */

/**

 * @function logsFctry
 * @param {ScopeElemet} $scope defines scope of an elemet or function.

 * @param {Service} $ionicPlatform  provides interface to default state.

 * @param {Service} $q provides db storage.

 * @param {Service} $cordovaFile provides popUp message boxes.

 * @description Function to initialising and writting logs to file.

 */

angular.module('dealerAudit.logsModule', ['ionic']).factory('logsFctry', function($ionicPlatform, $cordovaFile, $q, $cordovaDevice, settingsDbfctry, dealerAudit_ConstantsConst) {

	try {

		console.log('Entered into module dealerAudit.logsModule');
		var obj = {};

		//return {

		obj.dealerLogs_Inititalise = function() {
			try {
				console.log('Entered into dealerLogs_Inititalise');
				var StorageDirectory;
				var isIOS = ionic.Platform.isIOS();
				var isAndroid = ionic.Platform.isAndroid();
				var filePath = {};
				var createDirectoryResult;
				var createTxtResult;
				var writeFileResult;
				if (isIOS) {

					filePath = cordova.file.documentsDirectory;
					console.log('StorageDirectory ios::' + filePath);
				} else if (isAndroid) {
					filePath = cordova.file.externalApplicationStorageDirectory;
					//filePath =cordova.file.externalRootDirectory;
				}
				StorageDirectory = filePath;
				console.log('StorageDirectory::' + StorageDirectory);
				// Filename = Ti.Platform.name + Ti.Platform.model + Ti.Platform.manufacturer + getFileName();
				var checkDirectoryResult = [];
				var checkFileResult = [];
				//Checking directory exists

				obj.checkDirectory(StorageDirectory).then(function(arrayMe) {
					try {

						console.log('kkkk hiii');
						checkDirectoryResult = arrayMe;
						console.log('checkDirectoryResult when called:::::');
						console.log(JSON.stringify(checkDirectoryResult));

						if (checkDirectoryResult.isDirectory == true) {

							console.log('Directory exists and now checking for file exists');
							settingsDbfctry.getLogsFileName(dealerAudit_ConstantsConst.TTS_Name).then(function(fileName) {
								console.log('getLogsFileName from database::' + JSON.stringify(fileName));
								var x = JSON.stringify(fileName);
								var Filename = fileName;
								//if (fileName !== 'null' && fileName !== null && fileName !== 'undefined' && fileName !== undefined && fileName !== '') {
								if (Filename.length > 0) {
									console.log('fileName not null');
									obj.checkFile(Filename, StorageDirectory).then(function(arrayMe) {

										console.log('check file  hiii');
										checkFileResult = arrayMe;
										console.log('checkFileRes when called:::::');

										console.log(JSON.stringify(checkFileResult));
										if (checkFileResult.isFile == true) {
											settingsDbfctry.getLogFileCreationTime(dealerAudit_ConstantsConst.TTS_Name).then(function(dateArray) {
												console.log('log file creationdate from database::' + JSON.stringify(dateArray));
												var fileCreationcreationDate = dateArray;
												var currentDate = new Date().getTime();
												console.log('fileCreationcreationDate:::' + fileCreationcreationDate);
												console.log('currentDate:::' + currentDate);
												if (fileCreationcreationDate != '' && fileCreationcreationDate != 'null' && fileCreationcreationDate != null && fileCreationcreationDate != 'undefined' && fileCreationcreationDate != undefined) {
													console.log('calling date diff fn');
													if (obj.DateDiff(fileCreationcreationDate, currentDate) >= 5) {
														console.log('5 days  over');
														//deleting the log file

														obj.removeFile(Filename, StorageDirectory).then(function(arrayMe) {
															var removeFileResult = arrayMe;
															console.log('removeFileResult file::' + JSON.stringify(arrayMe));

															if (removeFileResult.fileRemoved.isFile == true) {

																var device = $cordovaDevice.getDevice();
																var uuid = device.uuid;
																console.log('device::' + JSON.stringify(device));

																//Ti.Platform.name + Ti.Platform.model + Ti.Platform.manufacturer + getFileName();
																//var deviceAndBuildInfo = 'Platform name:' + "  " + device.platform + "  " + "osname:" + "  " + device.platform + "  " + "model:" + "  " + device.model + "  " + "version:" + "  " + device.version + "  " + "manufacturer:" + "  " + device.manufacturer + "  " + "App:" + "  " + version;
																var Filename = "logs/" + device.platform.replace(/ /g, '') + device.model.replace(/ /g, '') + device.manufacturer.replace(/ /g, '') + obj.getFileName().replace(/ /g, '') + dealerAudit_ConstantsConst.TTS_Name.replace('@hybris.com', '') + ".log";
																//var Filename = "logs/" + "newText.log";
																//Filename = Filename.trim( );
																console.log('Filename::' + Filename);
																//console.log('platform::'+device.platform.trim());
																var firstTimeFlag = false;

																// var Filename = 'newfile.log';
																obj.initialCreateWrite(Filename, StorageDirectory, firstTimeFlag).then(function() {
																	console.log('hey created file after deleing  file');
																});

															}

														});
													} else {
														settingsDbfctry.setLogsStatus(dealerAudit_ConstantsConst.logs.LogsEnable, dealerAudit_ConstantsConst.TTS_Name);
														console.log('5 days not over');
													}
												}
											});

										} else {

										}

									}).catch(function(error) {
										fileExists = error;
										console.log(JSON.stringify(error));

									});
								} else {
									console.log('file does not exists and now creating file');

									var device = $cordovaDevice.getDevice();
									var uuid = device.uuid;
									console.log('device::' + JSON.stringify(device));

									//Ti.Platform.name + Ti.Platform.model + Ti.Platform.manufacturer + getFileName();
									//var deviceAndBuildInfo = 'Platform name:' + "  " + device.platform + "  " + "osname:" + "  " + device.platform + "  " + "model:" + "  " + device.model + "  " + "version:" + "  " + device.version + "  " + "manufacturer:" + "  " + device.manufacturer + "  " + "App:" + "  " + version;
									var Filename = "logs/" + device.platform.replace(/ /g, '') + device.model.replace(/ /g, '') + device.manufacturer.replace(/ /g, '') + obj.getFileName().replace(/ /g, '') + dealerAudit_ConstantsConst.TTS_Name.replace('@hybris.com', '') + ".log";
									//var Filename = "logs/" + "newText.log";
									//Filename = Filename.trim( );
									console.log('Filename::' + Filename);
									//console.log('platform::'+device.platform.trim());
									var firstTimeFlag = true;
									// var Filename = 'newfile.log';
									obj.initialCreateWrite(Filename, StorageDirectory, firstTimeFlag).then(function() {
										console.log('hey created file if not exists');
									});
								}

							});
							//Checking file exists

						} else {
						}

					} catch(e) {
						console.log('Error in checkDirectory::' + e);
					}
				}).catch(function(error) {
					directoryExists = error;
					console.log(JSON.stringify(error));

					console.log('Directory does not exists and now creating Directory');

					obj.createDirectory(StorageDirectory).then(function(arrayMe) {
						console.log('kkkk hiii');
						createDirectoryResult = arrayMe;

						if (createDirectoryResult.isDirectory == true) {

							var device = $cordovaDevice.getDevice();
							var uuid = device.uuid;
							console.log('device::' + JSON.stringify(device));

							//Ti.Platform.name + Ti.Platform.model + Ti.Platform.manufacturer + getFileName();
							//var deviceAndBuildInfo = 'Platform name:' + "  " + device.platform + "  " + "osname:" + "  " + device.platform + "  " + "model:" + "  " + device.model + "  " + "version:" + "  " + device.version + "  " + "manufacturer:" + "  " + device.manufacturer + "  " + "App:" + "  " + version;
							var user = dealerAudit_ConstantsConst.TTS_Name.replace('@hybris.com', '');
							console.log('user' + user);
							var Filename = "logs/" + device.platform.replace(/ /g, '') + device.model.replace(/ /g, '') + device.manufacturer.replace(/ /g, '') + obj.getFileName().replace(/ /g, '') + dealerAudit_ConstantsConst.TTS_Name.replace('@hybris.com', '') + ".log";
							//var Filename = "logs/" + "newText.log";
							//Filename = Filename.trim(%20);
							console.log('Filename::' + Filename);
							var firstTimeFlag = true;
							// var Filename = 'newfile.log';
							obj.initialCreateWrite(Filename, StorageDirectory, firstTimeFlag).then(function() {
								console.log('hey created file for first time');
							});
							console.log('createDirectoryResult when called:::::');
							console.log(JSON.stringify(createDirectoryResult));
						}
					}).catch(function(error) {

						console.log('createDir error when no dir exists::' + JSON.stringify(error));

					});
				});

			} catch(e) {
				console.log('Error in dealerLogs_Inititalise:: ' + e);
			}
			console.log("Exited dealerLogs_Inititalise");
		};
		obj.initialCreateWrite = function(Filename, StorageDirectory, firstTimeFlag) {
			console.log('entered initialCreateWrite');
			return obj.createFile(Filename, StorageDirectory).then(function(arrayMe) {
				var fileCreationTime = new Date().getTime();
				if (firstTimeFlag == true) {
					settingsDbfctry.insertFileCreationTime(fileCreationTime, Filename, dealerAudit_ConstantsConst.TTS_Name);
				} else {
					settingsDbfctry.updateFileCreationTime(fileCreationTime, Filename, dealerAudit_ConstantsConst.TTS_Name);
				}

				console.log('fileCreationTime::' + fileCreationTime);
				console.log('kkkk hiii');
				createFileResult = arrayMe;
				console.log('createFileResult when called:::::');
				console.log(JSON.stringify(createFileResult));
				if (createFileResult.isFile == true) {

					obj.writeExistingFile(Filename, "======================================" + " \n ", StorageDirectory).then(function(arrayMe) {
						writeFileResult = arrayMe;
						console.log('file is written :::::');
						console.log('writeFileResult::' + JSON.stringify(writeFileResult));
						//TTLogFile.write(    Ti.Platform.manufacturer + " " + "Resolution" + " - " + "screenheight" + " " + Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi + " " + "screenwidth " + " " + Ti.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi + " " + "density" + " " + Ti.Platform.displayCaps.dpi + " " + "TTLite version" + " " + Ti.App.getVersion() + " \n ", true);
						var version;
						var isIOS = ionic.Platform.isIOS();
						var isAndroid = ionic.Platform.isAndroid();
						if (isIOS) {
							version = dealerAudit_ConstantsConst.iosVersion;
							console.log('version ios::' + version);
						} else if (isAndroid) {
							version = dealerAudit_ConstantsConst.androidVersion;
							console.log('version android::' + version);
						}
						var deviceAndBuildInfo = 'Platform name:' + "  " + device.platform + "  " + "osname:" + "  " + device.platform + "  " + "model:" + "  " + device.model + "  " + "version:" + "  " + device.version + "  " + "manufacturer:" + "  " + device.manufacturer + "  " + "App:" + "  " + version;

						obj.writeExistingFile(Filename, deviceAndBuildInfo + " \n ", StorageDirectory).then(function(arrayMe) {
							writeFileResult = arrayMe;
							console.log('file is written :::::');
							console.log('writeFileResult::' + JSON.stringify(writeFileResult));

							obj.writeExistingFile(Filename, "====================================== :: " + " \n ", StorageDirectory).then(function(arrayMe) {
								writeFileResult = arrayMe;
								console.log('file is written :::::');
								console.log('writeFileResult::' + JSON.stringify(writeFileResult));
								obj.getLogFileNameFromDataBaseForUser();
							}).catch(function(error) {

								console.log(JSON.stringify(error));

							});
						}).catch(function(error) {

							console.log(JSON.stringify(error));

						});
					}).catch(function(error) {

						console.log(JSON.stringify(error));

					});

				}
				return;
			});
		};

		/////
		/** @function checkFile

		 * @description Function to checking file existence.

		 */
		obj.checkFile = function(Filename, StorageDirectory) {
			var checkFileResult = {};
			if (Filename !== '' && Filename != 'undefined' && Filename != undefined && Filename != 'null' && Filename != null) {
				return $q.when($cordovaFile.checkFile(StorageDirectory, Filename).then(function(success) {
					//$cordovaFile.checkFile(StorageDirectory, "logs/newfile.log").then(function(success) {
					// success
					console.log('file exists');
					console.log(JSON.stringify(success));
					checkFileResult = success;

					//alert(x);
					console.log('file exists::' + success.isFile);
					console.log('file fullPath path::' + success.fullPath);
					console.log('file nativeURL path::' + success.nativeURL);
					console.log('file checkFileResult::' + JSON.stringify(checkFileResult));
					return checkFileResult;
				}).catch(function(error) {

					console.log(JSON.stringify(error));

				}));
			}
			// function(error) {
			// console.log('error while checking file::' + JSON.stringify(error));
			// });

		};
		//function for checking directory
		/** @function checkDirectory

		 * @description Function to checking directory existence.

		 */
		obj.checkDirectory = function(StorageDirectory) {
			console.log('Enterecx into checkDirectory');
			var checkDirectoryResult = {};
			return $q.when($cordovaFile.checkDir(StorageDirectory, "logs").then(function(success) {
				console.log('directory exists');
				console.log(JSON.stringify(success));
				checkDirectoryResult = success;
				console.log('directory exists::' + success.isDirectory);
				console.log('directory fullPath path::' + success.fullPath);
				console.log('directory nativeURL path::' + success.nativeURL);
				return checkDirectoryResult;
			}));
			// function(error) {
			// console.log('error while checking directory::' + JSON.stringify(error));
			// });

		};
		//function for removing file
		/** @function checkDirectory

		 * @description Function to removing existing file.

		 */

		obj.removeFile = function(Filename, StorageDirectory) {
			//settingsDbfctry.getLogsFileName().then(function(fileName) {
			//var Filename = fileName;
			console.log('removeFile::FileName::' + Filename);
			//var File = Filename;
			var removeFileResult = {};
			return $q.when($cordovaFile.removeFile(StorageDirectory, Filename).then(function(success) {
				console.log('file removed');
				console.log(JSON.stringify(success));
				removeFileResult = success;

				return removeFileResult;
			}));
			//});
			// function(error) {
			// console.log('error while removing file::' + JSON.stringify(error));
			// });

		};
		//function for removing directory
		/** @function removeDirectory

		 * @description Function to removing existing directory.

		 */
		obj.removeDirectory = function(StorageDirectory) {
			var removeDirectoryResult = {};
			return $q.when($cordovaFile.removeDir(StorageDirectory, "logs").then(function(success) {
				// success
				console.log('directory removed');
				console.log(JSON.stringify(success));
				removeDirectoryResult = success;

				return removeDirectoryResult;
			}));

		};

		//function for creating directory
		/** @function createDirectory

		 * @description Function to creating a directory.

		 */
		obj.createDirectory = function(StorageDirectory) {
			var createDirectoryResult = {};
			return $q.when($cordovaFile.createDir(StorageDirectory, "logs", false).then(function(success) {
				console.log('logs directory is created');
				console.log(JSON.stringify(success));
				createDirectoryResult = success;
				//console.log('directory exists::' + success.isDirectory);
				//console.log('directory fullPath path::' + success.fullPath);
				//console.log('directory nativeURL path::' + success.nativeURL);
				return createDirectoryResult;
			}));
			// , function(error) {
			// console.log('error while creating directory::' + JSON.stringify(error));
			// });

		};

		//function for creating file
		/** @function createFile

		 * @description Function to creating a file.

		 */
		obj.createFile = function(Filename, StorageDirectory) {
			var createFileResult = {};
			return $q.when($cordovaFile.createFile(StorageDirectory, Filename, true).then(function(success) {
				console.log('text file is created');
				console.log(JSON.stringify(success));
				createFileResult = success;
				//console.log('directory exists::' + success.isDirectory);
				//console.log('directory fullPath path::' + success.fullPath);
				//console.log('directory nativeURL path::' + success.nativeURL);
				return createFileResult;
			}));
			// , function(error) {
			// console.log('error while creating file::' + JSON.stringify(error));
			// });

		};

		//function for writting into file
		/** @function writeExistingFile
		 * @param {String} data data to be written into file.

		 * @description Function to writting into  a existing file.

		 */
		obj.writeExistingFile = function(Filename, data, StorageDirectory) {
			console.log('data::' + data);
			//settingsDbfctry.getLogsFileName().then(function(fileName) {
			//var Filename = fileName;
			console.log('Filename ::writeExistingFile:: ' + Filename);
			var writeFileResult = {};
			return $cordovaFile.writeExistingFile(StorageDirectory, Filename, data).then(function(success) {
				console.log('writting into file');
				console.log(JSON.stringify(success));
				writeFileResult = success;
				//console.log('directory exists::' + success.isDirectory);
				//console.log('directory fullPath path::' + success.fullPath);
				//console.log('directory nativeURL path::' + success.nativeURL);
				return writeFileResult;
			}, function(error) {
				console.log('error while creating file::' + JSON.stringify(error));
			});
			//});

		};

		/** @function getFileName

		 * @description Function to getting the   existing file name.

		 */
		obj.getFileName = function() {
			try {
				console.log('Entered into getFileName');
				var currentTime = new Date();
				var hours = currentTime.getHours();
				var minutes = currentTime.getMinutes();
				var month = currentTime.getMonth() + 1;
				var day = currentTime.getDate();
				var year = currentTime.getFullYear();
				console.log(month + " " + day + "" + year);

				return "_" + month + "" + day + "" + year;
			} catch(e) {
				console.log('Error in getFileName:: ' + e);
			}
			console.log("Exited getFileName");
		};

		obj.DateDiff = function(date2, date1) {
			console.log('Entered Into Function DateDiff');
			try {
				date1 = new Date(date1);
				date2 = new Date(date2);
				var timeDiff = (date1.getTime() - date2.getTime());
				var diffDays = (timeDiff / (1000 * 3600 * 24));
				return diffDays;
			} catch(e) {
				console.log('e::' + e);
			}
			console.log('Exited From Function DateDiff');
		};
		////
		/** @function getLogFileNameFromDataBaseForUser
		 * @param {String} type defines type of log.

		 * @param {String} moduleName defines the module name.

		 * @param {String} str defines string to be written into file.

		 * @param {String} getDate defines present date.

		 * @param {String} getFileName provides popUp message boxes.

		 * @description Function to writting  string into existing file.

		 */

		obj.getLogFileNameFromDataBaseForUser = function(type, moduleName, str, getDate) {
			try {
				settingsDbfctry.getLogsFileName(dealerAudit_ConstantsConst.TTS_Name).then(function(fileName) {
					var Filename = fileName;
					dealerAudit_ConstantsConst.fileName = fileName;
					console.log('Filename from passParameterFctry::' + Filename);
				});

			} catch(e) {

			}

		}

		//obj.eCasingLogs = function(type, moduleName, str, getDate)
    obj.dealerLogs = function(type, moduleName, str, getDate) {
			try {
				/*settingsDbfctry.getLogsStatus(dealerAudit_ConstantsConst.TTS_Name).then(function(LogsStatus) {
				 console.log('LogsStatus from db::' + LogsStatus);
				 var logsStatus = LogsStatus;
				 if ((logsStatus != '') && (logsStatus != 'null') && (logsStatus != null) && (logsStatus != 'undefined') && (logsStatus != undefined)) {
				 if (logsStatus == dealerAudit_ConstantsConst.logs.LogsEnable) {*/
				/*settingsDbfctry.getLogsFileName(dealerAudit_ConstantsConst.TTS_Name).then(function(fileName) {
				 var Filename = fileName;
				 console.log('Filename from passParameterFctry::' + Filename);*/
				if (dealerAudit_ConstantsConst.logs.logStatusInConst == dealerAudit_ConstantsConst.logs.LogsEnable) {

					console.log('Entered into dealerLogs');
					console.log('type::' + type);
					console.log('moduleName::' + moduleName);
					console.log('str::' + str);
					console.log('getDate::' + getDate);
					//setting log type here
					//this.dealerLogs_Inititalise();
					var logType = 'INFOALL';

					console.log('logType::' + logType);
					if (logType == 'INFOALL') {

						var textToWrite = type + "   " + getDate + "   " + moduleName + " " + " " + str + '\n';
						console.log(textToWrite);
						var isIOS = ionic.Platform.isIOS();
						var isAndroid = ionic.Platform.isAndroid();
						var filePath = {};
						var writeFileResult;
						if (isIOS) {
							filePath = cordova.file.documentsDirectory;
						} else if (isAndroid) {
							filePath = cordova.file.externalApplicationStorageDirectory;
							//filePath =cordova.file.dataDirectory;
						}
						var StorageDirectory = filePath;

						$cordovaFile.writeExistingFile(StorageDirectory, dealerAudit_ConstantsConst.fileName, textToWrite);

						/*$cordovaFile.writeExistingFile(StorageDirectory, Filename, textToWrite).then(function(success) {
						 console.log('hi');
						 writeFileResult = JSON.stringify(success);
						 console.log('writeFileResult::' + writeFileResult);
						 }, function(error) {
						 console.log('error2::' + error);
						 });*/
					} else if (logType == 'INFO') {
						if (type == 'INFO') {
							var textToWrite = type + "   " + getDate + "   " + moduleName + " " + " " + str + '\n';
							console.log(textToWrite);
							var isIOS = ionic.Platform.isIOS();
							var isAndroid = ionic.Platform.isAndroid();
							var filePath = {};
							var writeFileResult;
							if (isIOS) {
								filePath = cordova.file.documentsDirectory;
							} else if (isAndroid) {
								filePath = cordova.file.externalApplicationStorageDirectory;
								//filePath =cordova.file.dataDirectory;
							}
							var StorageDirectory = filePath;
							$cordovaFile.writeExistingFile(StorageDirectory, dealerAudit_ConstantsConst.fileName, textToWrite);

							/*$cordovaFile.writeExistingFile(StorageDirectory, Filename, textToWrite).then(function(success) {
							 console.log('hi');
							 writeFileResult = JSON.stringify(success);
							 console.log('writeFileResult::' + writeFileResult);
							 }, function(error) {
							 console.log('error2::' + error);
							 });*/
						}
					} else if (logType == 'DEBUG') {
						if (type == 'DEBUG') {
							var textToWrite = type + "   " + getDate + "   " + moduleName + " " + " " + str + '\n';
							console.log(textToWrite);
							var isIOS = ionic.Platform.isIOS();
							var isAndroid = ionic.Platform.isAndroid();
							var filePath = {};
							var writeFileResult;
							if (isIOS) {
								filePath = cordova.file.documentsDirectory;
							} else if (isAndroid) {
								filePath = cordova.file.externalApplicationStorageDirectory;
								//filePath =cordova.file.dataDirectory;
							}
							var StorageDirectory = filePath;
							$cordovaFile.writeExistingFile(StorageDirectory, dealerAudit_ConstantsConst.fileName, textToWrite);
							/*$cordovaFile.writeExistingFile(StorageDirectory, Filename, textToWrite).then(function(success) {
							 console.log('hi');
							 writeFileResult = JSON.stringify(success);
							 console.log('writeFileResult::' + writeFileResult);
							 }, function(error) {
							 console.log('error2::' + error);
							 });*/
						}
					} else if (logType == 'ERROR') {
						if (type == 'ERROR') {
							var textToWrite = type + "   " + getDate + "   " + moduleName + " " + " " + str + '\n';
							console.log(textToWrite);
							var isIOS = ionic.Platform.isIOS();
							var isAndroid = ionic.Platform.isAndroid();
							var filePath = {};
							var writeFileResult;
							if (isIOS) {
								filePath = cordova.file.documentsDirectory;
							} else if (isAndroid) {
								filePath = cordova.file.externalApplicationStorageDirectory;
								//filePath =cordova.file.dataDirectory;
							}
							var StorageDirectory = filePath;
							$cordovaFile.writeExistingFile(StorageDirectory, dealerAudit_ConstantsConst.fileName, textToWrite);
							/*$cordovaFile.writeExistingFile(StorageDirectory, Filename, textToWrite).then(function(success) {
							 console.log('hi');
							 writeFileResult = JSON.stringify(success);
							 console.log('writeFileResult::' + writeFileResult);
							 }, function(error) {
							 console.log('error2::' + error);
							 });*/
						}
					} else if (logType == 'USERENTRIES') {
						if (type == 'USERENTRIES') {
							var textToWrite = type + "   " + getDate + "   " + moduleName + " " + " " + str + '\n';
							console.log(textToWrite);
							var isIOS = ionic.Platform.isIOS();
							var isAndroid = ionic.Platform.isAndroid();
							var filePath = {};
							var writeFileResult;
							if (isIOS) {
								filePath = cordova.file.documentsDirectory;
							} else if (isAndroid) {
								filePath = cordova.file.externalApplicationStorageDirectory;
								//filePath =cordova.file.dataDirectory;
							}
							var StorageDirectory = filePath;
							$cordovaFile.writeExistingFile(StorageDirectory, dealerAudit_ConstantsConst.fileName, textToWrite)
							/*
							 $cordovaFile.writeExistingFile(StorageDirectory, Filename, textToWrite).then(function(success) {
							 console.log('hi');
							 writeFileResult = JSON.stringify(success);
							 console.log('writeFileResult::' + writeFileResult);
							 }, function(error) {
							 console.log('error2::' + error);
							 });*/
						}
					} else {
						//do nothing
					}
					/*});*/
					/*} else {
					 console.log('write file Pleaseenable logs');
					 }
					 } else {
					 console.log('write file Pleaseenable logsStatus is null');
					 }
					 });*/
				} else {
					//Do nothing
					console.log('logs not enabled');
				}
			} catch(e) {
				console.log('Error in dealerLogs:: ' + e);
			}
			console.log("Exited dealerLogs");

		};

		//functin to print date for filename
		/** @function getFileName
		 * @description Function to get file name .

		 */
		/*obj.getFileName = function() {
		try {
		console.log('Entered into getFileName');
		var currentTime = new Date();
		var hours = currentTime.getHours();
		var minutes = currentTime.getMinutes();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();
		console.log(month + " " + day + "" + year);

		return "_" + month + "" + day + "" + year;
		} catch(e) {
		console.log('Error in getFileName:: ' + e);
		}
		console.log("Exited getFileName");
		};*/
		// endof  getFileName()
		//function to print date to log statements
		/** @function getDate
		 * @description Function to get current date .

		 */
		obj.getDate = function() {
			try {
				console.log('Entered into getDate');
				var currentTime = new Date();
				var hours = currentTime.getHours();
				var minutes = currentTime.getMinutes();
				var month = currentTime.getMonth() + 1;
				var day = currentTime.getDate();
				var year = currentTime.getFullYear();
				return month + "/" + day + "/" + year + " - " + hours + ":" + minutes;
			} catch(e) {
				console.log('Error in getDate:: ' + e);
			}
			console.log("Exited getDate");
		};

		/** @function sendMail
		 * @description Function for fetching and attching text file created to the mail and sending the  mail.

		 */
		obj.sendMail = function() {
			try {
				settingsDbfctry.getLogsStatus(dealerAudit_ConstantsConst.TTS_Name).then(function(LogsStatus) {
					console.log('LogsStatus from db::' + LogsStatus);
					var logsStatus = LogsStatus;
					if ((logsStatus != '') && (logsStatus != 'null') && (logsStatus != null) && (logsStatus != 'undefined') && (logsStatus != undefined)) {
						if (logsStatus == dealerAudit_ConstantsConst.logs.LogsEnable) {
							console.log('entered into sendMail');
							var isIOS = ionic.Platform.isIOS();
							var isAndroid = ionic.Platform.isAndroid();
							var filePath = {};
							if (isIOS) {
								filePath = cordova.file.documentsDirectory;
							} else if (isAndroid) {
								filePath = cordova.file.externalApplicationStorageDirectory;
								//filePath =cordova.file.dataDirectory;
							}
							settingsDbfctry.getLogsFileName(dealerAudit_ConstantsConst.TTS_Name).then(function(fileName) {
								var Filename = fileName;
								console.log('Filename in side send mail::' + Filename);
								/** @function checkFile

								 * @description Function to checking file existence.

								 */

								/*function checkFile() {
								var checkFileResult = {};
								console.log('Filename in checkFile send mail::' + Filename);
								return $q.when($cordovaFile.checkFile(filePath, Filename).then(function(success) {
								//$cordovaFile.checkFile(StorageDirectory, "logs/newfile.log").then(function(success) {
								// success
								console.log('file exists');
								console.log(JSON.stringify(success));
								checkFileResult = success;

								//alert(x);
								console.log('file exists::' + success.isFile);
								console.log('file fullPath path::' + success.fullPath);
								console.log('file nativeURL path::' + success.nativeURL);
								console.log('file checkFileResult::' + JSON.stringify(checkFileResult));
								return checkFileResult;
								}).catch(function(error) {

								console.log(JSON.stringify(error));

								}));
								// function(error) {
								// console.log('error while checking file::' + JSON.stringify(error));
								// });

								};*/
								//function for checking directory
								/** @function checkDirectory

								 * @description Function to checking directory existence.

								 */
								/*
								 function checkDirectory() {
								 console.log('Enterecx into checkDirectory');
								 var checkDirectoryResult = {};
								 return $q.when($cordovaFile.checkDir(filePath, "logs").then(function(success) {
								 console.log('directory exists');
								 console.log(JSON.stringify(success));
								 checkDirectoryResult = success;
								 console.log('directory exists::' + success.isDirectory);
								 console.log('directory fullPath path::' + success.fullPath);
								 console.log('directory nativeURL path::' + success.nativeURL);
								 return checkDirectoryResult;
								 }));
								 // function(error) {
								 // console.log('error while checking directory::' + JSON.stringify(error));
								 // });

								 };*/
								obj.checkDirectory(filePath).then(function(arrayMe) {
									console.log('entered into checkDirectory sendMail');
									try {

										var checkDirectoryResult = arrayMe;

										console.log('checkDirectoryResult when called in send mail:::::');

										console.log(JSON.stringify(checkDirectoryResult));

										if (checkDirectoryResult.isDirectory == true) {

											console.log(' directory exists in send mail');

											obj.checkFile(Filename, filePath).then(function(arrayMe) {

												try {

													console.log('checking for file existence in  send mail');

													var checkFileResult = arrayMe;

													console.log('checkFileResult when called in send mail:::::');

													console.log(JSON.stringify(checkFileResult));

													if (checkFileResult.isFile == true) {

														//var fileFullPath = checkFileResult.fullPath;
														var fileFullPath = checkFileResult.nativeURL;
														//var  fileFullPath = fileFullPath.trim( );
														console.log('fileFullPath::' + fileFullPath);

														if (fileFullPath != '' && fileFullPath != 'undefined' && fileFullPath != undefined && fileFullPath != null && fileFullPath != 'null') {
															console.log('opening emnail');
															cordova.plugins.email.open({

																//to : [""],

																attachments : [fileFullPath],

																subject : "dealer Logs",

																//body : bodyText,

																isHtml : true,

															}, function() {
																console.log('email view dismissed');
															}, this);
														}

													}
												} catch(e) {
													console.log(' error in checkFile send log::' + e);
												}
											}).catch(function(error) {

												console.log(' no log file to attach ::' + e);

											});

											//////

										}

									} catch(e) {
										console.log('error in   checkDirectory sendMail::' + e);
									}
									console.log('exit from   checkDirectory sendMail');
								}).catch(function(error) {

									console.log(' no log file to attach ');
									var bodyText = "<h2>helloo!! mail sent from my app..Task finished..</h2>";

									window.plugin.email.open({

										//to : [" "],

										//attachments : [""],

										subject : "dealer Logs",

										body : bodyText,

										isHtml : true,

									}, this);

								});
							});
						} else {
							console.log('please enable logs in the settings');
						}
					} else {
						console.log('logsStatus  is null');
					}
				});
			} catch(e) {
				console.log('error  in sendMail' + e);
			}
			console.log('exit from  sendMail');
		};
		/** @function logsDisplay
		 * @description Function for writting the logs in each page.

		 * @param {String} type  holds type of the log.

		 * @param {String} moduleName holds name of the module.

		 * @param {String} str holds the srting to be written into file.

		 */
		obj.logsDisplay = function(type, moduleName, str) {
			try {
				//console.log('Entered to the function logsDisplay');
				if (dealerAudit_ConstantsConst.logs.logStatusInConst == dealerAudit_ConstantsConst.logs.LogsEnable) {
					var getDate = obj.getDate();
					obj.dealerLogs(type, moduleName, str, getDate);
				}

				//logsFctry.dealerLogs_Inititalise();
			} catch(e) {
				console.log('Error in thre function logsDisplay'+e);

			}
			//console.log('Exit from the function logsDisplay');

		};
		//};
		return obj;
	} catch(e) {

		console.log('Error in the   module dealerAudit.logsModule::' + e);

		//handle exception here

	}

	console.log('Exit from  module dealerAudit.logsModule');

});
