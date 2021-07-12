import React from 'react';
import { FooterHelp, Link } from '@shopify/polaris';

const Footer = () => {
  return (
    <FooterHelp>
      <Link target="_blank" rel="noopener noreferrer" url={process.env.APP_TYPE=="public"?"https://www.chargezen.co/term-of-use":"#"}>
        Terms and Conditions
      </Link>
      <span> • </span>
      <Link target="_blank" rel="noopener noreferrer"  url={process.env.APP_TYPE=="public"?"https://www.chargezen.co/privacypolicy":"#"}>
        Privacy Policy
      </Link>
    </FooterHelp>
  );
};

export default Footer;
