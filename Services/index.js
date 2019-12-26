/*-----------------------------------------------------------------------
   * @ file        : index.js
   * @ description : Main module to incluse all the service files.
   * @ author      : Anurag Gupta
   * @ date        :
-----------------------------------------------------------------------*/

'use strict';

module.exports = {
  ContactFormService: require('./ContactFormServices'),
  ContactForm_Detail_Service: require('./ContactFormDetailServices'),
  CRM_USER_DATA_SERVICE: require('./CrmUserDataServices'),
  CRM_USER_PROPERTY_SERVICE: require('./CrmUserPropertyServices'),
  EmailSendDetail_SERVICE: require('./EmailSendDetailServices'),
  FUNNEL_SERVICE: require('./FunnelServices'),
  FUNNEL_TEMPLATE_SERVICE: require('./FunnelTemplateServices'),
  FRONTPAGE_SERVICE: require('./FrontPageServices'),
  Holiday_SERVICE: require('./HolidayServices'),
  MY_LISTING_SERVICE: require('./MylistingServices'),
  MARK_FAVORITE_SERVICE: require('./MarkFavoriteServices'),
  MAIN_PROPERTY_SERVICE: require('./MainPropertyServices'),
  PageDetailService: require('./PageDetailServices'),
  PaymentDetailServices: require('./PaymentDetailServices'),
  PostService: require('./PostServices'),
  PostCardLobService: require('./PostCardLobServices'),
  PROPERTY_CLASS_SERVICE: require('./PropertyClassServices'),
  REST_PROPERY_RD_1_Service: require('./restPropertyRD_1_Services'),
  SEARCH_DATA_SERVICE: require('./SearchDataServices'),
  SCHOOL_SERVICE: require('./SchoolServices'),
  SUBSCRIPTION_Plan_SERVICE: require('./SubscriptionPlanServices'),
  ThemeSetting_SERVICE: require('./ThemeSettingServices'),
  UserService: require('./userServices'),
  Testimonial: require('./testimonialServices'),
  Schedule: require('./scheduleServices'),
  featuredProperty: require('./featuredPropertyServices'),
  usefulLinks: require('./usefulLinksServices'),
  companyAddress: require('./companyAddressServices'),
  aboutUs: require('./aboutUsServices'),
  category: require('./categoryServices'),
  mortgage: require('./mortgageServices'),
  homeWorth: require('./homeWorthServices'),
  termsService: require('./termsService'),
  passwordExpiryService: require('./passwordExpiryServices'),
  deleteBuyerServices: require('./deleteBuyerServices'),
  cloudcma: require('./cloudcmaservices'),
  LOGS: require('./leadLogs'),
  crTemplate: require('./crTemplateServices'),
  propertyDeals: require('./propertyDealsServices'),
  dealTemplates: require('./dealTemplatesServices'),
  sellerLogs: require('./sellerLogs'),
  buyerLogs: require('./buyerLogsServices'),
  faq: require('./faq'),
  setAreaList: require('./setAreaService')
};
