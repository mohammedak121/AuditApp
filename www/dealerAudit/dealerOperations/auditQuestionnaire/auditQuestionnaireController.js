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

		$scope.noOfQuestionaPerPage = 4;
		$scope.headerIndex = 0;
		$scope.subHeaderIndex = 0;
		$scope.questionIndex = 0;


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

			// $scope.groups = [];
			// for(var i = 0; i < 10; i++) {
			// 	$scope.groups[i] = {
			// 		name: i,
			// 		items: []
			// 	};
			// 	for(var j = 0; j < 3; j++) {
			// 		$scope.groups[i].items.push(i + '-' + j);
			// 	}
			// }

			/*
			 * if given group is the selected group, deselect it
			 * else, select the given group
			 */
			$scope.toggleGroup = function(group) {
				if($scope.isGroupShown(group)) {
					$scope.shownGroup = null;
				} else {
					$scope.shownGroup = group;
				}
			};
			$scope.isGroupShown = function(group) {
				return $scope.shownGroup === group;
			};

			// This is a test method to populate the questionnaire result in JSON format.
			auditQuestionnaireDBFactory.getQuestionnaireObject().then(function(response) {

				if(typeof(response) != "undefined" || response != null) {
					console.log("Audit questionnaire get successfull");
					console.log("Audit questionnaire value " + JSON.stringify(response));

					$scope.grid = response;
					$scope.headers = Object.keys(response);

				} else {
					$ionicPopup.alert({
						title: $scope.errorTitle,
						content: $scope.noQuestionnaires,
						cssClass: 'customAlert'
					});
				}
			})
		});


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

		$scope.loadNextQuestionnaire = function() {

		}

	} catch(error) {
		logsFctry.logsDisplay('ERROR', $scope.TagName, "Error loading AuditQuestionnaireController" + JSON.stringify(error));
	}
}])
