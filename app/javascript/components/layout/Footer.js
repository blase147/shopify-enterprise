import React from 'react';
import { FooterHelp, Link } from '@shopify/polaris';

const Footer = () => {
  return (
    <FooterHelp>
      <Link url="#">
        Terms and Conditions
      </Link>
      <span> • </span>
      <Link url="#">
        Privacy Policy
      </Link>
    </FooterHelp>
  );
};

export default Footer;
