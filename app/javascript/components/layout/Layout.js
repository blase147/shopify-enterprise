import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import AppHeader from './AppHeader';

const Layout = (props) => {
  return (
    <div className={`module-navbar dashboardArea`}>
      <Nav domain={props?.domain} />
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