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
import './AvenirFont/stylesheet.css';

const index = ({ handleBack }) => {
  const days = ['all', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [customersData, setCustomersData] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState(days);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('sunday')
  const [mealData, setMealData] = useState([]);
  const [activeCustomer, setactiveCustomer] = useState(0)
  const [selectedCustomerMeals, setSelectedCustomerMeals] = useState([])
  const [orderCount, setOrderCount] = useState(0)
  const [ProductDetail, setDetailPoduct] = useState([]);
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
    if (deliveryData.data && deliveryData.data.fetchDeliveryOptions) {
      deliveryData.data.fetchDeliveryOptions?.unshift({ deliveryDays: 'all', __typename: 'DeliveryOption' })
      setDeliveryOptions(deliveryData.data.fetchDeliveryOptions.map(o => o.deliveryDays))
      setSelectedDeliveryOption(deliveryData.data.fetchDeliveryOptions[0]?.deliveryDays)
    }
  }, [deliveryData.data]);


  const GET_Customers_Orders = gql`
    query {
      fetchCustomersMealsOrders {
        preOrder {
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
          deliveryDay
          orderId
          status
        }
        contracts {
          name
          subscription
          weekNumber
          deliveryDate
          deliveryDay
          originOrderProducts {
            id
            title
            image
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
      filterAndSetCustomersData(selectedWeek);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedWeek || selectedWeek == 52) {
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
    const customerData = []
    data.fetchCustomersMealsOrders?.preOrder?.forEach((c) => {
      if ((dayjs(c?.deliveryDate).week()).toString() == (selectedWeek).toString()) {
        let info = {
          name: c.customer.name,
          totalCount: c.products?.length,
          products: [],
          deliveryDate: c.deliveryDate,
          deliveryDay: c.deliveryDay,
          subscription: c.customer.subscription,
          orderNumber: c.orderId,
          status: c.status,
          type: "preorder"
        }
        c.products && c.products.forEach((product) => {
          info.products.push(product)
        })
        c.products?.map((val) => {
          val["quantity"] = 1;
        })
        let productArray = []
        c.products?.map((row) => {
          let CHECK = productArray.find((val) => val.id === row?.id);
          if (CHECK) {
            CHECK["quantity"] += row["quantity"]
          } else {
            productArray.push(row);
          }
        })
        productArray && productArray?.forEach((product) => {
          info.products.push(product)
        })
        customerData.push(info)
      }
    })
    data.fetchCustomersMealsOrders.contracts.forEach((c) => {
      if ((dayjs(c?.deliveryDate).week()).toString() == (selectedWeek).toString()) {
        let info = {
          name: c.name,
          totalCount: c.originOrderProducts?.length,
          products: [],
          deliveryDate: c.deliveryDate,
          deliveryDay: c.deliveryDay,
          subscription: c.subscription,
          type: "originOrder"
        }
        c.originOrderProducts && c.originOrderProducts.forEach((product) => {
          if (!(product.title?.toLowerCase()?.includes("meal box") || product.title?.toLowerCase()?.includes("meals box"))) {
            info.products.push(product)
          }
        })
        customerData.push(info)
      }
    })
    setCustomersData(customerData)
    setOrderCount(customerData?.length)
    filterMealData(customerData)
    let ArrayData = [];
    const mealdata = customerData

    mealdata?.map((key, index) => {
      key?.products?.forEach((row) => {
        row['qty1'] = row?.quantity
      })

    })

    mealdata?.map((key, index) => {
      if (index === 0) {
        ArrayData = key?.products;
      } else {
        key?.products?.forEach((row) => {
          let CHECK = ArrayData?.find((val) => val.id === row?.id);
          if (CHECK) {
            CHECK['qty1'] += +row?.qty1;
            let FilterData = ArrayData?.filter((val) => val?.id !== row?.id);
            ArrayData = [...FilterData, CHECK];
          } else {
            ArrayData = [...ArrayData, row];
          }
        })
      }
    })
    setDetailPoduct(ArrayData);
  }

  const filterMealData = (customerData) => {
    let mealsArray = []
    customerData?.forEach((c) => {
      let productArray = []
      c.products.forEach((p) => {
        if (!(p.title?.toLowerCase()?.includes("meal box") || p.title?.toLowerCase()?.includes("meals box"))) {
          productArray.push({ name: p.title, imgUrl: p.image, quantity: p?.quantity })
        }
      })
      mealsArray.push(productArray)
    })
    setMealData(mealsArray)
    setSelectedCustomerMeals(mealsArray[0])
  }

  const handleWeekChange = (e) => {
    setFilterByDay();
    setSelectedDay('all')
    let newDate = dayjs()
    let newWeek = selectedWeek
    if (e.currentTarget.id === 'next-week' && selectedWeek < 52) {
      newDate = dayjs(selectedDate).add('7', 'day').format('YYYY-MM-DD')
      newWeek = selectedWeek + 1
      setSelectedDate(newDate)
      setSelectedWeek(newWeek)
    } else if (selectedWeek > 1 && e.currentTarget.id === 'prev-week') {
      newDate = dayjs(selectedDate).subtract('7', 'day').format('YYYY-MM-DD')
      newWeek = selectedWeek - 1
      setSelectedDate(newDate)
      setSelectedWeek(newWeek)
    }

    if (data && data.fetchCustomersMealsOrders) {
      filterAndSetCustomersData(newWeek)
    }
  }
  const [filterByDay, setFilterByDay] = useState();
  const handleDayChange = (e) => {
    setFilterByDay()
    let dayCount = days.indexOf(e.target.value)
    setSelectedDay(e.target.value)
    if (days[dayCount] == "all") {
      setFilterByDay(customersData)
      setOrderCount(customersData?.length)
    }
    else {
      let filteredData = customersData.filter(function (el) {
        return (el.deliveryDay)?.toLowerCase() == days[dayCount];
      }
      );
      setOrderCount(filteredData?.length)

      setFilterByDay(filteredData)
    }
    HandleCustomerClick()
    setSelectedDeliveryOption(e.target.value)
  }

  const productImage = (products, pid) => {
    if (pid && products?.length > 0) {
      return products.find(p => p.id === pid).imageUrl
    }
    return ""
  }

  const HandleCustomerClick = (customer_id) => {
    setSelectedCustomerMeals(mealData[customer_id])
    setactiveCustomer(customer_id)
  }

  const formatDateTitle = () => {
    let currdate = dayjs(selectedDate);
    const curr = new Date(currdate);
    const first = curr.getDate() - curr.getDay() + 1; // Start from Monday
    const firstDate = new Date(curr.setDate(first));
    const lastDate = new Date(curr.setDate(firstDate.getDate() + 6));
    return `${dayjs(firstDate).format('dddd DD MMM')} - ${dayjs(lastDate).format('dddd DD MMM YYYY')}`
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
              <div className='header'>
                <div className="header-content">
                  <div className="back-button pointer" id='prev-week' onClick={handleWeekChange}>
                    {/* <Icon source={MobileBackArrowMajor} color="base" /> */}
                    <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.853483 16.1929L0.850906 16.1862L0.848198 16.1796C0.669647 15.7455 0.669647 15.2587 0.848198 14.8246L0.850906 14.818L0.853483 14.8114C0.937595 14.5947 1.06332 14.3965 1.22361 14.228L13.7228 1.74428L13.7249 1.74221C13.8909 1.57498 14.0885 1.4422 14.3063 1.35158C14.5241 1.26096 14.7578 1.21429 14.9938 1.21429C15.2298 1.21429 15.4634 1.26096 15.6812 1.35158C15.899 1.44221 16.0966 1.57498 16.2627 1.74221L16.2627 1.74222L16.2668 1.74634C16.4342 1.9122 16.5671 2.10947 16.6577 2.32676C16.7484 2.54405 16.795 2.77709 16.795 3.01243C16.795 3.24777 16.7484 3.4808 16.6577 3.69809C16.5671 3.91538 16.4342 4.11265 16.2668 4.27851L16.2655 4.27981L8.01208 12.498L6.78641 13.7185H8.51607L27.499 13.7185C27.9731 13.7185 28.4277 13.9066 28.7627 14.2412C29.0977 14.5758 29.2857 15.0294 29.2857 15.5021C29.2857 15.9749 29.0977 16.4285 28.7627 16.7631C28.4277 17.0977 27.9731 17.2858 27.499 17.2858H8.51607L6.78641 17.2858L8.01208 18.5062L16.2647 26.7237C16.2649 26.7238 16.265 26.7239 16.2651 26.724C16.6018 27.0605 16.7908 27.5165 16.7908 27.9918C16.7908 28.2273 16.7443 28.4605 16.6541 28.678L17.3139 28.9517L16.6541 28.678C16.5638 28.8956 16.4316 29.0934 16.2647 29.26L16.7695 29.7654L16.2647 29.26C15.9278 29.5965 15.4706 29.7857 14.9938 29.7857C14.7577 29.7857 14.5239 29.7393 14.3058 29.649C14.0877 29.5588 13.8896 29.4266 13.7228 29.26L13.2194 29.764L13.7228 29.26L1.22359 16.7763C1.06331 16.6077 0.937592 16.4095 0.853483 16.1929Z" fill="#384443" stroke="#384443" stroke-width="1.42857" />
                    </svg>

                    {/* Back */}
                  </div>
                  <h2 className="Trial">Meals for: Week of {formatDateTitle()} </h2>
                  <div className="back-button pointer" id='next-week' onClick={handleWeekChange}>
                    {/* <Icon source={ArrowRightMinor} color="base" /> */}
                    <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M29.1465 16.1929L29.1491 16.1862L29.1518 16.1796C29.3304 15.7455 29.3304 15.2587 29.1518 14.8246L29.1491 14.818L29.1465 14.8114C29.0624 14.5947 28.9367 14.3965 28.7764 14.228L16.2772 1.74428L16.2751 1.74221C16.1091 1.57498 15.9115 1.4422 15.6937 1.35158C15.4759 1.26096 15.2422 1.21429 15.0062 1.21429C14.7702 1.21429 14.5366 1.26096 14.3188 1.35158C14.101 1.44221 13.9034 1.57498 13.7373 1.74221L13.7373 1.74222L13.7332 1.74634C13.5658 1.9122 13.4329 2.10947 13.3423 2.32676C13.2516 2.54405 13.205 2.77709 13.205 3.01243C13.205 3.24777 13.2516 3.4808 13.3423 3.69809C13.4329 3.91538 13.5658 4.11265 13.7332 4.27851L13.7345 4.27981L21.9879 12.498L23.2136 13.7185H21.4839L2.50104 13.7185C2.02688 13.7185 1.57231 13.9066 1.2373 14.2412C0.902317 14.5758 0.714286 15.0294 0.714286 15.5021C0.714286 15.9749 0.902317 16.4285 1.2373 16.7631C1.57231 17.0977 2.02688 17.2858 2.50104 17.2858H21.4839L23.2136 17.2858L21.9879 18.5062L13.7353 26.7237C13.7351 26.7238 13.735 26.7239 13.7349 26.724C13.3982 27.0605 13.2092 27.5165 13.2092 27.9918C13.2092 28.2273 13.2557 28.4605 13.3459 28.678L12.6861 28.9517L13.3459 28.678C13.4362 28.8956 13.5684 29.0934 13.7353 29.26L13.2305 29.7654L13.7353 29.26C14.0722 29.5965 14.5294 29.7857 15.0062 29.7857C15.2423 29.7857 15.4761 29.7393 15.6942 29.649C15.9123 29.5588 16.1104 29.4266 16.2772 29.26L16.7806 29.764L16.2772 29.26L28.7764 16.7763C28.9367 16.6077 29.0624 16.4095 29.1465 16.1929Z" fill="#384443" stroke="#384443" stroke-width="1.42857" />
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
                          <div className='selectbox_02'>
                            <select name="days" id="days" className="order_day" onChange={handleDayChange}>
                              {deliveryOptions.map((dd) => (
                                <option value={dd}>{_.upperFirst(dd)}</option>
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
                        <div style={{ display: "block" }}>
                          <div className="meals_with_quantity">
                            {
                              ProductDetail?.map((key, index) => {
                                return (
                                  <>
                                    <div className='meal-main'>
                                      <img clas="meal-image" src={key?.image} alt="not present" />
                                      <div className="meal_title" label="Chip Filled" style={{ fontSize: "15px", fontWeight: 700 }}>{key.title}</div>
                                      <div className="meal_qty">(Quantity: {key.qty1})</div>
                                    </div>
                                  </>
                                )
                              })
                            }
                          </div>
                        </div>
                        <h1>Total Orders: {orderCount}</h1>
                        <OrderMangementTable
                          HandleCustomerClick={HandleCustomerClick}
                          activeCustomer={activeCustomer}
                          customerData={filterByDay ? filterByDay : customersData}
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
