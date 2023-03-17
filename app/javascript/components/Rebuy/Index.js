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
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useHistory } from 'react-router-dom';
import swapIcon from '../../../assets/images/icons/swap.svg';
import AppLayout from '../layout/Layout';
import moment from 'moment';
import { Pagination } from "@shopify/polaris";
import LoadingScreen from '../LoadingScreen';
import HeaderButtons from '../HeaderButtons/HeaderButtons';
import PixelIcon from '../../images/PixelIcon';
import { DomainContext } from '../domain-context';


// import json2csv from 'json2csv';
const subscriptions = ['active', 'new', 'returning', 'paused', 'cancelled', 'all'];

const {
  Parser,
  transforms: { unwind },
} = require('json2csv');

// let sortOrder = 0;


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
        refetch({
          variables: {
            page: page.toString()
          }
        }).then(() => setselectedCustomers([]));
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

const Rebuy = ({ shopifyDomain }) => {
  const { domain } = useContext(DomainContext);
  const history = useHistory();
  // Start Tabs
  const [headerButton, setHeaderButton] = useState("auto")

  useEffect(() => {
    setPage(1)
    setStatus(headerButton)
  },
    [headerButton]
  );
  const headerButtons = [
    {
      val: 'Auto',
      name: 'Auto',
    },
    {
      val: 'All products',
      name: 'All products',
    },
    {
      val: 'Collection',
      name: 'Collection',
    },
    {
      val: 'Product',
      name: 'Product',
    }
  ];
  // End tabs
  const [sortOrder, setSortOrder] = useState(0);

  const [moneySpent, setMoneySpent] = useState(null);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(false);

  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
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

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [status, setStatus] = useState("active");
  const [searchQuery, setSearchQuery] = useState();
  // -------------------
  const GETBUNDLES = gql`
    query($page: String) {
      fetchRebuyMenus(page: $page) {
        rebuyMenus{
          id
          createdAt
          status
          rebuyType
          intervalType
          intervalCount
          rebuyOffersGenerated
          rebuyOffersConversion
        }
        totalPages
        totalCount
        pageNumber
      }
    }
  `;
  const { data, loading, error, refetch } = useQuery(GETBUNDLES, {
    fetchPolicy: 'no-cache',
    variables: {
      page: page.toString(),
    },

  });

  useEffect(() => {
    refetch({
      variables: {
        page: page.toString()
      }
    });
  }, [page]);

  const handleFiltersQueryChange = (value) => {
    console.log("fsdafdsafdfwe", value, value.length);
    setQueryValue(value)
    if (value.length > 1) {
      setSearchQuery(value)
    } else {
      setSearchQuery()
    }
  }

  useEffect(() => {
    setTotalPages(data?.fetchRebuyMenus?.rebuyMenus)
    if (+page < +totalPages) {
      setHasMore(true);
    }
    else {
      setHasMore(false)
    }
    if (+page <= 1) {
      setHasPrevious(false)
    }
    else {
      setHasPrevious(true)
    }
  }, [data]);


  const filterCustomersValue = () => {
    const rowsData = customers.filter((item) => {
      return (
        (item.subscription === headerButton || (headerButton === 'paused') ||
          (headerButton === 'active') || (headerButton === 'returning') || (headerButton === 'cancelled') || (headerButton === 'new') || (headerButton === 'all')) &&
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
    let apiData;
    return rows?.map((row) => {
      return row?.id !== null ?
        [
          row.createdAt,
          <a onClick={() => history.push("/createRebuy/" + row?.id)}>
            <div className='frequency'>
              {`${row?.intervalCount} ${row.intervalType}`}
            </div>
          </a>,
          row.status,
          row.rebuyOffersGenerated,
          row.rebuyOffersConversion,
        ] : []
    });
  };
  const [customers, setCustomers] = useState([]);
  const [filterCustomers, setFilterCustomers] = useState([]);


  // useEffect(() => {
  //   filterCustomersValue();
  // }, [selectedCustomers]);

  useEffect(() => {
    if (data && data.fetchRebuyMenus) {
      let rowsData = formatRows(data.fetchRebuyMenus?.rebuyMenus);
      setCustomers(data.fetchRebuyMenus?.rebuyMenus);
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
        refetch({
          variables: {
            page: page.toString()
          }
        });
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
        {loadingScreen && (
          <>
            <LoadingScreen />
          </>
        )}
        <Page
          title="Rebuy"
          primaryAction={
            <ButtonGroup>
              <Button onClick={() => history.push("/createRebuy")}>
                Create Rebuy
              </Button>
              {/*<Button
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
              </Button>*/}
            </ButtonGroup>
          }
        >
          <Card
            title={<div className="heading_title">
              <PixelIcon />
              Rebuy Offers</div>}
          >
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
              <div className={"table customer-subscription-tbl" + " "}>
                <DataTable
                  columnContentTypes={[
                    'text',
                    'text',
                    'text',
                    'text'
                  ]}
                  headings={[
                    'Date of creation',
                    'Frequency',
                    'Status',
                    'Rebuy offers generated',
                    'Rebuy offers conversions'
                  ]}

                  rows={formatRows(customers)}
                />
              </div>
              {loading && (
                <Spinner />
              )}
              <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                <Pagination
                  hasPrevious={hasPrevious}
                  onPrevious={() => {
                    setPage((prev) => +prev - 1)
                  }}
                  hasNext={hasMore}
                  onNext={() => {
                    setPage((prev) => +prev + 1)
                  }}
                />
              </div>
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
    </>
  );
};

export default Rebuy;
