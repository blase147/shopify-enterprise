import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ButtonGroup,
  Button,
  Stack,
  Modal,
  Heading,
  TextContainer,
} from '@shopify/polaris';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import titleImg1 from '../../../assets/images/subscriptionsPlans/titleCreatePlan1.svg';
import titleImg2 from '../../../assets/images/subscriptionsPlans/titleCreatePlan2.svg';
import titleImg3 from '../../../assets/images/subscriptionsPlans/titleCreatePlan3.svg';
import titleImg4 from '../../../assets/images/subscriptionsPlans/titleCreatePlan4.svg';

const Modals = (props) => {
  const slick = useRef(null);

  const slickConfig = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: 'subscription-plan-customSlick',
  };

  return (
    <Modal open={props.active} onClose={() => props.setActive(false)}>
      <Modal.Section>
        <Slider ref={slick} {...slickConfig}>
          <Stack wrap={false} vertical={true} alignment="center">
            <Stack.Item>
              <br />
            </Stack.Item>
            <Stack.Item>
              <Stack wrap={false}>
                <Stack.Item>
                  <div className="header">
                    <Stack vertical>
                      <Stack.Item>
                        <img className="top-img" src={titleImg1} />
                      </Stack.Item>
                      <Stack.Item>
                        <img className="bot-img" />
                      </Stack.Item>
                    </Stack>
                  </div>
                </Stack.Item>

                <Stack.Item fill>
                  <TextContainer>
                    <br />
                    <Heading>Fixed Subscription Plan</Heading>
                    <p>
                      Create plans in the ChargeZen app to control how your
                      customers will be billed and how orders will be generated.
                      For example, you can create a "subscribe & save" selling
                      plan group with discounted variants to entice customers to
                      subscribe to your products or services.
                    </p>
                    <ButtonGroup>
                      <Button
                        onClick={() =>
                          props.history.push('/fixed-subscription-plans')
                        }
                        primary
                      >
                        Create new
                      </Button>
                      <Button onClick={() => slick.current.slickNext()}>
                        Next Plan
                      </Button>
                    </ButtonGroup>
                  </TextContainer>
                </Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <br />
            </Stack.Item>
          </Stack>

          {/*<Stack wrap={false} vertical={true} alignment="center">
            <Stack.Item>
              <br />
            </Stack.Item>
            <Stack.Item>
              <Stack wrap={false}>
                <Stack.Item>
                  <div className="header">
                    <Stack vertical>
                      <Stack.Item>
                        <img className="top-img" src={titleImg2} />
                      </Stack.Item>
                      <Stack.Item>
                        <img className="bot-img" />
                      </Stack.Item>
                    </Stack>
                  </div>
                </Stack.Item>

                <Stack.Item fill>
                  <TextContainer>
                    <br />
                    <Heading>Free Trial Subscription Plan</Heading>
                    <p>
                      Create plans in the ChargeZen app to control how your
                      customers will be billed and how orders will be generated.
                      For example, you can create a "subscribe & save" selling
                      plan group with discounted variants to entice customers to
                      subscribe to your products or services.
                    </p>
                    <ButtonGroup>
                      <Button
                        primary
                        onClick={() =>
                          props.history.push('/trial-subscription-plan')
                        }
                      >
                        Create new
                      </Button>
                      <Button onClick={() => slick.current.slickNext()}>
                        Next Plan
                      </Button>
                    </ButtonGroup>
                  </TextContainer>
                </Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <br />
            </Stack.Item>
          </Stack>*/}

          <Stack wrap={false} vertical={true} alignment="center">
            <Stack.Item>
              <br />
            </Stack.Item>
            <Stack.Item>
              <Stack wrap={false}>
                <Stack.Item>
                  <div className="header">
                    <Stack vertical>
                      <Stack.Item>
                        <img className="top-img" src={titleImg2} />
                      </Stack.Item>
                      <Stack.Item>
                        <img className="bot-img" />
                      </Stack.Item>
                    </Stack>
                  </div>
                </Stack.Item>

                <Stack.Item fill>
                  <TextContainer>
                    <br />
                    <Heading>Build-A-Box Subscription Plan</Heading>
                    <p>
                      Create plans in the ChargeZen app to control how your
                      customers will be billed and how orders will be generated.
                      For example, you can create a "subscribe & save" selling
                      plan group with discounted variants to entice customers to
                      subscribe to your products or services.
                    </p>
                    <ButtonGroup>
                      <Button
                        primary
                        onClick={() =>
                          props.history.push('/build-a-box-subscription-plan')
                        }
                      >
                        Create new
                      </Button>
                      <Button onClick={() => slick.current.slickPrev()}>
                        Previous Plan
                      </Button>
                    </ButtonGroup>
                  </TextContainer>
                </Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <br />
            </Stack.Item>
          </Stack>

          {/*<Stack wrap={false} vertical={true} alignment="center">
            <Stack.Item>
              <br />
            </Stack.Item>
            <Stack.Item>
              <Stack wrap={false}>
                <Stack.Item>
                  <div className="header">
                    <Stack vertical>
                      <Stack.Item>
                        <img className="top-img" src={titleImg4} />
                      </Stack.Item>
                      <Stack.Item>
                        <img className="bot-img" />
                      </Stack.Item>
                    </Stack>
                  </div>
                </Stack.Item>

                <Stack.Item fill>
                  <TextContainer>
                    <br />
                    <Heading>Mystery Box Subscription Plan</Heading>
                    <p>
                      Create plans in the ChargeZen app to control how your
                      customers will be billed and how orders will be generated.
                      For example, you can create a "subscribe & save" selling
                      plan group with discounted variants to entice customers to
                      subscribe to your products or services.
                    </p>
                    <ButtonGroup>
                      <Button
                        primary
                        onClick={() =>
                          props.history.push('/mystery-box-subscription-plan')
                        }
                      >
                        Create new
                      </Button>
                      <Button onClick={() => slick.current.slickPrev()}>
                        Previous Plan
                      </Button>
                    </ButtonGroup>
                  </TextContainer>
                </Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <br />
            </Stack.Item>
          </Stack>*/}
        </Slider>
      </Modal.Section>
    </Modal>
  );
};

export default Modals;
