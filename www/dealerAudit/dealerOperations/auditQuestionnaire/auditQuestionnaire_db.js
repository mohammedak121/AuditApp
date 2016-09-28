/**
 * @class dealerAudit.ModifyDealerModuleDB
 * @description This module includes database functionalities for searching a dealer.
 */

var questionnaireDBModule = angular.module('dealerAudit.AuditQuestionnaireModuleDB', []);

questionnaireDBModule.factory('auditQuestionnaireDBFactory', ['logsFctry', '$q', '$cordovaSQLite', function(logsFctry, $q, $cordovaSQLite) {
	try {
		var tagName = "auditQuestionnaireDBFactory";

		logsFctry.logsDisplay('INFO', tagName, 'Entered in the module dealerAudit.AuditQuestionnaireModuleDB');

		return {

			/**
			 * @function getQuestionnaireObject
			 * @description Get the questionnaires to bind to the UI.
			 */
			getQuestionnaireObject: function() {

				var questionnaireObj = [];
				var CompleteGroupedArray = [];

				//var selectQuery = "SELECT * from question_master group by header_text";
				var selectQuery = "SELECT * from question_master";

				// var selectHeadersQuery = "SELECT * from question_master group by header_text having count(*) >=1";

				return $q.when($cordovaSQLite.execute(db, selectQuery).then(function(res) {
					if(res.rows.length > 0) {

						console.log("Result of grouped data" + res.rows);
						console.log("Result of grouped data" + JSON.stringify(res.rows));

						for(var i = 0; i < res.rows.length; i++) {
							questionnaireObj.push(res.rows.item(i));
						}

						var groupedArray = _.groupByMultipleFields(questionnaireObj, ['header_text', 'sub_header_text']);

						return groupedArray;
					} else {
						return groupedArray;
					}
				}))
			},

			/**
			 * @function getMandatoryQuestions
			 * @description Get the mandatory questions.
			 */
			getMandatoryQuestions: function() {

				var mandatoryQuestions = [];
				logsFctry.logsDisplay('INFO', tagName, 'Entered in the function getMandatoryQuestions');

				var selectQuery = "SELECT * from question_master WHERE mandatory_field = '" + true + "' ";

				return new Promise(function(resolve, reject) {
					$cordovaSQLite.execute(db, selectQuery).then(function(res) {
						if(res.rows.length > 0) {

							// console.log("No of mandatory questions " + res.rows);
							// console.log("No of mandatory questions" + JSON.stringify(res.rows));

							for(var i = 0; i < res.rows.length; i++) {
								mandatoryQuestions.push(res.rows.item(i));
							}

							resolve(mandatoryQuestions);
						} else {
							resolve(mandatoryQuestions);
						}
					})
				});

			}
		}

	} catch(error) {
		logsFctry.logsDisplay('ERROR', tagName, "Error loading ModifyDealerController" + JSON.stringify(error));
	}

}])
