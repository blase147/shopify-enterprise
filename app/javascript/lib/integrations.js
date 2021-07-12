// icons ##
// import hubspot from 'images/hubspot.svg';
// import zoho_crm from 'images/zoho_crm.svg';
// import xero from 'images/xero.svg';
// import pipedrive from 'images/pipedrive.svg';
// import Salesforce from 'images/Salesforce.svg';
// import ActiveCampaign from 'images/ActiveCampaign.svg';
// import Zapier from 'images/Zapier.svg';
// import LeadDyno from 'images/LeadDyno.svg';
// import ReferralCandy from 'images/ReferralCandy.svg';
// import Refersion from 'images/Refersion.svg';
// import Klaviyo from 'images/Klaviyo.svg';
// import Friendbuy from 'images/Friendbuy.svg';
// import Mailchimp from 'images/Mailchimp.svg';
// import Baremetrics from 'images/Baremetrics.svg';
// import ChartMogul from 'images/ChartMogul.svg';
// import Stitch from 'images/Stitch.svg';
// import ProfitWell from 'images/ProfitWell.svg';
// import Shopify from 'images/Shopify.svg';
// import Slack from 'images/Slack.svg';
// import Twillo from 'images/Twillo.svg';
// import PieSync from 'images/PieSync.svg';
// import Moxtra from 'images/Moxtra.svg';
// import Shipstation from 'images/Shipstation.svg';
// import RevenueManager from 'images/RevenueManager.svg';
// import QuickBooks from 'images/QuickBooks.svg';
// import Intacct from 'images/Intacct.svg';
// import Freshdesk from 'images/Freshdesk.svg';
// import Natero from 'images/Natero.svg';
// import Zendesk from 'images/Zendesk.svg';
// import Intercom from 'images/Intercom.svg';
// import Groove from 'images/Groove.svg';
// import GetAccept from 'images/GetAccept.svg';
// import Avalar from 'images/Avalar.svg';
// import TaxJar from 'images/TaxJar.svg';
// import GoogleAnalytics from 'images/GoogleAnalytics.svg';
// import vector99 from 'images/vector99.svg';
// import get_start from 'images/get_start.svg';

const integrations = [
  ...(process.env.APP_TYPE=="public" ? [{
    title: 'Sales',
    id: 'sale',
    // data: [
    //   { title: 'Hubspot', icon: hubspot },
    //   { title: 'Zoho CRM', icon: zoho_crm },
    //   { title: 'Pipedrive', icon: pipedrive },
    //   { title: 'Salesforce', icon: Salesforce },
    // ],
  }] : [])
  ,
  {
    title: 'Marketing',
    id: 'marketing',
    // data: [
    //   { title: 'Active Campaign', icon: ActiveCampaign },
    //   { title: 'Zapier', icon: Zapier },
    //   { title: 'LeadDyno', icon: LeadDyno },
    //   { title: 'Referral Candy', icon: ReferralCandy },
    //   { title: 'Refersion', icon: Refersion },
    //   { title: 'Friendbuy', icon: Friendbuy },
    //   { title: 'Mailchimp', icon: Mailchimp },
    // ],
  },
  {
    title: 'Collaboration',
    id: 'collabration',
    // data: [
    //   { title: 'Shopify', icon: Shopify },
    //   { title: 'Slack', icon: Slack },
    //   { title: 'Twillo', icon: Twillo },
    //   { title: 'PieSync', icon: PieSync },
    //   { title: 'Moxtra', icon: Moxtra },
    //   { title: 'Shipstation', icon: Shipstation },
    // ],
  },
  ...(process.env.APP_TYPE=="public" ? [{
    title: 'Reporting & Analytics',
    id: 'report',
    // data: [
    //   { title: 'Baremetrics', icon: Baremetrics },
    //   { title: 'Chart Mogul', icon: ChartMogul },
    //   { title: 'Stitch', icon: Stitch },
    //   { title: 'ProfitWell', icon: ProfitWell },
    //   { title: 'Google Analytics', icon: GoogleAnalytics },
    // ],
  },
  {
    title: 'Accounting',
    id: 'accounting',
    // data: [
    //   { title: 'Xero', icon: xero },
    //   { title: 'Revenue Manager', icon: RevenueManager },
    //   { title: 'QuickBooks', icon: QuickBooks },
    //   { title: 'Intacct', icon: Intacct },
    // ],
  },
  {
    title: 'Customer Support & Success',
    id: 'customer',
    // data: [
    //   { title: 'Freshdesk', icon: Freshdesk },
    //   { title: 'Natero', icon: Natero },
    //   { title: 'Zendesk', icon: Zendesk },
    //   { title: 'Intercom', icon: Intercom },
    //   { title: 'Groove', icon: Groove },
    // ],
  },
  {
    title: 'Contract Management',
    id: 'contract',
    // data: [{ title: 'GetAccept', icon: GetAccept }],
  },
  {
    title: 'Tax Management',
    id: 'tax',
    // data: [
    //   { title: 'Avalar', icon: Avalar },
    //   { title: 'TaxJar', icon: TaxJar },
    //   { title: 'Hubspot', icon: hubspot },
    // ],
  }]:[]),

];

export default integrations;
