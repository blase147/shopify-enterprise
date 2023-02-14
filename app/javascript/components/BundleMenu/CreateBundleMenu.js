import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { Link, useHistory, useParams } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import offerImg from '../../../assets/images/upsell/offerImage.svg';
import DeleteSVG from '../../../assets/images/delete.svg';
import removeIcon from '../../../assets/images/subscriptionsPlans/removeProduct.svg';
import './index.css';
import {
  Card,
  Button,
  Form,
  FormLayout,
  TextField,
  TextContainer,
  Frame,
  ContextualSaveBar,
  Select,
  Subheading,
  Toast,
  Banner,
  List,
  Page,
  ButtonGroup,
  TextStyle,
  Checkbox,
  Stack,
  Heading,
  Spinner,
  Autocomplete,
} from '@shopify/polaris';
import SearchCollection from '../plans/SearchCollection';
import SearchProduct from '../plans/SearchProduct';
import SearchPlan from '../upsell/SearchPlan';
import RangePickr from './RangePickr';
import LoadingScreen from '../LoadingScreen';
import PixelIcon from '../../images/PixelIcon';

const CreateBundleMenu = () => {
  var id;
  var handleClose = () => {

  }
  const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());
  const [canceledProducts, setCanceledProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [updated, setUpdated] = useState(false);

  const locationOptions = [
    { label: 'Customer Portal', value: 'customer_portal' },
    { label: 'Huron', value: 'huron' },
  ];

  const triggerOptions = [
    {
      label: 'Customer is subscribed to subscription plan',
      value: 'customer_is_subscribed_to_subscription_plan',
    },
  ];

  const initialValues = {
    title: '',
    bundleStyle: 'huron',
    subheadingI: '',
    subheadingIi: '',
    subheadingIii: '',
    sellingPlans: '',
    sellingPlanIds: '',
    productImages: '',
    collectionImages: '',
    breakPointPriceI: '',
    breakPointPriceIi: '',
    breakPointPriceIii: '',
    numberOfOptions: '',
    freeProductCollections: '',
    freeProductsImages: '',
    buildABoxCampaign: {
      startDate: '',
      endDate: '',
      boxQuantityLimit: 0,
      boxSubscriptionType: '',
      triggers: 'customer_is_subscribed_to_subscription_plan',
      sellingPlans: [],
      collectionImages: [],
      productImages: [],
    },
  };

  const [formErrors, setFormErrors] = useState([]);
  const [campaignData, setCampaignData] = useState(null);
  const [checkboxDisabled, setcheckboxDisabled] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingUpsellCampaign = useCallback((values, index) => {
    const campaigns = [...(values.upsellCampaigns || [])];
    campaigns[index]._destroy = true;
    return campaigns;
  });

  const handleAddUpsellCampaign = useCallback((values) => {
    const campaigns = [...(values.upsellCampaigns || [])];
    campaigns.push(initialValues.upsellCampaigns[0]);

    return campaigns;
  });

  const validationSchema = yup.object().shape({
    // publicName: yup.string().required().label('Public name'),
    // selectorTitle: yup.string().required().label('Campaign selector title'),
    // upsellCampaigns: yup.array().of(
    //   yup.object().shape({
    //     name: yup.string().required().label('Name'),
    //     selectorLabel: yup.string().required().label('Plan selector label'),
    // ruleCartValue: yup.object().shape({
    //   productId: yup.string().label('Only select'),
    // }),
    // productOffer: yup.object().shape({
    //   productId: yup.string().required().label('Only select'),
    // }),
    // ruleCustomerValue: yup.object().shape({
    //   sellingPlanId: yup.string().required().label('Only select'),
    // }),
    //   })
    // ),
  });

  const GET_UPSELL_CAMPAIGN = gql`
    query ($id: ID!) {
      fetchBuildABoxCampaignGroup(id: $id) {
        id
        internalName
        location
        buildABoxCampaign {
          id
          startDate
          endDate
          displayName
          boxQuantityLimit
          boxSubscriptionType
          triggers {
            name
          }
          sellingPlans {
            sellingPlanId
            sellingPlanName
          }
          collectionImages {
            collectionId
            collectionTitle
            _destroy
            products {
              productId
              image
              _destroy
            }
          }
          productImages {
            productId
            image
            _destroy
          }
        }
      }
    }
  `;
  // const { id } = useParams();

  const [getUpsell, { data, loading, error }] = useLazyQuery(
    GET_UPSELL_CAMPAIGN,
    {
      variables: { id: id },
      fetchPolicy: 'no-cache',
    }
  );

  useEffect(() => {
    if (id) {
      getUpsell();
    }
  }, []);

  const UPDATE_BOX_CAMPAIGN = gql`
    mutation ($input: UpdateBuildABoxCampaignGroupInput!) {
      updateBoxCampaign(input: $input) {
        campaign {
          id
          internalName
        }
      }
    }
  `;
  const [updateBoxCampaign] = useMutation(UPDATE_BOX_CAMPAIGN);

  const CREATE_BUNDLE_MENU = gql`
    mutation ($input: AddBundleMenuInput!) {
      addBundleMenu(input: $input) {
        bundleMenu{
          id
        }
      }
    }
  `;

  const history = useHistory();
  const [createUpsellCampaign] = useMutation(CREATE_BUNDLE_MENU);

  const formRef = useRef(null);

  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [selectedCollectionOptions, setSelectedCollectionOptions] = useState(
    []
  );
  const [selectedCollections, setSelectedCollections] = useState([]);

  const handleRemoveProduct = (index) => {
    setUpdated(true);
    setSelectedProducts(() => {
      let newSelectedProduct = [...(selectedProducts || [])];
      newSelectedProduct[index]._destroy = true;
      return newSelectedProduct;
    });
    setSelectedProductOptions([
      ...selectedProductOptions.slice(0, index),
      ...selectedProductOptions.slice(index + 1),
    ]);
  };

  const handleRemoveCollectionProduct = (collectionIndex, productIndex) => {
    setUpdated(true);
    setSelectedCollections(() => {
      let newSelectedCollection = [...(selectedCollections || [])];
      newSelectedCollection[collectionIndex].products[
        productIndex
      ]._destroy = true;
      return newSelectedCollection;
    });
  };

  useEffect(() => {
    if (
      selectedProducts &&
      formRef.current &&
      formRef.current?.values.buildABoxCampaign.productImages !=
      selectedProducts
    ) {
      formRef.current.setFieldValue(
        'buildABoxCampaign.productImages',
        selectedProducts
      );
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (
      selectedCollections &&
      formRef.current &&
      formRef.current?.values.buildABoxCampaign.collectionImages !=
      selectedCollections
    ) {
      formRef.current.setFieldValue(
        'buildABoxCampaign.collectionImages',
        selectedCollections
      );
    }
  }, [selectedCollections]);

  //// All Search Plans
  const [allSelectedPlans, setAllSelectedPlans] = useState([]);

  const handleRemovePlan = (id) => {
    setUpdated(true);
    setAllSelectedPlans(
      allSelectedPlans.filter((plan) => plan.sellingPlanId !== id)
    );
  };

  useEffect(() => {
    if (data && data?.fetchBuildABoxCampaignGroup) {
      data.fetchBuildABoxCampaignGroup.buildABoxCampaign.triggers =
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.triggers[0]?.name; //Manipulate later
      data.fetchBuildABoxCampaignGroup.buildABoxCampaign.endDate =
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.endDate || '';
      data.fetchBuildABoxCampaignGroup.buildABoxCampaign.startDate =
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.startDate || '';
      setCampaignData(data.fetchBuildABoxCampaignGroup);
      setSelectedProducts(
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.productImages
      );
      setSelectedProductOptions(() => {
        const defaultOption = [];
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.productImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.productId)
        );
        return defaultOption;
      });
      setSelectedCollections(
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.collectionImages
      );
      setSelectedCollectionOptions(() => {
        const defaultOption = [];
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.collectionImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.collectionId)
        );
        return defaultOption;
      });
      setAllSelectedPlans(
        data.fetchBuildABoxCampaignGroup.buildABoxCampaign.sellingPlans
      );
    }
  }, [data]);

  return (
    <Frame>
      <Page
        title="Create Bundle Menu"
        breadcrumbs={[
          {
            content: 'Build a box Campaigns',
            onAction: () => handleClose(),
          },
        ]}
      >
        {loading && id && (
          <LoadingScreen />
        )}
        {(campaignData || !id) && (
          <Formik
            validationSchema={validationSchema}
            initialValues={campaignData || initialValues}
            innerRef={formRef}
            onSubmit={(values, { setSubmitting }) => {
              const formData = { ...values };
              formData.collectionImages = selectedCollections;
              formData.productImages = selectedProducts;
              formData.sellingPlans = allSelectedPlans;
              // Manipulate later
              // formData.upsellCampaigns[0].productOffer = allProducts;
              if (id) {
                updateBoxCampaign({
                  variables: {
                    input: { params: formData },
                  },
                })
                  .then((resp) => {
                    const data = resp.data;
                    const errors = data.errors;
                    if (errors) {
                      setFormErrors(errors);
                      setSubmitting(false);
                    } else {
                      // setSaveSuccess(true);
                      handleClose();
                    }
                  })
                  .catch((error) => {
                    setSubmitting(false);
                    setFormErrors(error);
                  });
              } else {
                //const variables = formatUpsellCampaignGroup(values);
                createUpsellCampaign({
                  variables: { input: { params: formData } },
                })
                  .then((resp) => {
                    const data = resp.data;
                    const errors = data.errors;
                    if (errors) {
                      setFormErrors(errors);
                      setSubmitting(false);
                    } else {
                      // setSaveSuccess(true);
                      handleClose();
                    }
                  })
                  .catch((error) => {
                    setSubmitting(false);
                    setFormErrors(error);
                  });
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
              dirty,
              formik,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                {(dirty || updated) && (
                  <ContextualSaveBar
                    message="Unsaved changes"
                    saveAction={{
                      onAction: handleSubmit,
                      loading: isSubmitting,
                      disabled: false,
                    }}
                    discardAction={{
                      onAction: () => {
                        //   canceledProducts.map(prod => {
                        //     allProducts.push(prod)
                        //   });

                        //   setAllProducts(allProducts);
                        //   setCanceledProducts(prod => prod = []);
                        setUpdated((flag) => (flag = false));
                        resetForm();
                      },
                    }}
                  />
                )}

                {saveSuccess && (
                  <Toast
                    content="Upsell campaign group is saved"
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
                <div className="build-a-box-create">
                  <Card title={
                    <div className="heading_title">
                      <PixelIcon />
                      Create Bundle Menu
                    </div>} sectioned>
                    <Card.Section>
                      <FormLayout>
                        <FormLayout.Group>
                          <div>
                            <TextField
                              value={values?.title}
                              label="Title"
                              placeholder="Title"
                              type="text"
                              error={touched.title && errors.title}
                              onChange={(e) => {
                                setFieldValue(`title`, e);
                              }}
                              helpText={
                                <span>
                                  Title of the bundle menu
                                </span>
                              }
                            />
                          </div>
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <div>
                            <TextField
                              value={values?.subheadingI}
                              label="Subheading I"
                              placeholder="Subheading I"
                              type="text"
                              error={touched.subheadingI && errors.subheadingI}
                              onChange={(e) => {
                                setFieldValue(`subheadingI`, e);
                              }}
                              helpText={
                                <span>
                                  Subheading I of the bundle menu
                                </span>
                              }
                            />
                          </div>
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <div>
                            <TextField
                              value={values?.subheadingIi}
                              label="Subheading II"
                              placeholder="Subheading II"
                              type="text"
                              error={touched.subheadingIi && errors.subheadingIi}
                              onChange={(e) => {
                                setFieldValue(`subheadingIi`, e);
                              }}
                              helpText={
                                <span>
                                  Subheading II of the bundle menu
                                </span>
                              }
                            />
                          </div>
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <div>
                            <TextField
                              value={values?.subheadingIii}
                              label="subheading III"
                              placeholder="subheading III"
                              type="text"
                              error={touched.subheadingIii && errors.subheadingIii}
                              onChange={(e) => {
                                setFieldValue(`subheadingIii`, e);
                              }}
                              helpText={
                                <span>
                                  Subheading III of the bundle menu
                                </span>
                              }
                            />
                          </div>
                        </FormLayout.Group>
                        <FormLayout>
                          <FormLayout.Group>
                            <Select
                              options={locationOptions}
                              label="Choose bundle style"
                              value={values.bundleStyle}
                              error={touched.bundleStyle && errors.bundleStyle}
                              onChange={(e) => setFieldValue(`bundleStyle`, e)}
                              helpText={
                                <span>

                                </span>
                              }
                            />
                          </FormLayout.Group>
                        </FormLayout>
                        {/* <FormLayout.Group>
                          <div>
                            <TextContainer>
                              <h4>
                                <strong>DISPLAY RULES</strong>
                              </h4>
                              <h5>
                                Show these offers when any of the following
                                individual criteria are met
                              </h5>
                            </TextContainer>
                            <br />
                            <div className="date-range-label">
                              <TextContainer>
                                <Subheading element="h3">
                                  Campaign Duration:
                                </Subheading>
                              </TextContainer>
                            </div>
                            <RangePickr
                              startLabel={'buildABoxCampaign.startDate'}
                              endLabel={'buildABoxCampaign.endDate'}
                              setFieldValue={setFieldValue}
                              start={values?.buildABoxCampaign?.startDate || ''}
                              end={values?.buildABoxCampaign?.endDate || ''}
                            />
                          </div>
                          <br />
                        </FormLayout.Group> */}
                      </FormLayout>
                    </Card.Section>
                    {/* <Card.Section>
                      <FormLayout>
                        <Select
                          options={triggerOptions}
                          label="Triggers"
                          value={values?.buildABoxCampaign?.triggers}
                          error={
                            touched.buildABoxCampaign?.triggers &&
                            errors.buildABoxCampaign?.triggers
                          }
                          onChange={(e) =>
                            setFieldValue(`buildABoxCampaign.triggers`, e)
                          }
                          helpText={
                            <span>
                              Add a trigger to target the box campaign to
                              specific customers and orders.
                            </span>
                          }
                        />
                      </FormLayout>
                    </Card.Section> */}

                    <Card.Section>
                      <FormLayout>
                        <FormLayout.Group>
                          <div className="build-box-search">
                            <TextContainer>
                              <Subheading>Subscription Plan(s)</Subheading>
                            </TextContainer>
                            <Select
                              options={[{ label: 'is any', value: 'is_any' }]}
                              label=""
                              value={'is_any'}
                            />

                            <div className="search">
                              <SearchPlan
                                idForTextField={`serchPlan-${Math.random()}`}
                                value={values.buildABoxCampaign?.sellingPlans}
                                setFieldValue={setFieldValue}
                                fieldName={`sellingPlans`}
                                allSelectedPlans={allSelectedPlans || []}
                                setAllSelectedPlans={setAllSelectedPlans}
                                error={
                                  values?.sellingPlans &&
                                  touched?.sellingPlans
                                    ?.sellingPlanId &&
                                  errors?.sellingPlans
                                    ?.sellingPlanId
                                }
                              />
                            </div>
                          </div>
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <Stack vertical={true}>
                            {allSelectedPlans &&
                              allSelectedPlans?.map((plan) => (
                                <Stack.Item>
                                  <div className="selected-plan-container">
                                    <span>{plan?.sellingPlanName}</span>
                                    <img
                                      src={DeleteSVG}
                                      onClick={() =>
                                        handleRemovePlan(plan.sellingPlanId)
                                      }
                                      alt="Delete"
                                    />
                                  </div>
                                </Stack.Item>
                              ))}
                          </Stack>
                        </FormLayout.Group>

                        <TextContainer>
                          <Subheading>BUNDLE CONFIGURATION</Subheading>
                        </TextContainer>
                        <div className="limit-section">
                          {/* <FormLayout.Group>
                            <div className="box-subscription-detail">
                              <TextField
                                label="Limit Options"
                                value={values.buildABoxCampaign.boxQuantityLimit.toString()}
                                error={
                                  touched.buildABoxCampaign?.boxQuantityLimit &&
                                  errors.buildABoxCampaign?.boxQuantityLimit
                                }
                                type="number"
                                onChange={(e) => {
                                  setFieldValue(
                                    `buildABoxCampaign.boxQuantityLimit`,
                                    parseInt(e)
                                  );
                                }}
                              // placeholder="1"
                              />
                            </div>
                          </FormLayout.Group> */}
                          <FormLayout.Group>
                            <Checkbox
                              label="Sort box choices by collection"
                              checked={
                                values?.buildABoxCampaign
                                  ?.boxSubscriptionType === 'collection'
                              }
                              error={
                                touched.buildABoxCampaign
                                  ?.boxSubscriptionType &&
                                errors.buildABoxCampaign?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `buildABoxCampaign.boxSubscriptionType`,
                                  e === true ? 'collection' : ''
                                );
                              }}
                            />
                            <Checkbox
                              label="Display box choices by products"
                              checked={
                                values?.buildABoxCampaign
                                  ?.boxSubscriptionType === 'products'
                              }
                              error={
                                touched.buildABoxCampaign
                                  ?.boxSubscriptionType &&
                                errors.buildABoxCampaign?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `buildABoxCampaign.boxSubscriptionType`,
                                  e === true ? 'products' : ''
                                );
                              }}
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            {values?.buildABoxCampaign?.boxSubscriptionType ===
                              'collection' && (
                                <div className="box-subscription-search">
                                  <TextContainer>Collection</TextContainer>
                                  <SearchCollection
                                    selectedOptions={selectedCollectionOptions}
                                    setSelectedOptions={
                                      setSelectedCollectionOptions
                                    }
                                    selectedCollections={selectedCollections}
                                    setSelectedCollections={
                                      setSelectedCollections
                                    }
                                  />
                                </div>
                              )}
                            {values?.buildABoxCampaign?.boxSubscriptionType ===
                              'products' && (
                                <div className="box-subscription-search">
                                  <TextContainer>Product</TextContainer>
                                  <SearchProduct
                                    selectedOptions={selectedProductOptions}
                                    setSelectedOptions={setSelectedProductOptions}
                                    selectedProducts={selectedProducts}
                                    setSelectedProducts={setSelectedProducts}
                                  />
                                </div>
                              )}
                          </FormLayout.Group>
                          {values?.buildABoxCampaign?.boxSubscriptionType ===
                            'collection' && (
                              <div className="collection-stack">
                                {selectedCollections?.map(
                                  (collection, i) =>
                                    collection._destroy === false && (
                                      <div
                                        key={i}
                                        className="building-box-collection"
                                      >
                                        <div>{collection?.collectionTitle}</div>
                                        <Stack>
                                          {collection.products?.map(
                                            (product, j) =>
                                              product._destroy === false && (
                                                <div
                                                  key={j}
                                                  className="building-box-product"
                                                >
                                                  <img
                                                    className="product"
                                                    src={product?.image}
                                                  />
                                                  <img
                                                    className="removeIcon"
                                                    onClick={() => {
                                                      handleRemoveCollectionProduct(
                                                        i,
                                                        j
                                                      );
                                                    }}
                                                    src={removeIcon}
                                                  />
                                                </div>
                                              )
                                          )}
                                        </Stack>
                                      </div>
                                    )
                                )}
                              </div>
                            )}
                          {values?.buildABoxCampaign?.boxSubscriptionType ===
                            'products' && (
                              <div className="product-stack">
                                <div>
                                  Selected products (subscription box options)
                                </div>
                                <Stack>
                                  {selectedProducts?.map(
                                    (product, i) =>
                                      product._destroy === false && (
                                        <div
                                          key={i}
                                          className="building-box-product"
                                        >
                                          <img
                                            className="product"
                                            src={product?.image}
                                          />
                                          <img
                                            onClick={() => {
                                              handleRemoveProduct(i);
                                            }}
                                            className="removeIcon"
                                            src={removeIcon}
                                          />
                                        </div>
                                      )
                                  )}
                                </Stack>
                              </div>
                            )}
                        </div>
                      </FormLayout>
                    </Card.Section>
                  </Card>

                  {/* <Card title="Box Campaign" sectioned>
                    
                  </Card> */}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Page>
    </Frame>
  );
};

export default CreateBundleMenu;
