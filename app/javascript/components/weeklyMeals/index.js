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
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [customersData, setCustomersData] = useState(null);
  const [ deliveryOptions, setDeliveryOptions] = useState(days);
  
 // -------------------

 const GET_Delivery_Options = gql`
    query {
      fetchDeliveryOptions {
        deliveryDays
      }
    }
    `;

  const deliveryData = useQuery(GET_Delivery_Options, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if(deliveryData.data && deliveryData.data.fetchDeliveryOptions) {
      setDeliveryOptions(deliveryData.data.fetchDeliveryOptions.map(o => o.deliveryDays))
    }
  }, [deliveryData.data]);


  const GET_Customers_Orders = gql`
    query {
      fetchCustomersMealsOrders {
        totalCount
        customerName
        customerOrders {
          dateOfDelivery
          createdAt
          orderItems {
            name
            quantity
            productId
          }
          products {
            id
            imageUrl
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
      filterAndSetCustomersData(selectedDate);
    }
  }, [data]);
  
  useEffect(() => {
    if(!selectedWeek) {
      var weekOfYear = require('dayjs/plugin/weekOfYear')
      var weekday = require('dayjs/plugin/weekday')
      var updateLocale = require('dayjs/plugin/updateLocale')
      dayjs.extend(weekOfYear)
      dayjs.extend(weekday)
      dayjs.extend(updateLocale)
      let date = dayjs().startOf('week')

      setSelectedWeek(dayjs().week());
      setSelectedDay(days[dayjs(date).get('day')]);
      setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
    }
  }, []);

  const filterAndSetCustomersData = (selectedDate) => {
    let customerData=[]
    data.fetchCustomersMealsOrders.forEach((c)=> {
      if(c.totalCount > 0) {
        let info = { 
          name: c.customerName,
          totalCount: c.totalCount,
          customerOrders: []
        }
        c.customerOrders && c.customerOrders.forEach((order)=> {
          let dateOfDelivery = dayjs(order.dateOfDelivery).format('YYYY-MM-DD')
          if(selectedDate === dateOfDelivery) {
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

  const handleWeekChange = (e) => {
    let newDate = dayjs()
    let newWeek = selectedWeek
    if(e.target.id === 'next-week' && selectedWeek < 52) {
      newDate = dayjs(selectedDate).add('7', 'day').format('YYYY-MM-DD')
      newWeek = selectedWeek + 1
    } else if (selectedWeek > 1) {
      newDate = dayjs(selectedDate).subtract('7', 'day').format('YYYY-MM-DD')
      newWeek = selectedWeek - 1
    }
    setSelectedDate(newDate)
    setSelectedWeek(newWeek)
    filterAndSetCustomersData(newDate)
  }

  const handleDayChange = (e) => {
    debugger
    let dayCount = days.indexOf(e.target.value)
    let newDate = dayjs(selectedDate).startOf('week').add(dayCount, 'day').format('YYYY-MM-DD')
    setSelectedDate(newDate)
    setSelectedDay(e.target.value)
    filterAndSetCustomersData(newDate)
  }

  const productImage = (products, pid) => {
    if(pid && products.length > 0) {
      return products.find(p => p.id === pid).imageUrl
    }
    return ""
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
              <div className="back-button pointer"  id='prev-week' onClick={handleWeekChange}>
              {/* <Icon
                source={MobileBackArrowMajor}
                color="base" /> */}
                Back
              </div>
              <h2 className="Trial">Meals for: Week of {selectedWeek}/52 </h2>
              <select name="days" id="days" onChange={handleDayChange}>
                {deliveryOptions.map((dd) => (
                  <option value={dd}>{dd}</option>
                ))}
              </select>
              <div className="back-button pointer" id='next-week' onClick={handleWeekChange}>
                {/* <Icon
                  source={ArrowRightMinor}
                  color="base" /> */}
                  Next
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
                            <img src={productImage(order.products, line_item.productId)} alt="not present" />
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
                        <p className="s_data subdued">Est. {selectedDate}</p>
                      </div>
                    </div>
                </div>
              </div>
            ))}
            {(loading || deliveryData.loading) && (
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
