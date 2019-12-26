/*-----------------------------------------------------------------------
   * @ file        : index.js
   * @ description : Main module to incluse all the models.
   * @ author      : Anurag Gupta
   * @ date        :
-----------------------------------------------------------------------*/


'use strict';

module.exports = {
    CONTACTFORM: require('./ContactForm'),
    ContactDetail: require('./ContactDetails'),
    EmailSendDetail_MODEL: require('./EmailSendDetail'),
    FRONTPAGE_MODEL: require('./FrontPage'),
    FUNNEL_MODAL: require('./Funnel'),
    FunnelTemplate: require('./FunnelTemplate'),
    HOLIDAY_MODEL: require('./Holiday'),
    MARK_FAVORITE: require('./MarkFavorite'),
    MY_LISTING: require('./Mylisting'),
    MainProperty: require('./MainProperty'),
    PageDetail_MODEL: require('./PageDetail'),
    PaymentDetail_MODEL: require('./PaymentDetails'),
    POST: require('./Post'),
    POST_CARD_LOB: require('./PostCardLob'),
    REST_PROPERY_RD_1: require('./retsPropertyRD_1.js'),
    PROPERTY_CLASS: require('./PropertyClass'),
    SEARCHDATA: require('./searchData'),
    SCHOOL: require('./School'),
    SubscriptionPlans: require('./SubscriptionPlans'),
    users: require('./users'),
    ThemeSetting_MODEL: require('./ThemeSetting'),
    TESTIMONIALS: require('./testimonials'),
    SCHEDULE: require('./schedule'),
    featuredProperties: require('./featuredProperties'),
    usefulLinks: require('./usefulLinks'),
    companyAddress: require('./companyAddress'),
    contactInfoListing: require('./contactInfoListing'),
    postComments: require('./postComments'),
    aboutUs: require('./aboutUs'),
    category: require('./category'),
    mortgage: require('./mortgage'),
    city: require('./city'),
    homeWorth: require('./homeWorth'),
    terms: require('./terms'),
    passwordExpiry: require('./passwordExpiry'),
    cloudcma: require('./cloudcma'),
    displayAgents: require('./displayAgents'),
    logs: require('./leadLogs'),
    crTemplate: require('./crTemplate'),
    propertyDeals: require('./propertyDeals'),
    dealTemplates: require('./dealTemplates'),
    dealEmailSendDetails: require('./dealEmailSendDetails'),
    sellerLogs: require('./sellerLogs'),
    buyerLogs: require('./buyerLogs'),
    faq: require('./faq'),
    setArea: require('./setArea')
    //CRM_USER_DATA: require('./CmsUserData'),
    //CRM_USER_DATA: require('./CrmUserData'),
    //CRM_USER_PROPERTY: require('./CrmUserProperty'),
};
