import React, { useState } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import AppHeader from './AppHeader';

const Layout = (props) => {
  const [navCollapse, setNavCollapse] = useState(false);
  return (
    <div className={`module-navbar dashboardArea ${navCollapse ? "collapsedNav" : ""}`}>
      <Nav domain={props?.domain} setNavCollapse={setNavCollapse} navCollapse={navCollapse} locale={props?.locale} translations={props?.translations} />
      <div className='app_content'>
        <AppHeader domain={props?.domain} />
        {props.children}
        {process.env.APP_TYPE == "public" &&
          <Footer />
        }

        <br />
      </div>
    </div >
  );
};

export default Layout;