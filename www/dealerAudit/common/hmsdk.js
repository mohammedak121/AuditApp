var isOnline = true;
/*
 * These variables should be defined by the developer
 *
 */
var HM_CLIENT_VERSION;
var HM_APP_URL;
var HM_APP_KEY;
var HM_APP_SECRET;
var HM_DEBUG_LOG_ENABLED;
var HM_TOKEN;
var HM_REFRESH_TOKEN;
var HM_TOKEN_EXPIRY;
var HM_APP_TIMEOUT;


/*
 *  Function for custom logging functionalty
 */
function HM_Log(message)
{
    if(HM_DEBUG_LOG_ENABLED)
        console.log(message);
}


/*
 * Online and offline functions
 */
//var offlineQueueIndex = 0;
var lockedOnline=function(){

    if(isOnline) return;

    isOnline = true;
    console.log('We Are Online');

    setTimeout(function() {

        var objectsArray = JSON.parse(localStorage.getItem(('offline_objects')));
        var count = 0;
        var execCount = 0;
        var removeIndexes = [];


        var removeOfflineObjects = function(){
            for(var removeCount=0; removeCount < removeIndexes.length; removeCount++){
                objectsArray.splice(removeIndexes[removeCount], 1);
                for(var j = 0; j < removeIndexes.length ; j++){
                    if(removeIndexes[j] !== 0){
                        removeIndexes[j]--;
                    }
                }
            }
        };

        var markFailedOfflineObjects = function(){
            for(var k=0; k < objectsArray.length; k++){
                objectsArray[k].execfailed = true;
            }
        };

        var offlineDbCreateTransaction = function(objectType, data){
            var identifier = count++;
            objectType.create(data).then(
                function(success){
                    execCount++;
                    console.log(identifier);
                    removeIndexes.push(identifier);
                    if(execCount === objectsArray.length) {

                        removeOfflineObjects();
                        markFailedOfflineObjects();

                        localStorage.removeItem("offline_objects");
                        localStorage.setItem("offline_objects", JSON.stringify(objectsArray));
                    }
                },
                function(error){
                    execCount++;
                    console.log(identifier);
                    if(execCount === objectsArray.length) {

                        removeOfflineObjects();
                        markFailedOfflineObjects();

                        localStorage.removeItem("offline_objects");
                        localStorage.setItem("offline_objects", JSON.stringify(objectsArray));
                    }
                }
            );
        };

        var offlineDBUpdateTransaction = function(objectType, data){
            var identifier = count++;
            var object = new IClientObject(objectType, data);
            object.update(storedObject.data).then(
                function(success){
                    execCount++;
                    removeIndexes.push(identifier);
                    if(execCount === objectsArray.length) {

                        removeOfflineObjects();
                        markFailedOfflineObjects();

                        localStorage.removeItem("offline_objects");
                        localStorage.setItem("offline_objects", JSON.stringify(objectsArray));
                    }
                },
                function(error){
                    execCount++;
                    if(execCount === objectsArray.length) {

                        removeOfflineObjects();
                        markFailedOfflineObjects();

                        localStorage.removeItem("offline_objects");
                        localStorage.setItem("offline_objects", JSON.stringify(objectsArray));
                    }
                }
            );
        };

        var offlineDBDeleteTransaction = function(objectType, data){
            var identifier = count++;
            var object = new IClientObject(objectType, data);
            object.remove().then(
                function(success){
                    execCount++;
                    removeIndexes.push(identifier);
                    if(execCount === objectsArray.length) {

                        removeOfflineObjects();
                        markFailedOfflineObjects();

                        localStorage.removeItem("offline_objects");
                        localStorage.setItem("offline_objects", JSON.stringify(objectsArray));
                    }
                },
                function(error){
                    execCount++;
                    if(execCount === objectsArray.length) {

                        removeOfflineObjects();
                        markFailedOfflineObjects();

                        localStorage.removeItem("offline_objects");
                        localStorage.setItem("offline_objects", JSON.stringify(objectsArray));
                    }
                }
            );
        };

        if(objectsArray && objectsArray.length > 0) {

            for(var i=0; i < objectsArray.length; i++) {

                var storedObject = objectsArray[i];

                var tempclientObjectType = new IClientObjectType(storedObject.storeObjectName, storedObject.storeSchemaArray, storedObject.storeClientObject);

                if(storedObject.operation === tempclientObjectType.HMOperationType_CREATE) {
                    if(storedObject.execfailed !== true){
                        offlineDbCreateTransaction(tempclientObjectType, storedObject.data);
                    }else{
                        count++;
                    }
                }
                else if(storedObject.operation === tempclientObjectType.HMOperationType_UPDATE) {
                    if(storedObject.execfailed !== true){
                        offlineDBUpdateTransaction(tempclientObjectType,storedObject.data);
                    }else{
                        count++;
                    }
                }
                else if(storedObject.operation === tempclientObjectType.HMOperationType_DELETE) {
                    if(storedObject.execfailed !== true){
                        offlineDBDeleteTransaction(tempclientObjectType,storedObject.data);
                    }else{
                        count++;
                    }
                }
            }
        }
    }, 5000);
};

var onOffline=function(){
    if(!isOnline) return;

    isOnline = false;
    console.log('We Are Offline');
};

var onOnline = function() {

    LockableStorage.lock("offline_objects", function ()
    {
        lockedOnline();

    }, 10000);
};

/*
 *   Register Event Listeners
 */
window.addEventListener("online", onOnline, false);
window.addEventListener("offline", onOffline, false);

function HM_HTTPRequest(url, method, headers, data, bypassCache)
{

    return new Promise(function(resolve, reject)
    {
        var myRequest;

        if(window.XMLHttpRequest)
            myRequest = new XMLHttpRequest();

        //IE
        else if(window.ActiveXObject)
            myRequest = new ActiveXObject();

        // Request handler
        myRequest.onreadystatechange = function()
        {

            if(myRequest.readyState == 4)
            {
                var response = {};
                var responseHeaders = {};

                response.status = myRequest.status;
                if(myRequest.responseText === ""){
                    response.data = "";
                }
                else if(myRequest.getResponseHeader('content-type') == 'application/json'){
                    response.data = JSON.parse(myRequest.responseText);
                }
                else{
                    response.data = myRequest.responseText;
                }

                //Build Response Header Object
                var splitHeaders = myRequest.getAllResponseHeaders().split("\n");

                if(splitHeaders.length > 0)
                {
                    for(var i=0; i<splitHeaders.length; i++)
                    {
                        var splitValue = splitHeaders[i].split(": ");
                        var key = splitValue[0];
                        var val = splitValue[1];

                        if(key !== "" && key !== undefined)
                            responseHeaders[key] = val;
                    }
                }

                response.headers = responseHeaders;

                if(myRequest.status == 200 || myRequest.status == 204)
                {
                    resolve(response);
                }
                else
                {
                    if(myRequest.status == 401)
                    {
                        localStorage.removeItem(HM_APP_KEY + "_stored_session");
                        localStorage.removeItem(HM_TOKEN);
                        localStorage.removeItem(HM_REFRESH_TOKEN);
                        localStorage.removeItem(HM_TOKEN_EXPIRY);
                    }

                    reject(response);
                }
            }
        };

        // Set URL
        myRequest.open(method, url, true);

        //set TimeOut
        if(HM_APP_TIMEOUT !== undefined){
            myRequest.timeout = HM_APP_TIMEOUT;
        }

        // Set Headers
        if(bypassCache)
            headers["Cache-Control"] = "no-cache";

        for (var header in headers)
            myRequest.setRequestHeader(header,headers[header]);

        if(data)
            myRequest.send(data);
        else
            myRequest.send();
    });

}

/*
 *  Misc. Helper Functions Required For SDK
 */

/*
 *  Function to check if a string ends with a suffix
 */
