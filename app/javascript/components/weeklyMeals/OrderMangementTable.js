import React from 'react'
import { DataTable, Icon, Link, Page } from "@shopify/polaris";
import { DropdownMinor } from '@shopify/polaris-icons';
import './weeklyMeals.css';

const statusOptions = ['Preparing','Delivered','In Transit','Pending']
  
const handleStatusColor = (e) => {

  // console.log('status',e.target.value)
  e.target.removeAttribute("class");

  e.target.value == 'Preparing'?
    e.target.setAttribute('class','status preparing')
  : e.target.value == 'Delivered'?
    e.target.setAttribute('class','status delivered')

 :e.target.value == 'In Transit'?
    e.target.setAttribute('class','status inTransit')

 :e.target.value == 'Pending'?
    e.target.setAttribute('class','status pending'): ''
}
const OrderMangementTable=({ HandleCustomerClick, activeCustomer, customerData })=> {
const rows = []
customerData && customerData.map((customer,index)=>{
  rows.push(
    [        
      <div className={`${activeCustomer===index ? 'customerActive':''} profile_image_link`}
        onClick={()=>{
          HandleCustomerClick(index)
        }}
      >
        <img src='https://picsum.photos/200/300' className='order-img' />
        {customer.name}</div>,

        <div className={`${activeCustomer===index ? 'customerActive':''} profile_image_link`}
          onClick={()=>{
            HandleCustomerClick(index)
          }}
        >
          { customer.subscription }
        </div>,
        <div className= {`${activeCustomer===index ? 'customerActive':''} profile_image_link`}
          onClick={()=>{
            HandleCustomerClick(index)
         }}
        >
          <div className='selectbox'>
            <select name="status" className= {`${customer.status == 'Preparing'?
                'status preparing'
              : customer.status == 'Delivered'?
                'status delivered'
              :customer.status == 'In Transit'?
                'status inTransit'
              :customer.status == 'Pending'? 'status pending' : ''} status`} id="ful_status"
              onChange={(e,value)=>handleStatusColor(e)}
            >
              {statusOptions.map((status ) => {  
                if( status == customer.status){         
                  return <option value={status} selected >{ status }</option>
                }
                else {
                  return <option value={status}>{ status }</option>
                }
              })}
            </select>
            <label>
              <Icon source={DropdownMinor} color="base" />
            </label>
          </div>
        </div>,
        <div className={`${activeCustomer===index ? 'customerActive':''} profile_image_link`}
          onClick={()=>{
            HandleCustomerClick(index)
          }}
        >
          {customer.deliveryData}
        </div>,
    ]
  )
})

  // const rows = [
  //   [
      
  //       <div className={`${activeCustomer===0 ? 'active':''} profile_image_link`}
  //        onClick={()=>{
  //         HandleCustomerClick(0)
  //       }}
  //       >
  //       <img src='https://picsum.photos/200/300' className='order-img' />
  //       Emerald Silk Gown
  //       </div>,
  //     '$875.00',
  //     <div className='selectbox'>
  //       <select name="status" className='status' id="ful_status">
  //         {statusOptions.map((status ) => (           
  //           <option value=''>{ status }</option>
  //         ))}
  //       </select>
  //       <label>
  //         <Icon source={DropdownMinor} color="base" />
  //       </label>
  //     </div>,
  //     140,
  //   ],
  //   [
  //     <div className={`${activeCustomer===1 ? 'active':''} profile_image_link`}
  //     onClick={()=>{
  //         HandleCustomerClick(1)
  //       }}
  //       >
  //       <img src='https://picsum.photos/200/300' className='order-img' />
  //       Mauve Cashmere Scarf
  //     </div>,
  //     '$230.00',
  //     <div className='selectbox'>
  //       <select name="status" className='status' id="ful_status">
  //         {statusOptions.map((status) => (
  //           <option value=''>{ status }</option>
  //         ))}
  //       </select>
  //       <label>
  //         <Icon source={DropdownMinor} color="base" />
  //       </label>
  //     </div>,
  //     83,
  //   ],
  //   [
  //     <div className={`${activeCustomer===2 ? 'active':''} profile_image_link`}
  //     onClick={()=>{
  //      HandleCustomerClick(2)
  //    }}
  //    >
  //       <img src='https://picsum.photos/200/300' className='order-img' />
  //       Navy Merino Wool Blazer 
  //     </div>,
  //     '$445.00',
  //     <div className='selectbox'>
  //       <select name="status" className='status' id="ful_status">
  //         {statusOptions.map((status) => (
  //           <option value=''>{ status }</option>
  //         ))}
  //       </select>
  //       <label>
  //         <Icon source={DropdownMinor} color="base" />
  //       </label>
  //     </div>,
  //     32,
  //   ],
  // ];

  return (
    <Page>
      <DataTable
        columnContentTypes={[
          'text',
          'numeric',
          'text',
          'numeric',
        ]}
        headings={['Customer', 'Subscription Plan', 'Fulfilment Status', 'Delivery Date']}
        onClick={()=>{
          console.log('working')
        }}
        rows={rows}
      />
    </Page>
  );
}

export default OrderMangementTable;
