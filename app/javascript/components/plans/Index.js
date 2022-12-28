import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AppLayout from '../layout/Layout';

import {
  Page,
  Button,
  Badge,
  Select,
  Card,
  Checkbox,
  DataTable,
  Layout,
  Stack,
  Icon,
  Spinner,
  Banner,
  TextField,
  List,
  Toast,
  Frame,
  ButtonGroup,
} from '@shopify/polaris';

import {
  DeleteMajor,
  MobilePlusMajor,
  SearchMajor,
} from '@shopify/polaris-icons';

import { gql, useMutation, useQuery } from '@apollo/client';
import Modals from './Modals';
import LoadingScreen from '../LoadingScreen';

const ButtonRemove = (props) => {
  const {
    selectedPlansForRemove,
    setSelectedPlansForRemove,
    setFormErrors,
    formatRows,
    setPlans,
    setFilterPlans,
    setSaveSuccess,
  } = props;
  const DELETE_SELLING_PLAN = gql`
    mutation($input: DeleteSellingPlanGroupsInput!) {
      deletePlans(input: $input) {
        sellingPlans {
          id
          name
          subscriptionModel
          price
          trialPeriod
          billingPeriod
          active
          planType
          sellingPlans {
            id
            name
            intervalType
            intervalCount
            trialIntervalType
            trialIntervalCount
          }
        }
      }
    }
  `;

  const [
    deleteSellingPlan,
    { loading: deleting, error: deleteError },
  ] = useMutation(DELETE_SELLING_PLAN);

  const handleRemovePlans = () => {
    if (deleting) return;
    deleteSellingPlan({
      variables: {
        input: { params: selectedPlansForRemove },
      },
    }).then((resp) => {
      const errors = resp.data.errors;
      if (errors) {
        // setSaveSuccess(false);
        setFormErrors(errors);
      } else {
        const rowsData = formatRows(resp.data.deletePlans.sellingPlans);
        setPlans(resp.data.deletePlans.sellingPlans);
        setFilterPlans(rowsData);
        setSaveSuccess(true);
        setSelectedPlansForRemove([]);
      }
    });
  };

  return (
    <Button
      destructive
      icon={DeleteMajor}
      onClick={() => handleRemovePlans()}
      loading={deleting}
    >
      Delete Plan
    </Button>
  );
};

