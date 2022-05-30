import React from 'react'
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
const OrderDetail = ({MealData}) => {
    console.log('MealData',MealData)
    return(
        <div className='order-detail'>
            <h3>Order Details</h3>
            <div className='items-header'> Items </div>
            <div className='order-detail-content'>
                {MealData?.map((meal)=>{
                return <div className='order-card'>
                <Icon source={MobileCancelMajor} color="base" />
                <img src={meal?.imgUrl} className='order-img' />
                <div className='order-name'>
                    {meal?.name}
                </div>
                </div>
                })}
            </div>
        </div>
    );

}

export default OrderDetail;