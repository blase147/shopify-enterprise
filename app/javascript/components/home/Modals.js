import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  Card,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Badge,
  Link,
  Stack,
  Page,
  Tabs,
  Modal,
  Icon,
  Avatar,
  Heading,
  Subheading,
  Layout,
  TextStyle,
  DisplayText,
  TextContainer,
} from '@shopify/polaris';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import illustration1 from '../../../assets/images/dasboard/home-1.svg';
import illustration2 from '../../../assets/images/dasboard/home-2.svg';
import illustration3 from '../../../assets/images/dasboard/home-3.svg';
import illustration4 from '../../../assets/images/dasboard/home-4.svg';
import number1 from '../../../assets/images/dasboard/number-1.svg';
import number2 from '../../../assets/images/dasboard/number-2.svg';
import number3 from '../../../assets/images/dasboard/number-3.svg';
import number4 from '../../../assets/images/dasboard/number-4.svg';

const Modals=(props) => {
  const handleChange = useCallback(() => props.setActive(!props.active), [props.active]);

  const slickConfig = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const history = useHistory();

  return(
    <Modal large open={props.active} onClose={handleChange}>
      <Modal.Section>
        <Slider {...slickConfig}>
          <Stack wrap={false} alignment="center">
            <Stack.Item>
              <img src={illustration1} />
            </Stack.Item>
            <Stack.Item fill>
              <Stack vertical={true}>
                <Stack.Item>
                  <img src={number1} />
                </Stack.Item>
                <Stack.Item>
                  <Heading>Setting up your selling plan groups</Heading>
                </Stack.Item>
                <Stack.Item>
                  <p>
                    Create plans in the ChargeZen app to control how
                    your customers will be billed and how orders will be
                    generated. For example, you can create a "subscribe
                    & save" selling plan group with discounted variants
                    to entice customers to subscribe to your products or
                    services.
                  </p>
                </Stack.Item>
                <Stack.Item>
                  <Button primary onClick={() => history.push('/subscription-plans')}>
                    Setup your selling plan groups
                  </Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => history.push('/subscription-plans')}>
                    Learn more about selling plans
                  </Button>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>

          <Stack wrap={false} alignment="center">
            <Stack.Item>
              <img src={illustration2} />
            </Stack.Item>
            <Stack.Item fill>
              <Stack vertical={true}>
                <Stack.Item>
                  <img src={number2} />
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    Adding selling plan groups to your products in
                    Shopify
                  </Heading>
                </Stack.Item>
                <Stack.Item>
                  <p>
                    After you've created your selling plan group(s) you
                    can link them to your products in Shopify.
                  </p>
                </Stack.Item>
                <Stack.Item>
                  <br />
                  <Button primary>
                    <a href={`https://${props.domain}/admin/products`} target='_blank'>Link your selling plan groups to Shopify products</a>
                  </Button>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>

          <Stack wrap={false} alignment="center">
            <Stack.Item>
              <img src={illustration3} />
            </Stack.Item>
            <Stack.Item fill>
              <Stack vertical={true}>
                <Stack.Item>
                  <img src={number3} />
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    Update your theme to support selling plans and the
                    customer portal
                  </Heading>
                </Stack.Item>
                <Stack.Item>
                  <p>
                    To enable selling plans on your product pages,
                    you'll need to make a small change to your theme if
                    it doesn't already support them. This step involves
                    editing your theme code and can require a developer,
                    depending on your needs. If you would like your
                    customers to be able to manage their own
                    subscriptions, you'll need to make a small change to
                    your theme. This step involves editing your theme
                    code and can require a developer, depending on your
                    needs Need help with code? We're here to help!
                    Please reach out to our support team using our live
                    chat if you need assistance.
                  </p>
                </Stack.Item>
                <Stack.Item>
                Default Password: <strong>AdminAlaska777</strong> 
                </Stack.Item>
                <Stack.Item>
                  <Button primary onClick={() => history.push('/installation')}>
                    Add product page snippets to your theme
                  </Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => history.push('/subscription-plans')}>
                    Learn more about selling plans
                  </Button>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>

          <Stack wrap={false} alignment="center">
            <Stack.Item>
              <img src={illustration4} />
            </Stack.Item>
            <Stack.Item fill>
              <Stack vertical={true}>
                <Stack.Item>
                  <img src={number4} />
                </Stack.Item>
                <Stack.Item>
                  <Heading>
                    Run test transactions, configure settings, and start
                    selling!
                  </Heading>
                </Stack.Item>
                <Stack.Item>
                  <p>
                    Your subscriptions are ready to go! We recommend
                    duplicating an existing product in Shopify to test
                    your new payment options before you launch. You can
                    keep the product unpublished, so it's not visible to
                    customers browsing your website during the testing
                    period. To test properly, you should create a few
                    test transactions and review the generated orders to
                    make sure they meet your requirements for
                    fulfillment. You'll also want to login as a test
                    customer on the front-end of your website to view
                    your customer portal and ensure it's working
                    properly so your customers can manage their own
                    subscriptions and payment plans.
                  </p>
                </Stack.Item>
                <Stack.Item>
                  <br />
                  <Button primary>
                    Learn more about testing before you launch
                  </Button>
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
        </Slider>
      </Modal.Section>
    </Modal>
  );
}

export default Modals;