String.prototype.endsWith = function(suffix) {

    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
/*
 *  Function to check if a string begins with a prefix
 */
String.prototype.startsWith = function (prefix){
    return this.indexOf(prefix) === 0;
};
/*
 *  Function for case insensitive compare
 */
String.prototype.compareWith = function (string){
	return this.toUpperCase() === string.toUpperCase();
};

/*
 *  File to Store all Messages
 */
var EError = (function () {

        // Instance stores a reference to the Singleton
        var instance;

        function init() {

            return {

                    //Below are the enum, which are defined on the server
                    ACCESS_DENIED : 0,
                    NO_OBJECTS : 1,
                    NO_OBJECT : 2,
                    MISSING_INPUT : 3,
                    MISSING_REQUIRED_FIELD : 4,
                    QUERY_ERROR : 5,
                    OBJECT_EXISTS : 6,
                    SIGNATURE_CHECK_ERROR : 7,
                    USER_CREATE_ERROR : 8,
                    SAVE_ERROR : 9,
                    WRONG_FORMAT : 10,
                    APP_VERIFICATION_REQUIRED : 11,
                    INVALID_CLIENT : 12,
                    AUTHENTICATION_FAILURE : 13,
                    ADMIN_REQUIRED : 14,
                    INVALID_DEVICE : 15,
                    MISSING_SERVER : 16,
                    UNEXPECTED_OBJECT_COUNT : 17,
                    SERVICE_INVOCATION_ERROR : 18,
                    APP_DOWNLOAD_ERROR : 19,
                    MISSING_KEY_FIELD_ON_SERVICE : 20,
                    UNSUPPORTED_OPERATION : 21,
                    INVALID_INPUT : 22,
                    SERVICE_TEST_ERROR : 23,
                    UNEXPECTED_ERROR : 24,
                    APP_UNAVAILABLE : 25,
                    MISSING_CONFIGURATION : 26,
                    PIN_FAILURE : 27,
                    INVALID_AUTH_TOKEN : 28,
                    SEARCH_TERM_ERROR : 29,
                    GENERIC_ERROR_STRING : 30,
                    CHILD_REFERENCE_ERROR : 31,
                    USER_LOCKED : 32,
                    OBJECT_NOT_DELETEABLE : 33,
                    USER_DEVICE_REMOTE_WIPE_LOCKED : 34,
                    INVALID_FIELD_ON_SERVICE : 35,
                    INVALID_METADATA : 36,
                    REGISTERED_USER : 37,
                    INVALID_APP : 38,
                    INVALID_RELATIONSHIP : 39,
                    UPDATE_NOT_ALLOWED : 40,

                    //Below enum are not exist at server exception code.
                    MISSING_MANIFEST_ENTRIES : 41,
                    REQUEST_ERROR : 42,
                    MISSING_FIELD : 43,
                    INVALID_OBJECT_TYPE : 44,
                    DATA_FORMAT_ERROR : 45,
                    UNKNOWN_ERROR : 46,
                    NO_LISTENER_SPECIFIED : 47,
                    PARSE_ERROR : 48,
                    APP_VERIFICATION_FAILED : 49,
                    SESSION_INITIALIZATION_REQUIRED : 50,
                    TOKEN_EXPIRED : 51,
                    IDENTITY_OBJECT_NOT_DEFINED : 52,
                    KEY_ON_CREATE : 53,
                    KEY_GREATER_THAN_ZERO : 54,
                    NO_CONTENT : 55,
                    FILTER_STRING_MISMATCH : 56,
                    FILTER_STATEMENTS_ONLY : 57,
                    ADDED_TO_OFFLINE_QUEUE: 58,

                    getErrorObject : function (errorCode, stringParams) {

                        var errorMessage;

                        switch(errorCode)
                        {

                            case 0  :   errorMessage =  "The server has denied access to resource";
                                        break;

                            case 1  :   errorMessage = "No Objects of type exist";
                                        break;

                            case 2  :   errorMessage = "No Objects of type exists";
                                        break;

                            case 3  :   errorMessage = "Field " + stringParams[0] + " is required for this request";
                                        break;

                            case 4  :   errorMessage = "field " + stringParams[0] + " is required on object " + stringParams[1];
                                        break;

                            case 5  :   errorMessage = "Query error on server";
                                        break;

                            case 6  :   errorMessage = "Object exists on server";
                                        break;

                            case 7  :   errorMessage = "The computed signature doesn't match input signature " + stringParams[0];
                                        break;

                            case 8  :   errorMessage = "The user cannot be created";
                                        break;

                            case 9  :   errorMessage = stringParams[0] + " could not be saved";
                                        break;

                            case 10 :   errorMessage = stringParams[0] + " is of the wrong format";
                                        break;

                            case 11 :   errorMessage = "App Verification failed. Please Retry";
                                        break;

                            case 12 :   errorMessage = "Unauthorised App";
                                        break;

                            case 13 :   errorMessage = "Username and password combination does not exist";
                                        break;

                            case 14 :   errorMessage = "Current user is not an admin";
                                        break;

                            case 15 :   errorMessage = "Invalid device";
                                        break;

                            case 16 :   errorMessage = "Configuration for " + stringParams[0] + " server is required";
                                        break;

                            case 17 :   errorMessage = "Found " + stringParams[0] + " objects of type " + stringParams[1];
                                        break;

                            case 18 :   errorMessage = "Error returned from calling " + stringParams[0] + " of type " + stringParams[1];
                                        break;

                            case 19 :   errorMessage = "Error in downloading app " + stringParams[0];
                                        break;

                            case 20 :   errorMessage = "Service " + stringParams[0] + " doesn't have a key configured";
                                        break;

                            case 21 :   errorMessage = "Operation not supported";
                                        break;

                            case 22 :   errorMessage = "Invalid Input " + stringParams[0] + " for field " + stringParams[1];
                                        break;

                            case 23 :   errorMessage = "Error " + stringParams[0] + " returned from calling " + stringParams[1] + " object " + stringParams[2];
                                        break;

                            case 24 :   errorMessage = "Error " + stringParams[0] + " returned";
                                        break;

                            case 25 :   errorMessage = "App " + stringParams[0] + " is not available";
                                        break;

                            case 26 :   errorMessage = "App " + stringParams[0] + " is missing configuration " + stringParams[1];
                                        break;

                            case 27 :   errorMessage = "User " + stringParams[0] + " pin doesn't match";
                                        break;

                            case 28 :   errorMessage = "Token " + stringParams[0] + " is invalid";
                                        break;

                            case 29 :   errorMessage = "You need at least " + stringParams[0] + " characters to search for " + stringParams[1];
                                        break;

                            case 30 :   errorMessage = stringParams[0];
                                        break;

                            case 31 :   errorMessage = "Child " + stringParams[0] + " has references to " +stringParams[1];
                                        break;

                            case 32 :   //errorMessage = "User " + stringParams[0] + " is locked";
                                        errorMessage = "User is locked";
                                        break;

                            case 33 :   errorMessage = "Object " + stringParams[0] + " with " + stringParams[1] + " is not deletable";
                                        break;

                            case 34 :   //errorMessage = "User/Device " + stringParams[0] + " is remote wiped";
                                        errorMessage = "User/Device is remote wiped";
                                        break;

                            case 35 :   errorMessage = "Service " + stringParams[0] + " doesn't have field '%s' configured";
                                        break;

                            case 36 :   errorMessage = "Expect field " + stringParams[0] + " to be " + stringParams[1] + ", found " +stringParams[2];
                                        break;

                            case 37 :   errorMessage = "User " + stringParams[0] + " has been sent a pin previously";
                                        break;

                            case 38 :   errorMessage = "App '%s' is not a/an " + stringParams[0] + " app";
                                        break;

                            case 39 :   errorMessage = "Object " + stringParams[0] + " is not related to " + stringParams[1];
                                        break;

                            case 40 :   errorMessage = "Field " + stringParams[0] + " for object " + stringParams[1] + " is non-updatable";
                                        break;

                            case 41 :   errorMessage = "The manifest has missing entries";
                                        break;

                            case 42 :   errorMessage = "The server returned an error";
                                        break;

                            case 43 :   errorMessage = "A mandatory field is missing";
                                        break;

                            case 44 :   errorMessage = "Client object type doesn't exist for app";
                                        break;

                            case 45 :   errorMessage = "Data format mismatch";
                                        break;

                            case 46 :   errorMessage = "The server has denied access to resource";
                                        break;

                            case 46 :   errorMessage = "No Listener is Specified.";
                                        break;

                            case 48 :   errorMessage = "Couldn't parse the response";
                                        break;

                            case 49 :   errorMessage = "App verification failed with message " + stringParams[0];
                                        break;

                            case 50:   errorMessage = "Session needs to be initialized before using it";
                                        break;

                            case 51 :   errorMessage = "Token has expired";
                                        break;

                            case 52 :   errorMessage = "Identity object undefined for current session.";
                                        break;

                            case 53 :   errorMessage = "Key field should not be passed on create call";
                                        break;

                            case 54 :   errorMessage = "Key " + stringParams[0] +" should be greater than 0";
                                        break;

                            case 55 :   errorMessage = "No Content";
                                        break;

                            case 56 :   errorMessage = "Invalid filter statement object";
                                        break;

                            case 57 :   errorMessage = "FilterStatements should contain only FilterStatement class object";
                                        break;

                            case 58 :   errorMessage = "You seem to be offline. Objects will be updated once connectivity is resumed";
                                        break;
                        }

                        return {code:errorCode, message:errorMessage};

                    }
            };


        }


        return {
            // Get the Singleton instance if one exists
            // or create one if it doesn't
            getInstance: function () {
                if ( !instance ) {

                    instance = init();
                }
                    return instance;
            }
        };

})();




/**
 * Created by pradeep.kp on 10-06-2016.
 */

function ExceptionHandler(){

}

ExceptionHandler.submitCrashLogs = function(zipFile){
    console.log("Submit Crash Logs called.");
    return new Promise(function(resolve,reject){
        ISession.getInstance().then(function(session){
            session.getAuthToken().then(
                function(token){
                    var url = Constants.getUrl() + Constants.getCrashLogsUrl();
                    var method = "POST";
                    var headers = {"Authorization": "Bearer " + token};
                    var data = new FormData();

                    data.append("file",zipFile);

                    HM_HTTPRequest(url,method,headers,data,true).then(
                        function(response){
                            resolve(response);
                        },
                        function(error){
                            reject(error);
                        }
                    );
                },
                function(error){
                    reject(error);
                });
        },function(error){
            console.log(error);
        });
    });
};

/**
 * Created by pradeep.kp on 03-05-2016.
 */
var EPollType = {
    "TRUE_FALSE": "TRUE_FALSE" ,
    "NUMERIC_RATING" : "NUMERIC_RATING",
    "SINGLE_CHOICE_TEXT" : "SINGLE_CHOICE_TEXT",
    "MULTI_CHOICE_TEXT" : "MULTI_CHOICE_TEXT",
    "SINGLE_CHOICE_IMAGE" : "SINGLE_CHOICE_IMAGE",
    "MULTI_CHOICE_IMAGE" : "MULTI_CHOICE_IMAGE",
    "WORD_CLOUD" : "WORD_CLOUD"
};


function Constants()
{

}

Constants.getUrl = function() {

	var url = HM_APP_URL;

	if(!url) {

		HM_Log("Error! Global app url is not defined");
		return;
	}

	if(!url.endsWith("/"))
		url = url + "/";

	return url;
};

Constants.getVersionUrl = function() {

	return "client-api/api/version";
};

Constants.getUserRegistrationURL = function() {

	return "client-api/api/users";
};

Constants.getUserRegistrationPinURL = function() {

	return "client-api/api/register";
};

Constants.getUserUpdateURL = function() {

	return "client-api/api/users/update";
};
Constants.getAppUrl = function() {

	return "client-api/api/apps";
};
Constants.getAppUsersURL = function(appKey) {

	return "client-api/api/apps/" + appKey + "/users";
};
Constants.getServiceUrl = function() {

	return "client-api/api/services";
};

Constants.getSpecificServiceUrl = function(serviceName) {

	return "client-api/api/services/" + serviceName;
};

Constants.updateSpecificServiceUrl = function(serviceName,id) {

	return "client-api/api/services/" + serviceName +'/'+id;
};

Constants.getServiceMetadataUrl = function(serviceName) {

	return "client-api/api/services/" + serviceName + "?metadata=true";
};

Constants.getServiceUrlPaginated = function(serviceName, startIndex, size) {

	return "client-api/api/services/" + serviceName + "?start=" + startIndex + "&size=" + size;
};

Constants.getServiceUrlById = function(serviceName, objectId) {

	return "client-api/api/services/" + serviceName + "/" + objectId;
};

Constants.getRelatedServiceUrl = function(serviceName, objectId, relatedServiceName) {

	return "client-api/api/services/" + serviceName + "/" + objectId + "/" + relatedServiceName + "?";
};

Constants.getSearchServiceUrl = function(serviceName) {

	return "client-api/api/services/" + serviceName + "?";
};

Constants.getTokenUrl = function() {

	return "client-api/api/token/";
};

Constants.getLogoutUrl = function() {

	return "client-api/api/revoke/";
};

Constants.getCategoryUrl = function() {

	return "client-api/api/categories";
};

Constants.getCheckinUrl = function() {

	return "client-api/api/checkin";
};

Constants.getMediaUrl = function() {

	return "client-api/api/";
};

Constants.getPollUrl = function() {

	return "client-api/api/polls";
};

Constants.getPollResultsUrl = function(pollTitle) {

	return "client-api/api/polls/" + encodeURIComponent(pollTitle) + "/results";
};

Constants.getAnnouncementUrl = function() {

	return "client-api/api/psa";
};

Constants.getDeviceApplicationUrl = function() {

	return "client-api/api/devices/apps";
};
Constants.getServiceURL = function(serviceName) {

	return "client-api/api/code/" + serviceName;
};

Constants.getPollChoiceResponseURL = function(title){

	return Constants.getPollResultsUrl(title);
};

Constants.getPollResponsesUrl = function(pollTitle) {

	return "client-api/api/polls/" + encodeURIComponent(pollTitle) + "/responses";
};

Constants.getPollChoiceCreateUrl = function(pollTitle){

    return "client-api/api/polls/" + encodeURIComponent(pollTitle);
};

Constants.pollDeleteUrl = function(pollTitle){

	return "client-api/api/polls/" + encodeURIComponent(pollTitle);
};

Constants.pollUpdateUrl = function(pollTitle){

    return "client-api/api/polls/" + encodeURIComponent(pollTitle);
};

Constants.getPollChoiceDeleteUrl = function(pollTitle,choiceId){

    return "client-api/api/polls/" + encodeURIComponent(pollTitle) + "/choice/" + choiceId;
};

Constants.getBulkCreateUrl = function(clientObjectType){
	return "client-api/api/bulk/" + encodeURIComponent(clientObjectType);
};

Constants.getCrashLogsUrl = function(){
    return "client-api/api/devices";
};

Constants.getFunctionUrl = function(functionName){
	return "client-api/api/function/" + functionName;
};

Constants.getPasswordResetUrl = function(){
	return "client-api/api/users/reset_password";
};

/*
 *  Object Class EEoperator
 */
var FilterStatement = (function () {

		var error = EError.getInstance();

		function init(filterString) {


			var operator = filterString;
			var alias = formatToString(filterString);

			this.ISNULL             = 0;//"null";
			this.NOT_NULL           = 1;//"notnull";
			this.EQUALS             = 2;//"eq";
			this.NOT_EQUALS         = 3;//"ne";
			this.GREATER_THAN       = 4;//"gt";
			this.GREATER_THAN_EQUAL = 5;//"ge";
			this.LESS_THAN          = 6;//"lt";
			this.LESS_THAN_EQUAL    = 7;//"le";

			function formatToString(format) {

				switch(format) {

					case this.ISNULL				:return "null";
					case this.NOT_NULL				:return "notnull";
					case this.EQUALS				:return "eq";
					case this.NOT_EQUALS			:return "ne";
					case this.GREATER_THAN			:return "gt";
					case this.GREATER_THAN_EQUAL	:return "ge";
					case this.LESS_THAN				:return "lt";
					case this.LESS_THAN_EQUAL		:return "le";
					default							:return null;
				}
			}

			this.getAlias = function() {

				return alias;
			};
			this.getOperator = function() {

				return operator;
			};

		}


		return {
			// Get the Singleton instance if one exists
			// or create one if it doesn't
			getOperatorObject: function (filterString) {

				if(!filterString)
					return null;

				if(filterString === this.ISNULL || filterString === this.NOT_NULL ||
					filterString === this.EQUALS || filterString === this.GREATER_THAN ||
					filterString === this.GREATER_THAN_EQUAL || filterString === this.LESS_THAN ||
					filterString === this.LESS_THAN_EQUAL) {

					var instance = init(filterString);

					return instance;
				} else {

					return null;
				}
			}
		};

})();

/*
 *  Object Class For FieldMetadata
 */
function FieldMetadata(schemaDictionary)
{
	var name;
	var type;
	var required;
	var updateable;
	var key;
	var parent;

    // init prop
    this.prop = "";
    var self = this;

    // Public variables
    this.EValueType_OBJECT      = 0;
    this.EValueType_ENUM        = 1;
    this.EValueType_NUMERIC     = 2;
    this.EValueType_STRING      = 3;
    this.EValueType_DATE        = 4;
    this.EValueType_IP          = 5;
    this.EValueType_LAT_LONG    = 6;
    this.EValueType_NSFILE      = 7;
    this.EValueType_BOOLEAN     = 8;

	// Init Logic
	type = getValueType(schemaDictionary.data_type);
	name = schemaDictionary.name;
	updateable = schemaDictionary.updateable;
	required = schemaDictionary.required;
	parent = schemaDictionary.has_parent;

	if(schemaDictionary.key)
		key = true;
	// Init Logic

    function getValueType(dataType) {

		if (dataType == "OBJECT")
			return self.EValueType_OBJECT;

		else if (dataType == "ENUM")
			return self.EValueType_ENUM;

		else if (dataType == "NUMERIC")
			return self.EValueType_NUMERIC;

		else if (dataType == "STRING")
			return self.EValueType_STRING;

		else if (dataType == "DATE")
			return self.EValueType_DATE;

		else if (dataType == "IP")
			return self.EValueType_IP;

		else if (dataType == "LAT_LONG")
			return self.EValueType_LAT_LONG;

		else if (dataType == "FILE")
			return self.EValueType_NSFILE;

		else if (dataType == "BOOLEAN")
			return self.EValueType_BOOLEAN;

    }

    // Public Functions
    this.getName = function() {
		return name;
    };

    this.getType = function() {
		return type;
    };

    this.isRequired = function() {
		return required;
    };

    this.isUpdateable = function() {
		return updateable;
    };

    this.isKey = function() {
		return key;
    };

    this.hasParent = function() {
		return parent;
    };
}

/*
*  Object Class For Filter Statement
*/
function FilterStatement(_field, _operator, _value) {


	var field = _field;
	var operator = _operator;
	var value = _value;

	this.getField = function () {

		return field;
	};
	this.getOperator = function () {

		return operator;
	};
	this.getValue = function () {

		return value;
	};
	this.validate = function () {

		if(!field)
			return false;

		if((operator === FilterStatement.ISNULL || operator === FilterStatement.NOT_NULL ||
			operator === FilterStatement.EQUALS || operator === FilterStatement.NOT_EQUALS ||
			operator === FilterStatement.GREATER_THAN || operator === FilterStatement.GREATER_THAN_EQUAL ||
			operator === FilterStatement.LESS_THAN || operator === FilterStatement.LESS_THAN_EQUAL))
			return true;

		return false;

	};
	this.getFilterStatement = function () {

		if(operator === FilterStatement.ISNULL || operator === FilterStatement.NOT_NULL) {

			return field + operator;
		}else {

			return field + " " + operator + value;
		}
	};
}

FilterStatement.ISNULL				="null";
FilterStatement.NOT_NULL			="notnull";
FilterStatement.EQUALS				="eq";
FilterStatement.NOT_EQUALS			="ne";
FilterStatement.GREATER_THAN		="gt";
FilterStatement.GREATER_THAN_EQUAL	="ge";
FilterStatement.LESS_THAN			="lt";
FilterStatement.LESS_THAN_EQUAL		="le";

/*var FilterStatement = (function () {

		var error = EError.getInstance();

		function init(field, operator, value)) {

			var field = field;
			var operator = operator;
			var value = value;

			this.getField = function() {

				return field;
			};
			this.getOperator = function() {

				return operator;
			};
			this.getValue = function() {

				return value;
			};

		}


		return {
			// Get the Singleton instance if one exists
			// or create one if it doesn't
			getObject: function (field, operator, value) {

				if(!field)
					return(error.getErrorObject(MISSING_INPUT, ["Field"]));

				if(!operator.getAlias)
					return(error.getErrorObject(FILTER_STRING_MISMATCH));

				var instance = init(field, operator, value);

				return instance;
			}
		};

})();*/

/*
 *  Object Class For Application
 */
 /*
*  Object Class For Application Using Function Prototyping
*/
function IApplication(dataDictionary)
{
	// init prop
	this.prop = "";
	var self = this;

	this.name = null;
    this.modificationDate = null;
    this.applicationKey = null;
    this.description = null;
    this.hash = null;
    this.registrationMode = null;
    this.downloadUri = null;
    this.externalApp = null;
    this.rating = null;
    this.mediaLinks = null;
    this.lastVerificationDate = null;
    this.downloadDate = null;
    this.bundleVersion = null;
    this.categories = null;

    this.passcodeRequired = null;
    this.allowRootedAccess = null;
    this.allowSaveCredential = null;
    this.isUpdatable = null;
    this.termsOfService = null;
    this.appPackageName = null;
    this.appSize = null;
    this.operatingSystem = null;

	this.titleColor = null;
	this.bodyHeaderColor = null;
	this.bodySubheaderColor = null;
	this.bodyColor = null;
	this.bodyTextColor = null;
	this.titleTextColor = null;
	this.menuColor = null;
	this.menuTextColor = null;

	if(dataDictionary.key)
		this.applicationKey = dataDictionary.key;
	else
		this.applicationKey = HM_APP_KEY;

	if(dataDictionary.modification_date)
		this.modificationDate = dataDictionary.modification_date;

	if(dataDictionary.bundle_version)
		this.bundleVersion = dataDictionary.bundle_version;

	if(dataDictionary.bundle_identifier)
		this.bundle_identifier = dataDictionary.bundle_identifier;

	if(dataDictionary.key)
		this.applicationKey = dataDictionary.key;

	if(dataDictionary.name)
		this.name = dataDictionary.name;

	if(dataDictionary.description)
		this.description = dataDictionary.description;

	if(dataDictionary.hash)
		this.hash = dataDictionary.hash;

	if(dataDictionary.registration_mode)
		this.registrationMode = dataDictionary.registration_mode;

	if(dataDictionary.downloadUri)
		this.downloadUri = dataDictionary.downloadUri;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.external)
		this.externalApp = dataDictionary.external;

	if(dataDictionary.categories)
		this.categories = dataDictionary.categories;

	if(dataDictionary.require_passcode)
		this.passcodeRequired = dataDictionary.require_passcode;

	if(dataDictionary.allow_rooted_device)
		this.allowRootedAccess = dataDictionary.allow_rooted_device;

	if(dataDictionary.allow_save_credentials)
		this.allowSaveCredential = dataDictionary.allow_save_credentials;

	if(dataDictionary.mediaLinks)
		this.mediaLinks = dataDictionary.mediaLinks;

	if(dataDictionary.terms_of_service)
		this.termsOfService = dataDictionary.terms_of_service;

	if(dataDictionary.lastVerificationDate)
		this.lastVerificationDate = dataDictionary.lastVerificationDate;

	if(dataDictionary.downloadDate)
		this.downloadDate = dataDictionary.downloadDate;

	if(dataDictionary.body_subheader_color)
		this.bodySubheaderColor = dataDictionary.body_subheader_color;
	else
		this.bodySubheaderColor = "#0F7BB4";

	if(dataDictionary.title_color)
		this.titleColor = dataDictionary.title_color;
	else
		this.titleColor = "#050505";

	if(dataDictionary.body_header_color)
		this.bodyHeaderColor = dataDictionary.body_header_color;
	else
		this.bodyHeaderColor = "#0F7B7cc0e6B4";

	if(dataDictionary.body_color)
		this.bodyColor = dataDictionary.body_color;
	else
		this.bodyColor = "#ffffff";

	if(dataDictionary.body_text_color)
		this.bodyTextColor = dataDictionary.body_text_color;
	else
		this.bodyTextColor = "#000000";

	if(dataDictionary.title_text_color)
		this.titleTextColor = dataDictionary.title_text_color;
	else
		this.titleTextColor = "#000000";

	if(dataDictionary.menu_color)
		this.menuColor = dataDictionary.menu_color;
	else
		this.menuColor = "#7cc0e6";

	if(dataDictionary.menu_text_color)
		this.menuTextColor = dataDictionary.menu_text_color;
	else
		this.menuTextColor = "#000000";

	if(dataDictionary.operating_system)
		this.operatingSystem = dataDictionary.operating_system;

	if(dataDictionary.updateable)
		this.isUpdatable = dataDictionary.updateable;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;

	if(dataDictionary.size)
		this.appSize = dataDictionary.size;




	this.getRating = function () {

		HM_Log("get rating called");
		return self.rating;
	};

	this.getAppIcon = function () {

		return new Promise(function(resolve, reject)
		{
			HM_Log("get app icon called");

			var url = self.getIconUrl();

			HM_HTTPRequest(url, "GET", null, null).then(
			function(response)
			{
				resolve(data);
			},
			function(response)
			{
				reject(response);
			});

		});
	};

	this.getMediaLinks = function () {

		return self.mediaLinks;
	};

	this.getName = function () {

		return self.name;
	};

	this.getModifiedDate = function () {

		return self.modificationDate;
	};

	this.getKey = function () {

		return self.applicationKey;
	};

	this.getDownloadUri = function () {

		return self.downloadUri;
	};

	this.getOperatingSystem = function () {

		return self.downloadUri;
	};

	this.getIconUrl = function () {

		return Constants.getUrl() + Constants.getAppUrl() + "/" + self.getKey() + "?type=icon";
	};

	this.getRegistrationMode = function () {

		return self.registrationMode;
	};

	this.getDescription = function () {

		return self.description;
	};

	this.getHash = function () {

		return self.hash;
	};

	this.getCategories = function () {

		return self.categories;
	};

	this.getDownloadDate = function () {

		return self.downloadDate;
	};

	this.getLastVerificationDate = function () {

		return self.lastVerificationDate;
	};

	this.isPasscodeRequired = function () {

		return self.passcodeRequired;
	};

	this.isAllowRootedAccess = function () {

		return self.allowRootedAccess;
	};

	this.getTermsofService = function () {

		return self.termsOfService;
	};

	this.isAllowSaveCredential = function () {

		return self.allowSaveCredential;
	};

	this.getAppPackageName = function () {

		return self.appPackageName;
	};

	this.isExternalApp = function () {

		return self.externalApp;
	};

	this.isUpdatable = function () {

		return self.isUpdatable;
	};

	this.getAppSize = function () {

		return self.appSize;
	};

	this.getTitleColor = function () {

		return self.titleColor;
	};

	this.getTitleTextColor = function () {

		return self.titleTextColor;
	};

	this.getBodyHeaderColor = function () {

		return self.bodyHeaderColor;
	};

	this.getBodySubheaderColor = function () {

		return self.bodySubheaderColor;
	};

	this.getBodyColor = function () {

		return self.bodyColor;
	};

	this.getBodyTextColor = function () {

		return self.bodyTextColor;
	};

	this.getMenuColor = function () {

		return self.menuColor;
	};

	this.getMenuTextColor = function () {

		return self.menuTextColor;
	};

}

