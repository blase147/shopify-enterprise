export const conditions = [
  { label: 'isEqual', value: 'isEqual' },
  { label: 'is not Equal', value: 'isNotEqual' },
  { label: 'greater than', value: 'greaterThan' },
  { label: 'greater than or equal', value: 'greaterOrEqual' },
  { label: 'less than', value: 'lessThan' },
  { label: 'less than or equal', value: 'lessThanOrEqual' },
];
const isPartOf = [
  {
    label: 'Select operation',
    value: '',
  },
  {
    label: 'is part of',
    value: 'is_part_of',
  },
  {
    label: 'is not part of',
    value: 'is_not_part_of',
  },
];
const istrueList = [
  {
    label: 'Select operation',
    value: '',
  },
  {
    label: 'is true',
    value: 'is_true',
  },
  {
    label: 'is false',
    value: 'is_false',
  },
];
const isNotList = [
  {
    label: 'Select operation',
    value: '',
  },
  {
    label: 'is',
    value: 'is',
  },
  {
    label: 'is Not',
    value: 'is_not',
  },
];
const countryOptionList = [
  {
    label: 'Select sub condition',
    value: '',
  },
  {
    label: 'Country',
    value: 'abandoned_checkout.customer.addresses.country_code',
    subOptions: isNotList,
  },
  {
    label: 'City',
    value: 'abandoned_checkout.customer.addresses.city',
    subOptions: conditions,
  },
  {
    label: 'Province',
    value: 'abandoned_checkout.customer.addresses.province',
    subOptions: conditions,
  },
  {
    label: 'Company',
    value: 'abandoned_checkout.customer.addresses.company',
    subOptions: conditions,
  },
  {
    label: 'Postcode',
    value: 'abandoned_checkout.customer.addresses.zip',
    subOptions: conditions,
  },
  {
    label: 'First Name',
    value: 'abandoned_checkout.customer.addresses.first_name',
    subOptions: conditions,
  },
  {
    label: 'Last Name',
    value: 'abandoned_checkout.customer.addresses.last_name',
    subOptions: conditions,
  },
];
export const triggerList = [
  {
    title: 'Order',
    events: [
      {
        title: 'Abandoned checkout',
        id: 'abandoned_checkout',
        description:
          'Triggered when a customer abandons an order at the checkout.',
      },
      {
        title: 'Order Created',
        id: 'order_created',
        description: 'Triggered after the customer places an order.',
      },
      {
        title: 'Cross-sell',
        id: 'cross_sell',
        description:
          'Recommend a product to the customer based on what they purchased.',
      },
      {
        title: 'Order paid',
        id: 'order_paid',
        description: 'Triggered after the order payment is confirmed.',
      },
      {
        title: 'Order cancelled',
        id: 'order_cancelled',
        description: 'Triggers if the order is cancelled.',
      },
      {
        title: 'Order refund',
        id: 'order_refund',
        description: 'Sent to the customer if their order is refunded.',
      },
      {
        title: 'Order delivered',
        id: 'order_delivered',
        description:
          'Sent automatically to the client when their order is delivered.',
      },
    ],
  },
  {
    title: 'Shipping',
    events: [
      {
        title: 'Order fulfillment',
        id: 'order_fulfillment',
        description:
          'Sent automatically to the client when their order is fulfilled.',
      },
      {
        title: 'Shipping update ',
        id: 'shipping_update',
        description:
          "Sent automatically to the client if their fulfilled order's tracking number is updated.",
      },
    ],
  },
  {
    title: 'SmartySms',
    events: [
      {
        title: 'New Subscriber Confirmation',
        id: 'new_subscriber_confirmation',
        description:
          'Configure the text message customers will receive after they subscribed based on the subscription source.',
      },
      {
        title: 'Browse Abandonment ',
        id: 'browse_abandonment',
        description:
          'Triggered when someone has viewed a product in your store.',
      },
    ],
  },
  {
    title: 'Customer',
    events: [
      {
        title: 'New customer registration',
        id: 'new_customer_registration',
        description:
          'This event will be triggered when a new customer registers in your store or he/she is added manually by the store admin.',
      },
      {
        title: 'Customer deleted',
        id: 'customer_deleted',
        description:
          'This event will be triggered when customer is deleted from your store.',
      },
      {
        title: 'Customer winback',
        id: 'customer_winback',
        description:
          'This event will be triggered periodically and will target customers who have not purchased anything in the specified period. ',
      },
    ],
  },
  {
    title: 'Product',
    events: [
      {
        title: 'Product created',
        id: 'product_created',
        description: 'This event is triggered when a new product is created.',
      },
      {
        title: 'Product update',
        id: 'product_update',
        description: 'This event is triggered when a product is updated.',
      },
      {
        title: 'Product deleted',
        id: 'product_deleted',
        description:
          'This event is triggered when a product is deleted by administrator.',
      },
    ],
  },
];

export const actionList = [
  {
    title: 'SMS message',
    id: 'sms',
    description: 'Send SMS when condition is met.',
  },
  {
    title: 'SMS/MMS with Responses',
    id: 'sms_mms',
    description:
      'Send SMS/MMS with keywords which trigger automated personalised responses.',
  },
  {
    title: 'MMS message',
    id: 'mms',
    description: 'Send MMS when condition is met.',
  },
  {
    title: 'Add to list',
    id: 'add_to_list',
    description: 'Add customer to specific list when condition is met.',
  },
  {
    title: 'Send Slack Notification',
    id: 'slack_notification',
    description: 'Send Slack Notification.',
  },
];
const listofProductOptions = [
  {
    label: 'Product',
    value: 'abandoned_checkout.line_items.product_id',
  },
  {
    label: 'Collection',
    value: 'abandoned_checkout.line_items.collection_id',
  },
  {
    label: 'Fulfillable quantity',
    value: 'abandoned_checkout.line_items.fulfillable_quantity',
    subOptions: conditions,
  },
  {
    label: 'Product type',
    value: 'abandoned_checkout.line_items.product_type',
    subOptions: conditions,
  },
  {
    label: 'Tags',
    value: 'abandoned_checkout.line_items.tags',
    subOptions: isNotList,
  },
  {
    label: 'Vendor',
    value: 'abandoned_checkout.line_items.vendor',
    subOptions: conditions,
  },
  {
    label: 'Product quantity',
    value: 'abandoned_checkout.line_items.quantity',
    subOptions: conditions,
  },
  {
    label: 'Variants count',
    value: 'abandoned_checkout.line_items.variants_count',
    subOptions: conditions,
  },
];

