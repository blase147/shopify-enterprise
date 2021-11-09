import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
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
} from '@shopify/polaris';
import dayjs from 'dayjs';
import ToggleButton from 'react-toggle-button';
import { useHistory } from 'react-router';
import TableSkeleton from '../../common/TableSkeleton';

import PopupImage from '../../../../assets/images/collect_subscribers/popup.png';
import FloatingButtonImage from '../../../../assets/images/collect_subscribers/floating_button.png';
import KeywordsImage from '../../../../assets/images/collect_subscribers/keywords.png';
import ShareableLinkImage from '../../../../assets/images/collect_subscribers/shareable_link.png';
import SocialLinkImage from '../../../../assets/images/collect_subscribers/social_link.png';
import FooterCollectionImage from '../../../../assets/images/collect_subscribers/footer_collection.png';
import EmbeddedFormImage from '../../../../assets/images/collect_subscribers/embedded_form.png';
import QrGeneratorImage from '../../../../assets/images/collect_subscribers/qr_generator.png';

const CollectSubscribers = () => {
  return (
    <Card sectioned>
      <h2 style={{marginLeft: '1rem'}}>
        <Subheading>Collect Subscribers</Subheading>{' '}
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        <div className="col-sub-item">
          <img src={PopupImage}></img>
          <p>
            <TextStyle variation="strong">Popup</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Turn your website visitors into SMS and email subscribers with an
              engaging pop-up form.
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={FloatingButtonImage}></img>
          <p>
            <TextStyle variation="strong">Floating Button</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Get website visitors to subscribe to your SMS program with a
              button at the bottom.
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={KeywordsImage}></img>
          <p>
            <TextStyle variation="strong">Keywords</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Use a catchy keyword across your communication channels to collect
              SMS subscribers.
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={ShareableLinkImage}></img>
          <p>
            <TextStyle variation="strong">Shareable Subscribe Link</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Generate a link to a preset subscription page and share it across
              your channel.
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={SocialLinkImage}></img>
          <p>
            <TextStyle variation="strong">Social Opt-in</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Create a link and use it on your social media channels to turn
              followers into subscribers
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={FooterCollectionImage}></img>
          <p>
            <TextStyle variation="strong">Footer Collection</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Add a footer form and turn engaged visitors who scroll through
              your site into SMS
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={EmbeddedFormImage}></img>
          <p>
            <TextStyle variation="strong">Embedded Form</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Place embedded forms on any page of your online store to create a
              seamless subscriber.
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
        <div className="col-sub-item">
          <img src={QrGeneratorImage}></img>
          <p>
            <TextStyle variation="strong">QR Generator</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              Boost SMS subscriber collection on various offline channels using
              a branded QR.
            </TextStyle>
          </p>
          <Button primary>Create New</Button>
        </div>
      </div>
    </Card>
  );
};

export default CollectSubscribers;