function IClientObject(clientObjectType, clientObjectData) {

	// init prop
	this.prop = "";
	var self = this;

	this.id = null;
	this.data = null;
	this.type = null;

	if(clientObjectData.ETag)
		this.ETag = parseInt(clientObjectData.ETag.replace(/"/g, ''));

	var error = EError.getInstance();

	// Public Variables
	this.HMOperationType_CREATE = 0;
    this.HMOperationType_UPDATE = 1;
    this.HMOperationType_LIST   = 2;
    this.HMOperationType_DELETE = 3;

	// Init Logic
	this.type = clientObjectType;

	if(clientObjectData)
		this.data = clientObjectData;

	if (self.data && self.type && self.type.getKeyField() && self.data[self.type.getKeyField()])
		this.id = self.data[self.type.getKeyField()];

	this.requiredfields = self.type.getRequiredFieldNames();
	this.file_fields = self.type.getFileFieldNames();
	// Init Logic

	// Private Functions
	function privateValidate(params, operationType) {

		return new Promise(function(resolve, reject) {

			switch(operationType) {

				case self.HMOperationType_UPDATE :	// Check if all required fields are passed
													for(var requiredCountUpdate = 0; requiredCountUpdate < params.length; requiredCountUpdate++) {

														var fieldNameUpdate = self.type.requiredFields[params[requiredCountUpdate]];
														var requiredMetadataUpdate = self.type.schemaMap[fieldNameUpdate];

														//validation for field whether they are updateable or not
														if(!requiredMetadataUpdate.isUpdateable()) {

															reject(error.getErrorObject(error.UPDATE_NOT_ALLOWED, [fieldNameUpdate, self.type.name]));
														}
													}
													// Resolve if validated Succesfully
													resolve(true);
													break;

				case self.HMOperationType_LIST : break;

				case self.HMOperationType_DELETE : break;

				default : break;
			}
		});

	}
	function genericUpdate(url, object, session) {

		return new Promise(function(resolve, reject) {

			if(self.type.enableOfflineWrite === true)
			{
				if (isOnline) {
					//online previous functionality will work
				} else {
					//if enableofflinewrite set and internet is of then we need to store object in local storage
					var objArray = [];

					if(localStorage.getItem('offline_objects'))
					{
						objArray = JSON.parse(localStorage.getItem(('offline_objects')));
					}
					//set data to localstorage
					var obj = {};
                    //obj.id = offlineQueueIndex++;
					obj.storeObjectName = self.type.storeObjectName;
					obj.storeSchemaArray = self.type.storeSchemaArray;
					obj.storeClientObject = self.type.storeClientObject;
					obj.data = object;
					obj.data[self.type.getKeyField()] = self.id;
					obj.operation = self.HMOperationType_UPDATE;
                    obj.execfailed = false;
					objArray.push(obj);

					localStorage.removeItem("offline_objects");
					localStorage.setItem("offline_objects", JSON.stringify(objArray));

					resolve(error.getErrorObject(error.ADDED_TO_OFFLINE_QUEUE));

					return;
				}
			}

			session.getAuthToken().then(
			function(token){

				var method  = "POST";
				var headers = {};
				var data    = "";
				var toSend  = "";

				var formData = new FormData();
                var paramsAdded = false;
				for(var key in object){
					if(key === "ETag"){
						//do nothing
					}
					else{
						if(self.type.fileFields.length > 0){

							if(object[key] !== null && typeof object[key] === 'object')
								formData.append(key, JSON.stringify(object[key]));
							else
								formData.append(key, object[key]);
						}
						else{
                            if(!paramsAdded){
                                if(object[key] !== null && typeof object[key] === 'object')
                                {
                                    if(JSON.stringify(object[key]).indexOf("&") == -1)
                                        data = key + "=" + JSON.stringify(object[key]);
                                    else
                                        data = key + "=" + JSON.stringify(object[key]).replace(/&/g,'%26');
                                }
                                else
                                {
                                    data = key + "=" + encodeURIComponent(object[key]);
                                }
                                paramsAdded = true;
                            }else{
                                if(object[key] !== null && typeof object[key] === 'object')
                                {
                                    if(JSON.stringify(object[key]).indexOf("&") == -1)
                                        data = data + "&" + key + "=" + JSON.stringify(object[key]);
                                    else
                                        data = data + "&" + key + "=" + JSON.stringify(object[key]).replace(/&/g,'%26');
                                }
                                else
                                {
                                    data = data + "&" + key + "=" + encodeURIComponent(object[key]);
                                }
                            }
						}
					}
				}

				if(data.length > 0) {

				if(self.type.enableOptimisticLocking === true){
					if(self.ETag === undefined || self.ETag === null || self.ETag === "")
					{
						headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
					}
					else
					{
						headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token, "If-Match":self.ETag};
					}
					}
					else{
						headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
					}

					toSend = data;
				}else {

					if(self.type.enableOptimisticLocking === true){
						if(self.ETag === undefined || self.ETag === null || self.ETag === "")
						{
							headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
						}
						else
						{
							headers = {"Accept":"application/json", "Authorization":"Bearer " + token,"If-Match":self.ETag};
						}
					}
					else{
					headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
					}
					toSend = formData;
				}

				HM_HTTPRequest(url, method, headers, toSend).then(
				function(response) {

					resolve(response.data);
				},
				function(response) {

					if(response.status === 412)
					{
						self.type.get(self.id,true).then(
						function(response1) {

							resolve(object,response1.data);
						},
						function(response1) {

							reject(response);
						});
					}
					else
					{
						reject(response);
					}
				});
			},
			function(){

				reject(response);
			});
		});

	}
	function genericDelete(url, session) {

		return new Promise(function(resolve, reject) {

			if(self.type.enableOfflineWrite === true)
			{
				if (isOnline) {
				//online previous functionality will work
				} else {
					//if enableofflinewrite set and internet is of then we need to store object in local storage
					var objArray = [];

					if(localStorage.getItem('offline_objects'))
					{
						objArray = JSON.parse(localStorage.getItem(('offline_objects')));
					}
						//set data to localstorage
						var obj = {};
                        //obj.id = offlineQueueIndex++;
						obj.storeObjectName = self.type.storeObjectName;
						obj.storeSchemaArray = self.type.storeSchemaArray;
						obj.storeClientObject = self.type.storeClientObject;
						obj.data = self.data;
						obj.data[self.type.getKeyField()] = self.id;
						obj.operation = self.HMOperationType_DELETE;
                        obj.execfailed = false;
						objArray.push(obj);

						localStorage.removeItem("offline_objects");
						localStorage.setItem("offline_objects", JSON.stringify(objArray));

                        resolve(error.getErrorObject(error.ADDED_TO_OFFLINE_QUEUE));

						return;
				}
			}

			session.getAuthToken().then(
			function(token){

				var method  = "DELETE";
				var headers = {};

				headers = {"Accept":"application/json", "Authorization":"Bearer " + token};

				HM_HTTPRequest(url, method, headers).then(
				function(response) {

					resolve(response.data);
				},
				function(response) {

					reject(response);
				});

			},
			function(){

				reject(response);
			});
		});
	}
	function checkConditions(checkSchema) {

		return new Promise(function(resolve, reject) {

			// Check Verify
			ISession.getInstance().then(
			function(session) {

				session.getAuthToken().then(
				function(token) {

						resolve(session);
				},
				function(response) {

					reject(response);
				});
			},
			function(response) {

				reject(response);
			});
		});
	}
	function privateUpdate(clientObjectName, object, session) {

		return new Promise(function(resolve, reject) {

			var url     = Constants.getUrl() + Constants.updateSpecificServiceUrl(clientObjectName, self.id);
			genericUpdate(url, object, session).then(
			function(response) {

				resolve(response);
			},
			function(response) {

				reject(response);
			});
		});
	}
	function privateDelete(clientObjectName, id, session) {

		return new Promise(function(resolve, reject) {

			var url     = Constants.getUrl() + Constants.updateSpecificServiceUrl(clientObjectName,id);
			genericDelete(url,session).then(
			function(response) {

				resolve(response);
			},
			function(response) {

				reject(response);
			});
		});
	}
	// Private Functions

	// Public Functions
	this.validateInputs = function(params, operationType) {

		return new Promise(function(resolve, reject) {

				privateValidate(params, operationType).then(
				function(response) {

					resolve(true);
				},
				function(response) {

					reject(response);
				});
		});
	};
	this.getId = function() {

		return self.id;
    };
    this.getType = function() {

		return self.type;
    };
    this.getData = function() {

		return self.data;
    };
    this.getEtag = function() {

		return self.Etag;
    };
    this.update = function(object) {

		return new Promise(function(resolve, reject) {

			checkConditions(true).then(
			function(session) {

				if(!object)
					reject(error.getErrorObject(error.MISSING_INPUT, ["Object"]));
				if(!self.type.getName())
					reject(error.getErrorObject(error.MISSING_INPUT, ["Name"]));
				if(!self.id)
					reject(error.getErrorObject(error.MISSING_INPUT, ["id"]));

				self.validateInputs(object, self.HMOperationType_UPDATE).then(
				function(response) {

					privateUpdate(self.type.getName(), object, session).then(
					function(response) {

						resolve(response);
					},
					function(response) {

						reject(response);
					});
				},
				function(response) {

					reject(response);
				});
			},
			function(response) {

				reject(response);
			});
		});
    };

    this.remove = function() {

		return new Promise(function(resolve, reject) {

			if(!self.type.getName())
					reject(error.getErrorObject(error.MISSING_INPUT, ["Name"]));

			if(!self.id)
				reject(error.getErrorObject(error.MISSING_INPUT, ["id"]));


			checkConditions(true).then(
			function(session) {

				privateDelete(self.type.getName(), self.id, session).then(
				function(response) {

					resolve(response);
				},
				function(response) {

					reject(response);
				});

			},
			function(response) {

				reject(response);
			});
		});
    };
}

/*
 *  Object Class For IClientObjectType
 */
function IClientObjectType(objectName, schemaArray, clientObject)
{
    // init prop
    this.prop = "";
    var self = this;

    this.name = objectName;
    this.keyField = null;
    this.schema = [];
    this.requiredFields = [];
    this.fileFields = [];
    this.isIdentityObject = null;

    this.enable_create = clientObject && clientObject.enable_create ? clientObject.enable_create : false;
    this.enable_update = clientObject && clientObject.enable_update ? clientObject.enable_update : false;
    this.enable_delete = clientObject && clientObject.enable_delete ? clientObject.enable_delete : false;
    this.enable_offline_write = clientObject && clientObject.enable_offline_write ? clientObject.enable_offline_write : false;
    this.enable_optimistic_locking = clientObject && clientObject.enable_optimistic_locking ? clientObject.enable_optimistic_locking : false;

    this.schemaMap = {};

    this.storeObjectName = objectName;
    this.storeSchemaArray = schemaArray;
    this.storeClientObject = clientObject;

    var error = EError.getInstance();

    this.HMOperationType_CREATE = 0;
    this.HMOperationType_UPDATE = 1;
    this.HMOperationType_LIST   = 2;
    this.HMOperationType_DELETE = 3;

    // Init Logic
    for(var schemaArrayCount=0; schemaArrayCount < schemaArray.length; schemaArrayCount++) {

        var schemaDictionary = schemaArray[schemaArrayCount];
        var metaData1 = new FieldMetadata(schemaDictionary);

        this.schemaMap[schemaDictionary.name] = metaData1;
        this.schema.push(metaData1);
    }
    for(var schemaCount=0; schemaCount < self.schema.length; schemaCount++) {

        var metaData2 = self.schema[schemaCount];

        if(metaData2.isRequired() && !metaData2.isKey())
            self.requiredFields.push(metaData2.getName());

        if(metaData2.isKey())
            self.keyField = metaData2.getName();

        if(metaData2.getType() == metaData2.EValueType_NSFILE)
            self.fileFields.push(metaData2.getName());
    }
    // Init Logic

    // Private Functions
    function privateValidate(params, operationType) {

        return new Promise(function(resolve, reject) {

            switch(operationType) {

                case self.HMOperationType_CREATE :	// Check if all required fields are passed
                    for(var requiredCountCreate = 0; requiredCountCreate < self.requiredFields.length; requiredCountCreate++) {

                        var fieldNameCreate = self.requiredFields[requiredCountCreate];
                        var requiredMetadataCreate = self.schemaMap[fieldNameCreate];

                        if(!(params[fieldNameCreate] || params[fieldNameCreate] === false) && !requiredMetadataCreate.hasParent() && !requiredMetadataCreate.isKey()) {

                            reject(error.getErrorObject(error.MISSING_INPUT, [fieldNameCreate]));
                        }
                        if(requiredMetadataCreate.isKey()) {

                            reject(error.getErrorObject(KEY_ON_CREATE));
                        }
                        if(requiredMetadataCreate.hasParent() && params.fieldNameCreate && requiredMetadataCreate.getType() == requiredMetadataCreate.EValueType_NUMERIC) {

                            if(params.fieldNameCreate < 1) {

                                reject(error.getErrorObject(KEY_GREATER_THAN_ZERO));
                            }
                        }
                    }
                    // Resolve if validated Succesfully
                    resolve(true);
                    break;

                case self.HMOperationType_UPDATE :	// Check if all required fields are passed
                    for(var requiredCountUpdate = 0; requiredCountUpdate < self.requiredFields.length; requiredCountUpdate++) {

                        var fieldNameUpdate = self.requiredFields[requiredCountUpdate];
                        var requiredMetadataUpdate = self.schemaMap[fieldNameUpdate];

                        if(!params[fieldNameUpdate] && !requiredMetadataUpdate.hasParent() && !requiredMetadataUpdate.isKey()) {

                            reject(error.getErrorObject(error.MISSING_INPUT, [fieldNameUpdate]));
                        }
                        if(!requiredMetadataUpdate.isUpdateable()) {

                            reject(error.getErrorObject(error.UPDATE_NOT_ALLOWED, [fieldNameUpdate, self.name]));
                        }
                    }
                    // Resolve if validated Succesfully
                    resolve(true);
                    break;

                case self.HMOperationType_LIST : break;

                case self.HMOperationType_DELETE : break;

                default :	reject(error.getErrorObject(error.UNSUPPORTED_OPERATION));
                    break;
            }
        });

    }
    function genericCreate(url, object, session) {

        return new Promise(function(resolve, reject) {

            if(self.enableOfflineWrite === true)
            {
                if (isOnline) {
                    //online previous functionality will work
                } else {
                    var objArray = [];

                    if(localStorage.getItem('offline_objects'))
                    {
                        objArray = JSON.parse(localStorage.getItem(('offline_objects')));
                    }
                    //set data to localstorage
                    var obj = {};
                    //obj.id = offlineQueueIndex++;
                    obj.storeObjectName = self.storeObjectName;
                    obj.storeSchemaArray = self.storeSchemaArray;
                    obj.storeClientObject = self.storeClientObject;
                    obj.data = object;
                    obj.operation = self.HMOperationType_CREATE;
                    obj.execfailed = false;
                    objArray.push(obj);

                    localStorage.removeItem("offline_objects");
                    localStorage.setItem("offline_objects", JSON.stringify(objArray));

                    resolve(error.getErrorObject(error.ADDED_TO_OFFLINE_QUEUE));

                    return;
                }
            }

            session.getAuthToken().then(
                function(token){

                    var method  = "POST";
                    var headers = {};
                    var data    = "";
                    var toSend  = "";

                    var formData = new FormData();

                    var hasObject = false;
                    var hasFile = false;
                    // Check if object has nested object field
                    for(var objectKey in object) {

                        if(self.fileFields.indexOf(objectKey) !== -1){
                            hasFile = true;
                        }

                        if(object[objectKey] !== null && typeof object[objectKey] === 'object') {
                            hasObject = true;
                            break;
                        }
                    }

                    // Build data
                    if(hasObject && !(hasFile)) {

                        headers = {"Content-type":"application/json", "Accept":"application/json", "Authorization":"Bearer " + token};
                        toSend = JSON.stringify(object).replace(/&/g,'%26');

                    } else {

                        for(var key in object) {

                            if(self.fileFields.length > 0)
                                formData.append(key, object[key]);
                            else
                                data = data + "&" + key + "=" + encodeURIComponent(object[key]);
                        }

                        if(data.length > 0) {

                            headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
                            toSend = data;

                        } else {

                            headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
                            toSend = formData;
                        }
                    }


                    HM_HTTPRequest(url, method, headers, toSend).then(
                        function(response) {

                            resolve(response.data);
                        },
                        function(response) {

                            reject(response);
                        });

                },
                function(){

                    reject(response);
                });
        });

    }

    function privateCreate(object, session) {

        return new Promise(function(resolve, reject) {

            var url     = Constants.getUrl() + Constants.getSpecificServiceUrl(self.name);
            genericCreate(url, object, session).then(
                function(response) {

                    resolve(response);
                },
                function(response) {

                    reject(response);
                });
        });
    }
    function privateCreateRelated(objectID, relationName, relatedObject, session) {

        return new Promise(function(resolve, reject) {

            var url     = Constants.getUrl() + Constants.getRelatedServiceUrl(self.name, objectID, relationName);
            genericCreate(url, relatedObject, session).then(
                function(response) {

                    resolve(response);
                },
                function(response) {

                    reject(response);
                });
        });
    }
    function checkConditions(checkSchema) {

        return new Promise(function(resolve, reject) {

            // Check Verify
            ISession.getInstance().then(
                function(session) {

                    session.getAuthToken().then(
                        function(token) {

                            if(checkSchema) {

                                if(!self.schema) {

                                    self.getSchema.then(
                                        function(response) {

                                            resolve(session);
                                        },
                                        function(response) {

                                            reject(response);
                                        });


                                }else {
                                    resolve(session);
                                }

                            }else {

                                resolve(session);
                            }
                        },
                        function(response) {

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });
        });
    }
    // Private Functions

    // Public Functions
    this.validateInputs = function(params, operationType) {

        return new Promise(function(resolve, reject) {

            if(!self.schema) {

                self.getSchema.then(
                    function(response) {

                        privateValidate(params, operationType).then(
                            function(response) {

                                resolve(true);
                            },
                            function(response) {

                                reject(response);
                            });
                    },
                    function(response) {

                        reject(response);
                    });
            }else {

                privateValidate(params, operationType).then(
                    function(response) {

                        resolve(true);
                    },
                    function(response) {

                        reject(response);
                    });
            }
        });
    };
    this.getName = function() {

        return self.name;
    };
    this.getKeyField = function() {

        return self.keyField;
    };
    this.getSchema = function() {

        return new Promise(function(resolve, reject)
        {
            if(!self.name)
                reject(error.getErrorObject(error.MISSING_INPUT, ["Object Name"]));

            if(self.schema)
                resolve(self.schema);

            checkConditions(false).then(
                function(session) {

                    session.getAuthToken().then(
                        function(token){

                            var url     = Constants.getUrl() + Constants.getServiceMetadataUrl(self.name);
                            var method  = "GET";
                            var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};

                            HM_HTTPRequest(url, method, headers).then(
                                function(response) {

                                    var array = response.data;

                                    if(schemaArray.length > 0) {

                                        self.schema = [];
                                        self.requiredFields = [];
                                        self.fileFields = [];
                                        self.schemaMap = {};

                                        for(var schemaArrayCount=0; schemaArrayCount < array.length; schemaArrayCount++) {

                                            var schemaDictionary = array[schemaArrayCount];
                                            var metaData1 = new FieldMetadata(schemaDictionary);

                                            self.schemaMap[schemaDictionary.name] = metaData1;
                                            self.schema.push(metaData1);
                                        }
                                        for(var schemaCount=0; schemaCount < self.schema.length; schemaCount++) {

                                            var metaData2 = self.schema[schemaCount];

                                            if(metaData2.isRequired() && !metaData2.isKey())
                                                self.requiredFields.push(metaData2.getName());

                                            if(metaData2.isKey())
                                                self.keyField = metaData2.getName();

                                            if(metaData2.getType() == metaData2.EValueType_NSFILE)
                                                self.fileFields.push(metaData2.getName());
                                        }

                                        resolve(self.schema);

                                    }else {

                                        reject(error.getErrorObject(error.UNKNOWN_ERROR));
                                    }
                                },
                                function(response) {

                                    reject(response);
                                });
                        },
                        function(){

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });
        });
    };
    this.create = function(object) {

        return new Promise(function(resolve, reject) {


            checkConditions(true).then(
                function(session) {

                    if(!object)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Object"]));
                    if(!self.name)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Name"]));

                    self.validateInputs(object, self.HMOperationType_CREATE).then(
                        function(response) {

                            privateCreate(object, session).then(
                                function(response) {

                                    var clientObject = new IClientObject(self, response);
                                    resolve(clientObject);
                                },
                                function(response) {

                                    reject(response);
                                });
                        },
                        function(response) {

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });
        });
    };

    this.addRelated = function(objectID, relationName, relatedObject) {

        return new Promise(function(resolve, reject) {

            checkConditions(true).then(
                function(session) {

                    if(!objectID)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Object ID"]));
                    if(!relatedObject)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Related Object"]));
                    if(!relationName)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Relation Name"]));

                    self.validateInputs(relatedObject, self.HMOperationType_CREATE).then(
                        function(response) {

                            session.getClientObjectType(relationName).then(
                                function(clientObject) {

                                    privateCreateRelated(objectID, relationName, relatedObject, session).then(
                                        function(response) {

                                            var clientObject = new IClientObject(self, response);
                                            resolve(clientObject);
                                        },
                                        function(response) {

                                            reject(response);
                                        });

                                },
                                function() {

                                    reject(response);
                                });
                        },
                        function(response) {

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });
        });

    };
    this.list = function(startIndex, size, fields, bypassCache) {

        return new Promise(function(resolve, reject) {

            checkConditions(true).then(
                function(session) {

                    if(!startIndex)
                        startIndex = 0;
                    if(!size)
                        size = 50;

                    session.getAuthToken().then(
                        function(token){


                            var method  = "GET";
                            var url     = Constants.getUrl() + Constants.getServiceUrlPaginated(self.name, startIndex, size);
                            var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};

                            if(fields && fields.length > 0) {

                                for(var i=0; i < fields.length; i++) {

                                    url = url + "&fields=" + fields[i];
                                }

                            }

                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function(response) {

                                    var array = [];
                                    var data  = response.data;

                                    if(response && data.length > 0) {

                                        for(var i=0; i < data.length; i++) {

                                            var object = data[i];

                                            var clientObject = new IClientObject(self, object);
                                            array.push(clientObject);
                                        }

                                        resolve(array);

                                    }else {

                                        reject(error.getErrorObject(error.NO_CONTENT));
                                    }
                                },
                                function(response) {

                                    reject(response);
                                });

                        },
                        function(){

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });

        });
    };
    this.getRelatedObjects = function(id, clientObjectName, startIndex, size, fields, filterParams, filterStatements, bypassCache) {

        return new Promise(function(resolve, reject) {

            checkConditions(true).then(
                function(session) {

                    if(!id)
                        reject(error.getErrorObject(error.MISSING_INPUT,["id"]));
                    if(!clientObjectName)
                        reject(error.getErrorObject(error.MISSING_INPUT,["Related Object Name"]));

                    session.getAuthToken().then(
                        function(token){


                            var method  = "GET";
                            var url     = Constants.getUrl() + Constants.getRelatedServiceUrl(self.name, id, clientObjectName);
                            var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
                            var paramsAdded = 0;

                            // For Fields
                            if(fields && fields.length > 0) {

                                for(var fieldCount=0; fieldCount < fields.length; fieldCount++) {

                                    if(paramsAdded == 1) {

                                        url = url + "&fields=" + fields[fieldCount];

                                    }else {

                                        url = url + "fields=" + fields[fieldCount];
                                        paramsAdded = 1;
                                    }
                                }

                            }
                            // For Start Index
                            if(startIndex >=0) {

                                if(paramsAdded == 1)
                                    url = url + "&start=" + startIndex;
                                else {

                                    url = url + "start=" + startIndex;
                                    paramsAdded = 1;
                                }
                            }
                            // For Size
                            if(size >=0) {

                                if(paramsAdded == 1)
                                    url = url + "&size=" + size;
                                else {

                                    url = url + "size=" + size;
                                    paramsAdded = 1;
                                }
                            }
                            // For Filter Params
                            if(filterParams) {

                                for(var key in filterParams) {

                                    if(paramsAdded == 1)
                                        url = url + "&" + key + "=" + encodeURIComponent(filterParams[key]);
                                    else {

                                        url = url + key + "=" + encodeURIComponent(filterParams[key]);
                                        paramsAdded = 1;
                                    }

                                }
                            }
                            // For Filter Statements
                            if(filterStatements && filterStatements.length > 0) {

                                for(var filterStatementCount=0; filterStatementCount < filterStatements.length; filterStatementCount++) {

                                    if(paramsAdded == 1)
                                        url = url + "&" + filterStatements[filterStatementCount];
                                    else {

                                        url = url + filterStatements[filterStatementCount];
                                        paramsAdded = 1;
                                    }
                                }
                            }

                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function(response) {

                                    var array = [];
                                    var data  = response.data;

                                    if(response && data.length > 0) {

                                        session.getClientObjectType(clientObjectName).then(
                                            function(relatedClientObjectType)
                                            {
                                                for(var dataCount=0; dataCount < data.length; dataCount++) {

                                                    var object = data[dataCount];
                                                    var clientObject = new IClientObject(relatedClientObjectType, object);
                                                    array.push(clientObject);
                                                }

                                                resolve(array);

                                            },
                                            function(error)
                                            {
                                                reject(error);
                                            });


                                    }else {

                                        reject(error.getErrorObject(error.NO_CONTENT));
                                    }
                                },
                                function(response) {

                                    reject(response);
                                });

                        },
                        function(){

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });

        });
    };
    this.search = function(clientObjectName, startIndex, size, filterParams, fields, orderFields, orderDirective, groupFields, filterStatements, bypassCache) {

        return new Promise(function(resolve, reject) {

            checkConditions(true).then(
                function(session) {


                    session.getAuthToken().then(
                        function(token){


                            var method  = "GET";
                            var url     = Constants.getUrl() + Constants.getSearchServiceUrl(clientObjectName);
                            var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
                            var paramsAdded = 0;

                            // For Fields
                            if(fields && fields.length > 0) {

                                for(var fieldCount=0; fieldCount < fields.length; fieldCount++) {

                                    if(paramsAdded == 1) {

                                        url = url + "&fields=" + fields[fieldCount];

                                    }else {

                                        url = url + "fields=" + fields[fieldCount];
                                        paramsAdded = 1;
                                    }
                                }

                            }
                            // For Start Index
                            if(startIndex >=0) {

                                if(paramsAdded == 1)
                                    url = url + "&start=" + startIndex;
                                else {

                                    url = url + "start=" + startIndex;
                                    paramsAdded = 1;
                                }
                            }
                            // For Size
                            if(size >=0) {

                                if(paramsAdded == 1)
                                    url = url + "&size=" + size;
                                else {

                                    url = url + "size=" + size;
                                    paramsAdded = 1;
                                }
                            }
                            // For Grouped Fields
                            if(groupFields && groupFields.length > 0) {

                                for(var groupFieldCount=0; groupFieldCount < groupFields.length; groupFieldCount++) {

                                    if(paramsAdded == 1)
                                        url = url + "&group_field=" + groupFields[groupFieldCount];
                                    else {

                                        url = url + "group_field=" + groupFields[groupFieldCount];
                                        paramsAdded = 1;
                                    }

                                }
                            }
                            // For Order Fields
                            if(orderFields && orderFields.length > 0) {

                                for(var orderFieldCount=0; orderFieldCount < orderFields.length; orderFieldCount++) {

                                    if(paramsAdded == 1)
                                        url = url + "&order_field=" + orderFields[orderFieldCount];
                                    else {

                                        url = url + "order_field=" + orderFields[orderFieldCount];
                                        paramsAdded = 1;
                                    }

                                }
                            }

                            // For order directive
                            if(orderDirective) {

                                if(paramsAdded == 1)
                                    url = url + "&order_directive=" + orderDirective;
                                else {

                                    url = url + "order_directive=" + orderDirective;
                                    paramsAdded = 1;
                                }
                            }

                            // For Filter Params
                            if(filterParams) {

                                for(var key in filterParams) {

                                    if(paramsAdded == 1)
                                        url = url + "&" + key + "=" + filterParams[key];
                                    else {

                                        url = url + key + "=" + filterParams[key];
                                        paramsAdded = 1;
                                    }

                                }
                            }
                            // For Filter Statements
                            if(filterStatements && filterStatements.length > 0) {

                                for(var filterStatementCount=0; filterStatementCount < filterStatements.length; filterStatementCount++) {

                                    if(paramsAdded == 1)
                                        url = url + "&" + filterStatements[filterStatementCount];
                                    else {

                                        url = url + filterStatements[filterStatementCount];
                                        paramsAdded = 1;
                                    }
                                }
                            }

                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function(response) {

                                    var array = [];
                                    var data  = response.data;

                                    if(response && data.length > 0) {

                                        for(var dataCount=0; dataCount < data.length; dataCount++) {

                                            var object = data[dataCount];
                                            var clientObject = new IClientObject(self, object);
                                            array.push(clientObject);
                                        }

                                        resolve(array);

                                    }else {

                                        reject(error.getErrorObject(error.NO_CONTENT));
                                    }
                                },
                                function(response) {

                                    reject(response);
                                });

                        },
                        function(){

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });

        });
    };
    this.get = function(objectID, bypassCache) {

        return new Promise(function(resolve, reject) {

            checkConditions(true).then(
                function(session) {

                    session.getAuthToken().then(
                        function(token){


                            var method  = "GET";
                            var url     = Constants.getUrl() + Constants.getServiceUrlById(self.name, objectID);
                            var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};


                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function(response) {

                                    var data  = response.data;
                                    data.ETag = response.headers.ETag;
                                    if(response && data) {

                                        var clientObject = new IClientObject(self, data);
                                        resolve(clientObject);
                                    }else {
                                        reject(error.getErrorObject(error.NO_CONTENT));
                                    }
                                },
                                function(response) {

                                    reject(response);
                                });

                        },
                        function(){

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });

        });
    };
    this.getByField = function(objectID, fields, bypassCache) {

        return new Promise(function(resolve, reject) {

            checkConditions(true).then(
                function(session) {

                    session.getAuthToken().then(
                        function(token){


                            var method  = "GET";
                            var url     = Constants.getUrl() + Constants.getServiceUrlById(self.name, objectID);
                            var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
                            var paramsAdded = 0;

                            // For Fields
                            if(fields && fields.length > 0) {

                                for(var fieldCount=0; fieldCount < fields.length; fieldCount++) {

                                    if(paramsAdded == 1) {

                                        url = url + "&fields=" + fields[fieldCount];

                                    }else {

                                        url = url + "?fields=" + fields[fieldCount];
                                        paramsAdded = 1;
                                    }
                                }

                            }

                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function(response) {
                                    var data  = response.data;
                                    data.ETag = response.headers.ETag;
                                    if(response && data) {

                                        var clientObject = new IClientObject(self, data);
                                        resolve(data);
                                    }else {
                                        reject(error.getErrorObject(error.NO_CONTENT));
                                    }
                                },
                                function(response) {

                                    reject(response);
                                });

                        },
                        function(){

                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });

        });
    };

    this.getRequiredFieldNames = function() {

        return new Promise(function(resolve, reject)
        {
            if(!self.schema) {

                self.getSchema.then(
                    function(response) {

                        resolve(self.requiredFields);
                    },
                    function(response) {

                        reject(response);
                    });
            }

            resolve(self.requiredFields);
        });
    };
    this.getFileFieldNames = function() {

        return new Promise(function(resolve, reject)
        {
            if(!self.schema) {

                self.getSchema.then(
                    function(response) {

                        resolve(self.fileFields);
                    },
                    function(response) {

                        reject(response);
                    });
            }

            resolve(self.requiredFields);
        });
    };
    this.isIdentityObject = function() {

        return isIdentityObject;
    };

    this.createBatch = function(file,format){
        return new Promise(function(resolve,reject){
            if(file === undefined || file === null) {
                reject("File parameter required.");
            }
            else if(format === null || format === undefined || format === ""){
                reject("Format of the file not specified.");
            }
            else{
                ISession.getInstance().then(
                    function(session){
                        session.getAuthToken().then(
                            function(token){

                                var url = Constants.getUrl() + Constants.getBulkCreateUrl(self.name) + "?format="+format;                            var method = "POST";
                                var headers = {"Authorization":"Bearer " + token};

                                var formdata = new FormData();
                                formdata.append("file",file);
                                HM_HTTPRequest(url,method,headers,formdata,null).then(
                                    function(response){
                                        if(response === null){
                                            reject(error.getErrorObject(error.UNKNOWN_ERROR));
                                        }
                                        else if(response.status !== 200){
                                            reject(error.getErrorObject(response.data.code));
                                        }
                                        else{
                                            resolve(response);
                                        }
                                    },
                                    function(error){
                                        reject(error);
                                    });
                            },
                            function(error){
                                reject(error);
                            });
                    },
                    function(error){
                        reject(error);
                    });
            }
        });
    };

    this.getCount = function(filterParams){
        return new Promise(function(resolve,reject){
            ISession.getInstance().then(
                function(session){
                    session.getAuthToken().then(
                        function(token){

                            var url = Constants.getUrl() + Constants.getSpecificServiceUrl(self.name);
                            var method = "HEAD";
                            var headers = {"Authorization":"Bearer " + token};

                            var query = "";
                            var paramAdded = 0;
                            for (var param in filterParams){
                                if(paramAdded === 0){
                                    query = query + param + "=" + filterParams[param];
                                    paramAdded = 1;
                                }
                                else{
                                    query = query + "&" + param + "=" + filterParams[param];
                                }
                            }
                            url = url + "?" + query;
                            HM_HTTPRequest(url,method,headers,null,true).then(
                                function(response){
                                    if(response.headers['Content-Length'] !== undefined && response.headers['Content-Length'] !== null){
                                        resolve(response.headers['Content-Length']);
                                    }
                                    else{
                                       resolve(0);
                                    }
                                },
                                function(error) {
                                    reject(error);
                                });
                        },
                        function(error){
                            reject(error);
                        });
                },
                function(error){
                    reject(error);
                });
        });
    };

    this.delete = function(filterParams){
        return new Promise(function(resolve,reject){
            ISession.getInstance().then(
                function(session){
                    session.getAuthToken().then(
                        function(token){

                            var url = Constants.getUrl() + Constants.getSpecificServiceUrl(self.name);
                            var method = "DELETE";
                            var headers = {"Authorization":"Bearer " + token};

                            var query = "";
                            var paramAdded = 0;
                            for (var param in filterParams){
                                if(paramAdded === 0){
                                    query = query + param + "=" + filterParams[param];
                                    paramAdded = 1;
                                }
                                else{
                                    query = query + "&" + param + "=" + filterParams[param];
                                }
                            }
                            url = url + "?" + query;
                            HM_HTTPRequest(url,method,headers,null,true).then(
                                function(response){
                                    resolve(response);
                                },
                                function(error) {
                                    reject(error);
                                });
                        },
                        function(error){
                            reject(error);
                        });
                },
                function(error){
                    reject(error);
                });
        });
    };
}

/**
 * Created by pradeep.kp on 28-04-2016.
 */
function IPoll(poll, answered){

    this.poll_id = null;
    this.title = null;
    this.type = null;
    this.object_id = null;
    this.clientObjectType = {};
    this.choices = [];
    this.answered = false;
    this.start_time = null;
    this.end_time = null;

    var self = this;

    var error = EError.getInstance();
    /*Initialization*/
    if(poll.poll_id){
        self.poll_id = poll.poll_id;
    }
    if(poll.title){
        self.title = poll.title;
    }
    if(poll.type){
        self.type = poll.type;
    }

    if(poll.object){
        ISession.getInstance().then(
            function(session){
                session.getClientObjectType(poll.object).then(
                    function(clientObjectType){
                        self.clientObjectType = clientObjectType;
                    },
                    function(error){
                        reject("Failed to fetch metadata.");
                    });
            },
            function(error){
                reject("No Session present.");
            }
        );
    }

    if(poll.object_id){
        self.object_id = poll.object_id;
    }
    if(poll.start_time){
        self.start_time = new Date(poll.start_time);
    }
    if(poll.end_time){
        self.end_time = new Date(poll.end_time);
    }
    if(answered !== null && answered !== "" && answered !== undefined){
        self.answered = true;
    }
    /*choices iteration*/
    for(var i=0; i < poll.choices.length; i++) {
        var choice = new IPollChoice(self,poll.choices[i]);
        self.choices.push(choice);
    }
    /*choices iteration*/
    /*Initialization*/

    /*Getters and setters*/
    this.getId = function (){
        return self.poll_id;
    };

    this.getTitle = function (){
        return self.title;
    };

    this.getType = function(){
        return self.type;
    };

    this.isAnswered = function(){
        return self.answered;
    };

    this.getStartTime = function(){
        return self.start_time;
    };

    this.getEndTime = function(){
        return self.end_time;
    };

    this.getObjectType = function(){
        return self.clientObjectType;
    };

    this.getObjectId = function(){
        return self.object_id;
    };

    this.getChoices = function(){
        return self.choices;
    };

    this.setAnswered = function(answered){
        self.answered = answered;
    };
    /*Getters and setters*/

    this.getPollResults = function(bypassCache) {
        return new Promise(function (resolve, reject) {
            HM_Log("get poll results called");
            ISession.getInstance().then(
                function (session) {
                    session.getAuthToken().then(
                        function (token) {
                            var url = Constants.getUrl() + Constants.getPollResultsUrl(self.getTitle());
                            var method = "GET";
                            var headers = {
                                "Content-type": "application/x-www-form-urlencoded",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + token
                            };
                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function (response) {
                                    if(response.status !== 204 || response.status!== 404){
                                        resolve(response.data);
                                    }
                                    else{
                                        var emptyMap = {};
                                        resolve(emptyMap);
                                    }
                                },
                                function (error) {
                                    reject(error);
                                }
                            );
                        },
                        function (error) {
                            reject(error);
                        });
                },
                function (error) {
                    alert("Session failed to initialize");
                    reject(error);
                });
        });
    };

    this.postPollAnswer = function(choices){
        return new Promise(function (resolve, reject) {
            if (choices === null || choice === {} || choice === undefined) {
                reject(error.getErrorObject(error.MISSING_INPUT, ["Poll Choice"]));
                return;
            }

            for(var i = 0 ; i < choices.length ; i++){
                if(choices[i].getPoll() !== self){
                    reject("Poll choices do not belong to this Poll");
                    return;
                }
            }

            ISession.getInstance().then(
                function (session) {
                    session.getAuthToken().then(
                        function (token) {
                            var params = [];
                            var headers = {
                                "Content-type": "application/x-www-form-urlencoded",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + token
                            };
                            var paramAdded = 0;
                            var isWordCloudType = (self.getType() === EPollType.WORD_CLOUD);
                            var pollChoiceIds = [];
                            for(i=0; i < choices.length; i++){
                                pollChoiceIds.push(choices[i].poll_choice_id);
                                if(isWordCloudType && (choices[i].getWordCloudResponse() !== null || choices[i].getWordCloudResponse() !== "" || choices[i].getWordCloudResponse() !== undefined)){
                                    var key = "text_" + choices[i].poll_choice_id;
                                    var value = choices[i].getWordCloudResponse();
                                    var paramToPush = key + "=" + value;
                                    if(paramAdded === 0){
                                        params = paramToPush;
                                        paramAdded = 1;
                                    }
                                    else{
                                        params = params + "&" + paramToPush;
                                    }
                                    //deinitialize the variable;
                                    paramToPush = "";
                                }
                            }
                            var choiceIds = "";
                            var choicesAdded = 0;
                            for(var k = 0 ; k < pollChoiceIds.length ; k++){
                                if(choicesAdded === 0){
                                    choiceIds = choiceIds + "poll_choice_id=" + pollChoiceIds[k];
                                    choicesAdded = 1;
                                }
                                else{
                                    choiceIds = choiceIds + "&poll_choice_id=" + pollChoiceIds[k];
                                }
                            }

                            if(paramAdded === 0){
                                params = choiceIds;
                                paramAdded = 1;
                            }else{
                                params = params + "&" + choiceIds;
                            }

                            var url = Constants.getUrl() + Constants.getPollChoiceResponseURL(self.getTitle());
                            var method = "POST";

                            HM_HTTPRequest(url,method,headers,params,true).then(
                                function(response){
                                    if(response === null){
                                        reject(error.getErrorObject(24,"Unexpected Poll error"));
                                        return;
                                    }
                                    if(response.status !== 200 || response.status === 204){
                                        reject(error.getErrorObject(response.data.code,response.data.message));
                                    }
                                    else{
                                        resolve(true);
                                    }
                                },
                                function(error){
                                    reject(error);
                                }
                            );
                        });
                });
        });
    };

    this.getPollResponses= function(startTime, endTime, bypassCache) {
        return new Promise(function (resolve, reject) {
            HM_Log("get poll results for duration called");
            if(startTime === null  || startTime === "" || startTime === undefined){
                reject(error.getErrorObject(error.MISSING_INPUT, ["Start time"]));
                return;
            }
            if(endTime === null  || endTime === "" || endTime === undefined){
                reject(error.getErrorObject(error.MISSING_INPUT, ["End Time"]));
                return;
            }
            ISession.getInstance().then(
                function (session) {
                    session.getAuthToken().then(
                        function (token) {
                            var url = Constants.getUrl() + Constants.getPollResponsesUrl(self.getTitle());
                            var method = "GET";
                            var headers = {
                                "Content-type": "application/x-www-form-urlencoded",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + token
                            };
                            var params = "?startTime=" + startTime + "&endTime=" + endTime;
                            url = url + params;

                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function (response) {
                                    if(response.status !== 204 || response.status!== 404){
                                        resolve(response.data);
                                    }
                                    else{
                                        var emptyMap = {};
                                        resolve(emptyMap);
                                    }
                                },
                                function (error) {
                                    reject(error);
                                }
                            );
                        },
                        function (error) {
                            reject(error);
                        });
                },
                function (error) {
                    alert("Session failed to initialize");
                    reject(error);
                });
        });
    };

    this.getPollResponsesAsCSV = function(startTime, endTime, bypassCache) {
        return new Promise(function (resolve, reject) {
            HM_Log("get poll results for duration called");
            if(startTime === null  || startTime === "" || startTime === undefined){
                reject(error.getErrorObject(error.MISSING_INPUT, ["Start time"]));
                return;
            }
            if(endTime === null  || endTime === "" || endTime === undefined){
                reject(error.getErrorObject(error.MISSING_INPUT, ["End Time"]));
                return;
            }
            ISession.getInstance().then(
                function (session) {
                    session.getAuthToken().then(
                        function (token) {
                            var url = Constants.getUrl() + Constants.getPollResponsesUrl(self.getTitle());
                            var method = "GET";
                            var headers = {
                                "Content-type": "application/x-www-form-urlencoded",
                                "Accept": "application/octet-stream",
                                "Authorization": "Bearer " + token
                            };
                            var params = "?startTime=" + startTime + "&endTime=" + endTime;
                            url = url + params;

                            HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                                function (response) {
                                    if(response.status !== 204 || response.status!== 404){
                                        var responseData = response.data;
                                        if (!responseData.match(/^data:text\/csv/i)) {
                                            responseData = 'data:text/csv;charset=utf-8,' + responseData;
                                        }
                                        var data = encodeURI(responseData);
                                        var downloadLink = document.createElement('a');
                                        downloadLink.setAttribute('href', data);
                                        downloadLink.setAttribute('download', 'PollResponses.csv');
                                        downloadLink.click();
                                        downloadLink.remove();
                                        resolve("File Downloaded Successfully");
                                    }
                                    else if(response.status === 204){
                                        resolve("No Responses Data");
                                    }
                                    else{
                                        reject("Error Downloading File");
                                    }
                                },
                                function (error) {
                                    reject(error);
                                }
                            );
                        },
                        function (error) {
                            reject(error);
                        });
                },
                function (error) {
                    alert("Session failed to initialize");
                    reject(error);
                });
        });
    };
    var deletePollchoice = function(choiceId){
        return new Promise(function(resolve,reject){
            ISession.getInstance().then(
                function (session) {
                    session.getAuthToken().then(
                        function (token) {
                            var url = Constants.getUrl() + Constants.getPollChoiceDeleteUrl(self.title,choiceId);
                            var method = "DELETE";
                            var headers = {"Authorization":"Bearer " + token,
                                "Content-Type":"application/x-www-form-urlencoded"
                            };
                            HM_HTTPRequest(url,method,headers,null,true).then(
                                function(success){
                                    if(success.status === 200){
                                        resolve(success);
                                    }
                                    else{
                                        resolve("Choice with choiceID " + choiceId + "deleted successfully.");
                                    }
                                },
                                function(error){
                                    reject(error);
                                });
                        },
                        function (error) {
                            reject(error);
                        });
                },
                function(error){
                    reject(error);
                });
        });
    };

    var updatePollChoice = function(url, method, headers, data){
        HM_HTTPRequest(url,method,headers,data,true).then(
            function(response){
                console.log(response);
            },
            function(error){
                console.log(error);
            }
        );
    };

    var validatePollDataForType = function(pollType, words, choices) {

        if (pollType !== 'WORD_CLOUD') {
            if (choices !== null && choices !== undefined) {
                if (pollType === 'TRUE_FALSE') {
                    if (choices.length !== 2){
                        return "There should be only two choices allowed.";
                    }
                }

                if (pollType === 'SINGLE_CHOICE_TEXT') {
                    if (choices.length === 0){
                        return "There should be atleast one choice for this type of Poll.";
                    }
                }

                if (pollType === 'MULTI_CHOICE_TEXT') {
                    if (choices.length === 0){
                        return "There should be atleast one choice for this type of Poll.";
                    }
                }

                if (pollType === 'NUMERIC_RATING') {
                    if (choices.length > 0 && choices.length <= 5) {
                        for (var i = 0; i < choices.length; i++) {
                            if (isNaN(choices[i])) {
                                return "Only Numbers are allowed for choices for this type of Poll.";
                            }
                        }
                    } else {
                        return "Choices can be a minimum of 1 and maximum of 5 for this type of Poll.";
                    }
                }
            }else{
                return "Please enter the choice for the Poll.";
            }
        }

        if(pollType === 'WORD_CLOUD'){
            if(words === 0 || words === undefined || words ===null){
                return "Provide the number of words the user can give in the responses.";
            }
        }
        return true;
    };

    this.updatePoll = function(pollTitle, startDate, endDate, pollType, words, choices){
        return new Promise(function(resolve,reject){

            var type = ["TRUE_FALSE","MULTI_CHOICE_TEXT","SINGLE_CHOICE_TEXT","NUMERIC_RATING","WORD_CLOUD"];
            var validated = false;
            if(pollTitle === null || pollTitle === "" || pollTitle === undefined){
                reject("Poll title required.");
            }

            else if(startDate === null || startDate === "" || startDate === undefined){
                reject("Poll Start Date required.");
            }

            else if(endDate === null || endDate === "" || endDate === undefined){
                reject("Poll End Date required.");
            }

            else if(pollType === null || pollType === "" || pollType === undefined){
                reject("Poll Type required.");
            }

            else if(startDate > endDate){
                reject("Start Date should before or same as End Date.");
            }

            else if(type.indexOf(pollType) === -1){
                reject("Invalid Poll Type");
            }

            else{
                validated = validatePollDataForType(pollType, words, choices);
            }

            if(validated !== true) {
                reject(validated);
                return;
            }

            if(self.choices.length !== 0){
                for(var i = 0 ; i < self.choices.length; i++){
                    if(self.choices[i].poll_choice_id !== undefined && self.choices[i].poll_choice_id !== null && self.choices[i].poll_choice_id !== ""){
                        deletePollchoice(self.choices[i].poll_choice_id);
                    }
                }
            }
            ISession.getInstance().then(
                function(session){
                    session.getAuthToken().then(
                        function(token) {
                            var url = Constants.getUrl()+Constants.pollUpdateUrl(self.title);
                            var method  = "POST";
                            var headers = {"Authorization":"Bearer " + token};
                            var data = new FormData();
                            data.append("title",pollTitle);
                            data.append("start_date",startDate.toISOString());
                            data.append("end_date",endDate.toISOString());
                            data.append("type",pollType);

                            if((choices === null || choices.length === 0) && (words === null || words === undefined)){
                                HM_HTTPRequest(url, method, headers, data, null).then(
                                    function(response)
                                    {
                                        resolve("Poll Updated successfully");
                                    },
                                    function(error)
                                    {
                                        reject(error);
                                    });
                            }
                            else{
                                var i = 0;
                                if(pollType !== "WORD_CLOUD"){
                                    for(i = 0 ; i < choices.length ; i++){
                                        data.append("text",choices[i].text);
                                        updatePollChoice(url,method,headers,data);
                                        data.delete("text");
                                    }
                                }
                                else{
                                    data.append("text","");
                                    for(i = 0 ; i < words ; i++){
                                        updatePollChoice(url,method,headers,data);
                                    }
                                }
                            }
                            resolve("Poll Updated successfully");
                        },
                        function(error){
                            reject(error);
                        });
                },
                function(error){
                    reject("Session Failed to Initialize.");
                });
        });
    };

    this.deletePoll = function(){
        return new Promise(function (resolve, reject) {
            ISession.getInstance().then(
                function (session) {
                    session.getAuthToken().then(
                        function (token) {
                            var url = Constants.getUrl() + Constants.pollDeleteUrl(self.getTitle());
                            var method = "DELETE";
                            var headers = {
                                "Accept": "application/json",
                                "Authorization": "Bearer " + token
                            };
                            HM_HTTPRequest(url, method, headers, null, null).then(
                                function (response) {
                                    console.log("Poll " + self.getTitle() + " deleted Successfully");
                                    resolve(response);
                                },
                                function (error) {
                                    console.log("Error deleting poll");
                                    reject(error);
                                });
                        },
                        function (error) {
                            reject(error);
                        });
                },
                function (error) {
                    alert("Session failed to initialize");
                    reject(error);
                });
        });
    };
}

/**
 * Created by pradeep.kp on 28-04-2016.
 */
function IPollChoice(poll, choice) {

    this.poll = {};
    this.text = null;
    this.poll_choice_id = null;
    this.image = null;
    this.wordCloudResponse = null;

    var self = this;

    /*Initialization*/
    if (poll) {
        self.poll = poll;
    }
    if (choice.text) {
        self.text = choice.text;
    }
    if (choice.poll_choice_id) {
        self.poll_choice_id = choice.poll_choice_id;
    }
    if (choice.image) {
        self.image = choice.image;
    }
    if (choice.wordCloudkey !== null && choice.wordCloudkey !== "" && choice.wordCloudkey !== undefined) {
        this.wordCloudResponse = choice.worldCloudKey.value;
    }
    /*Initialization*/
    /*getters*/
    this.getPoll = function (){
        return self.poll;
    };

    this.getText = function (){
        return self.text;
    };

    this.getImage = function (){
        return self.image;
    };

    this.getId = function () {
        return self.poll_choice_id;
    };

    this.getWordCloudResponse = function(){
        return self.wordCloudResponse;
    };
    /*getters*/


}

/*
 *  Object Class For Application Using Function Prototyping
 */
var ISession = function (storedObject) {

    // init prop
    this.prop = "";
    var self = this;

    // Private Members
    this.appName = storedObject && storedObject.appName ? storedObject.appName : null;
    this.appKey = storedObject && storedObject.appKey ? storedObject.appKey : null;
    this.appSecret = storedObject && storedObject.appSecret ? storedObject.appSecret : null;
    this.appUrl = storedObject && storedObject.appUrl ? storedObject.appUrl : null;
    this.app_session = storedObject && storedObject.app_session ? storedObject.app_session : null;
    this.policy = storedObject && storedObject.policy ? storedObject.policy : null;
    this.currentUser = storedObject && storedObject.currentUser ? storedObject.currentUser : null;

    this.saml_idp_id = storedObject && storedObject.saml_idp_id ? storedObject.saml_idp_id : null;
    this.authentication_provider = storedObject && storedObject.authentication_provider ? storedObject.authentication_provider : null;
    this.login_url = storedObject && storedObject.login_url ? storedObject.login_url : null;

    this.clientObjectTypes = storedObject && storedObject.clientObjectTypes ? storedObject.clientObjectTypes : [];

    this.authToken = storedObject && storedObject.authToken ? storedObject.authToken : null;
    this.refreshToken = storedObject && storedObject.refreshToken ? storedObject.refreshToken : null;
    this.token_type = storedObject && storedObject.token_type ? storedObject.token_type : null;
    this.tokenExpiration = storedObject && storedObject.tokenExpiration ? storedObject.tokenExpiration : null;
    this.sessionExpiration = storedObject && storedObject.tokenExpiration ? storedObject.tokenExpiration : null;

    this.is_update_alert_shown = storedObject && storedObject.is_update_alert_shown ? storedObject.is_update_alert_shown : null;
    this.allowTocheckIn = storedObject && storedObject.allowTocheckIn ? storedObject.allowTocheckIn : null;
    this.disable_crashlog_upload = storedObject && storedObject.disable_crashlog_upload ? storedObject.disable_crashlog_upload : null;
    this.loggedInUser = storedObject && storedObject.loggedInUser ? storedObject.loggedInUser : null;

    this.application = storedObject && storedObject.application ? storedObject.application : null;

    this.identityObjectName = storedObject && storedObject.identityObjectName ? storedObject.identityObjectName : null;
    this.identityObjectField = storedObject && storedObject.identityObjectField ? storedObject.identityObjectField : null;
    this.identityObject = storedObject && storedObject.identityObject ? storedObject.identityObjecte : null;

    var error = EError.getInstance();
    // Private Members

    // Private Functions

    /*Function to generate UUID or GUID*/
    var guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    /*
     *  Function to refresh session
     */
    var refreshSession = function()
    {
        return new Promise(function(resolve, reject)
        {
            var instance;

            if(!HM_APP_KEY)
                reject("App Key is missing in the global vars file");
            if(!HM_APP_SECRET)
                reject("App Secret is missing in the global vars file");
            if(!HM_APP_URL)
                reject("App URL is missing in the global vars file");

            instance = new ISession();

            instance.verify().then(
                function(response)
                {
                    localStorage.setItem(HM_APP_KEY + "_stored_session" , JSON.stringify(instance));
                    self = instance;
                    resolve(instance);
                },
                function(response)
                {
                    reject(response);
                });
        });

    };

    /*
     * Function to refresh login
     */
    var refreshLogin = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("refresh token called");

            var url     = Constants.getUrl() + Constants.getTokenUrl();

            self.getAuthToken().then(
                function(token){

                    var refresh_token = localStorage.getItem(HM_REFRESH_TOKEN);
                    var method  = "POST";
                    var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
                    var data = "grant_type=refresh_token&refresh_token=" + refresh_token;

                    HM_HTTPRequest(url, method, headers, data).then(
                        function(response)
                        {
                            if(response.status == 200)
                            {
                                var data = response.data;

                                localStorage.setItem(HM_TOKEN, data.access_token);
                                localStorage.setItem(HM_REFRESH_TOKEN, data.refresh_token);
                                localStorage.setItem(HM_TOKEN_EXPIRY, Math.floor(Date.now() / 1000) + data.expires_in);
                                setTimeout(checkTokenExpiry, 2000);
                            }
                        },
                        function(response)
                        {
                            reject(response);
                        });
                },
                function(){

                    reject(response);
                });

        });

    };
    /*
     * Function to check token expiry
     */
    var checkTokenExpiry = function()
    {

        var token_expiry = localStorage.getItem("HM_TOKEN_EXPIRY");

        HM_Log("token expiry called");
        HM_Log(token_expiry);
        HM_Log(Math.floor(Date.now() / 1000));

        if(token_expiry > (Math.floor(Date.now() / 1000) + 180)) {

            refreshLogin();

        }else {

            setTimeout(checkTokenExpiry, 2000);

        }
    };
    /*
     * Function to remote wipe data
     */
    var remoteWipeData = function()
    {
        localStorage.clear();
    };
    /*
     *  Actual Function to get client object types
     */
    var iGetClientObjectTypes = function ()
    {

        return new Promise(function(resolve, reject)
        {
            HM_Log("get clientObject called");

            self.getAuthToken().then(
                function(token) {

                    var url     = Constants.getUrl() + Constants.getServiceUrl();
                    var method  = "GET";
                    var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};

                    HM_HTTPRequest(url, method, headers, null).then(
                        function(response)
                        {
                            self.clientObjectTypes = [];
                            var array = response.data;
                            for(var i=0; i < array.length; i++) {

                                var oneObject = array[i];
                                var clientObjectType = new IClientObjectType(oneObject.name, oneObject.schema, oneObject);

                                self.clientObjectTypes.push(clientObjectType);
                            }

                            resolve(self.clientObjectTypes);
                        },
                        function(response)
                        {
                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });

        });
    };
    /*
     *  Function to store instance in local storage
     */
    var storeSession = function ()
    {

        localStorage.removeItem(HM_APP_KEY + "_stored_session");
        localStorage.setItem(HM_APP_KEY + "_stored_session", JSON.stringify(self));
    };
    /*
     *  Function to clear instance from local storage
     */
    var clearSession = function ()
    {
        localStorage.removeItem(HM_APP_KEY + "_stored_session");
    };
    var checkPolicy = function()
    {
        return new Promise(function(resolve, reject)
        {
            if(!self.policy) {

                self.deleteStoredSession();
                refreshSession().then(
                    function(session)
                    {
                        resolve(self.policy);
                    },
                    function(error1)
                    {
                        reject(error.getErrorObject(error.APP_VERIFICATION_REQUIRED));
                    });
            }
            else {
                resolve(self.policy);
            }
        });

    };
    // Private Functions


    // Public Functions
    /*
     *  Function for verify call
     */
    this.verify = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("verify called");

            var epoch      = new Date().getTime() + "";
            var hash       = CryptoJS.HmacSHA256(epoch, HM_APP_SECRET);
            var HmacSHA256 = CryptoJS.enc.Base64.stringify(hash);

            var url     = Constants.getUrl() + Constants.getAppUrl();
            var method  = "POST";
            var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json"};
            var data    = "app_key=" + HM_APP_KEY +"&time=" + epoch + "&signature=" + encodeURIComponent(HmacSHA256);


            HM_HTTPRequest(url, method, headers, data).then(
                function(response)
                {
                    var dataDictionary = {};

                    for (var key in response.data) {

                        dataDictionary[key] = response.data[key];

                        if(key == "app_session")
                            self.app_session = response.data[key];

                        if(key == "saml_idp_id")
                            self.saml_idp_id = response.data[key];

                        if(key == "authentication_provider")
                            self.authentication_provider = response.data[key];

                        if(key == "login_url")
                            self.login_url = response.data[key];

                        if(key == "disable_crashlog_upload")
                            self.disable_crashlog_upload = response.data[key];

                        if(key == "identity_service_field")
                            self.identityObjectField = response.data[key];
                    }

                    self.application = new IApplication(dataDictionary);

                    // Need to discuss wether update logic is to be written

                    self.policy = new Policy(null, null, self.application.isPasscodeRequired(), self.application.isAllowRootedAccess(), self.application.getRegistrationMode());

                    storeSession();
                    resolve("App Verification Successful");
                },
                function(response)
                {
                    var data = response.data;
                    var errorCode = data.code;

                    switch (data.code)
                    {
                        case 34 :	self.policy = new Policy(null, true, null, null, null);
                            remoteWipeData();
                            reject(error.getErrorObject(error.USER_DEVICE_REMOTE_WIPE_LOCKED));
                            break;

                        case 32 :	self.policy = new Policy(true, null, null, null, null);
                            reject(error.getErrorObject(error.USER_LOCKED));
                            break;

                        case 7  :	self.reject(error.getErrorObject(error.SIGNATURE_CHECK_ERROR, [HmacSHA256]));
                            break;
                    }

                    storeSession();
                    reject(response);
                });
        });
    };
    /*
     *  Function to get current user
     */
    this.getCurrentUser = function()
    {
        return new Promise(function(resolve, reject)
        {
            checkPolicy().then(
                function(policy)
                {
                    self.getAuthToken().then(
                        function(response) {

                            resolve(self.currentUser);
                        },
                        function(response) {

                            reject(response);
                        });

                },
                function(error)
                {
                    reject(error);
                });

        });

    };
    /*
     *  Function to get identity object
     */
    this.getIdentityObject = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("get identity object called");

            if(!self.identityObjectField) {

                reject(error.getErrorObject(error.IDENTITY_OBJECT_NOT_DEFINED));
            }

            getAuthToken().then(
                function(response) {

                    if(!self.identityObjectField) {

                        reject(error.getErrorObject(error.IDENTITY_OBJECT_NOT_DEFINED));
                    }

                    resolve(self.identityObject);
                },
                function(response) {

                    reject(response);
                });

        });
    };
    /*
     *  Function to get identity object name
     */
    this.getIdentityObjectName = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("get identity object called");

            if(!self.identityObjectField) {

                reject(error.getErrorObject(error.IDENTITY_OBJECT_NOT_DEFINED));
            }

            resolve(self.identityObjectName);

        });
    };
    /*
     *  Function to get version info
     */
    this.getVersionInfo = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("get version info called");

            var url     = Constants.getUrl() + Constants.getVersionUrl();
            var method  = "GET";
            var headers = {"Accept":"application/json"};

            HM_HTTPRequest(url, method, headers, null).then(
                function(response)
                {
                    var version = {};
                    version.server_version = response.data;
                    version.client_version = HM_CLIENT_VERSION;
                    resolve(version);
                },
                function(response)
                {
                    reject(response);
                });
        });
    };
    /*
     *  Function to login
     */
    this.login = function(email, password, pin, os, platform, model, deviceUid)
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("login called");

            var url     = Constants.getUrl() + Constants.getTokenUrl();
            var method  = "POST";
            var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json"};
            var data = "";

            checkPolicy().then(
                function(policy)
                {
                    if(deviceUid === null || deviceUid === "" || deviceUid === undefined){
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Device Uid"]));
                        return;
                    }
                    // Logic for Authentication Type "ANONYMOUS"
                    if(self.policy.registrationMode.compareWith("ANONYMOUS")) {

                        if(email === null || email === "" || email === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["email"]));
                        else
                            data = "client_id=" + deviceUid + "&grant_type=password&username=" + email + "&password=";

                    }
                    // Logic for Authentication Type "PROVISIONED_USERS_ONLY"
                    else if(self.policy.registrationMode.compareWith("PROVISIONED_USERS_ONLY")) {

                        if(email === null || email === "" || email === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["email"]));

                        if(password === null || password === ""  || password === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["password"]));

                        data = "client_id=" + deviceUid + "&grant_type=password&username=" + email + "&password=" + password;
                    }
                    // Logic for Authentication Type "REGISTRATION_WITH_PIN"
                    else if(self.policy.registrationMode.compareWith("REGISTRATION_WITH_PIN")) {

                        if(email === null || email === "" || email === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["email"]));

                        if(password === null || password === "" || password === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["password"]));

                        if(pin === null || pin === "")
                            reject(error.getErrorObject(error.MISSING_INPUT, ["pin"]));

                        data = "client_id=" + deviceUid + "&grant_type=password&username=" + email + "&password=" + password + "&pin=" + pin;
                    }
                    // Logic for Other Authentication Types
                    else {

                        if(email === null || email === "" || email === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["email"]));

                        if(password === null || password === ""  || password === undefined)
                            reject(error.getErrorObject(error.MISSING_INPUT, ["password"]));

                        data =  "client_id=" + deviceUid + "&grant_type=password&username=" + email + "&password=" + password;
                    }

                    if(os !== null && os !== "")
                        data = data + "&os=" + os;

                    if(platform !== null && platform !== "")
                        data = data + "&platform=" + platform;

                    if(model !== null && model !== "")
                        data = data + "&model=" + model;

                    HM_HTTPRequest(url, method, headers, data).then(
                        function(response)
                        {
                            if(response.status == 200)
                            {
                                var data = response.data;

                                var expiryDate = new Date();
                                expiryDate.setSeconds(expiryDate.getSeconds() + parseInt(data.expires_in));

                                localStorage.setItem(HM_TOKEN, data.access_token);
                                localStorage.setItem(HM_REFRESH_TOKEN, data.refresh_token);
                                localStorage.setItem(HM_TOKEN_EXPIRY, Math.floor(Date.now() / 1000) + data.expires_in);

                                self.sessionExpiration = expiryDate;

                                var firstName   = data.first_name ? data.first_name : "";
                                var lastName    = data.last_name ? data.last_name : "";
                                var phoneNumber = data.phone_number ? data.phone_number : "";

                                self.currentUser = new IUser(email, firstName, lastName, phoneNumber);
                                self.getClientObjectTypes().then(function(response){
                                    resolve(self.currentUser);
                                },
                                function(error){
                                    resolve(self.currentUser,error);
                                });
                                storeSession();
                            }
                            else
                            {
                                reject(response);
                            }
                        },
                        function(response)
                        {
                            reject(response);
                        });
                },
                function(error)
                {
                    reject(error);
                });

        });
    };
    /*
     *  Function to register user
     */
    this.registerUser = function(firstname, lastname, email, password, phoneNo, source, os, platform, model, device_uid)
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("User Register Called");

            var url     = Constants.getUrl() + Constants.getUserRegistrationURL();
            var method  = "POST";
            var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json"};
            var data = "";

            // Check if policy exists
            checkPolicy().then(
                function(policy)
                {
                    // Validations
                    if(email === null || email === "")
                        reject(error.getErrorObject(error.MISSING_INPUT, ["email"]));


                    if(!self.policy.registrationMode.compareWith("UNAUTHENTICATED")) {

                        if(password === null || password === "")
                            reject(error.getErrorObject(error.MISSING_INPUT, ["password"]));
                    }
                    // Validations

                    // Populate data
                    //changed username to email parameter as email is mandatory parameter
                    data = data + "email=" + email;

                    if(!self.policy.registrationMode.compareWith("UNAUTHENTICATED"))
                        data = data + "&password=" + password;

                    if(!(firstname === null || firstname === "" || firstname === undefined))
                        data = data + "&first_name=" + firstname;

                    if(!(lastname === null || lastname === ""  || lastname === undefined ))
                        data = data + "&last_name=" + lastname;

                    if(!(source === null || source === "" || source === undefined))
                        data = data + "&source=" + source;

                    if(!(os === null || os === "" || os === undefined))
                        data = data + "&os=" + os;

                    if(!(platform === null || platform === "" || platform === undefined))
                        data = data + "&platform=" + platform;

                    if(!(model === null || model === ""  || model === undefined))
                        data = data + "&model=" + model;

                    if(!(phoneNo === null || phoneNo === ""  || phoneNo === undefined))
                        data = data + "&phone_number=" + phoneNo;

                    if(!(device_uid === null || device_uid === "" || device_uid === undefined)){
                        data = data + "&device_uid=" + device_uid;
                    }
                    else{
                        data = data + "&device_uid=" + guid();
                    }
                    // Populate data
                    HM_HTTPRequest(url, method, headers, data).then(
                        function(response)
                        {
                            var email       = data.email ? data.email : "";
                            var firstName   = data.first_name ? data.first_name : "";
                            var lastName    = data.last_name ? data.last_name : "";
                            var phoneNumber = data.phone_number ? data.phone_number : "";

                            var user = new IUser(email, firstName, lastName, phoneNumber);

                            resolve(user);
                        },
                        function(response)
                        {
                            reject(response);
                        });

                },
                function(error)
                {
                    reject(error);
                });
        });

    };
    /*
     *  Function to register user with pin
     */
    this.registerForPin = function(firstname, lastname, email, password, phoneNumber, os, platform, model)
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("User register with pin");

            var url     = Constants.getUrl() + Constants.getUserRegistrationPinURL();
            var method  = "POST";
            var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json"};
            var data = "";

            // Check if policy exists
            checkPolicy().then(
                function(policy)
                {
                    // Validations
                    if(email === null || email === "")
                        reject(error.getErrorObject(error.MISSING_INPUT, ["email"]));

                    if(password === null || password === "")
                        reject(error.getErrorObject(error.MISSING_INPUT, ["password"]));

                    if(phoneNumber === null || phoneNumber === "")
                        reject(error.getErrorObject(error.MISSING_INPUT, ["phone number"]));
                    // Validations

                    // Populate data
                    data = data + "username=" + email + "&password=" + password + "&phone_number=" + phoneNumber;

                    if(!(firstname === null || firstname === ""))
                        data = data + "&first_name=" + firstname;

                    if(!(lastname === null || lastname === ""))
                        data = data + "&last_name=" + lastname;
                    // Populate data

                    if(os !== null && os !== "")
                        data = data + "&os=" + os;

                    if(platform !== null && platform !== "")
                        data = data + "&platform=" + platform;

                    if(model !== null && model !== "")
                        model = model + "&model=" + model;

                    HM_HTTPRequest(url, method, headers, data).then(
                        function(response)
                        {
                            var email       = data.email ? data.email : "";
                            var firstName   = data.first_name ? data.first_name : "";
                            var lastName    = data.last_name ? data.last_name : "";
                            var phoneNumber = data.phone_number ? data.phone_number : "";

                            var user = new IUser(email, firstName, lastName, phoneNumber);

                            resolve(user);
                        },
                        function(response)
                        {
                            reject(response);
                        });
                },
                function(error)
                {
                    reject(error);
                });
        });
    };
    /*
     *	Get Expiration Date
     */
    this.getSessionExpiration = function()
    {
        return this.sessionExpiration;
    };
    /*
     *	Get Expiration Date
     */
    this.getExpirationDate = function()
    {
        return this.sessionExpiration;
    };
    /*
     *  Function to get client object type
     */
    this.getClientObjectTypes = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("Get client object types");

            // Check for auth token
            self.getAuthToken().then(
                function(response) {

                    iGetClientObjectTypes().then(
                        function(response)
                        {
                            resolve(self.clientObjectTypes);
                            storeSession();
                        },
                        function(response)
                        {
                            reject(response);
                        });
                },
                function(response) {

                    reject(response);
                });
        });

    };
    /*
     *  Function to get client specific object type
     */
    this.getClientObjectType = function(name)
    {
        var found =false;
        return new Promise(function(resolve, reject)
        {

            HM_Log("Get client object type specific");
            if(self.clientObjectTypes.length !== 0){
                var returnObject;
                for(var i=0; i < self.clientObjectTypes.length; i++) {
                    var oneObject = self.clientObjectTypes[i];
                    var clientObjectType = new IClientObjectType(oneObject.name, oneObject.storeSchemaArray, oneObject);

                    if(clientObjectType.getName() === name) {
                        returnObject = clientObjectType;
                        found = true;
                        break;
                    }
                }

                if(found) {
                    resolve(returnObject);
                } else {
                    self.clientObjectTypes = [];
                    self.getClientObjectType(name);
                }
            }
            else{
                // Check for auth token
                self.getAuthToken().then(
                    function(response) {

                        iGetClientObjectTypes().then(
                            function(response) {

                                var found = false;
                                var returnObject;

                                if(response && response.length > 0) {

                                    for(var i=0; i < response.length; i++) {

                                        var oneObject = response[i];

                                        if(oneObject.getName() === name) {

                                            returnObject = oneObject;
                                            found = true;
                                            break;
                                        }
                                    }

                                    if(found) {

                                        resolve(returnObject);
                                    } else {

                                        reject(error.getErrorObject(error.INVALID_OBJECT_TYPE));
                                    }
                                }
                                else{

                                    reject(error.getErrorObject(error.NO_OBJECTS));
                                }
                            },
                            function(response) {

                                reject(response);
                            });
                    },
                    function(response) {

                        reject(response);
                    });
            }
        });

    };
    /*
     *  Function to get auth token
     */
    this.getAuthToken = function()
    {

        return new Promise(function(resolve, reject)
        {
            HM_Log("get auth token called");

            var token = localStorage.getItem(HM_TOKEN);

            // Check if policy exists
            checkPolicy().then(
                function(policy)
                {
                    // Check if token exists
                    if(!token) {

                        reject(error.getErrorObject(error.TOKEN_EXPIRED));
                    }

                    resolve(token);
                },
                function(error)
                {
                    reject(error);
                });

        });
    };
    /*
     *  Function to execute request
     */
    this.executeService = function(serviceName, parameters, bypassCache)
    {
        return new Promise(function(resolve, reject)
        {
            var method = "GET";

            self.getAuthToken().then(
                function(token) {

                    // Validations
                    if(serviceName === null || serviceName === "")
                        reject(error.getErrorObject(error.MISSING_INPUT, ["serviceName"]));

                    if(parameters)
                        method = "POST";

                    var url = Constants.getUrl() + Constants.getServiceURL(serviceName);
                    var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
                    var data = "";
                    var paramsAdded = 0;

                    if(parameters) {

                        for(var key in parameters) {

                            if(paramsAdded == 1)
                                data = data + "&" + key + "=" + parameters[key];
                            else {

                                data = data + key + "=" + parameters[key];
                                paramsAdded = 1;
                            }
                        }
                    }

                    HM_HTTPRequest(url, method, headers, data, bypassCache).then(
                        function(response) {

                            resolve(response);
                        },
                        function(response) {

                            reject(response);
                        });

                },
                function(response) {

                    reject(response);
                });
        });
    };

    this.executeFunction = function(functionName, parameters, contentType, bypassCache)
    {
        return new Promise(function(resolve, reject)
        {
            var method = "GET";

            self.getAuthToken().then(
                function(token) {
                    var url = Constants.getUrl() + Constants.getFunctionUrl(functionName);
                    var headers = {};
                    // Validations
                    if(functionName === null || functionName === "" || functionName === undefined){
                        reject(error.getErrorObject(error.MISSING_INPUT, ["functionName"]));
                    }
                    else if(contentType === null || contentType === "" || contentType === undefined){
                        reject(error.getErrorObject(error.MISSING_INPUT, ["contentType"]));
                    }
                    if(contentType === "url-encoded"){
                        headers = {
                            "Content-Type":"application/x-www-form-urlencoded",
                            "Accept":"application/json",
                            "Authorization":"Bearer " + token
                        };
                    }else if(contentType === "json"){
                        headers = {
                            "Content-Type":"application/json",
                            "Accept":"application/json",
                            "Authorization":"Bearer " + token
                        };
                    }else{
                        reject(error.getErrorObject(error.INVALID_INPUT, ["content Type should be 'url-encoded' or 'json'"]));
                        return;
                    }

                    if(parameters)
                        method = "POST";

                    var data = "";
                    var paramsAdded = 0;

                    if(parameters) {
                        if(contentType === "json"){
                            data = JSON.stringify(parameters);
                        }
                        else{
                            for(var key in parameters) {

                                if(paramsAdded == 1)
                                    data = data + "&" + key + "=" + parameters[key];
                                else {

                                    data = data + key + "=" + parameters[key];
                                    paramsAdded = 1;
                                }
                            }
                        }
                    }

                    HM_HTTPRequest(url, method, headers, data, bypassCache).then(
                        function(response) {

                            resolve(response);
                        },
                        function(response) {

                            reject(response);
                        });

                },
                function(response) {

                    reject(response);
                });
        });
    };
    /*
     *  Function to get splash image
     */
    this.getSplashImage = function()
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("get application called");

            self.getAuthToken().then(function()
                {
                    var url     = Constants.getUrl() + Constants.getAppUrl() + HM_APP_KEY + "?type=splash";
                    var method  = "GET";

                    HM_HTTPRequest(url, method, null, null).then(
                        function(response)
                        {
                            resolve(response.data);
                        },
                        function(response)
                        {
                            reject(response);
                        });

                },
                function(response)
                {
                    reject(response);
                });

        });

    };
    /*
     *  Function to get application
     */
    this.getApplication = function ()
    {

        return new Promise(function(resolve, reject)
        {
            HM_Log("get application called");

            self.getAuthToken().then(function()
                {
                    resolve(application);

                },
                function(response)
                {
                    reject(response);
                });

        });
    };

    this.getManagedAppUsers = function (appKey, count, searchQuery)
    {
        return new Promise(function(resolve, reject)
        {
            HM_Log("get application called");

            self.getAuthToken().then(function()
                {
                    var url     = Constants.getUrl() + Constants.getAppUsersURL();
                    var method;
                    if(count)
                        method  = "HEAD";
                    else
                        method = "GET";
                    var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};
                    var data = "";

                    if(searchQuery)
                        url = url + '?' + searchQuery;

                    HM_HTTPRequest(url, method, null, null, bypassCache).then(
                        function(response)
                        {
                            resolve(response);
                        },
                        function(response)
                        {
                            reject(response);
                        });

                },
                function(response)
                {
                    reject(response);
                });

        });
    };
    /*
     *  Function to get announcements
     */
    this.getAnnouncements = function (objectName, ObjectId, pageNumber, pageSize, bypassCache, ids)
    {

        return new Promise(function(resolve, reject)
        {
            HM_Log("get announcements called");

            self.getAuthToken().then(
                function(token){

                    var url     = Constants.getUrl() + Constants.getAnnouncementUrl();
                    var method  = "POST";
                    var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
                    var data = "";


                    if(!objectName)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Object Name"]));
                    else
                        data = data + "object=" + objectName;

                    if(!ObjectId) {

                        reject(error.getErrorObject(error.MISSING_INPUT, ["Object Id"]));
                    }
                    else {

                        if(ids && ids.length > 0)
                            for(var i=0; i < ids.length; i++)
                                data = data + "&id=" + ids[i];

                        data = data + "&id=" + ObjectId;
                    }

                    data = data + "&start=" + pageNumber + "&size=" + size;


                    HM_HTTPRequest(url, method, null, data, bypassCache).then(
                        function(response)
                        {
                            var announcements = response.data();
                            resolve(announcements);
                        },
                        function(response)
                        {
                            reject(response);
                        });

                },
                function(error){
                    reject(error);
                });

        });
    };
    this.deleteStoredSession = function ()
    {
        localStorage.removeItem(HM_APP_KEY + "_stored_session");
        localStorage.removeItem(HM_TOKEN);
        localStorage.removeItem(HM_REFRESH_TOKEN);
        localStorage.removeItem(HM_TOKEN_EXPIRY);
    };
    this.logout = function ()
    {
        localStorage.removeItem(HM_APP_KEY + "_stored_session");
        localStorage.removeItem(HM_TOKEN);
        localStorage.removeItem(HM_REFRESH_TOKEN);
        localStorage.removeItem(HM_TOKEN_EXPIRY);
    };

    this.getPolls = function(startIndex, size, bypassCache){
        return new Promise(function(resolve, reject) {
            HM_Log("get polls called");

            self.getAuthToken().then(
                function(token) {
                    var url = Constants.getUrl()+Constants.getPollUrl();
                    var method  = "GET";
                    var param = "";
                    var headers = {"Content-type":"application/x-www-form-urlencoded",
                        "Accept":"application/json",
                        "Authorization":"Bearer " + token};
                    if (!(startIndex !== null || startIndex !== "" || startIndex !== undefined)) {
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Start Index"]));
                        return;
                    }
                    if (!(size !== null || size !== "" || size !== undefined)) {
                        reject(error.getErrorObject(error.MISSING_INPUT, ["Size"]));
                        return;
                    }
                    param = "?start=" + startIndex + "&size=" + size;
                    url = url + param;
                    HM_HTTPRequest(url, method, headers, null, bypassCache).then(
                        function(response)
                        {
                            var allPolls = response.data;
                            var pollArray = [];
                            for(var i = 0 ; i< allPolls.length ; i++){
                                var poll = new IPoll(allPolls[i]);
                                pollArray.push(poll);
                            }
                            resolve(pollArray);
                        },
                        function(response)
                        {
                            reject(response);
                        });
                },
                function(error){
                    reject(error);
                });
        });
    };

    var validatePollDataForType = function(pollType, words, choices) {

        if (pollType !== 'WORD_CLOUD') {
            if (choices !== null && choices !== undefined) {
                if (pollType === 'TRUE_FALSE') {
                    if (choices.length !== 2){
                        return "There should be only two choices allowed.";
                    }
                }

                if (pollType === 'SINGLE_CHOICE_TEXT') {
                    if (choices.length === 0){
                        return "There should be atleast one choice for this type of Poll.";
                    }
                }

                if (pollType === 'MULTI_CHOICE_TEXT') {
                    if (choices.length === 0){
                        return "There should be atleast one choice for this type of Poll.";
                    }
                }

                if (pollType === 'NUMERIC_RATING') {
                    if (choices.length > 0 && choices.length <= 5) {
                        for (var i = 0; i < choices.length; i++) {
                            if (isNaN(choices[i])) {
                                return "Only Numbers are allowed for choices for this type of Poll.";
                            }
                        }
                    } else {
                        return "Choices can be a minimum of 1 and maximum of 5 for this type of Poll.";
                    }
                }
            }else{
                return "Please enter the choice for the Poll.";
            }
        }

        if(pollType === 'WORD_CLOUD'){
            if(words === 0 || words === undefined || words ===null){
                return "Provide the number of words the user can give in the responses.";
            }
        }
        return true;
    };

    var createChoice = function(pollData,choice,token){

        var url = Constants.getUrl() + Constants.getPollChoiceCreateUrl(pollData.title);
        var method = "POST";
        var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};

        var formData = new FormData();
        formData.append('type', pollData.type);
        formData.append('start_date', pollData.start_time);
        formData.append('end_date', pollData.end_time);
        formData.append('text', choice);
        HM_HTTPRequest(url,method,headers,formData,false);
    };

    var createChoiceCloud = function(pollData,token){

        var url = Constants.getUrl() + Constants.getPollChoiceCreateUrl(pollData.title);
        var method = "POST";
        var headers = {"Accept":"application/json", "Authorization":"Bearer " + token};

        var formData = new FormData();
        formData.append('type', pollData.type);
        formData.append('start_date', pollData.start_time);
        formData.append('end_date', pollData.end_time);
        formData.append('text', "");
        HM_HTTPRequest(url,method,headers,formData,false);
    };

    this.addPoll = function(pollTitle, startDate, endDate, pollType, words, choices){
        return new Promise(function(resolve,reject){

            var type = ["TRUE_FALSE","MULTI_CHOICE_TEXT","SINGLE_CHOICE_TEXT","NUMERIC_RATING","WORD_CLOUD"];
            var validated = false;
            if(pollTitle === null || pollTitle === "" || pollTitle === undefined){
                reject("Poll title required.");
            }

            else if(startDate === null || startDate === "" || startDate === undefined){
                reject("Poll Start Date required.");
            }

            else if(endDate === null || endDate === "" || endDate === undefined){
                reject("Poll End Date required.");
            }

            else if(pollType === null || pollType === "" || pollType === undefined){
                reject("Poll Type required.");
            }

            else if(startDate > endDate){
                reject("Start Date should before or same as End Date.");
            }

            else if(type.indexOf(pollType) === -1){
                reject("Invalid Poll Type");
            }

            else{
                validated = validatePollDataForType(pollType, words, choices);
            }

            if(validated !== true) {
                reject(validated);
            }
            else{
                self.getAuthToken().then(
                    function(token) {
                        var url = Constants.getUrl()+Constants.getPollUrl();
                        var method  = "POST";
                        var data = "";
                        var headers = {"Content-type":"application/x-www-form-urlencoded",
                            "Accept":"application/json",
                            "Authorization":"Bearer " + token};
                        data = data + "title=" + encodeURIComponent(pollTitle);
                        data = data + "&start_date=" + startDate.toISOString();
                        data = data + "&end_date=" + endDate.toISOString();
                        data = data + "&type=" + pollType;

                        HM_HTTPRequest(url, method, headers, data, null).then(
                            function(response)
                            {
                                if(pollType !== "WORD_CLOUD"){
                                    for(var choice in choices){
                                        createChoice(response.data,choices[choice],token);
                                    }
                                }
                                else {
                                    for(var i =0 ; i < words ; i++){
                                        createChoiceCloud(response.data,token);
                                    }
                                }
                                resolve("Poll created successfully!!!.");
                            },
                            function(response)
                            {
                                reject(response);
                            });
                    },
                    function(error){
                        reject(error);
                    });
            }

        });
    };

    // method return three arrays related to failed operations in create, update and delete in the order.
    this.getOfflineObjects = function(){
        return new Promise(function(resolve, reject){
            var offlineObjectsArray = JSON.parse(localStorage.getItem(('offline_objects')));
            var createObjectArray = [];
            var updateObjectArray = [];
            var deleteObjectArray = [];

            for(var i =0 ; i< offlineObjectsArray.length ; i++){
                if(offlineObjectsArray[i].execfailed === true){
                    var tempclientObjectType = new IClientObjectType(offlineObjectsArray[i].storeObjectName,
                        offlineObjectsArray[i].storeSchemaArray, offlineObjectsArray[i].storeClientObject);

                    if(offlineObjectsArray[i].operation === tempclientObjectType.HMOperationType_CREATE){
                        createObjectArray.push(offlineObjectsArray[i]);
                    }
                    else if(offlineObjectsArray[i].operation === tempclientObjectType.HMOperationType_UPDATE){
                        updateObjectArray.push(offlineObjectsArray[i]);
                    }
                    else if(offlineObjectsArray[i].operation === tempclientObjectType.HMOperationType_DELETE){
                        deleteObjectArray.push(offlineObjectsArray[i]);
                    }
                }
            }
            resolve(createObjectArray,updateObjectArray,deleteObjectArray);
        });
    };

    this.recoverpassword = function (username) {

        return new Promise(function(resolve, reject) {

            ISession.getInstance().then(
                function(token) {

                    if(!username)
                        reject(error.getErrorObject(error.MISSING_INPUT, ["User Name or Email"]));

                    var url     = Constants.getUrl() + Constants.getPasswordResetUrl();
                    var method  = "POST";
                    var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
                    var data    = "";

                    data = data + "username=" + username;

                    HM_HTTPRequest(url, method, headers, data).then(
                        function(response) {

                            resolve(response.data);
                        },
                        function(response) {

                            reject(response);
                        });

                },
                function(response) {

                    reject(response);
                });
        });
    };
    // Public Functions
};

