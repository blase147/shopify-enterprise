import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Badge,










  Banner, Button,






  ButtonGroup,














  Caption, Card,



















  Checkbox, ChoiceList, DataTable,















  DropZone, Filters,












  Frame, List, Modal, Page,










  Spinner, Stack,






  Tabs, Thumbnail,



















  Toast
} from '@shopify/polaris';
import { DeleteMajor, NoteMinor } from '@shopify/polaris-icons';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useHistory } from 'react-router-dom';
import swapIcon from '../../../assets/images/icons/swap.svg';
import AppLayout from '../layout/Layout';


// import json2csv from 'json2csv';
const subscriptions = ['all', 'inTrial', 'future', 'active', 'cancelled'];

const {
  Parser,
  transforms: { unwind },
} = require('json2csv');

const ButtonRemove = (props) => {
  const { selectedCustomers, refetch, setselectedCustomers } = props;
  const DELETE_CUSTOMER = gql`
    mutation($input: DeleteCustomersInput!) {
      deleteCustomers(input: $input) {
        result
      }
    }
  `;

  const [
    deleteCustomer,
    { loading: deleting, error: deleteError },
  ] = useMutation(DELETE_CUSTOMER);

  const handleRemoveCustomers = () => {
    if (deleting) return;
    deleteCustomer({
      variables: {
        input: { params: selectedCustomers },
      },
    }).then((resp) => {
      const errors = resp.errors;
      if (errors) {
      } else {
        refetch().then(() => setselectedCustomers([]));
      }
    });
  };

  return (
    <Button
      destructive
      icon={DeleteMajor}
      onClick={() => handleRemoveCustomers()}
      loading={deleting}
    >
      Delete Customer
    </Button>
  );
};

