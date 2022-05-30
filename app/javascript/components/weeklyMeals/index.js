import { gql, useQuery } from '@apollo/client';
import {
  Badge, Button,
  Card,
  Checkbox, ChoiceList,
  Frame, Icon,
  Spinner,
  Layout,
  TextStyle,
  Select
} from '@shopify/polaris';

import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  MobileBackArrowMajor, ArrowRightMinor, DropdownMinor
} from '@shopify/polaris-icons';
import './weeklyMeals.css';
import OrderMangementTable from './OrderMangementTable';
import { Link } from 'react-router-dom';
import OrderDetail from './OrderDetail';
//import './AvenirFont/stylesheet.css';

const index = ({ handleBack }) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [customersData, setCustomersData] = useState(null);
  const [ deliveryOptions, setDeliveryOptions] = useState(days);
  const [mealData, setMealData] = useState([]);
  const[activeCustomer,setactiveCustomer]=useState(0)
  const[selectedCustomerMeals, setSelectedCustomerMeals]=useState([])
  const[orderCount, setOrderCount] = useState(0)
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
        week
        products {
          id
          title
          image
          description
        }
        shopifyContractId
        customer {
          name
          subscription
        }
        deliveryDate
      }
    }
  `;

  const { data, loading } = useQuery(GET_Customers_Orders, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (data && data.fetchCustomersMealsOrders) {
      filterAndSetCustomersData(selectedWeek);
      setOrderCount(data.fetchCustomersMealsOrders.length)
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

  const filterAndSetCustomersData = (selectedWeek) => {
    var weekOfYear = require('dayjs/plugin/weekOfYear')
    dayjs.extend(weekOfYear)
    let customerData=[]
    data.fetchCustomersMealsOrders.forEach((c)=> {
      if(c.week === selectedWeek.toString()) {
        let info = { 
          name: c.customer.name,
          totalCount: c.products.length,
          products: [],
          deliveryDate: c.deliveryDate,
          subscription: c.customer.subscription
        }
        c.products && c.products.forEach((product)=> {
          info.products.push(product)
        })
        customerData.push(info)
      }
    })
    setCustomersData(customerData)
    filterMealData(customerData)
  }

  const filterMealData = (customerData) => {

    let mealsArray = []
    customerData.forEach((c) => {
      let productArray = []
      c.products.forEach((p) => {
        productArray.push({name: p.title, imgUrl: p.image})
      })
      mealsArray.push(productArray)
    })
    setMealData(mealsArray)
    setSelectedCustomerMeals(mealsArray[0])
  }

  const handleWeekChange = (e) => {
    let newDate = dayjs()
    let newWeek = selectedWeek
    if(e.currentTarget.id === 'next-week' && selectedWeek < 52) {
      newDate = dayjs(selectedDate).add('7', 'day').format('YYYY-MM-DD')
      newWeek = selectedWeek + 1
    } else if (selectedWeek > 1) {
      newDate = dayjs(selectedDate).subtract('7', 'day').format('YYYY-MM-DD')
      newWeek = selectedWeek - 1
    }
    setSelectedDate(newDate)
    setSelectedWeek(newWeek)
    if (data && data.fetchCustomersMealsOrders) {
      filterAndSetCustomersData(newWeek)
    }
  }

  const handleDayChange = (e) => {
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

  console.log('customersData',customersData)

  const MealDataArr=[
    [
      {name: 'test1',imgUrl: 'https://picsum.photos/200/300'},
  {name: '45888',imgUrl: 'https://picsum.photos/200/300'},
  {name: '5998',imgUrl: 'https://picsum.photos/200/300'}
  
  ],
    [{name: 'test2',imgUrl: 'https://picsum.photos/200/300'}],
    [{name: 'test3',imgUrl: 'https://picsum.photos/200/300'}],
    [{name: 'test4',imgUrl: 'https://picsum.photos/200/300'}],
  ]
// const[mealdata,setMealData]=useState(MealDataArr[0])

const HandleCustomerClick=(customer_id)=>{
  setSelectedCustomerMeals(mealData[customer_id])
  setactiveCustomer(customer_id)
}


  return (
    <>
      <div className='weeklyMeal'>
      <Frame>
        {/* <div className="shipping-header">
          <div className="back-button pointer" onClick={handleBack}>
            <Icon
              source={MobileBackArrowMajor}
              color="base" />
          </div>
        </div> */}

        <Card>
          <Card.Section>
          <div className="shipping-header">
            <Layout>
              <Layout.Section>
              <div className="back-button pointer" onClick={handleBack}>
                {/* <Icon source={MobileBackArrowMajor} color="base" /> */}
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.597437 11.485L0.59753 11.485L0.593739 11.4757C0.468752 11.1719 0.468752 10.8311 0.593739 10.5272L0.59383 10.5273L0.597437 10.518C0.656313 10.3663 0.74431 10.2276 0.856495 10.1096L9.60596 1.371L9.6074 1.36954C9.72365 1.25249 9.86198 1.15954 10.0144 1.09611C10.1669 1.03267 10.3304 1 10.4956 1C10.6608 1 10.8244 1.03267 10.9768 1.09611C11.1293 1.15954 11.2676 1.25249 11.3839 1.36954L11.3868 1.37244C11.504 1.48854 11.597 1.62663 11.6604 1.77873C11.7239 1.93084 11.7565 2.09396 11.7565 2.2587C11.7565 2.42344 11.7239 2.58656 11.6604 2.73866C11.597 2.89076 11.504 3.02886 11.3868 3.14495L11.3859 3.14586L5.60845 8.89862L4.75049 9.75293H5.96125L19.2493 9.75293C19.5812 9.75293 19.8994 9.88463 20.1339 10.1188C20.3684 10.353 20.5 10.6706 20.5 11.0015C20.5 11.3324 20.3684 11.6499 20.1339 11.8841C19.8994 12.1184 19.5812 12.2501 19.2493 12.2501L5.96125 12.2501H4.75049L5.60845 13.1044L11.3853 18.8566C11.6211 19.0921 11.7535 19.4114 11.7535 19.7443C11.7535 19.9091 11.721 20.0723 11.6579 20.2246C11.5947 20.3769 11.5021 20.5154 11.3853 20.632L11.7387 20.9858L11.3853 20.632C11.1495 20.8676 10.8294 21 10.4956 21C10.3304 21 10.1667 20.9675 10.0141 20.9043C9.8614 20.8412 9.72273 20.7486 9.60595 20.632L0.856514 11.8934C0.744318 11.7754 0.656315 11.6367 0.597437 11.485Z" fill="black" stroke="black"/>
                </svg>

                <p>
                  <TextStyle variation="subdued"> Back to schedule page</TextStyle>
                </p>
              </div>
              </Layout.Section>
            </Layout>
          </div>
            <div className='header'>
              <div className="header-content">
                <div className="back-button pointer"  id='prev-week' onClick={handleWeekChange}>
                {/* <Icon source={MobileBackArrowMajor} color="base" /> */}
                <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.853483 16.1929L0.850906 16.1862L0.848198 16.1796C0.669647 15.7455 0.669647 15.2587 0.848198 14.8246L0.850906 14.818L0.853483 14.8114C0.937595 14.5947 1.06332 14.3965 1.22361 14.228L13.7228 1.74428L13.7249 1.74221C13.8909 1.57498 14.0885 1.4422 14.3063 1.35158C14.5241 1.26096 14.7578 1.21429 14.9938 1.21429C15.2298 1.21429 15.4634 1.26096 15.6812 1.35158C15.899 1.44221 16.0966 1.57498 16.2627 1.74221L16.2627 1.74222L16.2668 1.74634C16.4342 1.9122 16.5671 2.10947 16.6577 2.32676C16.7484 2.54405 16.795 2.77709 16.795 3.01243C16.795 3.24777 16.7484 3.4808 16.6577 3.69809C16.5671 3.91538 16.4342 4.11265 16.2668 4.27851L16.2655 4.27981L8.01208 12.498L6.78641 13.7185H8.51607L27.499 13.7185C27.9731 13.7185 28.4277 13.9066 28.7627 14.2412C29.0977 14.5758 29.2857 15.0294 29.2857 15.5021C29.2857 15.9749 29.0977 16.4285 28.7627 16.7631C28.4277 17.0977 27.9731 17.2858 27.499 17.2858H8.51607L6.78641 17.2858L8.01208 18.5062L16.2647 26.7237C16.2649 26.7238 16.265 26.7239 16.2651 26.724C16.6018 27.0605 16.7908 27.5165 16.7908 27.9918C16.7908 28.2273 16.7443 28.4605 16.6541 28.678L17.3139 28.9517L16.6541 28.678C16.5638 28.8956 16.4316 29.0934 16.2647 29.26L16.7695 29.7654L16.2647 29.26C15.9278 29.5965 15.4706 29.7857 14.9938 29.7857C14.7577 29.7857 14.5239 29.7393 14.3058 29.649C14.0877 29.5588 13.8896 29.4266 13.7228 29.26L13.2194 29.764L13.7228 29.26L1.22359 16.7763C1.06331 16.6077 0.937592 16.4095 0.853483 16.1929Z" fill="#384443" stroke="#384443" stroke-width="1.42857"/>
                </svg>

                {/* Back */}
                </div>
                <h2 className="Trial">Meals for: Week of {selectedWeek}/52 </h2>
                <div className="back-button pointer" id='next-week' onClick={handleWeekChange}>
                  {/* <Icon source={ArrowRightMinor} color="base" /> */}
                  <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.1465 16.1929L29.1491 16.1862L29.1518 16.1796C29.3304 15.7455 29.3304 15.2587 29.1518 14.8246L29.1491 14.818L29.1465 14.8114C29.0624 14.5947 28.9367 14.3965 28.7764 14.228L16.2772 1.74428L16.2751 1.74221C16.1091 1.57498 15.9115 1.4422 15.6937 1.35158C15.4759 1.26096 15.2422 1.21429 15.0062 1.21429C14.7702 1.21429 14.5366 1.26096 14.3188 1.35158C14.101 1.44221 13.9034 1.57498 13.7373 1.74221L13.7373 1.74222L13.7332 1.74634C13.5658 1.9122 13.4329 2.10947 13.3423 2.32676C13.2516 2.54405 13.205 2.77709 13.205 3.01243C13.205 3.24777 13.2516 3.4808 13.3423 3.69809C13.4329 3.91538 13.5658 4.11265 13.7332 4.27851L13.7345 4.27981L21.9879 12.498L23.2136 13.7185H21.4839L2.50104 13.7185C2.02688 13.7185 1.57231 13.9066 1.2373 14.2412C0.902317 14.5758 0.714286 15.0294 0.714286 15.5021C0.714286 15.9749 0.902317 16.4285 1.2373 16.7631C1.57231 17.0977 2.02688 17.2858 2.50104 17.2858H21.4839L23.2136 17.2858L21.9879 18.5062L13.7353 26.7237C13.7351 26.7238 13.735 26.7239 13.7349 26.724C13.3982 27.0605 13.2092 27.5165 13.2092 27.9918C13.2092 28.2273 13.2557 28.4605 13.3459 28.678L12.6861 28.9517L13.3459 28.678C13.4362 28.8956 13.5684 29.0934 13.7353 29.26L13.2305 29.7654L13.7353 29.26C14.0722 29.5965 14.5294 29.7857 15.0062 29.7857C15.2423 29.7857 15.4761 29.7393 15.6942 29.649C15.9123 29.5588 16.1104 29.4266 16.2772 29.26L16.7806 29.764L16.2772 29.26L28.7764 16.7763C28.9367 16.6077 29.0624 16.4095 29.1465 16.1929Z" fill="#384443" stroke="#384443" stroke-width="1.42857"/>
                  </svg>

                  {/* Next */}
                </div>
              </div>
            </div>
            <div className="body-content">
              <div className='table'>
                <Card>
                  <div className='order-header'>Order Management</div>
                  <div className='main-order-section'>
                  <div className='left-section'>
                    <div className='order-buttons'>
                      <div className='selectbox_01'>
                        <select name="week" id="week"  className='week_custom_css' onChange={handleDayChange}>
                          <option value="">Select Week</option>
                          {deliveryOptions.map((dd) => (
                            <option value={dd}>{dd}</option>
                          ))}
                        </select>
                        <label htmlFor="week">
                          <Icon source={DropdownMinor} color="base" />
                        </label>
                      </div>

                      <div className='selectbox_02'>
                        <select name="days" id="days" className="order_day" onChange={handleDayChange}>
                          {deliveryOptions.map((dd) => (
                            <option value=''>Select Day</option>
                          ))}
                        </select>
                        <label>
                          <Icon source={DropdownMinor} color="base" />
                        </label>
                      </div>
                      
                      <div className='selectbox_03'>
                        <select name="orders" className='number_of_order' id="num_of_orders" onChange={handleDayChange}>
                          {deliveryOptions.map((dd) => (
                            <option value=''>Number Of Orders</option>
                          ))}
                        </select>
                        <label>
                          <Icon source={DropdownMinor} color="base" />
                        </label>
                      </div>
                      <div className="analytic-section">
                        <div className="deep-analytics">
                          <Link
                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                            to={'/toolbox'}
                          >
                            Refresh
                          </Link>
                        </div>
                      </div>
                    </div>
                    <h1>Total Orders: { orderCount }</h1>
                    <OrderMangementTable 
                    HandleCustomerClick={HandleCustomerClick}
                    activeCustomer={activeCustomer}
                    customerData={customersData}
                    />
                  </div>
                  <div className='right-section'>
                    <OrderDetail
                     MealData={selectedCustomerMeals}
                     />
                  </div>
                  </div>
                </Card>
              </div>
            </div>
            
            {/*customersData && customersData.map((customer)=> (
              <div className="Trial">
                <div className='order-box'>
                  <h2 className="Trial">{customer.name} <span>{selectedDate}</span></h2>
                  <div className="orders">
                    <div className="placed_data pdate">
                      <p className="placed">Order placed:</p>0px
                      <p className="placed_dates "></p>
                    </div>
                    <div id="psection" className="product_section">
                    {customer.products.map((product) =>(
                      <div className="order_inn">
                        <div className="holder">
                          { //<button className="dish_remove" data-id="{{product.id}}">+</button>
                          }
                          <img src={product.image} alt="not present" />
                          <h5>{product.name}</h5>
                        </div>
                      </div>
                    ))}
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
            ))*/}
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
    </div>
    </>
  )
}

export default index