ISession.initialize = function (appKey, appSecret, appUrl, logEnabled, requestTimeOut)
{
    HM_APP_KEY = appKey;
    HM_APP_SECRET = appSecret;
    HM_APP_URL = appUrl;
    HM_DEBUG_LOG_ENABLED  = logEnabled;
    HM_TOKEN              = HM_APP_KEY + "_token";
    HM_REFRESH_TOKEN      = HM_APP_KEY + "_refresh_token";
    HM_TOKEN_EXPIRY       = HM_APP_KEY + "_token_expiry";

    if(requestTimeOut !== undefined){
        //convert minutes in milliseconds
        HM_APP_TIMEOUT = requestTimeOut * 60 * 1000;
    }
};

/*
 * Function get session instance
 */
ISession.getInstance = function ()
{
    return new Promise(function(resolve, reject)
    {

        var instance;
        var storedObject = JSON.parse(localStorage.getItem(HM_APP_KEY + "_stored_session"));

        if(storedObject)
        {
            instance = new ISession(storedObject);
            resolve(instance);
        }
        else
        {
            if(!HM_APP_KEY)
                reject("App Key is missing in the global vars file");
            if(!HM_APP_SECRET)
                reject("App Secret is missing in the global vars file");
            if(!HM_APP_URL)
                reject("App URL is missing in the global vars file");

            instance = new ISession();

            instance.verify().then(
                function(response)
                {
                    localStorage.setItem(HM_APP_KEY + "_stored_session" , JSON.stringify(instance));
                    resolve(instance);
                },
                function(response)
                {
                    reject(response);
                });
        }
    });
};

