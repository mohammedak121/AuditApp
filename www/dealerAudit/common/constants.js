angular.module('dealerAudit.ModuleConstants', []).constant('dealerAudit_ConstantsConst', {
	/**
	 * @memberof dealerAudit.ModuleConstants
	 * @ngdoc constants
	 * @name dealerAudit_Constants
	 * @desc This  defines all the constants used in the dealerAudit Projects.
	 */
	// this is for example .You have to use constants here

	//Server Environment------dev-gy.halosys.comSonata
	//Android Dev Instance
	HybrisLocalSonataInstance: "https://dev-gy.halosys.com/",
	AppNameAndroid: "Audit_Android",
	AppKeyAndroid: "5603861",
	SecretAndroid: "4d373f77-0343-4a45-b3c6-efa0fdc90ad9",
	//IOS Dev Instance
	AppNameIOS: "Audit_IOS",
	AppKeyIOS: "9076418",
	SecretIOS: "124457e5-7bd1-4fdf-bec6-9af435b508d8",
	//End of Server Environment------dev-gy.halosys.comSonata

	//Server Environment------dev-gy.halosys.comGoodyear
	//Android Dev Instance
	// HybrisLocalSonataInstance: "https://dev-gy.halosys.com/",
	// AppNameAndroid: "Audit_Android",
	// AppKeyAndroid: "7285378",
	// SecretAndroid: "4d373f77-0343-4a45-b3c6-efa0fdc90ad9",
	// //IOS Dev Instance
	// AppNameIOS: "Audit_IOS",
	// AppKeyIOS: "5238899",
	// SecretIOS: "8b8a3340-bd5e-4444-9930-b03417f973ae",
	//End of Server Environment------dev-gy.halosys.comGoodyear


	//Server Environment------qa-cons-gy.halosys.comSonata
	// Android QA instance
	// HybrisLocalSonataInstance: "https://qa-cons-gy.halosys.com",
	// AppNameAndroid: "Audit_Android",
	// AppKeyAndroid: "6955007",
	// SecretAndroid: "7d0f1f28-96e3-4f6d-aba0-bddaa4c768bd",
	// // IOS QA instance.
	// AppNameIOS: "Audit_IOS",
	// AppKeyIOS: "7354101",
	// SecretIOS: "3c4b68ed-0b5c-48f7-9d8d-1e6682124075",
	// End of Server Environment------qa-cons-gy.halosys.comSonata


	//Server Environment------qa-cons-gy.halosys.comGoodyear
	// Android QA instance
	// HybrisLocalSonataInstance: "https://qa-cons-gy.halosys.com",
	// AppNameAndroid: "Audit_Android",
	// AppKeyAndroid: "281828",
	// SecretAndroid: "7d0f1f28-96e3-4f6d-aba0-bddaa4c768bd",
	// // IOS QA instance.
	// AppNameIOS: "DealerAudit",
	// AppKeyIOS: "4527791",
	// SecretIOS: "e17ab210-7e1d-4ee3-9593-4900b2c8e966",
	// End of Server Environment------qa-cons-gy.halosys.comGoodyear

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

	validations: {
		RegExpEmail: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
		RegExpPhoneIndian: /(7|8|9)\d{9}/,
		RegExpPhoneInternational: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
	},
	downloadDealerStatusCodes: {
		success: 1,
		failure: 0,
		noContent: 2
	},
	keyBoardSubmitButtonKeyCode: 13,
	keyBoardGoButtonKeyCode: 9,
	currentLanguage :'',
	currentCountry : ''

});
