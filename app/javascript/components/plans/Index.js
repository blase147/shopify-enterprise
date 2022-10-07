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

  const [planStatus, setPlanStatus] = useState('');
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
        <div className={`${row.active ? 'active' : 'draft'}`}>
          <Badge>{row.active ? 'Active' : 'Draft'}</Badge>
        </div>
        <Link to={`/${generateLink(row.planType)}/${row.id}`} key={row.id}>
          {row.name}
        </Link>
      </div>,
      `${row.sellingPlans[0].intervalCount} ${capitalize(row.sellingPlans[0].intervalType)}`,
      row.price,
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
        <Page>
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
          <Layout>
            <Layout.Section>
              <Stack>
                <Stack.Item>
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
                </Stack.Item>
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
              <Card>
                <div className="search">
                  <label className="head-search">
                    {filterPlans.length} Plans
                  </label>
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
    </AppLayout>
  );
};

export default SellingPlans;
