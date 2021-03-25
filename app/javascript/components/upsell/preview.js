import React, { useEffect, useState } from 'react';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Preview = ({ allProducts, setAllProducts }) => {

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
      allProducts.splice(index, 1);
      console.log(allProducts);
      setAllProducts(product => product = allProducts);
      setRemoveFlag(flag => flag = !removeFlag);
    }
  }

  const previewCard = allProducts.map((product) => {
    return (
      <div className="preview-item" id={`preview-${product.title.replaceAll(' ', '_')}`}>
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
        <p>{product.title}</p>
        <div className="btn-wrapper">
          <button type="button">ADD</button>
        </div>

      </div>
    )
  });

  return (
    <div className="slider-preview" style={allProducts.length > 0 ? { display: "block" } : { display: "none" }}>
      <Slider {...slickConfig}>
        {previewCard}
      </Slider>
    </div>
  );
}

export default Preview;