import { gql, useQuery } from '@apollo/client';
import {
  Badge,
  Banner, Button,
  Card,
  Checkbox, ChoiceList, DataTable,
  Filters,
  Frame, Icon, List, Page,
  Spinner,
  Tabs,
  Toast
} from '@shopify/polaris';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import swapIcon from '../../../assets/images/icons/swap.svg';
import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';
import './shippingSuit.css';

const index = ({ handleBack }) => {
  // Start Tabs
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 'all',
      content: 'All',
    },
    {
      id: 'new',
      content: 'Due Today',
    },
    {
      id: 'returning',
      content: 'Returning',
    },
    {
      id: 'active',
      content: 'Unfulfiled',
    },
    {
      id: 'expired',
      content: 'Fulfiled',
    },
  ];
  // End tabs

  const [sortOrder, setSortOrder] = useState(0);

  const [moneySpent, setMoneySpent] = useState(null);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );

  const handleMoneySpentRemove = useCallback(() => setMoneySpent(null), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleFiltersClearAll = useCallback(() => {
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleMoneySpentRemove, handleQueryValueRemove, handleTaggedWithRemove]);

  const filters = [
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <ChoiceList
          title="Tagged with"
          titleHidden
          choices={[
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Active', value: 'active' },
            { label: 'In Trial', value: 'inTrial' },
            { label: 'Future', value: 'future' },
          ]}
          selected={taggedWith || []}
          onChange={handleTaggedWithChange}
        // allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'moneySpent',
      label: 'Money spent',
      // filter: (
      //   <RangeSlider
      //     label="Money spent is between"
      //     labelHidden
      //     value={moneySpent || [0, 500]}
      //     prefix="$"
      //     output
      //     min={0}
      //     max={2000}
      //     step={1}
      //     onChange={handleMoneySpentChange}
      //   />
      // ),
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(moneySpent)) {
    const key = 'moneySpent';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = 'taggedWith';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
  // -------------------
  const GET_Shipping_Orders = gql`
    query {
        fetchShipEngineOrders {
                totalCount
                shipEngineOrders {
                    orderId
                    orderDate
                    dueDate
                    signatureConfirmation
                    signatureInsurance
                    createReturnLabel
                    containsAlcohol
                    shippingInterval
                    shippingIntervalCount
                    status
                    createdAt
                    updatedAt
                    orderStatus {
                        paymentStatus
                        fulfillmentStatus
                        isCancelled
                    }
                    paymentDetails {
                        subtotalAmount
                        shippingAmount
                        tax
                        grandTotal
                    }
                    customer {
                        name
                        phone
                        email
                    }
                    shipTo {
                        name
                        email
                        address1
                        city
                        zip
                        countryCode
                    }
                    orderItems {
                        name
                        sku
                        unitPrice
                        quantity
                        weight
                        weightUnit
                        length
                        width
                        height
                        dimensionUnit
                    }
                }
        }
    }
    `;
  const { data, loading, error, refetch } = useQuery(GET_Shipping_Orders, {
    fetchPolicy: 'no-cache'
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const [selectedCustomers, setselectedCustomers] = useState([]);
  const handleChangeCheckedCustomers = (newChecked, customerId) => {
    if (newChecked) {
      setselectedCustomers([...selectedCustomers, customerId]);
    } else {
      const index = selectedCustomers.indexOf(customerId);
      setselectedCustomers([
        ...selectedCustomers.slice(0, index),
        ...selectedCustomers.slice(index + 1),
      ]);
    }
  };
  //upper first letter
  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  //each row in data table
  const formatRows = (rows) => {
    return rows?.map((row) =>
      row?.subscription !== null ?
        [
          <div className='orderId'>
            <Checkbox
              label={row.id}
              checked={selectedCustomers.indexOf(row.id) != -1}
              onChange={(newChecked) =>
                handleChangeCheckedCustomers(newChecked, row.id)
              }
            />
            <a
              href=''
              key={row.orderId}
            >{`${row.orderId}`}</a>
          </div>
          ,
          // row.createdAt,
          <div>
            {row?.customer && <>
              {row?.customer?.name && <h6>{capitalize(row?.customer?.name)}</h6>}
              {row?.customer?.address && <p>{row?.customer?.address}</p>}
              {row?.dueDate && <p>{dayjs(row?.dueDate).format('MMM DD YYYY')}</p>}
            </>
            }
          </div>
          ,
          <div>
            {row?.orderItems?.map(item => <div>
              {item?.name && <h6>{item?.name}</h6>}
              {item?.unitPrice && <p>${item?.unitPrice} USD {row?.shippingIntervalCount ? '/' : ''} {row?.shippingIntervalCount} {row?.shippingInterval ? capitalize(row?.shippingInterval) : ''}</p>}
              <p>{item?.weight || ''} {item?.weightUnit} {item?.length ? `${item?.length} X` : ''} {item?.width ? `${item?.width} X` : ''} {item?.height ? `${item?.height}` : ''} {item?.dimensionUnit || ''}</p>
            </div>)}
          </div>
          ,
          <div>
            {row?.orderItems?.map(item => !item?.dimensionUnit ? <h5>Rates Unavalible</h5> : '')}
            {/* <h6>{'USPS First-Class Package/Mail Parcel'}</h6>
              <p>${'3 - 5 days'}</p>
              <p>"{'Subscription shipping - $4.90'}"</p> */}
          </div>,
          <div>
            <Badge>{capitalize(row.status)}</Badge>
          </div>,
          <div className='vieworder'>
            <Button>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.08397 19.7847C8.42274 19.7847 9.50803 18.6994 9.50803 17.3606C9.50803 16.0218 8.42274 14.9366 7.08397 14.9366C5.7452 14.9366 4.65991 16.0218 4.65991 17.3606C4.65991 18.6994 5.7452 19.7847 7.08397 19.7847Z" fill="white"/>
                <path d="M14.8503 14.913C13.505 14.7806 12.3072 15.7639 12.1748 17.1091C12.0424 18.4544 13.0256 19.6523 14.3709 19.7847C14.5303 19.8004 14.6909 19.8004 14.8503 19.7847C16.1956 19.6523 17.1788 18.4544 17.0465 17.1091C16.9321 15.9469 16.0125 15.0274 14.8503 14.913Z" fill="white"/>
                <path d="M19.8397 5.68747C19.7192 5.50715 19.5152 5.40069 19.2984 5.40506H16.6154V5.35799C16.6156 2.51145 14.3082 0.203721 11.4617 0.203537C8.61518 0.203353 6.30746 2.51076 6.30727 5.3573C6.30727 5.35753 6.30727 5.35776 6.30727 5.35799V5.40506H4.30683L3.62433 2.29849C3.54853 1.98247 3.26681 1.75903 2.94183 1.75719H0V3.16927H2.377L4.56571 13.2186C4.62349 13.549 4.91285 13.7884 5.24822 13.7834H17.5568C17.8818 13.7815 18.1635 13.5581 18.2393 13.2421L19.9809 6.27584C20.0319 6.06839 19.9793 5.84909 19.8397 5.68747ZM11.4614 9.09999C9.39472 9.09999 7.71935 7.42462 7.71935 5.35799C7.71935 3.29135 9.39472 1.61598 11.4614 1.61598C13.528 1.61598 15.2034 3.29135 15.2034 5.35799C15.1905 7.41929 13.5227 9.08712 11.4614 9.09999Z" fill="white"/>
                <path d="M10.8965 5.42859L9.60208 4.11065L8.59009 5.0991L10.3787 6.91127C10.5091 7.04429 10.6867 7.12041 10.8729 7.12308C11.0568 7.13209 11.2359 7.06383 11.3672 6.9348L14.3325 4.13419L13.3676 3.09866L10.8965 5.42859Z" fill="white"/>
              </svg> 
              BUY
            </Button>
          </div>
        ] : []);
  };
  const [customers, setCustomers] = useState([]);
  const [filterCustomers, setFilterCustomers] = useState([]);

  const filterCustomersValue = () => {
    const rowsData = customers.filter((item) => {
      return (
        item
      );
    });

    setFilterCustomers(rowsData);
  };
  useEffect(() => {
    if (customers) {
      filterCustomersValue();
    }
    // console.log('searchvalue: ', queryValue);
  }, [queryValue, taggedWith, customers]);


  useEffect(() => {
    if (data && data.fetchShipEngineOrders) {
      let rowsData = formatRows(data.fetchShipEngineOrders.shipEngineOrders);
      setCustomers(data.fetchShipEngineOrders.shipEngineOrders);
    }
  }, [data]);

  let activeArr = [],
    newArr = [],
    pausedArr = [],
    cancelledArr = [];
  if (selectedTab == 1 && filterCustomers.length !== 0) {
    filterCustomers?.map(res => {
      if (res.dueDate !== null && (new Date(Date.parse(res.dueDate)).toDateString()) === new Date(new Date().getTime()).toDateString()) {
        newArr.push(res);
      }
    });
  } else if (selectedTab == 2 && filterCustomers.length !== 0) {
    filterCustomers?.map(res => {
      res.status == 'PAUSED' && pausedArr.push(res);
    });
  } else if (selectedTab == 3 && filterCustomers.length !== 0) {
    filterCustomers?.map(res => {
      res.status == 'ACTIVE' && activeArr.push(res);
    });
  } else if (selectedTab == 4 && filterCustomers.length !== 0) {
    filterCustomers?.map(res => {
      res.status == 'CANCELLED' && cancelledArr.push(res);
    });
  }

  return (
    <>
      <Frame>
        {saveSuccess && (
          <Toast
            content="Customer data has been saved successfully"
            onDismiss={hideSaveSuccess}
          />
        )}

        {formErrors.length > 0 && (
          <>
            <Banner title="Customer data has not been saved" status="critical">
              <List type="bullet">
                {formErrors.map((message, index) => (
                  <List.Item key={index}>{message.message}</List.Item>
                ))}
              </List>
            </Banner>
            <br />
          </>
        )}
       
          <div>
            <div className="back-button pointer" onClick={handleBack}>
              <Icon
                source={MobileBackArrowMajor}
                color="base" />
            </div>
          </div>
          <Card>
            <div className="tabs">
              <Tabs
                tabs={tabs}
                selected={selectedTab}
                onSelect={handleTabChange}
              />
            </div>
            <Card.Section>
              <div className="filter">
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleFiltersClearAll}
                />
                <span className="separate"></span>
                <div className="btn-sort">
                  <Button
                    onClick={() => {
                      setFilterCustomers(() => {
                        if (sortOrder === 1) {
                          setSortOrder(0);
                          return [...filterCustomers].sort(
                            (a, b) =>
                              new Date(b.updatedAt) - new Date(a.updatedAt)
                          );
                        } else {
                          setSortOrder(1);
                          return [...filterCustomers].sort(
                            (a, b) =>
                              new Date(a.updatedAt) - new Date(b.updatedAt)
                          );
                        }
                      });
                    }}
                  >
                    <img src={swapIcon} />
                    Sort By last update (Newest First)
                  </Button>
                </div>
              </div>
              <div className={`table customer-subscription-tbl ${selectedTab} shippingSuiteTable`}>
                <DataTable
                  className={`suitTable`}
                  columnContentTypes={[
                    'text',
                    'text',
                    'text',
                    'text',
                    'text',
                  ]}
                  headings={[
                    'Order',
                    'Details',
                    'Item Details',
                    'Shipping Rates',
                    'Status',
                    '',
                  ]}
                  rows={selectedTab == 1 ? formatRows(newArr) : selectedTab == 2 ? formatRows(pausedArr) : selectedTab == 3 ? formatRows(activeArr) : selectedTab == 4 ? formatRows(cancelledArr) : formatRows(filterCustomers)}
                />
              </div>
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