/*
 *  Object Class For User
 */
function IUser(email, first_name, last_name, phone_number,notification_token)
{
	var username = null;
	var firstName = null;
	var lastName = null;
	var password = null;
	var phoneNumber = null;
	var notificationToken = null;
	//var self = this;

	var error = EError.getInstance();

	if(email)
		username = email;

	if(first_name)
		firstName = first_name;

	if(last_name)
		lastName = last_name;

	if(phone_number)
		phoneNumber = phone_number;

	if(notification_token)
		notificationToken = notification_token;

	function checkConditions() {

		return new Promise(function(resolve, reject) {

			// Check Verify
			ISession.getInstance().then(
			function(session) {

				session.getAuthToken().then(
				function(token) {

						resolve(token);
				},
				function(response) {

					reject(response);
				});
			},
			function(response) {

				reject(response);
			});
		});
	}


	this.getEmail = function () {

		return username;
	};
	this.getFirstName = function () {

		return firstName;
	};
	this.setFirstName = function (first_name) {

		self.firstName = first_name;
	};
	this.getLastName = function () {

		return lastName;
	};
	this.setLastName = function (last_name) {

		self.lastName = last_name;
	};
	this.getTelephoneNumber = function () {

		return phoneNumber;
	};
	this.setTelephoneNumber = function (phone_number) {

		self.phoneNumber = phone_number;
	};
	this.setNotificationToken = function (notification_token) {

		self.notificationToken = notification_token;
	};
	this.update = function () {

		return new Promise(function(resolve, reject) {

			checkConditions().then(
			function(token) {

				var url     = Constants.getUrl() + Constants.getUserUpdateURL();
				var method  = "POST";
				var headers = {"Content-type":"application/x-www-form-urlencoded", "Accept":"application/json", "Authorization":"Bearer " + token};
				var data    = "";

				if(self.firstName !== null && self.firstName !== "" && self.firstName !== undefined)
					data = data + "first_name=" + self.firstName;

				if(self.lastName !== null && self.lastName !== "" && self.lastName !== undefined)
					data = data + "&last_name=" + self.lastName;

				if(self.phoneNumber !== null && self.phoneNumber !== ""  && self.phoneNumber !== undefined)
					data = data + "&phone_number=" + self.phoneNumber;

				if(self.password !== null && self.password !== "" && self.password !== undefined)
					data = data + "&password=" + self.password;

				if(self.notificationToken !== null && self.notificationToken !== "" && self.notificationToken !== undefined)
					data = data + "&ns_device_id=" + self.notificationToken;


				HM_HTTPRequest(url, method, headers, data).then(
				function(response) {

					self.firstName = response.data.first_name;
					self.lastName = response.data.last_name;
					self.phoneNumber = response.data.phone_number;

					resolve(response.data);
				},
				function(response) {

					reject(response);
				});

			},
			function(response) {

				reject(response);
			});
		});
	};
}