const productConditionBase = [
  {
    label: 'Select',
    value: '',
  },
  {
    label: 'Any of the Products and Collections match the following',
    value: 'any_of',
    subOptions: listofProductOptions,
  },
  {
    label: 'All of the Products and Collections match the following',
    value: 'all_of',
    subOptions: listofProductOptions,
  },
  {
    label: 'None of the Products and Collections match the following',
    value: 'none_of',
    subOptions: listofProductOptions,
  },
];
const countryStatementList = [
  {
    label: 'Select',
    value: '',
  },
  {
    label: 'Any of the Country and Address match the following',
    value: 'any_of',
    subOptions: countryOptionList,
  },
  {
    label: 'All of the Country and Address match the following',
    value: 'all_of',
    subOptions: countryOptionList,
  },
  {
    label: 'None of the Country and Address match the following',
    value: 'none_of',
    subOptions: countryOptionList,
  },
];

export const conditionOptions = [
  {
    title: 'Checkout Specific',
    options: [
      {
        label: 'Total cart value',
        value: 'abandoned_checkout.total_price',
      },
      {
        label: 'Products and Collections',
        value: 'abandoned_checkout.line_items',
        subOptions: productConditionBase,
      },
      {
        label: 'Currency code',
        value: 'abandoned_checkout.currency',
        subOptions: isNotList,
      },
      {
        label: 'Email',
        value: 'abandoned_checkout.email',
      },
      {
        label: 'Checkout phone',
        value: 'abandoned_checkout.phone',
      },
    ],
  },
  {
    title: 'SMSBump',
    options: [
      {
        label: 'Made an order since start of this flow',
        value: 'abandoned_checkout.order_since_flow_start',
        subOptions: istrueList,
      },
      {
        label: 'Clicked on a link from this flow',
        value: 'abandoned_checkout.abandoned_url_link_click',
        subOptions: istrueList,
      },
    ],
  },
  {
    title: 'Segments',
    options: [
      {
        label: 'Subscriber',
        value: 'abandoned_checkout.subscriber_lists',
        subOptions: isPartOf,
      },
    ],
  },
  {
    title: 'Shopify Customer',
    options: [
      {
        label: 'Total spent',
        value: 'abandoned_checkout.customer.total_spent',
        subOptions: conditions,
      },
      {
        label: 'Tags',
        value: 'abandoned_checkout.customer.tags',
        subOptions: isNotList,
      },
      {
        label: 'Orders Count',
        value: 'abandoned_checkout.customer.orders_count',
        subOptions: conditions,
      },
      {
        label: 'Name',
        value: 'abandoned_checkout.customer.name',
        subOptions: conditions,
      },
      {
        label: 'Email',
        value: 'abandoned_checkout.customer.email',
        subOptions: conditions,
      },
      {
        label: 'Country and Address',
        value: 'abandoned_checkout.customer.addresses',
        subOptions: countryStatementList,
      },
      {
        label: 'Gender',
        value: 'abandoned_checkout.customer.gender',
      },
    ],
  },
  {
    title: 'Shipping Address',
    options: [
      {
        label: 'Country',
        value: 'abandoned_checkout.shipping_address.country_code',
        subOptions: isNotList,
      },
      {
        label: 'City',
        value: 'abandoned_checkout.shipping_address.city',
        subOptions: conditions,
      },
      {
        label: 'Province',
        value: 'abandoned_checkout.shipping_address.province',
        subOptions: conditions,
      },
      {
        label: 'Company',
        value: 'abandoned_checkout.shipping_address.company',
        subOptions: conditions,
      },
      {
        label: 'Postcode',
        value: 'abandoned_checkout.shipping_address.zip',
        subOptions: conditions,
      },
      {
        label: 'First Name',
        value: 'abandoned_checkout.shipping_address.first_name',
        subOptions: conditions,
      },
      {
        label: 'Last Name',
        value: 'abandoned_checkout.shipping_address.last_name',
        subOptions: conditions,
      },
    ],
  },
  {
    title: 'Billing Address',
    options: [
      {
        label: 'Country',
        value: 'abandoned_checkout.billing_address.country_code',
        subOptions: isNotList,
      },
      {
        label: 'City',
        value: 'abandoned_checkout.billing_address.city',
        subOptions: conditions,
      },
      {
        label: 'Province',
        value: 'abandoned_checkout.billing_address.province',
        subOptions: conditions,
      },
      {
        label: 'Company',
        value: 'abandoned_checkout.billing_address.company',
        subOptions: conditions,
      },
      {
        label: 'Postcode',
        value: 'abandoned_checkout.billing_address.zip',
        subOptions: conditions,
      },
      {
        label: 'First Name',
        value: 'abandoned_checkout.billing_address.first_name',
        subOptions: conditions,
      },
      {
        label: 'Last Name',
        value: 'abandoned_checkout.billing_address.last_name',
        subOptions: conditions,
      },
    ],
  },
];
