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
  TextField,
  Frame,
  Toast,
  List,
  Banner
} from '@shopify/polaris';

import {
  DeleteMajor,
  MobilePlusMajor,
  SearchMajor,
  MobileBackArrowMajor
} from '@shopify/polaris-icons';

import { gql, useMutation, useQuery } from '@apollo/client';

const ButtonRemove = (props) => {
  const {
    selectedCampaignsForRemove,
    setSelectedCampaignsForRemove,
    setFormErrors,
    formatRows,
    setCampaigns,
    setFilterCampaigns,
    setSaveSuccess,
  } = props;
  const DELETE_UPSELL_CAMPAIGN = gql`
    mutation($input: DeleteUpsellCampaignGroupsInput!) {
      deleteCampaigns(input: $input) {
        campaigns {
          id
          internalName
          status
          upsellCampaigns {
            id
            intervalCount
          }
        }
      }
    }
  `;

  const [
    deleteUpsellCampaign,
    { loading: deleting, error: deleteError },
  ] = useMutation(DELETE_UPSELL_CAMPAIGN);

  const handleRemoveCampaigns = () => {
    if (deleting) return;
    deleteUpsellCampaign({
      variables: {
        input: { params: selectedCampaignsForRemove },
      },
    }).then((resp) => {
      const errors = resp.data.errors;
      if (errors) {
        // setSaveSuccess(false);
        setFormErrors(errors);
      } else {
        const rowsData = formatRows(resp.data.deleteCampaigns.campaigns);
        setCampaigns(resp.data.deleteCampaigns.campaigns);
        setFilterCampaigns(rowsData);
        setSaveSuccess(true);
        setSelectedCampaignsForRemove([]);
      }
    });
  };

  return (
    <Button
      destructive
      icon={DeleteMajor}
      onClick={() => handleRemoveCampaigns()}
      loading={deleting}
    >
      Delete Campaign
    </Button>
  );
};

const Upsell = ({handleBack,handleForm}) => {
  const history = useHistory();

  const GET_UPSELL_CAMPAIGNS = gql`
    query {
      fetchCampaigns {
        id
        internalName
        status
        upsellCampaigns {
          id
          intervalCount
          intervalType
        }
      }
    }
  `;

  const [formErrors, setFormErrors] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const [campaigns, setCampaigns] = useState([]);
  const [filterCampaigns, setFilterCampaigns] = useState([]);

  const [campaignStatus, setCampaignStatus] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const filterCampaignsValue = () => {
    const rowsData = campaigns.filter((item) => {
      return (
        ((item.status === 'publish' && campaignStatus === 'active') ||
          (item.status !== 'publish' && campaignStatus === 'draft') ||
          campaignStatus === 'all' ||
          !campaignStatus) &&
        (item.internalName
          ?.toLowerCase()
          ?.includes(searchValue?.toLowerCase()) ||
          item.id === searchValue ||
          !searchValue)
      );
    });

    setFilterCampaigns(formatRows(rowsData));
  };

  const optionsCampaigns = [
    { label: 'All Campaigns', value: 'all' },
    { label: 'Active Campaigns', value: 'active' },
    { label: 'Draft Campaigns', value: 'draft' },
  ];

  const { data, loading, error, refetch } = useQuery(GET_UPSELL_CAMPAIGNS, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      let rowsData = formatRows(data.fetchCampaigns);

      setCampaigns(data.fetchCampaigns);
      setFilterCampaigns(rowsData);
    }
  }, [data]);

  const formatRows = (rows) => {
    return rows?.map((row) => [
      <Checkbox
        label={false}
        checked={selectedCampaignsForRemove.indexOf(row.id) != -1}
        onChange={(newChecked) =>
          handleChangeCheckedCampaigns(newChecked, row.id)
        }
      />,
      <div className="campaigns">
        <div className={`${row.status == 'publish' ? 'active' : 'draft'}`}>
          <Badge>{row.status == 'publish' ? 'Active' : 'Draft'}</Badge>
        </div>
        <Link onClick={()=>handleForm(row.id)} key={row.id}>
          {row.internalName}
        </Link>
      </div>,
      `${row.upsellCampaigns[0].intervalCount} ${row.upsellCampaigns[0].intervalType}`,
      <p className="money">
        <span>$130.00</span>USD
      </p>,
      'one-time',
      '0 Days',
    ]);
  };

  const [selectedCampaignsForRemove, setSelectedCampaignsForRemove] = useState(
    []
  );

  const handleChangeCheckedCampaigns = (newChecked, campaignId) => {
    if (newChecked) {
      setSelectedCampaignsForRemove([
        ...selectedCampaignsForRemove,
        campaignId,
      ]);
    } else {
      const index = selectedCampaignsForRemove.indexOf(campaignId);
      setSelectedCampaignsForRemove([
        ...selectedCampaignsForRemove.slice(0, index),
        ...selectedCampaignsForRemove.slice(index + 1),
      ]);
    }
  };

  useEffect(() => {
    filterCampaignsValue();
    setSelectedCampaignsForRemove([]);
  }, [searchValue, campaignStatus]);

  useEffect(() => {
    filterCampaignsValue();
  }, [selectedCampaignsForRemove]);

  return (
    <Frame>
        <Page>
          {saveSuccess && (
            <Toast
              content="Upsell campaign groups is deleted"
              onDismiss={hideSaveSuccess}
            />
          )}
          {formErrors.length > 0 && (
            <>
              <Banner
                title="Upsell campaign group could not be saved"
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
           <Layout>
                <Layout.Section>
                  <div className="back-button pointer" onClick={handleBack}>
                    <Icon
                      source={MobileBackArrowMajor}
                      color="base" />
                  </div>
                </Layout.Section>
            </Layout>
            <Layout.Section>
              <Stack>
                <Stack.Item>
                  <Select
                    label="Campaigns"
                    labelInline
                    options={optionsCampaigns}
                    onChange={(status) => {
                      setCampaignStatus(status);
                    }}
                    value={campaignStatus}
                  />
                </Stack.Item>
                <Stack.Item fill></Stack.Item>
                <Stack.Item>
                  <Stack>
                    <div
                      className={`${
                        selectedCampaignsForRemove.length === 0 ? 'hidden' : ''
                      }`}
                    >
                      <ButtonRemove
                        formatRows={formatRows}
                        setCampaigns={setCampaigns}
                        setFilterCampaigns={setFilterCampaigns}
                        setFormErrors={setFormErrors}
                        setSaveSuccess={setSaveSuccess}
                        selectedCampaignsForRemove={selectedCampaignsForRemove}
                        setSelectedCampaignsForRemove={
                          setSelectedCampaignsForRemove
                        }
                      />
                    </div>
                    <Button
                      primary
                      icon={MobilePlusMajor}
                      onClick={() => handleForm("")}
                    >
                      Create Campaign
                    </Button>
                  </Stack>
                </Stack.Item>
              </Stack>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <div className="search">
                  <label className="head-search">
                    {filterCampaigns.length} Campaigns
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
                    'Campaigns',
                    'Campaign Period',
                    'Created',
                    'Pricing Model',
                    'Trial Period',
                  ]}
                  rows={filterCampaigns}
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
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
  );
};

export default Upsell;