/*
 *  Object Class For User
 */
function Policy(locked, remoteWipe, passcodeRequired, allowRootedAccess, registrationMode)
{
	this.locked = false;
	this.remoteWipe = false;
	this.passcodeRequired = false;
	this.allowRootedAccess = false;
	this.registrationMode = null;

	if(locked)
		this.locked = locked;

	if(remoteWipe)
		this.remoteWipe = remoteWipe;

	if(allowRootedAccess)
		this.passcodeRequired = allowRootedAccess;

	if(allowRootedAccess)
		this.allowRootedAccess = allowRootedAccess;

	if(registrationMode)
		this.registrationMode = registrationMode;


	return this;

}

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,i){var e={},f=e.lib={},l=f.Base=function(){function a(){}return{extend:function(j){a.prototype=this;var d=new a;j&&d.mixIn(j);d.$super=this;return d},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var d in a)a.hasOwnProperty(d)&&(this[d]=a[d]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),k=f.WordArray=l.extend({init:function(a,j){a=
this.words=a||[];this.sigBytes=j!=i?j:4*a.length},toString:function(a){return(a||m).stringify(this)},concat:function(a){var j=this.words,d=a.words,c=this.sigBytes,a=a.sigBytes;this.clamp();if(c%4)for(var b=0;b<a;b++)j[c+b>>>2]|=(d[b>>>2]>>>24-8*(b%4)&255)<<24-8*((c+b)%4);else if(65535<d.length)for(b=0;b<a;b+=4)j[c+b>>>2]=d[b>>>2];else j.push.apply(j,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=h.ceil(b/4)},clone:function(){var a=
l.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],d=0;d<a;d+=4)b.push(4294967296*h.random()|0);return k.create(b,a)}}),o=e.enc={},m=o.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,d=[],c=0;c<a;c++){var e=b[c>>>2]>>>24-8*(c%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c+=2)d[c>>>3]|=parseInt(a.substr(c,2),16)<<24-4*(c%8);return k.create(d,b/2)}},q=o.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,d=[],c=0;c<a;c++)d.push(String.fromCharCode(b[c>>>2]>>>24-8*(c%4)&255));return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c++)d[c>>>2]|=(a.charCodeAt(c)&255)<<24-8*(c%4);return k.create(d,b)}},r=o.Utf8={stringify:function(a){try{return decodeURIComponent(escape(q.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return q.parse(unescape(encodeURIComponent(a)))}},b=f.BufferedBlockAlgorithm=l.extend({reset:function(){this._data=k.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,d=b.words,c=b.sigBytes,e=this.blockSize,g=c/(4*e),g=a?h.ceil(g):h.max((g|0)-this._minBufferSize,0),a=g*e,c=h.min(4*a,c);if(a){for(var f=0;f<a;f+=e)this._doProcessBlock(d,f);f=d.splice(0,a);b.sigBytes-=c}return k.create(f,c)},clone:function(){var a=l.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});f.Hasher=b.extend({init:function(){this.reset()},
reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,d){return a.create(d).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return g.HMAC.create(a,d).finalize(b)}}});var g=e.algo={};return e}(Math);
(function(h){var i=CryptoJS,e=i.lib,f=e.WordArray,e=e.Hasher,l=i.algo,k=[],o=[];(function(){function e(a){for(var b=h.sqrt(a),d=2;d<=b;d++)if(!(a%d))return!1;return!0}function f(a){return 4294967296*(a-(a|0))|0}for(var b=2,g=0;64>g;)e(b)&&(8>g&&(k[g]=f(h.pow(b,0.5))),o[g]=f(h.pow(b,1/3)),g++),b++})();var m=[],l=l.SHA256=e.extend({_doReset:function(){this._hash=f.create(k.slice(0))},_doProcessBlock:function(e,f){for(var b=this._hash.words,g=b[0],a=b[1],j=b[2],d=b[3],c=b[4],h=b[5],l=b[6],k=b[7],n=0;64>
n;n++){if(16>n)m[n]=e[f+n]|0;else{var i=m[n-15],p=m[n-2];m[n]=((i<<25|i>>>7)^(i<<14|i>>>18)^i>>>3)+m[n-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+m[n-16]}i=k+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&h^~c&l)+o[n]+m[n];p=((g<<30|g>>>2)^(g<<19|g>>>13)^(g<<10|g>>>22))+(g&a^g&j^a&j);k=l;l=h;h=c;c=d+i|0;d=j;j=a;a=g;g=i+p|0}b[0]=b[0]+g|0;b[1]=b[1]+a|0;b[2]=b[2]+j|0;b[3]=b[3]+d|0;b[4]=b[4]+c|0;b[5]=b[5]+h|0;b[6]=b[6]+l|0;b[7]=b[7]+k|0},_doFinalize:function(){var e=this._data,f=e.words,b=8*this._nDataBytes,
g=8*e.sigBytes;f[g>>>5]|=128<<24-g%32;f[(g+64>>>9<<4)+15]=b;e.sigBytes=4*f.length;this._process()}});i.SHA256=e._createHelper(l);i.HmacSHA256=e._createHmacHelper(l)})(Math);
(function(){var h=CryptoJS,i=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(e,f){e=this._hasher=e.create();"string"==typeof f&&(f=i.parse(f));var h=e.blockSize,k=4*h;f.sigBytes>k&&(f=e.finalize(f));for(var o=this._oKey=f.clone(),m=this._iKey=f.clone(),q=o.words,r=m.words,b=0;b<h;b++)q[b]^=1549556828,r[b]^=909522486;o.sigBytes=m.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var f=
this._hasher,e=f.finalize(e);f.reset();return f.finalize(this._oKey.clone().concat(e))}})})();
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,i=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();for(var b=[],a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var b=b.replace(/\s/g,""),e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));
for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return i.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

