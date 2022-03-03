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
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [customersData, setCustomersData] = useState(null);
  const orders = [
    {
      name: 'order 1',
      image: 'src',
      status: 'Pending',
      eta: '13-24-2022',
    },
    {
      name: 'order 1',
      image: 'src',
      status: 'Pending',
      eta: '13-24-2022',
    },
    {
      name: 'order 1',
      image: 'src',
      status: 'Pending',
      eta: '13-24-2022',
    },
    {
      name: 'order 1',
      image: 'src',
      status: 'Pending',
      eta: '13-24-2022',
    },
    {
      name: 'order 1',
      image: 'src',
      status: 'Pending',
      eta: '13-24-2022',
    },
    {
      name: 'order 1',
      image: 'src',
      status: 'Pending',
      eta: '13-24-2022',
    }
  ]
  // -------------------
  const GET_Customers_Orders = gql`
    query {
        fetchCustomersMealsOrders {
                totalCount
                customerName
                customerOrders {
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
      setCustomersData(data.fetchCustomersMealsOrders);
    }
  }, [data]);
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
              <div className="back-button pointer" onClick={handleBack}>
              <Icon
                source={MobileBackArrowMajor}
                color="base" />
              </div>
              <h2 className="Trial">Meals for: Week of </h2>
              <div className="back-button pointer" onClick={handleBack}>
                <Icon
                  source={ArrowRightMinor}
                  color="base" />
              </div>
            </div>
            {customersData && customersData.map((customer)=> (
              <div className="Trial">
                <div className='order-box'>
                  <h2 className="Trial">{customer.customerName} <span>June 1, 2022</span></h2>
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
                          <button className="dish_remove" data-id="{{item.id}}">+</button>
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
                        <p className="s_data subdued">Est. June 4, 2021</p>
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
