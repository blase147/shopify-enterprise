import { gql, useQuery } from '@apollo/client';
import {
  Badge, Button,
  Card,
  Checkbox, ChoiceList,
  Frame, Icon,
  Spinner
} from '@shopify/polaris';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  MobileBackArrowMajor, ArrowRightMinor
} from '@shopify/polaris-icons';
import './weeklyMeals.css';

const index = ({ handleBack }) => {
  // Start Tabs
  const [selectedDate, setSelectedDate] = useState('');
  const [customersData, setCustomersData] = useState(null);
 // -------------------
  const GET_Customers_Orders = gql`
    query {
        fetchCustomersMealsOrders {
                totalCount
                customerName
                customerOrders {
                  estimatedDateOfDelivery
                  createdAt
                  orderItems {
                    name
                    quantity
                  }
                }
        }
    }
    `;
  const { data, loading } = useQuery(GET_Customers_Orders, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (data && data.fetchCustomersMealsOrders) {
      filterAndSetCustomersData();
    }
    if(!selectedDate) {
      setSelectedDate(dayjs().format('YYYY-MM-DD'));
    }
  }, [data]);

  const filterAndSetCustomersData = () => {
    let customerData=[]
    data.fetchCustomersMealsOrders.forEach((c)=> {
      if(c.totalCount > 0) {
        let info = { 
          name: c.customerName,
          totalCount: c.totalCount,
          customerOrders: []
        }
        c.customerOrders.forEach((order)=> {
          if(order.createdAt === selectedDate) {
            info.customerOrders.push(order)
          }
        })
        if(info.customerOrders.length > 0){
          customerData.push(info)
        }
      }
    })
    setCustomersData(customerData)
  }

  const handleDateChange = (e) => {
    let newDate = dayjs()
    if(e.target.parentElement.parentElement.id === 'next-day') {
      newDate = dayjs(selectedDate).add('1', 'day').format('YYYY-MM-DD')
    } else {
      newDate = dayjs(selectedDate).subtract('1', 'day').format('YYYY-MM-DD')
    }
    setSelectedDate(newDate)
    filterAndSetCustomersData()
  }

  return (
    <>
      <Frame>
        <div className="shipping-header">
          <div className="back-button pointer" onClick={handleBack}>
            <Icon
              source={MobileBackArrowMajor}
              color="base" />
          </div>
        </div>

        <Card>
          <Card.Section>
            <div className='header'>
              <div className="back-button pointer"  id='prev-day' onClick={handleDateChange}>
              <Icon
                source={MobileBackArrowMajor}
                color="base" />
              </div>
              <h2 className="Trial">Meals for: Week of {selectedDate} </h2>
              <div className="back-button pointer" id='next-day' onClick={handleDateChange}>
                <Icon
                  source={ArrowRightMinor}
                  color="base" />
              </div>
            </div>
            {customersData && customersData.map((customer)=> (
              <div className="Trial">
                <div className='order-box'>
                  <h2 className="Trial">{customer.name} <span>{selectedDate}</span></h2>
                  <div className="orders">
                    <div className="placed_data pdate">
                      <p className="placed">Order placed:</p>
                      <p className="placed_dates "></p>
                    </div>
                    <div id="psection" className="product_section">
                    {customer.customerOrders.map((order) =>(
                      order.orderItems.map((line_item)=> (
                      <div className="order_inn">
                        <div className="holder">
                          { //<button className="dish_remove" data-id="{{item.id}}">+</button>
                          }
                          <img src={line_item.src} alt="not present" />
                          <h5>{line_item.name} ({line_item.quantity})</h5>
                        </div>
                      </div>
                    ))))}
                    </div>
                  </div>
                  <div className="order_status">
                      <div className="Status">
                        <p className="s_name">Status:</p>
                        <p className="s_data">Pending</p>
                      </div>
                      <div className="Status bottom">
                        <p className="s_name">Arriving:</p>
                        <p className="s_data subdued">Est. {customer.customerOrders[0].estimatedDateOfDelivery}</p>
                      </div>
                    </div>
                </div>
              </div>
            ))}
            {loading && (
              <Spinner
                accessibilityLabel="Spinner example"
                size="large"
                color="teal"
              />
            )}
          </Card.Section>
        </Card>
        {/* </Page> */}
      </Frame>
    </>
  )
}

export default index