/**
Copyright (c) 2012, Benjamin Dumke-von der Ehe

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

/*
 LockableStorage.lock(key, lockAquiredCallback)
*/
(function () {

    function now() {
        return new Date().getTime();
    }

    function someNumber() {
        return Math.random() * 1000000000 | 0;
    }

    var myId = now() + ":" + someNumber();

    function getter(lskey) {
        return function () {
            var value = localStorage[lskey];
            if (!value)
                return null;

            var splitted = value.split(/\|/);
            if (parseInt(splitted[1]) < now()) {
                return null;
            }
            return splitted[0];
        }
    }

    function _mutexTransaction(key, callback, synchronous) {
        var xKey = key + "__MUTEX_x",
            yKey = key + "__MUTEX_y",
            getY = getter(yKey);

        function criticalSection() {
            try {
                callback();
            } finally {
                localStorage.removeItem(yKey);
            }
        }

        localStorage[xKey] = myId;
        if (getY()) {
            if (!synchronous)
                setTimeout(function () { _mutexTransaction(key, callback); }, 0);
            return false;
        }
        localStorage[yKey] = myId + "|" + (now() + 40);

        if (localStorage[xKey] !== myId) {
            if (!synchronous) {
                setTimeout(function () {
                    if (getY() !== myId) {
                        setTimeout(function () { _mutexTransaction(key, callback); }, 0);
                    } else {
                        criticalSection();
                    }
                }, 50)
            }
            return false;
        } else {
            criticalSection();
            return true;
        }
    }

    function lockImpl(key, callback, maxDuration, synchronous) {

        maxDuration = maxDuration || 5000;

        var mutexKey = key + "__MUTEX",
            getMutex = getter(mutexKey),
            mutexValue = myId + ":" + someNumber() + "|" + (now() + maxDuration);

        function restart () {
            setTimeout(function () { lockImpl(key, callback, maxDuration); }, 10);
        }

        if (getMutex()) {
            if (!synchronous)
                restart();
            return false;
        }

        var aquiredSynchronously = _mutexTransaction(key, function () {
            if (getMutex()) {
                if (!synchronous)
                    restart();
                return false;
            }
            localStorage[mutexKey] = mutexValue;
            if (!synchronous)
                setTimeout(mutexAquired, 0)
        }, synchronous);

        if (synchronous && aquiredSynchronously) {
            mutexAquired();
            return true;
        }
        return false;
        function mutexAquired() {
            try {
                callback();
            } finally {
                _mutexTransaction(key, function () {
                    if (localStorage[mutexKey] !== mutexValue)
                        throw key + " was locked by a different process while I held the lock"

                    localStorage.removeItem(mutexKey);
                });
            }
        }

    }

    window.LockableStorage = {
        lock: function (key, callback, maxDuration) { lockImpl(key, callback, maxDuration, false) },
        trySyncLock: function (key, callback, maxDuration) { return lockImpl(key, callback, maxDuration, true) }
    };
})();
