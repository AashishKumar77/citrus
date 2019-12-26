/*----------------------------------------------------------------------------------
   * @ file        : appConstants.js
   * @ description : It includes all the Constant values using in the application.
   * @ author      : Anurag Gupta
   * @ date        :
-----------------------------------------------------------------------------------*/
var GOOGLE_TIMEZONE_API__KEY = "AIzaSyDdlo-rcKhsd2APXiW0Ja37XX2lQivwCPI";
// var GOOGLE_TIMEZONE_API__KEY = "AIzaSyCSblqhuttE7ZRr50ViHtTr6VfWmFsjghU";
var SENDGRID_API_KEY = "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";
var CLOUDCMA_API_KEY = "e0fc9d73a78351fbb516a35cab7cb15d"; //cloudcma
var SOCIAL_MODE = {
    FACEBOOK: "Facebook",
    LINKEDIN: "Linkedin"
}
var USER_TYPE = {
    AGENT: "Agent",
    CONSUMER: "Consumer",
    BUYER: "Buyer",
    SELLER: "Seller",
    ADMIN: "Admin",
    NON_MEMBER: "Non-Member",
    SUPER_ADMIN : "SUPER_ADMIN",
    SITE_AGENT  : "SITE_AGENT"
}
var SUBSCRIPTION_PLAN_TYPE = {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
}
var POST_STATUS = {
    PUBLISH: "Publish",
    DRAFT: "Draft",
}
var CRM_USER_RATING = {
     "BRONZE":"Bronze",
     "GOLD":"Gold",
     "RED":"Red",
     "GREEN":"Green",
     "SILVER":"Silver",
}
var CATEGORY_OF_LEAD = {
    "HOT":"Hot",
    "COLD":"Cold",
    "QUALIFIED":"Qualified",
    "NURTURED":"Nurtured",
}
var LOB_API_KEY ='test_fe291adade83121b498f1d1710c2b5ebbbf';

var RESIDENTIAL_TYPE={
     RESIDENTIAL_DETACHED:"Residential Detached",
     RESIDENTIAL_ATTACHED:"Residential Attached",
     MULTI_FAMILY:"Multifamily",
     LOST_AND_LAND:" LotsAndLand",
     LAND_ONLY:"Land Only",
}
var CONTACT_FORM_TYPE = {
    LEAD: "Lead",
    CONTACT_FORM: "Contact Us",
    PROPERTY_VALUATION: "Property Valuation",
    PROPERTY_DETAIL: "Property Detail",
    REQUESTCALLBACK: "Request Call Back",
    CONTACT_AGENT: "Contact Agent",
    HOMEWORTH : "homeworth",
    LANDINGPAGEB : "landingPageBuyer",
    LANDINGPAGES : "landingPageSeller"
}



var DEVICE_TYPE = {
    ANDROID: "Android",
    IOS: "IOS"
}
var IMG_SIZE = {
    SIZE: 1048576 * 50
}
var MaxImagesUpload = 4;

var MaxDistance = 100000;

var SUB_JOB_STATUS = {
    REQUESTED        : "Requested",
    APPROVED         : "Approved",
    DISAPPROVED      : "DisApproved",
    COMPLETED        : "Completed",
    DISPUTE          : "Dispute",
    DISPUTED         : "Disputed",
    HIRE             : "Hired",
    PRICE_REQUEST    : "PriceChangeRequest",
    PAYMENT_RELEASED : "Payment Released",
}
var JOB_STATUS = {
    "OPEN": "Open",
    "IN_PROGRESS": "In-progress",
    "COMPLETED": "Completed",
    "CLOSEd": "Closed",
    "Invited": "Invited",
}