const Customers = () => {
  const history = useHistory();
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
      content: 'New',
    },
    {
      id: 'returning',
      content: 'Returning',
    },
    {
      id: 'active',
      content: 'Active',
    },
    {
      id: 'expired',
      content: 'Canceled',
    },
  ];
  // End tabs

  const [moneySpent, setMoneySpent] = useState(null);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);

  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    []
  );
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
  const GET_CUSTOMERS = gql`
    query($sortColumn: String, $sortDirection: String) {
      fetchCustomers(sortColumn: $sortColumn, sortDirection: $sortDirection) {
        id
        shopifyId
        firstName
        lastName
        name
        email
        phone
        communication
        subscription
        status
        autoCollection
        language
        createdAt
        updatedAt
        additionalContacts {
          id
          firstName
          lastName
          email
          phone
          companyName
        }
        billingAddress {
          id
          language
          firstName
          lastName
          email
          company
          phone
          address1
          address2
          city
          zipCode
        }
      }
    }
  `;
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMERS, {
    fetchPolicy: 'no-cache',
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
          <Checkbox
            label={row.id}
            checked={selectedCustomers.indexOf(row.id) != -1}
            onChange={(newChecked) =>
              handleChangeCheckedCustomers(newChecked, row.id)
            }
          />,
          <a
            href={`/subscriptions/${row.shopifyId}`}
            key={row.id}
          >{`${row.firstName} ${row.lastName}`}</a>,
          row.createdAt,
          <div
            className={
              row.status === 'PAUSED'
                ? 'cancelled'
                : row.status === 'ACTIVE'
                  ? 'active'
                  : 'future'
            }
          >
            <Badge>{capitalize(row.status)}</Badge>
          </div>,
          <div className='subscription'>{row.subscription}</div>,
          <div>
            <p className="more">
              {row.communication}
            </p>
            <p>
              <span className="price">{row.language}</span>
            </p>
          </div>
        ] : []);
  };
  const [customers, setCustomers] = useState([]);
  const [filterCustomers, setFilterCustomers] = useState([]);

  const filterCustomersValue = () => {
    const rowsData = customers.filter((item) => {
      return (
        (item.subscription === subscriptions[selectedTab] ||
          (subscriptions[selectedTab] === 'all') || (subscriptions[selectedTab] === 'returning') || (subscriptions[selectedTab] === 'active')) &&
        (item.name?.toLowerCase()?.includes(queryValue?.toLowerCase()) ||
          !queryValue) &&
        (item.subscription?.toLowerCase()?.includes(taggedWith) || !taggedWith)
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
    filterCustomersValue();
  }, [selectedCustomers]);

  useEffect(() => {
    if (data && data.fetchCustomers) {
      let rowsData = formatRows(data.fetchCustomers);
      setCustomers(data.fetchCustomers);
      // console.log('data: ', data);
    }
  }, [data]);

  //export data to csv
  // const headers = [
  //   { label: 'Number', key: 'id' },
  //   { label: 'Name', key: 'name' },
  //   { label: 'Date Created', key: 'createdAt' },
  //   { label: 'Status', key: 'status' },
  //   { label: 'Subscription', key: 'subscription' },
  //   { label: 'additionalContacts', key: 'additionalContacts' },
  // ];
  const headers = [
    { label: 'Number', key: 'id' },
    { label: 'firstName', key: 'firstName' },
    { label: 'lastName', key: 'lastName' },
    { label: 'Date Created', key: 'createdAt' },
    { label: 'Status', key: 'status' },
    { label: 'Subscription', key: 'subscription' },
    { label: 'additionalContacts.email', key: 'additionalContacts.email' },
    {
      label: 'additionalContacts.firstName',
      key: 'additionalContacts.firstName',
    },
    {
      label: 'additionalContacts.lastName',
      key: 'additionalContacts.lastName',
    },
    {
      label: 'additionalContacts.companyName',
      key: 'additionalContacts.companyName',
    },
    { label: 'additionalContacts.phone', key: 'additionalContacts.phone' },

    { label: 'billingAddress.firstName', key: 'billingAddress.firstName' },
    { label: 'billingAddress.lastName', key: 'billingAddress.lastName' },
    { label: 'billingAddress.email', key: 'billingAddress.email' },
    { label: 'billingAddress.company', key: 'billingAddress.company' },
    { label: 'billingAddress.phone', key: 'billingAddress.phone' },
    { label: 'billingAddress.language', key: 'billingAddress.language' },
    { label: 'billingAddress.city', key: 'billingAddress.city' },
  ];
  const fields = [
    'id',
    'firstName',
    'lastName',
    'email',
    'communication',
    'phone',
    'language',
    'autoCollection',
    'status',
    'subscription',

    'additionalContacts.id',
    'additionalContacts.email',
    'additionalContacts.firstName',
    'additionalContacts.lastName',
    'additionalContacts.companyName',
    'additionalContacts.phone',

    'billingAddress.firstName',
    'billingAddress.lastName',
    'billingAddress.email',
    'billingAddress.company',
    'billingAddress.phone',
    'billingAddress.address1',
    'billingAddress.address2',
    'billingAddress.city',
    'billingAddress.language',
    'billingAddress.zipCode',
  ];
  const transforms = [
    unwind({ paths: ['additionalContacts', 'billingAddress'] }),
  ];
  const json2csvParser = new Parser({ fields, transforms });
  let csv = json2csvParser.parse(dataSelected);

  //
  // const exportCSV = () => {
  const dataSelected = [...filterCustomers].filter((item) =>
    selectedCustomers.find((select) => select === item.id)
  );
  // };

  //import customer by csv:
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleCheckbox = useCallback((value) => setChecked(value), []);

  //upload file
  const [file, setFile] = useState();

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile((file) => acceptedFiles[0]),
    []
  );

  // const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <Stack>
      <Thumbnail size="small" alt={file.name} source={NoteMinor} />
      <div>
        {file.name} <Caption>{file.size} bytes</Caption>
      </div>
    </Stack>
  );
  //config

  const csvData = [];

  const parsedata =
    file &&
    Papa.parse(file, {
      header: false,
      step: function (result) {
        csvData.push(result.data);
      },
      complete: function (results, file) {
        // console.log('csvData: ', csvData);
      },
    });
  const handleImportCustomer = () => {
    const rcs = [];
    const tempData = csvData.slice(1);
    tempData?.map((item) => {
      const index = rcs.findIndex((customer) => customer.email == item[3]);

      if (index !== -1) {
        rcs[index].additionalContacts.push({
          // id: item[10],
          email: item[11],
          firstName: item[12],
          lastName: item[13],
          companyName: item[14],
          phone: item[15],
        });
      } else {
        rcs.push({
          // id: item[0],
          firstName: item[1],
          lastName: item[2],
          email: item[3],
          communication: item[4],
          phone: item[5],
          language: item[6],
          autoCollection: Boolean(item[7]),
          status: item[8],
          subscription: item[9],
          additionalContacts:
            item[11] === ''
              ? []
              : [
                {
                  email: item[11],
                  firstName: item[12],
                  lastName: item[13],
                  companyName: item[14],
                  phone: item[15],
                },
              ],
          billingAddress: {
            firstName: item[16],
            lastName: item[17],
            email: item[18],
            company: item[19],
            phone: item[20],
            address1: item[21],
            address2: item[22],
            city: item[23],
            language: item[24],
            zipCode: item[25],
          },
        });
      }
    });

    createCustomer({
      variables: {
        input: { params: rcs },
      },
    }).then((resp) => {
      // const errors = resp.errors;
      const data = resp.data;
      const errors = data.errors;

      if (errors) {
        setFormErrors(errors);
      } else {
        setSaveSuccess(true);
        refetch();
      }
    });
    setFile();
    // refetch();
  };
  const CREATE_CUSTOMER = gql`
    mutation($input: AddCustomersInput!) {
      addCustomers(input: $input) {
        result
      }
    }
  `;
  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  let activeArr = [],
    newArr = [],
    pausedArr = [],
    cancelledArr = [];
  if (selectedTab == 1 && filterCustomers.length !== 0) {
    filterCustomers?.map(res => {
      if (res.createdAt !== null && (new Date(Date.parse(res.createdAt)).toDateString()) === new Date(new Date().getTime()).toDateString()) {
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
    <AppLayout typePage="customers" tabIndex="2">
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
        <Page
          title="Customer Subscriptions"
          primaryAction={
            <ButtonGroup>
              <Button onClick={() => { }}>
                {dataSelected.length > 0 ? (
                  <CSVLink
                    data={json2csvParser.parse(dataSelected)}
                    filename={'customers.csv'}
                  >
                    Export
                  </CSVLink>
                ) : (
                  'Export'
                )}
              </Button>
              <Button
                onClick={() => {
                  toggleActive();
                  setFile();
                }}
              >
                Import Customer
              </Button>
              <div
                className={`${selectedCustomers.length === 0 ? 'hidden' : ''}`}
              >
                <ButtonRemove
                  selectedCustomers={selectedCustomers}
                  refetch={refetch}
                  setselectedCustomers={setselectedCustomers}
                />
              </div>
              <Button primary onClick={() => history.push('/customers/new')}>
                Add Customer
              </Button>
            </ButtonGroup>
          }
        >
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
                        return [...filterCustomers].sort(
                          (a, b) =>
                            Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
                        );
                      });
                      // console.log('filterCustomers--after', filterCustomers);
                    }}
                  >
                    <img src={swapIcon} />
                    Sort By last update (Newest First)
                  </Button>
                </div>
              </div>
              <div className={"table" + " " + selectedTab}>
                <DataTable
                  columnContentTypes={[
                    'text',
                    'numeric',
                    'numeric',
                    'numeric',
                    'text',
                  ]}
                  headings={[
                    'Id',
                    'Name',
                    'Date Created',
                    'Status',
                    'Product',
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
        </Page>
      </Frame>
      <Modal
        large
        open={active}
        onClose={toggleActive}
        title="Import customers by CSV"
        primaryAction={{
          content: 'Import customers',
          onAction: () => {
            toggleActive();
            handleImportCustomer();
            // parsedata;
          },
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => {
              toggleActive();
              setFile();
            },
          },
        ]}
      >
        <Modal.Section>
          <Stack vertical>
            <DropZone
              allowMultiple={false}
              onDrop={handleDropZoneDrop}
              accept=".csv"
              errorOverlayText="File type must be .csv"
              type="file"
            >
              {uploadedFile}
              {fileUpload}
            </DropZone>
            {/* <Checkbox
              checked={checked}
              label="Overwrite existing customers that have the same customer ID"
              onChange={handleCheckbox}
            /> */}
          </Stack>
        </Modal.Section>
      </Modal>
    </AppLayout>
  );
};

export default Customers;
