import React from 'react';
import Nav from './Nav';
import Footer from './Footer';

const Layout = (props) => {
  return (
    <div className={`module-${props.typePage}`}>
      <Nav selected={parseInt(props.tabIndex)}/>
      {props.children}
      <Footer/>
      <br/>
    </div>
  );
};

export default Layout;
