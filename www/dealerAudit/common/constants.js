angular.module('dealerAudit.ModuleConstants', []).constant('dealerAudit_ConstantsConst', {
	/**
	 * @memberof dealerAudit.ModuleConstants
	 * @ngdoc constants
	 * @name dealerAudit_Constants
	 * @desc This  defines all the constants used in the dealerAudit Projects.
	 */
	// this is for example .You have to use constants here
	goodName: "Belgium",
	HybrisLocalSonataInstance: "https://dev-gy.halosys.com/",
	AppNameAndroid: "Audit_Android",
	AppKeyAndroid: "5603861",
	SecretAndroid: "4d373f77-0343-4a45-b3c6-efa0fdc90ad9",
	AppNameIOS: "Audit_IOS",
	AppKeyIOS: "9076418",
	SecretIOS: "124457e5-7bd1-4fdf-bec6-9af435b508d8",
	// AppNameIOS:"Dealer Audit",
	// AppKeyIOS : "5238899",
	// SecretIOS : "8b8a3340-bd5e-4444-9930-b03417f973ae",
	User_PinLength: 6,
	setPinRegex: "/[^0-9]/g",
	TTS_Name: "",
	loginId: "",
	User_PinStausUpdate: 2,
	User_PinStausInsert: 1,
	UserID: null,
	setPinClearFlagTrue: true,
	setPinClearFlagTrue: false,
	logs: {
		LogsEnable: 1,
		LogsDisable: 0,
		logStatusInConst: 0,
	},
	languag: {
		Englishlanguage: "English",
		Germanlanguage: "German",
		Frenchlanguage: "French"
	},
	fileName: "",


	androidVersion: "Version 1.0.0.2",
	iosVersion: "Version 2.0.0.2",
	lastOnlineLoginKey: "LastOnlineLoginDateTime",
	lastOfflineLoginKey: "LastOfflineLoginDateTime",
	dealerScreenInputMaxLength: 30,
});
