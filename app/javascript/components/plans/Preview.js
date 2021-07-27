import React, { useEffect, useState } from 'react';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Preview = ({ allProducts, setAllProducts, setUpdated, isUpdate=false }) => {

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
    let hasDestroy=allProducts[index].hasOwnProperty('_destroy')
    if (index > -1) {
    if(isUpdate && hasDestroy){
        const products=allProducts.map((prod,i)=>(i===index?{...prod,_destroy:true}:prod));
        setAllProducts(product => product = products);
    }else{
        allProducts.splice(index, 1);
        setAllProducts(product => product = allProducts);
    }
      setUpdated && setUpdated(flag => flag = true);
      setRemoveFlag(flag => flag = !removeFlag);
    }
  }

  const previewCard = allProducts.filter(prod=>(!prod._destroy)).map((product) => {
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

      </div>
    )
  });

  return (
    <div className="preview-container" style={allProducts.length > 0 ? { display: "block" } : { display: "none" }}>
      <div className="slider-preview">
        <Slider {...slickConfig}>
          {previewCard}
        </Slider>
      </div>
    </div>
  );
}

export default Preview;