const SellingPlans = () => {
  const history = useHistory();

  const GET_SELLING_PLANS = gql`
    query {
      fetchPlanGroups {
        id
        name
        subscriptionModel
        price
        trialPeriod
        billingPeriod
        active
        planType
        sellingPlans {
          id
          name
          intervalType
          intervalCount
          trialIntervalType
          trialIntervalCount
        }
      }
    }
  `;

  const [viewType, setViewType] = useState('regular');
  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const [plans, setPlans] = useState([]);
  const [filterPlans, setFilterPlans] = useState([]);

  const [planStatus, setPlanStatus] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const filterPlansValue = () => {
    const rowsData = plans.filter((item) => {
      return (
        ((item.active === true && planStatus === 'active') ||
          (item.active === false && planStatus === 'draft') ||
          planStatus === 'all' ||
          !planStatus) &&
        (item.name.toLowerCase().includes(searchValue?.toLowerCase()) ||
          item.id === searchValue ||
          !searchValue)
      );
    });

    setFilterPlans(formatRows(rowsData));
  };

  const optionsPlans = [
    { label: 'All Plans', value: 'all' },
    { label: 'Active Plans', value: 'active' },
    { label: 'Draft Plans', value: 'draft' },
  ];

  const viewTypes = [
    { label: 'Regular View', value: 'regular' },
    { label: 'Power View', value: 'power' }
  ];

  const [getStartedModal, setGetStartedModal] = useState(false);
  const { data, loading, error } = useQuery(GET_SELLING_PLANS, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      const rowsData = formatRows(data.fetchPlanGroups);
      setPlans(data.fetchPlanGroups);
      setFilterPlans(rowsData);
    }
  }, [data]);

  const generateLink = (type) => {
    if (viewType == 'power') {
      return 'power-view-plan';
    }
    switch (type) {
      case 'fixed_price': {
        return 'fixed-subscription-plans';
      }
      case 'free_trial': {
        return 'trial-subscription-plan';
      }
      case 'build_a_box': {
        return 'build-a-box-subscription-plan';
      }
      case 'mystery_box': {
        return 'mystery-box-subscription-plan';
      }
    }
  };

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() + 's'
  }

  const formatRows = (rows) => {
    return rows?.map((row) => [
      <Checkbox
        label={false}
        checked={selectedPlansForRemove.indexOf(row.id) != -1}
        onChange={(newChecked) => handleChangeCheckedPlans(newChecked, row.id)}
      />,
      <div className="plans">
        <Link to={`/${generateLink(row.planType)}/${row.id}`} key={row.id}>
          {row.name}
        </Link>
      </div>,
      `${row.sellingPlans[0].intervalCount} ${capitalize(row.sellingPlans[0].intervalType)}`,
      row.price,
      <Badge status={row.active ? 'success' : 'attention'}>{row.active ? 'Active' : 'Draft'}</Badge>
      ,
      row.subscriptionModel,
      row.planType === 'fixed_price'
        ? '0 Days'
        : `${row.sellingPlans[0].trialIntervalCount} ${capitalize(row.sellingPlans[0].trialIntervalType)}`,
    ]);
  };

  const [selectedPlansForRemove, setSelectedPlansForRemove] = useState([]);

  const handleChangeCheckedPlans = (newChecked, planId) => {
    if (newChecked) {
      setSelectedPlansForRemove([...selectedPlansForRemove, planId]);
    } else {
      const index = selectedPlansForRemove.indexOf(planId);
      setSelectedPlansForRemove([
        ...selectedPlansForRemove.slice(0, index),
        ...selectedPlansForRemove.slice(index + 1),
      ]);
    }
  };

  useEffect(() => {
    filterPlansValue();
    setSelectedPlansForRemove([]);
  }, [searchValue, planStatus, viewType]);

  useEffect(() => {
    filterPlansValue();
  }, [selectedPlansForRemove]);

  return (
    <AppLayout typePage="sellingPlansList" tabIndex="1">
      <Frame>
        <Page title={<div className='pageTitle'>Subscription Plans</div>}>
          <Layout>
            {saveSuccess && (
              <Toast
                content="Selling plan groups is deleted"
                onDismiss={hideSaveSuccess}
              />
            )}
            {formErrors.length > 0 && (
              <>
                <Banner
                  title="Selling plan group could not be saved"
                  status="critical"
                >
                  <List type="bullet">
                    {formErrors.map((message, index) => (
                      <List.Item key={index}>{message.message}</List.Item>
                    ))}
                  </List>
                </Banner>
                <br />
              </>
            )}
            <Layout.Section>
              <Stack>
                {/* <Stack.Item>
                  <Select
                    label="Plans"
                    labelInline
                    options={optionsPlans}
                    onChange={(status) => {
                      setPlanStatus(status);
                    }}
                    value={planStatus}
                  />
                </Stack.Item>
                <Stack.Item>
                  <Select
                    label="View"
                    labelInline
                    options={viewTypes}
                    onChange={setViewType}
                    value={viewType}
                  />
                </Stack.Item> */}
                <Stack.Item fill></Stack.Item>
                <Stack.Item>
                  <Stack>
                    <div
                      className={`${selectedPlansForRemove.length === 0 ? 'hidden' : ''
                        }`}
                    >
                      <ButtonRemove
                        formatRows={formatRows}
                        setPlans={setPlans}
                        setFilterPlans={setFilterPlans}
                        setFormErrors={setFormErrors}
                        setSaveSuccess={setSaveSuccess}
                        selectedPlansForRemove={selectedPlansForRemove}
                        setSelectedPlansForRemove={setSelectedPlansForRemove}
                      />
                    </div>
                    <Button
                      primary
                      icon={MobilePlusMajor}
                      onClick={() => history.push('/fixed-subscription-plans')}
                    >
                      Create Plan
                    </Button>
                  </Stack>
                </Stack.Item>
              </Stack>
            </Layout.Section>
            <Layout.Section>
              <Card
                title={<div className="heading_title">
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.30664 16.382C5.64501 16.8989 6.04378 17.3774 6.49667 17.8067C7.61886 18.8703 9.02523 19.586 10.5456 19.8671C12.066 20.1481 13.6353 19.9826 15.0636 19.3905C16.4919 18.7984 17.718 17.8051 18.5936 16.5307C19.4692 15.2564 19.9567 13.7556 19.9972 12.21C20.0378 10.6644 19.6295 9.14011 18.8219 7.82164C18.0143 6.50317 16.8419 5.44698 15.4466 4.78086C14.5023 4.33005 13.4832 4.07098 12.4479 4.01291L13.0031 6.08481C13.5482 6.17724 14.0808 6.34506 14.5849 6.58574C15.6314 7.08533 16.5107 7.87747 17.1164 8.86632C17.7221 9.85517 18.0283 10.9984 17.9979 12.1576C17.9675 13.3168 17.6019 14.4424 16.9452 15.3981C16.2885 16.3539 15.3689 17.0989 14.2977 17.543C13.2265 17.9871 12.0495 18.1112 10.9092 17.9004C9.76892 17.6896 8.71415 17.1528 7.8725 16.3551C7.69677 16.1885 7.53189 16.0121 7.37854 15.8269L5.30664 16.382Z" fill="white" />
                    <path d="M5.91239 4.06647C6.68924 3.47037 7.54796 2.99272 8.46042 2.64739C8.87978 2.48868 9.08946 2.40932 9.28694 2.51053C9.48442 2.61174 9.54649 2.84338 9.67063 3.30667L11.7412 11.0341C11.8632 11.4894 11.9242 11.7171 11.8206 11.8964C11.7171 12.0758 11.4894 12.1368 11.0341 12.2588L3.30667 14.3294C2.84338 14.4535 2.61174 14.5156 2.42535 14.3952C2.23896 14.2747 2.20284 14.0535 2.13061 13.6109C1.97344 12.6481 1.95774 11.6656 2.08555 10.6947C2.25696 9.39275 2.68314 8.13728 3.33975 7C3.99636 5.86272 4.87054 4.8659 5.91239 4.06647Z" stroke="white" stroke-width="2" />
                  </svg>
                  </span>Manage Plans</div>}
                actions={{
                  content:
                    <div className='tabButtons'>
                      <ButtonGroup>
                        <Button
                          onClick={() => {
                            setPlanStatus("all");
                          }}
                          primary={planStatus === "all" ? true : false}
                        >
                          All Plans</Button>
                        <Button
                          onClick={() => {
                            setPlanStatus("active");
                          }}
                          primary={planStatus === "active" ? true : false}
                        >Active Plans</Button>
                        <Button
                          onClick={() => {
                            setPlanStatus("draft");
                          }}
                          primary={planStatus === "draft" ? true : false}
                        >Draft Plans</Button>
                        <Button
                          onClick={() => {
                            setViewType(viewType == "regular" ? "power" : "regular");
                          }}
                        >{viewType == "regular" ? "Regular" : "Power"} Mode</Button>
                      </ButtonGroup>
                    </div>
                }}
              >
                <Card.Section>
                  <div className="search_plan_div">
                    {/* <label className="head-search">
                      {filterPlans.length} Plans
                    </label> */}
                    <TextField
                      value={searchValue}
                      onChange={(value) => setSearchValue(value)}
                      prefix={<Icon source={SearchMajor} color="inkLighter" />}
                      placeholder="Search for Name"
                    />
                  </div>

                  <DataTable
                    columnContentTypes={[
                      'text',
                      'text',
                      'text',
                      'text',
                      'text',
                      'text',
                    ]}
                    headings={[
                      '',
                      'Plans',
                      'Billing Period',
                      'Price',
                      'Status',
                      'Subscription  Model',
                      'Trial Period',
                    ]}
                    rows={filterPlans}
                    sortable={[false, false, true, false, false, false]}
                    defaultSortDirection="descending"
                    initialSortColumnIndex={1}
                  />
                  {loading && (
                    <LoadingScreen />
                  )}
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>

        <Modals
          history={history}
          active={getStartedModal}
          setActive={setGetStartedModal}
        />
      </Frame>
    </AppLayout >
  );
};

export default SellingPlans;
