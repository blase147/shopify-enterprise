import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Card,
  Select,
  Heading,
  FormLayout,
  Button,
  Icon,
  Modal,
  TextField,
  Stack,
  Toast,
  Frame
} from '@shopify/polaris';
import MainImage from "../../images/main-image.png";
import Icon1 from "../../images/icons/icon1.png";
import Icon2 from "../../images/icons/icon2.png";
import Icon3 from "../../images/icons/icon3.png";
import Icon4 from "../../images/icons/icon4.png";
import Icon5 from "../../images/icons/icon5.png";
import Icon6 from "../../images/icons/icon6.png";
import Icon7 from "../../images/icons/icon7.png";
import Icon8 from "../../images/icons/icon8.png";
import { DeleteMajor } from '@shopify/polaris-icons';
import UserImage from "../../images/account.svg";
import "./loyalty.css";
import { DomainContext } from '../domain-context';

const Customize = () => {
  const { domain } = useContext(DomainContext);
  const [active, setActive] = useState(false);
  const [statusActive, setStatusActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleStatusActive = useCallback(() => setStatusActive((statusActive) => !statusActive), []);

  const [loyaltyId, setLoyaltyId] = useState(null);
  const [programName, setProgramName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [location, setLocation] = useState('customer-portal');
  const [primaryThemeClr, setPrimaryThemeClr] = useState('');
  const [secondaryThemeClr, setSecondaryThemeClr] = useState('');
  const [primaryTextClr, setPrimaryTextClr] = useState('');
  const [secondaryTextClr, setSecondaryTextClr] = useState('');

  const [purchase, setPurchase] = useState(0);
  const [account, setAccount] = useState(0);
  const [socialMediaLike, setSocialMediaLike] = useState(0);
  const [socialMediaFollow, setSocialMediaFollow] = useState(0);
  const [upsell, setUpsell] = useState(0);
  const [smartySms, setSmartySms] = useState(0);
  const [referFriend, setReferFriend] = useState(0);
  const [mailingList, setMailingList] = useState(0);
  const [customRule, setCustomRule] = useState(0);

  const [discount, setDiscount] = useState(0);
  const [point, setPoint] = useState(0);
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);

  const couponList = [
    { label: '$5.00 OFF', value: '5' },
    { label: '$10.00 OFF', value: '10' },
    { label: '$15.00 OFF', value: '15' },
  ];

  const descTexts = [
    { label: 'Earn 10 points when you create an account', value: '10' },
    { label: 'Earn 50 points when you create an account', value: '50' },
    { label: 'Earn 100 points when you create an account', value: '100' },
  ];

  const completedMsgList = [
    { label: 'Looks like you have already compeleted this offer!', value: 'offer-completed' },
    { label: 'You have already availed this offer!', value: 'offer-availed' },
    { label: 'Looks like this offer is not valid anymore!', value: 'offer-invalid' },
  ];

  const maxCompletionLimits = [
    { label: 'No Maximum', value: 'no-max' },
    { label: '5 Times', value: '5-times' },
    { label: '10 Times', value: '10-times' },
  ];

  const rewardOptions = [
    { label: 'Coupon', value: 'coupon' },
    { label: 'Discount', value: 'discount' },
    { label: 'Points', value: 'points' },
  ];

  const loactionOptions = [
    { label: 'Customer Portal', value: 'customer-portal' },
    { label: 'Website Frontend', value: 'website-frontend' },
  ];

  const iconsList = [
    { label: 'fa-user', value: 'fa-user' },
    { label: 'fa-heart', value: 'fa-heart' },
    { label: 'fa-person', value: 'fa-person' },
    { label: 'fa-dollar', value: 'fa-dollar' },
  ];
  const rewardReferrerOptions = [
    { label: 'a coupon', value: 'coupon' },
    { label: 'points', value: 'points' },
    { label: 'nothing', value: 'nothing' },
  ]
  const pointsReferrerEarnsOptions = [
    { label: 'a fixed amount', value: 'fixed_amount' },
    { label: 'based on the amount spent by the referred customer', value: 'percentage_spend' },
    { label: 'based on the product purchased by the referred customer', value: 'product_map' },
  ]

  // refer_a_friend Campaign
  const [referCampaignStatus, setReferCampaignStatus] = useState(false);
  const [referCampaignDate, setReferCampaignDate] = useState(null);
  const [referrerReward, setReferrerReward] = useState(0);
  const [referrerPoints, setReferrerPoints] = useState(0);
  const [referrerFixedPoints, setReferrerFixedPoints] = useState(0);
  const [pointsToReferrer, setPointsToReferrer] = useState(0);
  const [pointsToReferred, setPointsToReferred] = useState(0);
  const [selectedReward, setSelectedReward] = useState('coupon');
  const [selectedCoupon, setSelectedCoupon] = useState('5');
  const [applyCoupon, setApplyCoupon] = useState(1);
  const [rewardText, setRewardText] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('fa-user');
  const [callToActionText, setCallToActionText] = useState('');
  const [landingURL, setLandingURL] = useState('');
  const [landingURLQueryParams, setLandingURLQueryParams] = useState('');
  const [defaultTwitterMsg, setDefaultTwitterMsg] = useState('');
  const [headerForFbMsg, setHeaderForFbMsg] = useState('');
  const [descriptionForFbMsg, setDescriptionForFbMsg] = useState('');
  const [defaultSmsMsg, setDefaultSmsMsg] = useState('');

  const [showReferCampaign, setShowReferCampaign] = useState(false);
  const referActivator = <Button primary outline size="slim" onClick={() => getReferCampaign()}>Edit</Button>;

  const [rewardReferrer, setRewardReferrer] = useState("nothing");
  const [pointsReferrerEarns, setPointsReferrerEarns] = useState("fixed_amount");

  const [couponReferrerGet, setCouponReferrerGet] = useState("5");
  console.log("pointsToReferred", pointsToReferred);
  const getReferCampaign = () => {
    setShowReferCampaign(true);
    fetch(`/loyalty_campaign?name=refer_a_friend&shopify_domain=${domain}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setReferCampaignStatus(data.campaign?.status);
          setReferCampaignDate(data.campaign?.updated_at);
          setReferrerReward(data.campaign?.referrer_reward.toString());
          setReferrerPoints(data.campaign?.referrer_points.toString());
          setReferrerFixedPoints(data.campaign?.referrer_fixed_points.toString());
          setPointsToReferrer(data.campaign?.points_to_referrer.toString());
          setSelectedReward(data.campaign?.selected_reward);
          setSelectedCoupon(data.campaign?.selected_coupon);
          setApplyCoupon(data.campaign?.apply_coupon.toString());
          setCampaignName(data.campaign?.campaign_name);
          setRewardText(data.campaign?.reward_text);
          setDescription(data.campaign?.description);
          setIcon(data.campaign?.icon);
          setCallToActionText(data.campaign?.call_to_action_text);
          setLandingURL(data.campaign?.landing_url);
          setLandingURLQueryParams(data.campaign?.landing_url_query_params);
          setDefaultTwitterMsg(data.campaign?.default_twitter_msg);
          setHeaderForFbMsg(data.campaign?.header_for_fb_msg);
          setDescriptionForFbMsg(data.campaign?.description_for_fb_msg);
          setDefaultSmsMsg(data.campaign?.default_sms_msg);
          setRewardReferrer(data.campaign?.reward_referrer)
          setCouponReferrerGet(data.campaign?.coupon_referrer_get)
          setPointsReferrerEarns(data.campaign?.points_referrer_earns)
          setPercentPointsReferrer(data.campaign?.percent_points_referrer)
          setMapProductsPoints(data.campaign?.map_products_points)
          setPointsToReferred(data.campaign?.points_to_referred)
        }
      })
  }

  const saveReferCampaign = () => {
    fetch('/loyalty_campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopify_domain: domain, name: 'refer_a_friend', referrer_reward: referrerReward, referrer_points: referrerPoints, referrer_fixed_points: referrerFixedPoints, points_to_referrer: pointsToReferrer, selected_reward: selectedReward, selected_coupon: selectedCoupon, apply_coupon: applyCoupon,
        campaign_name: campaignName, reward_text: rewardText, description: description, icon: icon, call_to_action_text: callToActionText, landing_url: landingURL, landing_url_query_params: landingURLQueryParams,
        default_twitter_msg: defaultTwitterMsg, header_for_fb_msg: headerForFbMsg, description_for_fb_msg: descriptionForFbMsg, default_sms_msg: defaultSmsMsg, reward_referrer: rewardReferrer, coupon_referrer_get: couponReferrerGet, points_referrer_earns: pointsReferrerEarns,
        percent_points_referrer: percentPointsReferrer, map_products_points: mapProductsPoints, points_to_referred: pointsToReferred
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          toggleActive();
        }
      })
  }

  // create_account Campaign
  const [accountCampaignStatus, setAccountCampaignStatus] = useState(false);
  const [accountCampaignDate, setAccountCampaignDate] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [descText, setDescText] = useState('10');
  const [completedMsg, setCompletedMsg] = useState('offer-completed');
  const [maxTimesCompletion, setMaxTimesCompletion] = useState('no-max');

  const [showAccountCampaign, setShowAccountCampaign] = useState(false);
  const accountActivator = <Button primary outline size="slim" onClick={() => getAccountCampaign()}>Edit</Button>;

  const getAccountCampaign = () => {
    setShowAccountCampaign(true);
    fetch(`/loyalty_campaign?name=create_account&shopify_domain=${domain}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setAccountCampaignStatus(data.campaign?.status);
          setAccountCampaignDate(data.campaign?.updated_at);
          setSelectedReward(data.campaign?.selected_reward);
          setPointsToReferrer(data.campaign?.points_to_referrer.toString());
          setCampaignName(data.campaign?.campaign_name);
          setRewardText(data.campaign?.reward_text);
          setDescText(data.campaign?.description_text);
          setIcon(data.campaign?.icon);
          setCompletedMsg(data.campaign?.completed_msg);
          setMaxTimesCompletion(data.campaign?.max_times_completion);
        }
      })
  }

  const saveAccountCampaign = () => {
    fetch('/loyalty_campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'create_account', selected_reward: selectedReward, points_to_referrer: pointsToReferrer, campaign_name: campaignName, reward_text: rewardText, description_text: descText, icon: icon, completed_msg: completedMsg, max_times_completion: maxTimesCompletion, shopify_domain: domain })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          toggleActive();
        }
      })
  }

  // happy_birthday Campaign
  const [birthdayCampaignStatus, setBirthdayCampaignStatus] = useState(false);
  const [birthdayCampaignDate, setBirthdayCampaignDate] = useState(null);

  const [showBirthdayCampaign, setShowBirthdayCampaign] = useState(false);
  const birthdayActivator = <Button primary outline size="slim" onClick={() => getBirthdayCampaign()}>Edit</Button>;

  const getBirthdayCampaign = () => {
    setShowBirthdayCampaign(true);
    fetch(`/loyalty_campaign?name=happy_birthday&shopify_domain=${domain}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setBirthdayCampaignStatus(data.campaign?.status);
          setBirthdayCampaignDate(data.campaign?.updated_at);
          setSelectedReward(data.campaign?.selected_reward);
          setPointsToReferrer(data.campaign?.points_to_referrer.toString());
          setCampaignName(data.campaign?.campaign_name);
          setRewardText(data.campaign?.reward_text);
          setDescText(data.campaign?.description_text);
          setDefaultSmsMsg(data.campaign?.default_sms_msg);
          setDescription(data.campaign?.description);
          setApplyCoupon(data.campaign?.apply_coupon.toString());
          setIcon(data.campaign?.icon);
          setCallToActionText(data.campaign?.call_to_action_text);
        }
      })
  }

  const saveBirthdayCampaign = () => {
    fetch('/loyalty_campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'happy_birthday', selected_reward: selectedReward, points_to_referrer: pointsToReferrer, campaign_name: campaignName, reward_text: rewardText, description_text: descText, default_sms_msg: defaultSmsMsg, description: description, apply_coupon: applyCoupon, icon: icon, call_to_action_text: callToActionText, shopify_domain: domain })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          toggleActive();
        }
      })
  }

  // make_a_purchase Campaign
  const [purchaseCampaignStatus, setPurchaseCampaignStatus] = useState(false);
  const [purchaseCampaignDate, setPurchaseCampaignDate] = useState(null);
  const [customerFixedPoints, setCustomerFixedPoints] = useState(0);
  const [requiredProduct, setRequiredProduct] = useState('');
  const [requireProdReward, setRequireProdReward] = useState('entire-cart');
  const [customerTag, setCustomerTag] = useState('');
  const [customerTagList, setCustomerTagList] = useState('');
  const [orderTag, setOrderTag] = useState('');
  const [orderTagList, setOrderTagList] = useState('');
  const [limit, setLimit] = useState('exactly');
  const [orders, setOrders] = useState(0);
  const [maxTimesPerUser, setMaxTimesPerUser] = useState('no-max');
  const [timeBetween, setTimeBetween] = useState('5-days');
  const [countdownMessage, setCountdownMessage] = useState('24-hours');

  const [showPurchaseCampaign, setShowPurchaseCampaign] = useState(false);
  const purchaseActivator = <Button primary outline size="slim" onClick={() => getPurchaseCampaign()}>Edit</Button>;
  const [percentPointsReferrer, setPercentPointsReferrer] = useState('');
  const [mapProductsPoints, setMapProductsPoints] = useState('');

  const getPurchaseCampaign = () => {
    setShowPurchaseCampaign(true);
    fetch(`/loyalty_campaign?name=make_a_purchase&shopify_domain=${domain}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setPurchaseCampaignStatus(data.campaign?.status);
          setPurchaseCampaignDate(data.campaign?.updated_at);
          setCustomerFixedPoints(data.campaign?.customer_fixed_points.toString());
          setPointsToReferrer(data.campaign?.points_to_referrer.toString());
          setCampaignName(data.campaign?.campaign_name);
          setRewardText(data.campaign?.reward_text);
          setDescText(data.campaign?.description_text);
          setRequiredProduct(data.campaign?.required_product);
          setRequireProdReward(data.campaign?.required_product_reward);
          setCustomerTag(data.campaign?.customer_tag);
          setCustomerTagList(data.campaign?.customer_tag_list);
          setOrderTag(data.campaign?.order_tag);
          setOrderTagList(data.campaign?.order_tag_list);
          setLimit(data.campaign?.limit);
          setOrders(data.campaign?.orders.toString());
          setMaxTimesCompletion(data.campaign?.max_times_completion);
          setMaxTimesPerUser(data.campaign?.max_times_per_user);
          setTimeBetween(data.campaign?.time_between);
          setCountdownMessage(data.campaign?.countdown_message);
        }
      })
  }

  const savePurchaseCampaign = () => {
    fetch('/loyalty_campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopify_domain: domain, name: 'make_a_purchase', customer_fixed_points: customerFixedPoints, points_to_referrer: pointsToReferrer, campaign_name: campaignName, reward_text: rewardText, description_text: descText, required_product: requiredProduct, required_product_reward: requireProdReward,
        customer_tag: customerTag, customer_tag_list: customerTagList, order_tag: orderTag, order_tag_list: orderTagList, limit: limit, orders: orders, max_times_completion: maxTimesCompletion, max_times_per_user: maxTimesPerUser, time_between: timeBetween, countdown_message: countdownMessage
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          toggleActive();
        }
      })
  }

  // Customize Coupon
  const [couponValue, setCouponValue] = useState('');
  const [rewardCustomers, setRewardCustomers] = useState('redeem-points');
  const [couponType, setCouponType] = useState('fixed-amount');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponName, setCouponName] = useState('');
  const [couponPoints, setCouponPoints] = useState('');
  const [couponText, setCouponText] = useState('');
  const [applyDiscount, setApplyDiscount] = useState('any-product');
  const [cartAmount, setCartAmount] = useState(null);
  const [customerList, setCustomerList] = useState(null);
  const [applyDiscountPer, setApplyDiscountPer] = useState('cart');
  const [discountCodeUsage, setDiscountCodeUsage] = useState('1');
  const [couponCodeExpire, setCouponCodeExpire] = useState('never');
  const [couponRestriction, setCouponRestriction] = useState('0');
  const [codePrefix, setCodePrefix] = useState('');
  const [codeLength, setCodeLength] = useState(1);
  const [couponCodeIntro, setCouponCodeIntro] = useState('redeem');

  const [showCustomizeCoupon, setShowCustomizeCoupon] = useState(false);
  const coupon7Activator = <Button primary outline size="slim" onClick={() => getCustomizeCoupon('7.5')}>Edit</Button>;
  const coupon15Activator = <Button primary outline size="slim" onClick={() => getCustomizeCoupon('15')}>Edit</Button>;
  const coupon30Activator = <Button primary outline size="slim" onClick={() => getCustomizeCoupon('30')}>Edit</Button>;

  const getCustomizeCoupon = (value) => {
    setCouponValue(value);
    setShowCustomizeCoupon(true);
    fetch('/loyalty_coupon?name=' + value + '-off&shopify_domain=' + domain, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setRewardCustomers(data.coupon?.reward_customers);
          setCouponType(data.coupon?.coupon_type);
          setDiscountAmount(data.coupon?.discount_amount.toString());
          setCouponName(data.coupon?.coupon_name);
          setDescription(data.coupon?.description);
          setCouponPoints(data.coupon?.coupon_points);
          setCouponText(data.coupon?.coupon_text);
          setApplyDiscount(data.coupon?.apply_discount);
          setCartAmount(data.coupon?.cart_amount.toString());
          setCustomerList(data.coupon?.customer_list);
          setApplyDiscountPer(data.coupon?.apply_discount_per);
          setDiscountCodeUsage(data.coupon?.discount_code_usage);
          setCouponCodeExpire(data.coupon?.coupon_code_expire);
          setCouponRestriction(data.coupon?.coupon_restriction);
          setCodePrefix(data.coupon?.code_prefix);
          setCodeLength(data.coupon?.code_length.toString());
          setDefaultSmsMsg(data.coupon?.success_msg);
          setIcon(data.coupon?.icon);
          setCouponCodeIntro(data.coupon?.coupon_code_intro);
        }
      })
  }

  const saveCustomizeCoupon = () => {
    fetch('/loyalty_coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopify_domain: domain, name: couponValue + '-off', reward_customers: rewardCustomers, coupon_type: couponType, discount_amount: discountAmount, coupon_name: couponName, description: description, coupon_points: couponPoints,
        coupon_text: couponText, apply_discount: applyDiscount, cart_amount: cartAmount, customer_list: customerList, apply_discount_per: applyDiscountPer, discount_code_usage: discountCodeUsage, coupon_code_expire: couponCodeExpire,
        coupon_restriction: couponRestriction, code_prefix: codePrefix, code_length: codeLength, success_msg: defaultSmsMsg, icon: icon, coupon_code_intro: couponCodeIntro
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          toggleActive();
        }
      })
  }

  // Loyalty Settings
  useEffect(() => {
    fetch(`/loyalty?shopify_domain=${domain}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setProgramName(data.loyalty?.name);
          setLocation(data.loyalty?.location);
          setPrimaryThemeClr(data.loyalty?.primary_theme_color);
          setSecondaryThemeClr(data.loyalty?.secondary_theme_color);
          setPrimaryTextClr(data.loyalty?.primary_text_color);
          setSecondaryTextClr(data.loyalty?.secondary_text_color);
        }
      })

    fetch(`/loyalty_campaign/campaign_statuses?shopify_domain=${domain}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          data.campaigns.map(function (campaign) {
            if (campaign.name == 'refer_a_friend') {
              setReferCampaignStatus(campaign.status)
              setReferCampaignDate(campaign.updated_at)
            }
            else if (campaign.name == 'create_account') {
              setAccountCampaignStatus(campaign.status)
              setAccountCampaignDate(campaign.updated_at)
            }
            else if (campaign.name == 'happy_birthday') {
              setBirthdayCampaignStatus(campaign.status)
              setBirthdayCampaignDate(campaign.updated_at)
            }
            else if (campaign.name == 'make_a_purchase') {
              setPurchaseCampaignStatus(campaign.status)
              setPurchaseCampaignDate(campaign.updated_at)
            }
          })
        }
      })
  }, [])

  const saveCustomizeSettings = () => {
    if (programName.replace(/\s/g, '') !== '') {
      fetch('/loyalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: programName.trim(), location: location.trim(), primary_theme_color: primaryThemeClr.trim(), secondary_theme_color: secondaryThemeClr.trim(), primary_text_color: primaryTextClr.trim(), secondary_text_color: secondaryTextClr.trim(), shopify_domain: domain })
      })
        .then((response) => response.json())
        .then((data) => {
          toggleActive();
          setLoyaltyId(data.loyalty.id);
          setNameError(false);
          // fetchEarnPointsSettings();
        })
    } else {
      setNameError(true);
    }
  }

  // Loyalty Points Settings
  const fetchEarnPointsSettings = () => {
    fetch(`/loyalty_rules?shopify_domain=${domain}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setPurchase(data.settings?.purchase.toString());
          setAccount(data.settings?.account.toString());
          setSocialMediaLike(data.settings?.social_media_like.toString());
          setSocialMediaFollow(data.settings?.social_media_follow.toString());
          setUpsell(data.settings?.buy_upsell.toString());
          setSmartySms(data.settings?.signup_smarty_sms.toString());
          setReferFriend(data.settings?.refer_friend.toString());
          setMailingList(data.settings?.signup_mailing_list.toString());
          setCustomRule(data.settings?.custom_rule.toString());
        }
      })
  }

  const saveEarnPointsSettings = () => {
    fetch('/loyalty_rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loyalty_id: loyaltyId, purchase: purchase, account: account, social_media_like: socialMediaLike, social_media_follow: socialMediaFollow, buy_upsell: upsell, signup_smarty_sms: smartySms, refer_friend: referFriend, signup_mailing_list: mailingList, custom_rule: customRule, shopify_domain: domain })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          // setShowRedeemForm(true);
          // fetchRedeemPointsSettings();
        }
      })
  }

  // Loyalty Redeem Points Settings
  const fetchRedeemPointsSettings = () => {
    fetch(`/loyalty_redeem_points?shopify_domain=${domain}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setDiscount(data.settings?.discount.toString());
          setPoint(data.settings?.point.toString());
          setStartingDate(data.settings?.starting_date.toString());
          setEndingDate(data.settings?.ending_date.toString());
        }
      })
  }

  const saveRedeemPointsSettings = () => {
    fetch('/loyalty_redeem_points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loyalty_id: loyaltyId, discount: discount, point: point, starting_date: startingDate, ending_date: endingDate, shopify_domain: domain })
    })
      .then((response) => response.json())
      .then((data) => {

      })
  }

  // Update Campaign Status 
  const updateCampaignStatus = (name, status) => {
    fetch('/loyalty_campaign/update_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, status: !status, shopify_domain: domain })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          toggleStatusActive();
          if (data.campaign_name == 'refer_a_friend')
            setReferCampaignStatus(data.campaign_status)
          else if (data.campaign_name == 'create_account')
            setAccountCampaignStatus(data.campaign_status)
          else if (data.campaign_name == 'happy_birthday')
            setBirthdayCampaignStatus(data.campaign_status)
          else if (data.campaign_name == 'make_a_purchase')
            setPurchaseCampaignStatus(data.campaign_status)
        }
      })
  }

  const toastMarkup = active ? (
    <Frame>
      <Toast content="Data updated successfully." onDismiss={toggleActive} duration={3000} />
    </Frame>
  ) : statusActive ? (
    <Frame>
      <Toast content="Status updated successfully." onDismiss={toggleStatusActive} duration={3000} />
    </Frame>
  ) : null;

  return (
    <FormLayout>
      <Card
        sectioned
        primaryFooterAction={{ content: 'Save and Continue', onAction: saveCustomizeSettings }}
        footerActionAlignment="left"
      >
        <div className='card-box'>
          {/* <h2 className='blue-title'>Customize</h2> */}
          <Stack distribution="fill">
            <TextField
              type="text"
              label={"Name your loyalty program *"}
              placeholder='Subscribe and Save'
              value={programName}
              onChange={useCallback((newValue) => setProgramName(newValue), [])}
              error={nameError}
              autoComplete="off"
              helpText={<span>Internal name of the group, use to identify it in the admin</span>}
            />
            <Select
              label="Select loyalty location *"
              options={loactionOptions}
              value={location}
              onChange={useCallback((newValue) => setLocation(newValue), [])}
            />
          </Stack>
          <div className='holder color-holder'>
            <h3>COLORS</h3>
            <Stack>
              <TextField
                label="Pick Color"
                type="color"
                placeholder='None'
                value={primaryThemeClr}
                onChange={useCallback((newValue) => setPrimaryThemeClr(newValue), [])}
                autoComplete="off"
              />
              <TextField
                label="Primary theme color"
                type="text"
                placeholder='None'
                value={primaryThemeClr}
                onChange={useCallback((newValue) => setPrimaryThemeClr(newValue), [])}
                autoComplete="off"
              />
              <TextField
                label="Pick Color"
                type="color"
                placeholder='None'
                value={secondaryThemeClr}
                onChange={useCallback((newValue) => setSecondaryThemeClr(newValue), [])}
                autoComplete="off"
              />
              <TextField
                label="Secondary theme color"
                type="text"
                placeholder='None'
                value={secondaryThemeClr}
                onChange={useCallback((newValue) => setSecondaryThemeClr(newValue), [])}
                autoComplete="off"
              />
            </Stack>
          </div>
          <div className='mt-3 color-holder'>
            <Stack>
              <TextField
                label="Pick Color"
                type="color"
                placeholder='None'
                value={primaryTextClr}
                onChange={useCallback((newValue) => setPrimaryTextClr(newValue), [])}
                autoComplete="off"
              />
              <TextField
                label="Primary text color"
                type="text"
                placeholder='None'
                value={primaryTextClr}
                onChange={useCallback((newValue) => setPrimaryTextClr(newValue), [])}
                autoComplete="off"
              />
              <TextField
                label="Pick Color"
                type="color"
                placeholder='None'
                value={secondaryTextClr}
                onChange={useCallback((newValue) => setSecondaryTextClr(newValue), [])}
                autoComplete="off"
              />
              <TextField
                label="Primary text color"
                type="text"
                placeholder='None'
                value={secondaryTextClr}
                onChange={useCallback((newValue) => setSecondaryTextClr(newValue), [])}
                autoComplete="off"
              />
            </Stack>
          </div>
        </div>
      </Card>
      <div style={false ? { display: "block" } : { display: "none" }}>
        <Card
          sectioned
          primaryFooterAction={{ content: 'Save and Continue', onAction: saveEarnPointsSettings }}
          footerActionAlignment="left"
        >
          <div className='card-box'>
            <h2 className='blue-title'>Earn Points</h2>
            <h3 className='m-0'>POINTS RULES</h3>
            <p>Create ways yours customers can earn points when they join, share and engage with your brand.</p>

            <div className='holder color-holder'>
              <Stack distribution="fillEvenly">
                <TextField
                  label="Make a purchase (Buy a subscription product)"
                  type="number"
                  min="0"
                  placeholder='5'
                  value={purchase}
                  onChange={useCallback((newValue) => setPurchase(newValue), [])}
                  autoComplete="off"
                  helpText={<span>Points per dollar spent</span>}
                />
                <TextField
                  label="Create an Account"
                  type="number"
                  min="0"
                  placeholder='50'
                  value={account}
                  onChange={useCallback((newValue) => setAccount(newValue), [])}
                  autoComplete="off"
                  helpText={<span>Points per dollar spent</span>}
                />
                <TextField
                  label="Like us on Social Media - Facebook & IG"
                  type="number"
                  min="0"
                  placeholder='100'
                  value={socialMediaLike}
                  onChange={useCallback((newValue) => setSocialMediaLike(newValue), [])}
                  autoComplete="off"
                />
              </Stack>
            </div>
            <div className='mt-3 color-holder'>
              <Stack distribution="fillEvenly">
                <TextField
                  label="Follow us on Social Media - Facebook & IG"
                  type="number"
                  min="0"
                  placeholder='5'
                  value={socialMediaFollow}
                  onChange={useCallback((newValue) => setSocialMediaFollow(newValue), [])}
                  autoComplete="off"
                />
                <TextField
                  label="Buy an Upsell"
                  type="number"
                  min="0"
                  placeholder='100'
                  value={upsell}
                  onChange={useCallback((newValue) => setUpsell(newValue), [])}
                  autoComplete="off"
                  helpText={<span>Points per dollar spent</span>}
                />
                <TextField
                  label="Sign up to our Smarty SMS"
                  type="number"
                  min="0"
                  placeholder='100'
                  value={smartySms}
                  onChange={useCallback((newValue) => setSmartySms(newValue), [])}
                  autoComplete="off"
                />
              </Stack>
            </div>
            <div className='mt-3 color-holder'>
              <Stack distribution="fillEvenly">
                <TextField
                  label="Refer a friend"
                  type="number"
                  min="0"
                  placeholder='10'
                  value={referFriend}
                  onChange={useCallback((newValue) => setReferFriend(newValue), [])}
                  autoComplete="off"
                />
                <TextField
                  label="Sign up to our mailing list"
                  type="number"
                  min="0"
                  placeholder='50'
                  value={mailingList}
                  onChange={useCallback((newValue) => setMailingList(newValue), [])}
                  autoComplete="off"
                />
                <TextField
                  label="Create custom rule"
                  type="number"
                  min="0"
                  placeholder='100'
                  value={customRule}
                  onChange={useCallback((newValue) => setCustomRule(newValue), [])}
                  autoComplete="off"
                />
              </Stack>
            </div>
          </div>
        </Card>
      </div>
      <div style={false ? { display: "block" } : { display: "none" }}>
        <Card
          sectioned
          secondaryFooterActions={[{ content: '+ Add' }]}
          primaryFooterAction={{ content: 'Save and Continue', onAction: saveRedeemPointsSettings }}
          footerActionAlignment="left"
        >
          <div className='card-box'>
            <h2 className='blue-title'>Redeem Points</h2>
            <h3 className='m-0'>REWARD RULES</h3>
            <p>Create rewards yours customers can redeem with the points they've earned.</p>

            <div className='holder color-holder'>
              <Stack distribution="fillEvenly">
                <TextField
                  label="Order Discount"
                  type="number"
                  min='0'
                  placeholder='5 dollar discount'
                  value={discount}
                  onChange={useCallback((newValue) => setDiscount(newValue), [])}
                  prefix={"$"}
                  autoComplete="off"
                />
                <TextField
                  label="Points"
                  type="number"
                  min='0'
                  placeholder='500 Points'
                  value={point}
                  onChange={useCallback((newValue) => setPoint(newValue), [])}
                  autoComplete="off"
                />
                <TextField
                  label="Starting Date"
                  type="date"
                  placeholder='Choose Starting Date'
                  value={startingDate}
                  onChange={useCallback((newValue) => setStartingDate(newValue), [])}
                  autoComplete="off"
                />
                <TextField
                  label="Ending Date"
                  type="date"
                  placeholder='Choose Ending Date'
                  value={endingDate}
                  onChange={useCallback((newValue) => setEndingDate(newValue), [])}
                  autoComplete="off"
                />
                <Icon source={DeleteMajor} />
              </Stack>
            </div>
          </div>
        </Card>
      </div>

      <Card
        sectioned
        primaryFooterAction={{ content: 'Save and Continue' }}
        footerActionAlignment="left"
      >
        <div className='card-box'>
          <h2 className='blue-title'>Earn Points</h2>
          <h3 className='m-0'>POINTS RULES</h3>
          <p>Create ways your customer can earn points when they join, share, and engage with your brand.</p>
          <div className='holder'>
            <div className='cards-list'>
              <Card sectioned>
                <div className='card-header' id={referCampaignStatus ? 'activated' : 'not-activated'}>
                  <Heading element="h2">Refer a friend <br /><small>Refer a friend</small></Heading>
                  <div className='button-holder'>
                    <Modal
                      large
                      activator={referActivator}
                      open={showReferCampaign}
                      onClose={useCallback(() => setShowReferCampaign(!showReferCampaign), [showReferCampaign])}
                      title="Customize Refer a friend Campaign"
                      primaryAction={{
                        content: 'Save Changes',
                        onAction: saveReferCampaign,
                      }}
                    >
                      <Modal.Section>
                        <div className='input-group'>
                          {/* <div className="icon-before">$</div> */}
                          <TextField
                            type="number"
                            min='0'
                            label="Reward the referrer when the referred customer spends over..."
                            placeholder='5'
                            prefix={"$"}
                            value={referrerReward}
                            onChange={useCallback((newValue) => setReferrerReward(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          {/* <div className='mt-2 with-premium-label-tag'> */}
                          <Select
                            label="Reward the referrer with..."
                            options={rewardReferrerOptions}
                            onChange={(newValue) => setRewardReferrer(newValue)}
                            value={rewardReferrer}
                          />
                        </div>
                        <div className='rewadRefferWithForm'>
                          {rewardReferrer === "coupon" &&
                            <div className='mt-2'>
                              <Select
                                label="Which coupon should the referrer get?."
                                options={couponList}
                                onChange={(newValue) => setCouponReferrerGet(newValue)}
                                value={couponReferrerGet}
                              />
                            </div>
                          }

                          {rewardReferrer === "points" &&
                            <div className='mt-2'>
                              <Select
                                label="The amount of points the referrer earns is..."
                                options={pointsReferrerEarnsOptions}
                                onChange={(newValue) => setPointsReferrerEarns(newValue)}
                                value={pointsReferrerEarns}
                              />
                            </div>
                          }
                        </div>

                        <div className='RewardReferrerpoints'>
                          {pointsReferrerEarns === "fixed_amount" &&
                            <div className='mt-2'>
                              <div className='input-group'>
                                <TextField
                                  type="number"
                                  min='0'
                                  label="How many points should we give the referrer"
                                  placeholder='500'
                                  value={referrerFixedPoints}
                                  onChange={(newValue) => setReferrerFixedPoints(newValue)}
                                  autoComplete="off"
                                />
                                <div className="icon-after">points</div>
                              </div>
                            </div>
                          }
                          {
                            pointsReferrerEarns === "percentage_spend" &&
                            <div className='mt-2'>
                              <div className='input-group'>
                                <TextField
                                  type="number"
                                  min='0'
                                  label="What percentage of spend should be rewarded in points?"
                                  placeholder='10'
                                  value={percentPointsReferrer}
                                  onChange={(newValue) => setPercentPointsReferrer(newValue)}
                                  autoComplete="off"
                                />
                                <div className="icon-after">%</div>
                              </div>
                            </div>
                          }
                          {
                            pointsReferrerEarns === "product_map" &&
                            <div className='input-group'>
                              <div className='mt-2'>
                                <TextField
                                  type="text"
                                  min='0'
                                  label="Provide a mapping between product id and points. (ex. 1:100, 2:150)"
                                  placeholder=''
                                  value={mapProductsPoints}
                                  onChange={(newValue) => setMapProductsPoints(newValue)}
                                  autoComplete="off"
                                />
                              </div>
                            </div>
                          }
                        </div>
                        {/* Reward for referred customer */}
                        <div className='mt-2'>
                          {/* <div className='mt-2 with-premium-label-tag'> */}
                          <Select
                            label="Reward the referred customer with..."
                            options={rewardReferrerOptions}
                            onChange={(newValue) => setSelectedReward(newValue)}
                            value={selectedReward}
                          />
                        </div>
                        <div className='rewadRefferWithForm'>
                          {selectedReward === "coupon" &&
                            <div className='mt-2'>
                              <Select
                                label="Which coupon should the referred customer get?"
                                options={couponList}
                                onChange={(newValue) => setSelectedCoupon(newValue)}
                                value={selectedCoupon}
                              />
                            </div>
                          }

                          {selectedReward === "points" &&
                            <div className='mt-2'>
                              <div className='input-group'>
                                <TextField
                                  type="number"
                                  min='0'
                                  label="How many points should we give the referred customer?"
                                  placeholder='500'
                                  onChange={(newValue) => setPointsToReferred(newValue)}
                                  autoComplete="off"
                                  value={pointsToReferred}
                                />
                                <div className="icon-after">points</div>
                              </div>
                            </div>
                          }
                        </div>

                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: 'Yes', value: '1' },
                              { label: 'No', value: '0' }
                            ]}
                            label="Auto apply coupon?"
                            onChange={useCallback((value) => setApplyCoupon(value), [])}
                            value={applyCoupon}
                          />
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  label="Campaign Name"
                                  helpText="The name as it will appear onsite"
                                  placeholder='Refer a friend'
                                  value={campaignName}
                                  onChange={useCallback((newValue) => setCampaignName(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  label="Reward Text"
                                  helpText="What you want to display to the user"
                                  placeholder='500 Points'
                                  value={rewardText}
                                  onChange={useCallback((newValue) => setRewardText(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Description"
                            placeholder='Earn 500 points for every time you refer a friend who spends over $5.00'
                            value={description}
                            onChange={useCallback((newValue) => setDescription(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <Select
                                options={iconsList}
                                label="Icon"
                                onChange={useCallback((newValue) => setIcon(newValue), [])}
                                value={icon}
                              />
                              <TextField
                                type="text"
                                label="Call To Action Text"
                                placeholder='Take me there'
                                value={callToActionText}
                                onChange={useCallback((newValue) => setCallToActionText(newValue), [])}
                                autoComplete="off"
                              />
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <TextField
                                type="text"
                                label="Landing URL"
                                placeholder='http://demo.myshopify.com'
                                value={landingURL}
                                onChange={useCallback((newValue) => setLandingURL(newValue), [])}
                                autoComplete="off"
                              />
                              <TextField
                                type="text"
                                label="Landing URL Query Params"
                                value={landingURLQueryParams}
                                onChange={useCallback((newValue) => setLandingURLQueryParams(newValue), [])}
                                autoComplete="off"
                              />
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Default message your customers will share on Twitter (they can customize it)"
                            placeholder='These guys are great! Get a discount using my code'
                            value={defaultTwitterMsg}
                            onChange={useCallback((newValue) => setDefaultTwitterMsg(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Header text for Facebook share message"
                            placeholder='Earn A Discount When You Shop Today!'
                            value={headerForFbMsg}
                            onChange={useCallback((newValue) => setHeaderForFbMsg(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Description for Facebook share message"
                            value={descriptionForFbMsg}
                            onChange={useCallback((newValue) => setDescriptionForFbMsg(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2 mb-2'>
                          <TextField
                            type="text"
                            label="Default message your customers can share via SMS"
                            placeholder='Hey, want ${discount_amount} to ${company_name}? I thought you would like them. Here is my link: ${referral_link}'
                            value={defaultSmsMsg}
                            onChange={useCallback((newValue) => setDefaultSmsMsg(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                      </Modal.Section>
                    </Modal>
                    <Button name='refer_a_friend' id={referCampaignStatus ? 'warning-outline' : 'success-outline'} outline size="slim" onClick={() => updateCampaignStatus('refer_a_friend', referCampaignStatus)}>{referCampaignStatus ? 'Deactivate' : 'Activate'}</Button>
                  </div>
                </div>
                <div className='card-body'>
                  <p>Earn 500 points for every time you refer a friend who spends over $5.00</p>
                  <p>$5.00</p>
                </div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>Started on 10/25/21</p>
                    </Stack.Item>
                    <Stack.Item>
                      <p>0 Referrals Completed</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
              <Card sectioned>
                <div className='card-header' id={accountCampaignStatus ? 'activated' : 'not-activated'}>
                  <Heading element="h2">Create account <br /><small>Create account</small></Heading>
                  <div className='button-holder'>
                    <Modal
                      large
                      activator={accountActivator}
                      open={showAccountCampaign}
                      onClose={useCallback(() => setShowAccountCampaign(!showAccountCampaign), [showAccountCampaign])}
                      title="Customize Create account Campaign"
                      primaryAction={{
                        content: 'Save Changes',
                        onAction: saveAccountCampaign,
                      }}
                    >
                      <Modal.Section>
                        <div className='top-section'>
                          <img src={UserImage} alt="" />
                          <p>Reward customers for creating an account! Having an account is an incredible way to engage and educate customers between purchases.</p>
                        </div>
                        <Select
                          label="What kind of reward"
                          options={rewardOptions}
                          onChange={useCallback((value) => setSelectedReward(value), [])}
                          value={selectedReward}
                        />
                        <div className='mt-2'>
                          <div className='input-group'>
                            <TextField
                              type="number"
                              min='0'
                              label="How many points"
                              placeholder='500'
                              value={pointsToReferrer}
                              onChange={useCallback((newValue) => setPointsToReferrer(newValue), [])}
                              autoComplete="off"
                            />
                            <div className="icon-after">points</div>
                          </div>
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  label="Campaign Name"
                                  helpText="The name as it will appear onsite"
                                  placeholder='Refer a friend'
                                  value={campaignName}
                                  onChange={useCallback((newValue) => setCampaignName(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  helpText="What you want to display to the user"
                                  label="Reward Text"
                                  placeholder='10 Points'
                                  value={rewardText}
                                  onChange={useCallback((newValue) => setRewardText(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={descTexts}
                            label="Description Text"
                            onChange={useCallback((newValue) => setDescText(newValue), [])}
                            value={descText}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={iconsList}
                            label="Icon"
                            onChange={useCallback((newValue) => setIcon(newValue), [])}
                            value={icon}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={completedMsgList}
                            label="Already Completed Message"
                            onChange={useCallback((newValue) => setCompletedMsg(newValue), [])}
                            value={completedMsg}
                          />
                        </div>
                        <div className='mt-2 mb-2 with-helper-text'>
                          <Select
                            options={maxCompletionLimits}
                            label="Maximum Times Completed Total"
                            onChange={useCallback((newValue) => setMaxTimesCompletion(newValue), [])}
                            value={maxTimesCompletion}
                            helpText="The maximum number of times this campaign can be completed."
                          />
                        </div>
                      </Modal.Section>
                    </Modal>
                    <Button id={accountCampaignStatus ? 'warning-outline' : 'success-outline'} outline size="slim" onClick={() => updateCampaignStatus('create_account', accountCampaignStatus)}>{accountCampaignStatus ? 'Deactivate' : 'Activate'}</Button>
                    {/* <Button id="danger-outline" outline size="slim">Delete</Button> */}
                  </div>
                </div>
                <div className='card-body'>
                  <p>Earn 10 points when you create an account</p>
                </div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>Started on 10/25/21</p>
                    </Stack.Item>
                    <Stack.Item>
                      <p>0 Referrals Completed</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
              <Card sectioned>
                <div className='card-header' id={birthdayCampaignStatus ? 'activated' : 'not-activated'}>
                  <Heading element="h2">Happy birthday <br /><small>Happy birthday</small></Heading>
                  <div className='button-holder'>
                    <Modal
                      large
                      activator={birthdayActivator}
                      open={showBirthdayCampaign}
                      onClose={useCallback(() => setShowBirthdayCampaign(!showBirthdayCampaign), [showBirthdayCampaign])}
                      title="Customize Happy Birthday Campaign"
                      primaryAction={{
                        content: 'Save Changes',
                        onAction: saveBirthdayCampaign,
                      }}
                    >
                      <Modal.Section>
                        <div className='top-section'>
                          <img src={UserImage} alt="" />
                          <p>Reward your customers with a gift on their birthday. This drives massive customer engagement, happiness and new marginal revenue.</p>
                        </div>
                        <Select
                          label="What kind of reward"
                          options={rewardOptions}
                          onChange={useCallback((value) => setSelectedReward(value), [])}
                          value={selectedReward}
                        />
                        <div className='mt-2'>
                          <div className='input-group'>
                            <TextField
                              type="number"
                              min='0'
                              label="How many points"
                              placeholder='500'
                              value={pointsToReferrer}
                              onChange={(newValue) => setPointsToReferrer(newValue)}
                              autoComplete="off"
                            />
                            <div className="icon-after">points</div>
                          </div>
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  label="Campaign Name"
                                  helpText="The name as it will appear onsite"
                                  placeholder='Refer a friend'
                                  value={campaignName}
                                  onChange={useCallback((newValue) => setCampaignName(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  helpText="What you want to display to the user"
                                  label="Reward Text"
                                  placeholder='10 Points'
                                  value={rewardText}
                                  onChange={useCallback((newValue) => setRewardText(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: 'Earn 10 points on your birthday', value: '10' },
                              { label: 'Earn 50 points on your birthday', value: '50' },
                              { label: 'Earn 100 points on your birthday', value: '100' },
                            ]}
                            label="Description Text"
                            onChange={useCallback((newValue) => setDescText(newValue), [])}
                            value={descText}
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Success Message"
                            placeholder='Thanks! We`re looking forward to helping you celebrate :)'
                            value={defaultSmsMsg}
                            onChange={useCallback((newValue) => setDefaultSmsMsg(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Birth Month Selection"
                            placeholder='January,February,March,April,May,June,July,August,September,October,November,December'
                            value={description}
                            onChange={useCallback((newValue) => setDescription(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: "Yes", value: 1 },
                              { label: "No", value: 0 }
                            ]}
                            label="Also ask for birth year?"
                            onChange={useCallback((newValue) => setApplyCoupon(newValue), [])}
                            value={applyCoupon}
                          />
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div>
                                <Select
                                  options={iconsList}
                                  label="Icon"
                                  onChange={useCallback((newValue) => setIcon(newValue), [])}
                                  value={icon}
                                />
                              </div>
                              <div>
                                <TextField
                                  type="text"
                                  label="Call To Action Text"
                                  placeholder='Take me there'
                                  value={callToActionText}
                                  onChange={useCallback((newValue) => setCallToActionText(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                      </Modal.Section>
                    </Modal>
                    <Button id={birthdayCampaignStatus ? 'warning-outline' : 'success-outline'} outline size="slim" onClick={() => updateCampaignStatus('happy_birthday', birthdayCampaignStatus)}>{birthdayCampaignStatus ? 'Deactivate' : 'Activate'}</Button>
                  </div>
                </div>
                <div className='card-body'>
                  <p>Earn 5 points on your birthday</p>
                  <p>$5.00</p>
                </div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>Started on 10/25/21</p>
                    </Stack.Item>
                    <Stack.Item>
                      <p>0 Referrals Completed</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
              <Card sectioned>
                <div className='card-header' id={purchaseCampaignStatus ? 'activated' : 'not-activated'}>
                  <Heading element="h2">Points for purchases <br /><small>Make a purchase</small></Heading>
                  <div className='button-holder'>
                    <Modal
                      large
                      activator={purchaseActivator}
                      open={showPurchaseCampaign}
                      onClose={useCallback(() => setShowPurchaseCampaign(!showPurchaseCampaign), [showPurchaseCampaign])}
                      title="Customize Make a Purchase Campaign"
                      primaryAction={{
                        content: 'Save Changes',
                        onAction: savePurchaseCampaign,
                      }}
                    >
                      <Modal.Section>
                        <div className='top-section'>
                          <img src={UserImage} alt="" />
                          <p>For every dollar spent, earn X points. This campaign helps e-commerce merchants increase avaerage cart size and purchase frequency.</p>
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="number"
                            min='0'
                            label="The amount of points the customer earns is..."
                            placeholder='A fixed amount'
                            value={customerFixedPoints}
                            onChange={useCallback((newValue) => setCustomerFixedPoints(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <div className='input-group'>
                            <TextField
                              type="number"
                              min='0'
                              label="Reward Amount"
                              placeholder='10'
                              value={pointsToReferrer}
                              onChange={useCallback((newValue) => setPointsToReferrer(newValue), [])}
                              autoComplete="off"
                            />
                            <div className="icon-after">points per $1</div>
                          </div>
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  label="Campaign Name"
                                  helpText="The name as it will appear onsite"
                                  placeholder='Refer a friend'
                                  value={campaignName}
                                  onChange={useCallback((newValue) => setCampaignName(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                              <div className='with-helper-text'>
                                <TextField
                                  type="text"
                                  helpText="What you want to display to the user"
                                  label="Reward Text"
                                  placeholder='10 Point Per $1.00'
                                  value={rewardText}
                                  onChange={useCallback((newValue) => setRewardText(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: 'Earn 10 points for every $1.00 you spend in our store', value: '10' },
                              { label: 'Earn 50 points for every $5.00 you spend in our store', value: '50' },
                              { label: 'Earn 100 points for every $10.00 you spend in our store', value: '100' },
                            ]}
                            label="Description Text"
                            onChange={useCallback((newValue) => setDescText(newValue), [])}
                            value={descText}
                          />
                        </div>
                        <div className='mt-2 with-helper-text with-premium-label-tag'>
                          <TextField
                            type="text"
                            helpText="Require a purcahse to include at least one product with one of these tags to receive credit"
                            label="Required Product Ids"
                            placeholder='10 Point Per $1.00'
                            value={requiredProduct}
                            onChange={useCallback((newValue) => setRequiredProduct(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2 with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'Reward the entire cart', value: 'entire-cart' },
                              { label: 'Reward the 25% OFF on entire cart', value: '25%-off' },
                              { label: 'Reward the 50% OFF on entire cart', value: '50%-off' },
                            ]}
                            label="If using required products, what should we reward?"
                            onChange={useCallback((newValue) => setRequireProdReward(newValue), [])}
                            value={requireProdReward}
                          />
                        </div>
                        <div className='mt-2 with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'Tag One', value: 'tag-1' },
                              { label: 'Tag Two', value: 'tag-2' },
                              { label: 'Tag There', value: 'tag-3' },
                            ]}
                            placeholder='Only Exclude Customers with Tags Listed Below'
                            label="Exclude or Include Specific Customer Tags"
                            onChange={useCallback((newValue) => setCustomerTag(newValue), [])}
                            value={customerTag}
                          />
                        </div>
                        <div className='mt-2 with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'Customer List One', value: 'customer-list-1' },
                              { label: 'Customer List Two', value: 'customer-list-2' },
                              { label: 'Customer List There', value: 'customer-list-3' },
                            ]}
                            placeholder='Only Exclude Customers with Tags Listed Below'
                            label="Customer Tags (Comma Separated List)"
                            onChange={useCallback((newValue) => setCustomerTagList(newValue), [])}
                            value={customerTagList}
                          />
                        </div>
                        <div className='mt-2 with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'Tag One', value: 'tag-1' },
                              { label: 'Tag Two', value: 'tag-2' },
                              { label: 'Tag There', value: 'tag-3' },
                            ]}
                            placeholder='Only Exclude Orders with Tags Listed Below'
                            label="Exclude or Include Specific Order Tags"
                            onChange={useCallback((newValue) => setOrderTag(newValue), [])}
                            value={orderTag}
                          />
                        </div>
                        <div className='mt-2 with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'Order List One', value: 'order-list-1' },
                              { label: 'Order List Two', value: 'order-list-2' },
                              { label: 'Order List There', value: 'order-list-3' },
                            ]}
                            placeholder='Only Exclude Orders with Tags Listed Below'
                            label="Order Tags (Comma Separated List)"
                            onChange={useCallback((newValue) => setOrderTagList(newValue), [])}
                            value={orderTagList}
                          />
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div>
                                <Select
                                  options={[
                                    { label: 'Exactly', value: 'exactly' },
                                    { label: 'Minimum', value: 'minimum' },
                                    { label: 'Maximum', value: 'maximum' },
                                  ]}
                                  label="Restrict to Customers With Certain Number of Orders"
                                  onChange={useCallback((newValue) => setLimit(newValue), [])}
                                  value={limit}
                                />
                              </div>
                              <div className='input-group'>
                                <TextField
                                  type="number"
                                  min='0'
                                  label="Orders"
                                  placeholder='5'
                                  value={orders}
                                  onChange={useCallback((newValue) => setOrders(newValue), [])}
                                  autoComplete="off"
                                />
                                <div className="icon-after">Orders</div>
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2 mb-2 with-helper-text with-premium-label-tag'>
                          <Select
                            options={maxCompletionLimits}
                            label="Maximum Times Completed Total"
                            onChange={useCallback((newValue) => setMaxTimesCompletion(newValue), [])}
                            value={maxTimesCompletion}
                            helpText="The maximum number of times this campaign can be completed."
                          />
                        </div>
                        <div className='mt-2 mb-2 with-helper-text with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'No Maximum', value: 'no-max' },
                              { label: '5 Times', value: '5-times' },
                              { label: '10 Times', value: '1-times' },
                            ]}
                            label="Maximum Times Completed Total"
                            onChange={useCallback((newValue) => setMaxTimesPerUser(newValue), [])}
                            value={maxTimesPerUser}
                            helpText="The maximum number of times this campaign can be completed."
                          />
                        </div>
                        <div className='mt-2 mb-2 with-helper-text with-premium-label-tag'>
                          <Select
                            options={[
                              { label: 'You`re eligible to participate again in 5 days.', value: '5-days' },
                              { label: 'You`re eligible to participate again in 10 days.', value: '10-days' },
                              { label: 'You`re eligible to participate again in 15 days.', value: '15-days' },
                            ]}
                            label="Time Between Rewards"
                            onChange={useCallback((newValue) => setTimeBetween(newValue), [])}
                            value={timeBetween}
                            helpText="If you set a `Time between rewards` limit, customers will see this countdown message"
                          />
                        </div>
                        <div className='mt-2 mb-2 with-helper-text'>
                          <Select
                            options={[
                              { label: 'You`re eligible to participate again in 24 hours.', value: '24-hours' },
                              { label: 'You`re eligible to participate again in 48 hours.', value: '48-hours' },
                              { label: 'You`re eligible to participate again in 72 hours.', value: '72-hours' },
                            ]}
                            label="Eligible countdown message (hours)"
                            onChange={useCallback((newValue) => setCountdownMessage(newValue), [])}
                            value={countdownMessage}
                            helpText="If you set a `Time between rewards` limit, customers will see this countdown message"
                          />
                        </div>
                      </Modal.Section>
                    </Modal>
                    <Button id={purchaseCampaignStatus ? 'warning-outline' : 'success-outline'} outline size="slim" onClick={() => updateCampaignStatus('make_a_purchase', purchaseCampaignStatus)}>{purchaseCampaignStatus ? 'Deactivate' : 'Activate'}</Button>
                    {/* <Button id="danger-outline" outline size="slim">Delete</Button> */}
                  </div>
                </div>
                <div className='card-body'>
                  <p>Earn 1 points for every $1.00 you spent in our store</p>
                </div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>Started on 10/25/21</p>
                    </Stack.Item>
                    <Stack.Item>
                      <p>0 Accounts Created</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card >
      <Card
        sectioned
        primaryFooterAction={{ content: 'Save and Continue' }}
        footerActionAlignment="left"
      >

        <div className='card-box'>
          <h2 className='blue-title'>Redeem Points</h2>
          <h3 className='m-0'>REWARD RULES</h3>
          <p>Create rewards your customers can redeem with the points they've earned.</p>
          <div className='holder'>
            <div className='cards-list other-list'>
              <Card sectioned>
                <div className='card-header' id='not-activated'>
                  <Heading element="h2">$7.50 Off for 750 Points</Heading>
                  <div className='button-holder'>
                    <Modal
                      large
                      activator={coupon7Activator}
                      open={showCustomizeCoupon}
                      onClose={useCallback(() => setShowCustomizeCoupon(!showCustomizeCoupon), [showCustomizeCoupon])}
                      title="Customize Campaign"
                      primaryAction={{
                        content: 'Save Changes',
                        onAction: saveCustomizeCoupon,
                      }}
                    >
                      <Modal.Section>
                        <div>
                          <Select
                            label="I want to use this coupon to reward customers..."
                            options={[
                              { label: "When they redeem their points", value: "redeem-points" },
                              { label: "When they redeem their discounts", value: "redeem-discounts" },
                            ]}
                            onChange={useCallback((value) => setRewardCustomers(value), [])}
                            value={rewardCustomers}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            label="Coupon Type"
                            options={[
                              { label: "A fixed amount", value: "fixed-amount" },
                              { label: "A fixed percentage", value: "fixed-percentage" },
                            ]}
                            onChange={useCallback((value) => setCouponType(value), [])}
                            value={couponType}
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="number"
                            min='0'
                            label="Discount Amount"
                            placeholder={couponValue}
                            prefix={"$"}
                            value={discountAmount}
                            onChange={useCallback((newValue) => setDiscountAmount(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Name"
                            placeholder={'$' + couponValue + '.00 Off'}
                            value={couponName}
                            onChange={useCallback((newValue) => setCouponName(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Description"
                            placeholder={'Get $' + couponValue + '.00 off on your next purchase for ' + couponValue + '00 points'}
                            value={description}
                            onChange={useCallback((newValue) => setDescription(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="How many points does this coupon cost?"
                            placeholder={couponValue + '00'}
                            value={couponPoints}
                            onChange={useCallback((newValue) => setCouponPoints(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="What should we display to the user for the cost of coupon?"
                            placeholder={couponValue + '00 Points'}
                            value={couponText}
                            onChange={useCallback((newValue) => setCouponText(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: 'Any Product', value: 'any-product' },
                              { label: 'Multiple Products', value: 'multiple-products' },
                              { label: 'Specific Product', value: 'specific-product' },
                            ]}
                            label="Apply discount to"
                            onChange={useCallback((newValue) => setApplyDiscount(newValue), [])}
                            value={applyDiscount}
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="number"
                            min='0'
                            label="Only apply if cart is greater than (leave blank for no minimum)"
                            placeholder='0'
                            prefix={"$"}
                            value={cartAmount}
                            onChange={useCallback((newValue) => setCartAmount(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Only applies to these saved customer search IDs (leave blank for all customers)"
                            placeholder='Any customer'
                            value={customerList}
                            onChange={useCallback((newValue) => setCustomerList(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: "Cart", value: "cart" },
                              { label: "Purchase", value: "purchase" }
                            ]}
                            label="Apply discount once per..."
                            onChange={useCallback((newValue) => setApplyDiscountPer(newValue), [])}
                            value={applyDiscountPer}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: "1 Time", value: 1 },
                              { label: "5 Times", value: 5 },
                              { label: "10 Times", value: 10 }
                            ]}
                            label="How mant times can a discount code be used?"
                            onChange={useCallback((newValue) => setDiscountCodeUsage(newValue), [])}
                            value={discountCodeUsage}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: "Never, let my customers use this whenever they`d like", value: 'never' },
                              { label: "After 30 days, the code will be expired", value: '30-days' },
                              { label: "After 60 days, the code will be expired", value: '60-days' },
                            ]}
                            label="When should the coupon code expire?"
                            onChange={useCallback((newValue) => setCouponCodeExpire(newValue), [])}
                            value={couponCodeExpire}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: "No, let logged out customers or their friends use this coupon", value: 0 },
                              { label: "Yes, restrict logged out customers or their friends from using this coupon", value: 1 },
                            ]}
                            label="Should we restrict the usage of the coupon to the customer who redeems it?"
                            onChange={useCallback((newValue) => setCouponRestriction(newValue), [])}
                            value={couponRestriction}
                          />
                        </div>
                        <div className='mt-2'>
                          <FormLayout>
                            <FormLayout.Group>
                              <div>
                                <TextField
                                  type="text"
                                  label="Code Prefix"
                                  placeholder=''
                                  value={codePrefix}
                                  onChange={useCallback((newValue) => setCodePrefix(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                              <div>
                                <TextField
                                  type="number"
                                  min="1"
                                  label="Code Length"
                                  placeholder='8'
                                  value={codeLength}
                                  onChange={useCallback((newValue) => setCodeLength(newValue), [])}
                                  autoComplete="off"
                                />
                              </div>
                            </FormLayout.Group>
                          </FormLayout>
                        </div>
                        <div className='mt-2'>
                          <TextField
                            type="text"
                            label="Success Message"
                            placeholder='Thanks! We`re looking forward to helping you celebrate :)'
                            value={defaultSmsMsg}
                            onChange={useCallback((newValue) => setDefaultSmsMsg(newValue), [])}
                            autoComplete="off"
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={iconsList}
                            label="Icon"
                            onChange={useCallback((newValue) => setIcon(newValue), [])}
                            value={icon}
                          />
                        </div>
                        <div className='mt-2'>
                          <Select
                            options={[
                              { label: "Thanks for redeeming! Here`s your coupon code:", value: "redeem" },
                              { label: "Thanks for availing! Here`s your coupon code:", value: "avail" },
                            ]}
                            label="Coupon Code (Intro)"
                            onChange={useCallback((newValue) => setCouponCodeIntro(newValue), [])}
                            value={couponCodeIntro}
                          />
                        </div>
                      </Modal.Section>
                    </Modal>
                    <Button id="danger-outline" outline size="slim">Delete</Button>
                  </div>
                </div>
                <div className='card-body'></div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>0 Coupon Redeemed</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
              <Card sectioned>
                <div className='card-header' id='not-activated'>
                  <Heading element="h2">$15.00 Off for 1500 Points</Heading>
                  <div className='button-holder'>
                    {coupon15Activator}
                    <Button id="danger-outline" outline size="slim">Delete</Button>
                  </div>
                </div>
                <div className='card-body'></div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>0 Coupon Redeemed</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
              <Card sectioned>
                <div className='card-header' id='not-activated'>
                  <Heading element="h2">$30.00 Off for 3000 Points</Heading>
                  <div className='button-holder'>
                    {coupon30Activator}
                    <Button id="danger-outline" outline size="slim">Delete</Button>
                  </div>
                </div>
                <div className='card-body'></div>
                <div className='card-footer'>
                  <Stack>
                    <Stack.Item fill>
                      <p>0 Coupon Redeemed</p>
                    </Stack.Item>
                  </Stack>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
      <Card
        sectioned
      >
        <div className='card-box'>
          <h2 className='blue-title'>Preview</h2>
          <div className='preview-items'>
            <div className="left-section">
              <h3 className='m-0'>PREVIEW</h3>
              <p>Create rewards your customer can redeem with the points they've earned.</p>
            </div>
            <div className="right-section">
              <Button primary>Preview</Button>
            </div>
          </div>
        </div>
      </Card>
      <div className='prepare-to-launch'>
        <div className='top-title'>
          <div className='ico'>
            <img src={Icon8} alt="icon" />
          </div>
          <h3>Prepare to Launch</h3>
        </div>
        <div className="cta">
          <div className="left-section">
            <h3>Welcome to <br /> Chargezen Rewards</h3>
            <p>Earn points by simply receiving your Chargezen subscription boxes and then redeem them for
              exclusive gifts, discounts and other loyalty perks.
            </p>
          </div>
          <div className="right-section">
            <div className="image-holder">
              <img src={MainImage} alt="Main Image" />
            </div>
          </div>
        </div>
        <h4>Exchange your points for Feel Rewards</h4>
        <div className="rewards-list">
          <div className="reward-list">
            <div className="ico">
              <img src={Icon1} alt="icon" />
            </div>
            <h5>$5 off</h5>
            <p className="text-muted">next subscription order</p>
            <p>500 points</p>
          </div>
          <div className="reward-list">
            <div className="ico">
              <img src={Icon1} alt="icon" />
            </div>
            <h5>$10 off</h5>
            <p className="text-muted">next subscription order</p>
            <p>1000 points</p>
          </div>
          <div className="reward-list">
            <div className="ico">
              <img src={Icon1} alt="icon" />
            </div>
            <h5>$20 off</h5>
            <p className="text-muted">next subscription order</p>
            <p>2000 points</p>
          </div>
        </div>
      </div>
      <div className="how-it-works">
        <h4>How it works</h4>
        <div className="box-holder">
          <div className="box">
            <div className="ico">
              <img src={Icon2} alt="icon" />
            </div>
            <p>Earn points by simply purchasing Feel products - Every $10 you spent is worth 500 points or more.</p>
          </div>
          <div className="box">
            <div className="ico">
              <img src={Icon3} alt="icon" />
            </div>
            <p>Earn points by simply purchasing Feel products - Every $10 you spent is worth 500 points or more.</p>
          </div>
          <div className="box">
            <div className="ico">
              <img src={Icon4} alt="icon" />
            </div>
            <p>Earn points by simply purchasing Feel products - Every $10 you spent is worth 500 points or more.</p>
          </div>
        </div>
      </div>
      <div className="more-points">
        <h4>More ways to earn points</h4>
        <div className="box-holder">
          <div className="box">
            <div className="ico">
              <img src={Icon5} alt="icon" />
            </div>
            <h5>Make a purchase</h5>
            <p>$5 for 500 points</p>
          </div>
          <div className="box">
            <div className="ico">
              <img src={Icon6} alt="icon" />
            </div>
            <h5>Create an account</h5>
            <p>$10 for 1000 points</p>
          </div>
          <div className="box">
            <div className="ico">
              <img src={Icon7} alt="icon" />
            </div>
            <h5>Sign up to our mailing list</h5>
            <p>$20 for 2000 points</p>
          </div>
        </div>
      </div>
      {toastMarkup}
    </FormLayout >
  );
}
export default Customize;
