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

						// console.log("Questionnaire object" + questionnaireObj);
						// console.log("Questionnaire object" + JSON.stringify(questionnaireObj));

						var groupedArray = _.groupByMultipleFields(questionnaireObj, ['header_text', 'sub_header_text']);
						// var keys = Object.keys(groupedArray);

						// console.log("JSON grouped array" + JSON.stringify(groupedArray))

						// CompleteGroupedArray.push({
						// 	'GroupedArray': groupedArray,
						// 	'KeysArray': keys
						// })

						// console.log("Grouped Array " + groupedArray);
						// console.log("Grouped Array " + JSON.stringify(groupedArray));

						// console.log("Complete Grouped Array" + CompleteGroupedArray);

						return groupedArray;
					} else {
						return groupedArray;
					}
				}))

			}
		}

	} catch(error) {
		logsFctry.logsDisplay('ERROR', tagName, "Error loading ModifyDealerController" + JSON.stringify(error));
	}

}])
