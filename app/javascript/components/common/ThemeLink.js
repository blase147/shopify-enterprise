import React from 'react'
import { Link } from '@shopify/polaris'

const ThemeLink = (props)  => {
  const {
    id,
    path,
    children
  } = props;

  const data = document.getElementById('shopify-app-init').dataset;
  const origin = data.shopOrigin;

  return (
    <Link
      url={`https://${origin}/admin/themes/${id}?key=${encodeURIComponent(path)}`}
      children={children}
    />
  )
};

export default ThemeLink;