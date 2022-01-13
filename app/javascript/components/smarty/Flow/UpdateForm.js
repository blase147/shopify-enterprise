import React, { useState, useEffect } from 'react';
import {
  Card,
  Layout,
  Select,
  TextField,
  Spinner,
  SkeletonDisplayText,
  Button,
  Stack,
  DataTable,
  Pagination,
  TextStyle,
  Subheading,
  Checkbox,
} from '@shopify/polaris';
import FlowTree from './FlowTree';

const UpdateFlowForm = ({ id, handleClose }) => {
  const [flow, setFlow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  // useEffect(() => {
  //   if (id) {
  //     fetch(`/sms_flows/${id}/edit`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       credentials: 'same-origin',
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setFlow(data);
  //         setLoading(false);
  //       });
  //   }
  // }, [id]);
  const types = [
    {
      tag: 'abandoned_cart',
      content: 'Abandoned Cart',
    },
    {
      tag: 'browse_abandonment',
      content: 'Browse Abandonment',
    },
    {
      tag: 'customer_winback',
      content: 'Customer Winback',
    },
    {
      tag: 'post_purchase',
      content: 'Post Purchase',
    },
    {
      tag: 'new_subscriber',
      content: 'New Subscriber',
    },
    {
      tag: 'customer_care',
      content: 'Customer Care',
    },
    {
      tag: 'holiday_flows',
      content: 'Holiday Flows',
    },
    {
      tag: 'transactional',
      content: 'Transactional',
    },
  ];
  const integrations = [
    {
      tag: 'recharge',
      content: 'Recharge',
    },
    {
      tag: 'yotpo',
      content: 'Yotpo',
    },
    {
      tag: 'ocu',
      content: 'OCU',
    },
  ];
  const predefinedFlows = [
    {
      title: 'Abandoned Cart 2 Step',
      description:
        '2 series abandoned cart flow, designed to boost your abandoned cart recovery rate',
    },
    {
      title: 'High Value vs Low Value Abandoned Cart Flow',
      description:
        'Trigger different abandoned cart promos based on the abandoned cart value',
    },
    {
      title: 'International Abandoned Cart',
      description:
        'Send abandoned cart messages in 4 different languages, based on the customers locale',
    },
    {
      title: 'Browse Abandonment',
      description:
        'Remind customers for the last product they saw in your store and nudge them to make a purchase',
    },
    {
      title: 'Customer Winback Single',
      description:
        'Increase customer LTV by sending a SMS promo for people that have not shopped for a while',
    },
    {
      title: 'Customer Winback 2 Step',
      description:
        '2 series customer winback designed to bring back lapsed customers',
    },
    {
      title: 'Post Purchase Upsell',
      description:
        'Offer an instant discount whenever someone orders a new product',
    },
    {
      title: 'Post Purchase New Customer vs Existing Customer + Upsell',
      description:
        'Send an order confirmation for new customers and treat repeat buyers with a special offer',
    },
    {
      title: 'Post Purchase Cross-Sell',
      description:
        'Cross sell specific products based on what your customer has purchased',
    },
  ];
  return (

    <Card >
      <FlowTree id={id}></FlowTree>
    </Card>
  );
};

export default UpdateFlowForm;
