/**
 * @class dealerAudit.toastModule
 * @param {Module} ionic defines ionic specific functionalities or services.
 * @description This module includes functionalities displaying toast message.
 */
/**
 * @function toastFctry
 * @param {Service} $cordovaToast service for displaying toast.
 * @description Function for displaying the toast messages.
 */

 var toastModule = angular.module('dealerAudit.toastModule', ['ionic']);

 toastModule.factory('toastFctry',function($cordovaToast){
   return {

  	/**
  	 * @function showToast
  	 * @param {String} message defines message to be displayed.
  	 * @param {String} duration defines duration of the toast message.
  	 * location {String} location defines the position of the toast message.
  	 * @description Function for displaying the toast messages.
  	 */
  	 showToast : function(message) {
  	 	try{
  	 	console.log('Entered into showToast');
  		$cordovaToast.show(message, 'short', 'center').then(function(success) {
  			console.log("The toast was shown");
  		}, function(error) {
  			console.log("The toast was not shown due to " + error);
  		});
  		}catch(e){
  			console.log('Error in showToast::'+e);
  	 	}
  	 	console.log('Exit from  showToast');
  	},
	};
 })
