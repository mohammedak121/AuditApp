/**

 * @class dealerAudit.auditQuestionnaireController
 * @description Functions related to Audit Questionnaire.
 */

var questionnaireModule = angular.module("dealerAudit.auditQuestionnaireControllers", ['ionic']);

questionnaireModule.controller('AuditQuestionnaireController', ['$scope', 'logsFctry', '$filter', 'auditQuestionnaireDBFactory', 'dealerAudit_AssetsConst', '$cordovaDatePicker', '$ionicPopup', '$location', function($scope, logsFctry, $filter, auditQuestionnaireDBFactory, dealerAudit_AssetsConst, $cordovaDatePicker, $ionicPopup, $location) {
	try {

		$scope.TagName = "AuditQuestionnaireController";
		$scope.questionnaireHeaderTitle = $filter('translate')('lblQuestionnaireTitle');
		$scope.rightArrow = dealerAudit_AssetsConst.rightArrow;
		$scope.calender = dealerAudit_AssetsConst.calender;

		$scope.progressBarMaxValue = 0;
		$scope.progressBarValue = 0;

		$scope.errorTitle = $filter('translate')('lblError');
		$scope.noQuestionnaires = $filter('translate')('lblNoQuestionnaires');

		/**
		 * @function gotoDashboard
		 * @description Navigate to dashboard.
		 */
		$scope.gotoDashboard = function() {
			$location.path('/dashBoard');
		}

		/**
		 * @function on
		 * @description Bind questionnaire data.
		 */
		$scope.$on('$ionicView.beforeEnter', function() {

			// This is a test method to populate the questionnaire result in JSON format.
			auditQuestionnaireDBFactory.getQuestionnaireObject().then(function(response) {

				if(typeof(response) != "undefined" || response != null) {
					console.log("Audit questionnaire get successfull");
					console.log("Audit questionnaire value " + JSON.stringify(response));

					$scope.grid = response;
					$scope.headers = Object.keys(response);

					auditQuestionnaireDBFactory.getMandatoryQuestions().then(function(mandatoryQuestionResponse) {
						if(mandatoryQuestionResponse.length > 0) {
							console.log("Number of mandatory questions " + mandatoryQuestionResponse.length);
							$scope.progressBarMaxValue = mandatoryQuestionResponse.length;
						} else {
							console.log("There are no mandatory questions");
						}
					});

				} else {
					$ionicPopup.alert({
						title: $scope.errorTitle,
						content: $scope.noQuestionnaires,
						cssClass: 'customAlert'
					});
				}
			})
		});

		$scope.nextButtonClick = function() {
			// for(header in $scope.grid) {
			// 	for(subheader in header) {
			// 		for(question in subheader) {
			// 			var
			// 		}
			// 	}
			// }
		}

		/**
		 * @function openDatePicker
		 * @description Open Cordova date picker.
		 */
		$scope.openDatePicker = function() {
			console.log("inside openDatePicker function");

			var dateOptions = {
				date: new Date(),
				mode: 'date', // or 'time'
				minDate: new Date() - 10000,
				maxDate: new Date() + 10,
				allowOldDates: true,
				allowFutureDates: false,
				doneButtonLabel: 'DONE',
				doneButtonColor: '#000000',
				cancelButtonLabel: 'CANCEL',
				cancelButtonColor: '#000000'
			};

			$cordovaDatePicker.show(dateOptions).then(function(date) {
				console.log("Date value from date picker" + date);

				var dateValue = date.getDate();
				var month = date.getMonth() + 1;
				var year = date.getFullYear();

				var fullDate = dateValue + "/" + month + "/" + year;

				console.log("Formatted date date: " + dateValue);
				console.log("Formatted date month: " + month);
				console.log("Formatted date year: " + year);

				console.log("Full date " + fullDate);
				$scope.dateData = fullDate;
			});
		}
	} catch(error) {
		logsFctry.logsDisplay('ERROR', $scope.TagName, "Error loading AuditQuestionnaireController" + JSON.stringify(error));
	}
}])