var STATUS_MSG ={
	SUCCESS: {
		CREATED: {
			statusCode:201,
			customMessage : 'Created Successfully',
			type : 'CREATED'
        },
        ADDED: {
			statusCode:200,
			customMessage : 'Added Successfully',
			type : 'ADDED'
		},
        SAVE_SUCCESSFULLY: {
            statusCode:200,
            customMessage : 'Save Successfully',
            type : 'SAVE_SUCCESSFULLY'
        },
		DEFAULT: {
			statusCode:200,
			customMessage : 'Success',
			type : 'DEFAULT'
		},
    OFFERMADE: {
			statusCode:200,
			customMessage : 'Offer made successfully',
			type : 'OFFERMADE'
		},

		EMAILNOTVERIFY: {
			statusCode:200,
			customMessage : 'Registered successfully. Please verify your email',
			type : 'EMAILNOTVERIFY'
		},
		UPDATED: {
			statusCode:200,
			customMessage : 'Updated Successfully',
			type : 'UPDATED'
		},
		LOGOUT: {
			statusCode:200,
			customMessage : 'Logged Out Successfully',
			type : 'LOGOUT'
		},
		DELETED: {
			statusCode:200,
			customMessage : 'Deleted Successfully',
			type : 'DELETED'
		},
		PassWord_Token_Send: {
			statusCode:200,
			customMessage : 'Your password reset request has been sent to your email id',
			type : 'UPDATED'
		},
		Data_fetched: {
			statusCode:200,
			customMessage : 'User data fetched successfully.',
			type : 'DATA_FETCHED'
		},
        FORGOT_PASSWORD_LINK_SEND: {
			statusCode:200,
			customMessage : 'Forgot password link sent to your email',
			type : 'FORGOT_PASSWORD_LINK_SEND'
		},
        CREDENTIALS_SEND: {
			statusCode:200,
			customMessage : 'Credentials sent to your email.',
			type : 'CREDENTIALS_SEND'
		},
        LICENSEUPDATED: {
            statusCode: 200,
            customMessage: 'License number added Successfully',
            type: 'UPDATED'
        },
}
}

module.exports = {

    jwtAlgo: 'HS256',
    jwtkey: 'Citrus',
    ADMIN_EMIAL: 'derek@derekthornton.com',
    DEVELOPER_EMAIL : 'chetan@devs.matrixmarketers.com',
    //ADMIN_EMIAL: 'ankur@matrixmarketers.com',
    TESTER_EMAIL: [],
    devClientId: '',
    prodClientId: '',
    testSecretKey: 'sk_test_AgZKfIho2sqgmftheseydYsA',
    liveSecretKey: 'sk_test_AgZKfIho2sqgmftheseydYsA',
    bcryptSaltRound: '',
    noReplyEmail: 'info@matrixm.info',
    mailTemplateUrl: '',
    ProfilePicUrl: '',
    baseUrl: 'http://southsurrey.ca',
    // accountconfirmationUrl : 'http://localhost/project/Citrus/#/verifyemail',
    // resetPasswordUrl       : "http://localhost/project/Citrus/#/resetpasswrd",
    apiBaseUrl : 'http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=',
    accountconfirmationUrl : 'http://southsurrey.ca/#/email/verification',
    resetPasswordUrl       : "http://southsurrey.ca/#/password/reset",
    createPasswordUrl      :  "http://southsurrey.ca/#/password/create",
    noOfeatured:10,
    facebook: {
        Id: '',
        Secret: ''
    },
    twitter: {
        Id: '',
        Secret: ''
    },
    instagram: {
        Id: '',
        Secret: ''
    },
    linkedIn: {
        Id: '',
        Secret: ''
    },
    googlePlus: {
        Id: '',
        Secret: ''
    },
    GOOGLE_TIMEZONE_API__KEY: GOOGLE_TIMEZONE_API__KEY,
    SOCIAL_MODE: SOCIAL_MODE,
    STATUS_MSG: STATUS_MSG,
    DEVICE_TYPE: DEVICE_TYPE,
    USER_TYPE: USER_TYPE,
    IMG_SIZE: IMG_SIZE,
    MaxDistance: MaxDistance,
    MaxImagesUpload: MaxImagesUpload,
    RESIDENTIAL_TYPE:RESIDENTIAL_TYPE,
    CONTACT_FORM_TYPE:CONTACT_FORM_TYPE,
    POST_STATUS:POST_STATUS,
    CRM_USER_RATING:CRM_USER_RATING,
    CATEGORY_OF_LEAD:CATEGORY_OF_LEAD,
    LOB_API_KEY:LOB_API_KEY,
    CLOUDCMA_API_KEY:CLOUDCMA_API_KEY,
    SUBSCRIPTION_PLAN_TYPE:SUBSCRIPTION_PLAN_TYPE,
    STRIPE_CURRENCY:'USD',
}
