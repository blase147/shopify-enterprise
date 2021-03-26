import React, { useEffect, useState } from 'react';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Preview = ({ allProducts, setAllProducts, showOfferTitle, offerTitle, buttonText, setUpdated, canceledProducts, setCanceledProducts }) => {

  const [removeFlag, setRemoveFlag] = useState(false);

  const slickConfig = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  const handleAllProducts = (title) => {
    var index = allProducts.map(prod => {
      return prod.title;
    }).indexOf(title);
    if (index > -1) {
      canceledProducts.push(allProducts[index]);
      setCanceledProducts(prod => prod = canceledProducts);
      allProducts.splice(index, 1);
      setAllProducts(product => product = allProducts);
      setUpdated(flag => flag = true);
      setRemoveFlag(flag => flag = !removeFlag);
    }
  }

  const previewCard = allProducts.map((product) => {
    return (
      <div key={product.productId} className="preview-item" id={`preview-${product.title.replaceAll(' ', '_')}`}>
        <div className="img">
          <div onClick={() => handleAllProducts(product.title)} className="cancel">
            <Icon
              source={MobileCancelMajor} />
          </div>
          <img
            alt=""
            src={product.image}
          />
        </div>
        <p>
          {product.title}
          {product.title.length <= 26 ? <div><br /></div> : ''}
        </p>
        <div className="btn-wrapper">
          <button type="button">{buttonText == '' ? 'ADD' : buttonText}</button>
        </div>

      </div>
    )
  });

  return (
    <div className="preview-container" style={allProducts.length > 0 ? { display: "block" } : { display: "none" }}>
      <h2 >{showOfferTitle == "true" && offerTitle != '' ? offerTitle : showOfferTitle == "true" && offerTitle == '' ? 'Hey there! There’s an offer for you!' : ''}</h2>
      <div className="slider-preview">
        <Slider {...slickConfig}>
          {previewCard}
        </Slider>
      </div>
    </div>
  );
}

export default Preview;