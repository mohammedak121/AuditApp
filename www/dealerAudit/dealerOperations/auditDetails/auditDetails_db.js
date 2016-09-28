 angular.module('dealerAudit.AuditDetailsModuleDB', []).factory('auditDetailsDbFactory', ['$cordovaSQLite', '$q', '$timeout', 'logsFctry',
 function($cordovaSQLite, $q, $timeout,logsFctry) {
   try {
    var TagName = "auditDetailsDbFactory";
    logsFctry.logsDisplay('INFO', TagName, 'Entered in the module dealerAudit.AuditDetailsModuleDB');
   return {
       saveAuditDetailsInfo: function(auditDetails) {
        logsFctry.logsDisplay('INFO', TagName, 'Entered into saveAuditDetailsInfo');
         logsFctry.logsDisplay('DEBUG', TagName, "Audit details information" + JSON.stringify(auditDetails));
       var insertQuery = "INSERT OR REPLACE INTO Audit_master(audit_date, audit_person_onsite, audit_done_by) VALUES";
       if(typeof(auditDetails.audit_date) == undefined || auditDetails.audit_date == null) {
         auditDetails.audit_date = "";
       }
       if(typeof(auditDetails.audit_person) == undefined || auditDetails.audit_person == null) {
         auditDetails.audit_person = "";
       }
       if(typeof(auditDetails.audit_done_by) == undefined || auditDetails.audit_done_by == null) {
         auditDetails.audit_done_by = "";
       }
        insertQuery += "('" + auditDetails.audit_date + "','" + auditDetails.audit_person + "','" + auditDetails.audit_done_by + "')";
    		return $q.when($cordovaSQLite.execute(db, insertQuery).then(function(res) {
					insertQuery = "";
					console.log("Insert into DB successful" + JSON.stringify(res));
 					logsFctry.logsDisplay('DEBUG', TagName, "Insert into dealers DB successful" + JSON.stringify(res));
 					return true;
				}, function(error) {
					logsFctry.logsDisplay('ERROR', TagName, "Insert into dealers DB failed" + JSON.stringify(error));
					console.log("Error saving into DB " + JSON.stringify(error));
					return false;
 				}));
       }
     }
   }catch(error) {
  		logsFctry.logsDisplay('Error', TagName, "Error in the module dealerAudit.ModifyDealerModuleDB" + JSON.stringify(error));
			console.log("Catch error in db ----" + JSON.stringify(error));
  	}
}]);
