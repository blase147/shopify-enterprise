import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
  TextField,
  Frame,
  Toast,
  List,
  Banner,
} from '@shopify/polaris';
import {
  DeleteMajor,
  MobilePlusMajor,
  SearchMajor,
  MobileBackArrowMajor,
} from '@shopify/polaris-icons';

import { gql, useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';

import AppLayout from '../layout/Layout';
const ButtonRemove = (props) => {
  const {
    selectedMenusForRemove,
    setSelectedMenusForRemove,
    setFormErrors,
    formatRows,
    setMenus,
    setFilterMenus,
    setSaveSuccess,
    menus,
    filteredMenus,
  } = props;
  const DELETE_WEEKLY_MENUS = gql`
    mutation ($input: DeleteWeeklyMenusInput!) {
      deleteWeeklyMenus(input: $input) {
        cutoffDate
        week
        displayName
        boxSubscriptionType
      }
    }
  `;

  const [deleteWeeklyMenu, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_WEEKLY_MENUS);

  const handleRemoveMenus = () => {
    if (deleting) return;
    deleteWeeklyMenu({
      variables: {
        input: { params: selectedMenusForRemove },
      },
    }).then((resp) => {
      const errors = resp.data.errors;
      if (errors) {
        // setSaveSuccess(false);
        setFormErrors(errors);
      } else {
        let updatedMenus = menus.filter(menu => !selectedMenusForRemove.includes(menu.id));
        const rowsData = formatRows(
          updatedMenus
        );
        setMenus(updatedMenus);
        setFilterMenus(rowsData);
        setSaveSuccess(true);
        setSelectedMenusForRemove([]);
      }
    });
  };

  return (
    <Button
      destructive
      icon={DeleteMajor}
      onClick={() => handleRemoveMenus()}
      loading={deleting}
    >
      Delete Menu
    </Button>
  );
};

const Index = ({ handleForm, handleBack }) => {
  const history = useHistory();

  const GET_WEEKLY_MENUS = gql`
    query {
      fetchWeeklyMenus {
        id
        displayName
        cutoffDate
        week
        boxSubscriptionType
      }
    }
  `;

  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const [menus, setMenus] = useState([]);
  const [filterMenus, setFilterMenus] = useState([]);

  const [menuStatus, setMenuStatus] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const filterMenusValue = () => {
    const rowsData = menus.filter((item) => {
      return (
        ((item.status === 'publish' && menuStatus === 'active') ||
          (item.status !== 'publish' && menuStatus === 'draft') ||
          menuStatus === 'all' ||
          !menuStatus) &&
        (item.displayName
          ?.toLowerCase()
          ?.includes(searchValue?.toLowerCase()) ||
          item.id === searchValue ||
          !searchValue)
      );
    });
    setFilterMenus(formatRows(rowsData));
  };

  const optionsMenus = [
    { label: 'All Menus', value: 'all' },
    { label: 'Active Menus', value: 'active' },
    { label: 'Draft Menus', value: 'draft' },
  ];

  const { data, loading, error, refetch } = useQuery(GET_WEEKLY_MENUS, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      let rowsData = formatRows(data.fetchWeeklyMenus);

      setMenus(data.fetchWeeklyMenus);
      setFilterMenus(rowsData);
    }
  }, [data]);

  const formatRows = (rows) => {
    return rows?.map((row) => [
      <Checkbox
        label={false}
        checked={selectedMenusForRemove.indexOf(row.id) != -1}
        onChange={(newChecked) =>
          handleChangeCheckedMenus(newChecked, row.id)
        }
      />,
      <div className="menus">
        <Link key={row.id} onClick={() => handleForm(row.id)} to='#'>
          {row.displayName}
        </Link>
      </div>,
      `${_.startCase(row.location?.split('_').join(' '))}`,
    ]);
  };

  const [selectedMenusForRemove, setSelectedMenusForRemove] = useState(
    []
  );

  const handleChangeCheckedMenus = (newChecked, menuId) => {
    if (newChecked) {
      setSelectedMenusForRemove([
        ...selectedMenusForRemove,
        menuId,
      ]);
    } else {
      const index = selectedMenusForRemove.indexOf(menuId);
      setSelectedMenusForRemove([
        ...selectedMenusForRemove.slice(0, index),
        ...selectedMenusForRemove.slice(index + 1),
      ]);
    }
  };

  useEffect(() => {
    filterMenusValue();
    setSelectedMenusForRemove([]);
  }, [searchValue, menuStatus]);

  useEffect(() => {
    filterMenusValue();
  }, [selectedMenusForRemove]);

  return (
    <Frame>
      {saveSuccess && (
        <Toast
          content="Weekly menu is deleted"
          onDismiss={hideSaveSuccess}
        />
      )}
      {formErrors.length > 0 && (
        <>
          <Banner
            title="Weekly menu could not be saved"
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
          <div className="back-button pointer" onClick={handleBack}>
            <Icon source={MobileBackArrowMajor} color="base" />
          </div>
        </Layout.Section>
        <Layout.Section>
          <Stack>
            <Stack.Item>
            </Stack.Item>
            <Stack.Item fill></Stack.Item>
            <Stack.Item>
              <Stack>
                <div
                  className={`${
                    selectedMenusForRemove.length === 0 ? 'hidden' : ''
                  }`}
                >
                  <ButtonRemove
                    menus={menus}
                    filteredCompaigns={filterMenus}
                    formatRows={formatRows}
                    setMenus={setMenus}
                    setFilterMenus={setFilterMenus}
                    setFormErrors={setFormErrors}
                    setSaveSuccess={setSaveSuccess}
                    selectedMenusForRemove={selectedMenusForRemove}
                    setSelectedMenusForRemove={
                      setSelectedMenusForRemove
                    }
                  />
                </div>
                <Button
                  primary
                  icon={MobilePlusMajor}
                  onClick={() => handleForm('')}
                >
                  Create Weekly Menu
                </Button>
              </Stack>
            </Stack.Item>
          </Stack>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Card.Section>
              <div className="search">
                <label className="head-search">
                  {filterMenus && filterMenus.length} Menus
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
                  // 'text',
                  // 'text',
                  // 'text',
                ]}
                headings={[
                  '',
                  'Menus',
                  'Location',
                  // 'Created',
                  // 'Pricing Model',
                  // 'Trial Period',
                ]}
                rows={filterMenus ? filterMenus : []}
                sortable={[false, false, true, false, false, false]}
                defaultSortDirection="descending"
                initialSortColumnIndex={1}
              />
              {loading && (
                <Spinner
                  accessibilityLabel="Spinner example"
                  size="large"
                  color="teal"
                />
              )}
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Frame>
  );
};

export default Index;
