import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { Link, useHistory, useParams } from 'react-router-dom';
import AppLayout from '../layout/Layout';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import offerImg from '../../../assets/images/upsell/offerImage.svg';
// import SearchProduct from './SearchProduct';
// import SearchPlan from './SearchPlan';
// import Preview from './preview';
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
import mixpanel from 'mixpanel-browser';

const WeeklyMenuForm = ({ id, handleClose }) => {
  const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());
  const [canceledProducts, setCanceledProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [updated, setUpdated] = useState(false);

  //Initialise Mixpanel
  mixpanel.init("467d5df251a711e7b0ae20d18c8fb2e1", { debug: true });
  const mixpanelId = localStorage.getItem("distinct_id_admin_chargezen");

  const triggerOptions = [
    {
      label: 'Customer is subscribed to subscription plan',
      value: 'customer_is_subscribed_to_subscription_plan',
    },
  ];

  const initialValues = {
    cutoffDate: '',
    week: 0,
    boxSubscriptionType: '',
    triggers: 'customer_is_subscribed_to_subscription_plan',
    sellingPlans: [],
    collectionImages: [],
    productImages: [],
  };

  const [formErrors, setFormErrors] = useState([]);
  const [menuData, setMenuData] = useState(null);
  const [checkboxDisabled, setcheckboxDisabled] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingWeeklyMenu = useCallback((values, index) => {
    const menus = [...(values.weeklyMenus || [])];
    menus[index]._destroy = true;
    return menus;
  });

  const handleAddWeeklyMenu = useCallback((values) => {
    const menus = [...(values.weeklyMenus || [])];
    menus.push(initialValues.weeklyMenus[0]);

    return menus;
  });

  const validationSchema = yup.object().shape({
    boxSubscriptionType: yup
      .string()
      .required()
      .label('box subscription type'),
  });

  const GET_WEEKLY_MENU = gql`
      query ($id: ID!) {
        fetchWeeklyMenu(id: $id) {
          id
          cutoffDate
          week
          displayName
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
    `;
  // const { id } = useParams();

  const [getWeeklyMenu, { data, loading, error }] = useLazyQuery(
    GET_WEEKLY_MENU,
    {
      variables: { id: id },
      fetchPolicy: 'no-cache',
    }
  );

  useEffect(() => {
    if (id) {
      getWeeklyMenu();
    }
  }, []);

  const UPDATE_WEEKLY_MENU = gql`
      mutation ($input: UpdateWeeklyMenuInput!) {
        updateWeeklyMenu(input: $input) {
          menu {
            id
          }
        }
      }
    `;
  const [updateWeeklyMenu] = useMutation(UPDATE_WEEKLY_MENU);

  const CREATE_WEEKLY_MENU = gql`
      mutation ($input: AddWeeklyMenuInput!) {
        addWeeklyMenu(input: $input) {
          menu {
            id
          }
        }
      }
    `;

  const history = useHistory();
  const [createWeeklyMenu] = useMutation(CREATE_WEEKLY_MENU);

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
      formRef.current?.values.productImages !=
      selectedProducts
    ) {
      formRef.current.setFieldValue(
        'productImages',
        selectedProducts
      );
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (
      selectedCollections &&
      formRef.current &&
      formRef.current?.values.collectionImages !=
      selectedCollections
    ) {
      formRef.current.setFieldValue(
        'collectionImages',
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
    if (data) {
      data.fetchWeeklyMenu.triggers = data.fetchWeeklyMenu.triggers[0]?.name; //Manipulate later
      data.fetchWeeklyMenu.cutoffDate = data.fetchWeeklyMenu.cutoffDate || '';
      setMenuData(data);
      setSelectedProducts(
        data.fetchWeeklyMenu.productImages
      );
      setSelectedProductOptions(() => {
        const defaultOption = [];
        data.fetchWeeklyMenu.productImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.productId)
        );
        return defaultOption;
      });
      setSelectedCollections(
        data.fetchWeeklyMenu.collectionImages
      );
      setSelectedCollectionOptions(() => {
        const defaultOption = [];
        data.fetchWeeklyMenu.collectionImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.collectionId)
        );
        return defaultOption;
      });
      setAllSelectedPlans(
        data.fetchWeeklyMenu.sellingPlans
      );
      setMenuType(`${data?.fetchWeeklyMenu?.week}`)
    }
  }, [data]);

  const [menuType, setMenuType] = useState("Week");

  return (
    <Frame>
      <Page
        title={
          id ? 'Update Weekly Menu' : 'Create Weekly Menu'
        }
        breadcrumbs={[
          {
            content: 'Weekly Menu',
            onAction: () => handleClose(),
          },
        ]}
      >
        {loading && id && (
          <Spinner
            accessibilityLabel="Spinner example"
            size="large"
            color="teal"
          />
        )}
        {(menuData || !id) && (
          <Formik
            validationSchema={validationSchema}
            initialValues={menuData?.fetchWeeklyMenu || initialValues}
            innerRef={formRef}
            onSubmit={(values, { setSubmitting }) => {
              const formData = { ...values };
              formData.collectionImages = selectedCollections;
              formData.productImages = selectedProducts;
              formData.sellingPlans = allSelectedPlans;
              formData.triggers = [
                { name: formData?.triggers },
              ]; // Manipulate later

              if (id) {
                mixpanel.identify(mixpanelId);
                mixpanel.track("Updated Weekly Menu", { week: formData?.week });
                updateWeeklyMenu({
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
                mixpanel.identify(mixpanelId);
                mixpanel.track("Created Weekly Menu", { week: formData?.week });
                createWeeklyMenu({
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
                  <>
                    <ContextualSaveBar
                      message="Unsaved changes"
                      saveAction={{
                        onAction: handleSubmit,
                        loading: isSubmitting,
                        disabled: false,
                      }}
                      discardAction={{
                        onAction: () => {
                          setUpdated((flag) => (flag = false));
                          resetForm();
                        },
                      }}
                    />
                  </>
                )}

                {saveSuccess && (
                  <Toast
                    content="Weekly menu is saved"
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
                <div className="build-a-box-create">
                  <Card title="Weekly Menu" sectioned>
                    <Card.Section>
                      <FormLayout>
                        <FormLayout.Group>
                          <div>
                            <TextField
                              value={values?.displayName}
                              label="Display name"
                              placeholder="Weekly Menu"
                              type="text"
                              error={touched.displayName && errors.displayName}
                              onChange={(e) => {
                                setFieldValue(`displayName`, e);
                              }}
                              helpText={
                                <span>
                                  Display Name that will appear on weekly menu page.
                                </span>
                              }
                            />
                          </div>
                        </FormLayout.Group>
                        <FormLayout.Group>
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

                            <Select
                              options={["Week", "Master"]}
                              label="Menu Type"
                              value={menuType === `-1` ? 'Master' : `Week`}
                              error={
                                touched.triggers &&
                                errors.triggers
                              }
                              onChange={(e) => {
                                setMenuType(e)
                                e === "Week" ? setFieldValue(`week`, ``) : setFieldValue(`week`, `-1`);
                              }
                              }
                            />
                            <br />

                            {(menuType === "Week") &&
                              <>
                                <div className="date-range-label">
                                  <TextContainer>
                                    <Subheading element="h3">
                                      Menu Duration:
                                    </Subheading>
                                  </TextContainer>
                                </div>

                                <RangePickr
                                  cutoffLabel={'cutoffDate'}
                                  setFieldValue={setFieldValue}
                                  cutoff={values?.cutoffDate || ''}
                                />
                                <br />

                                <TextField
                                  value={values?.week && values?.week.toString()}
                                  label="Week Number"
                                  placeholder="Week Number(1,2,3,4...)"
                                  type="text"
                                  error={touched.week && errors.week}
                                  onChange={(e) => {
                                    setFieldValue(`week`, `${e}`);
                                  }}
                                  helpText={
                                    <span>
                                      Week Number that will appear on weekly menu page.
                                    </span>
                                  }
                                />
                              </>

                            }
                          </div>
                          <br />
                        </FormLayout.Group>
                      </FormLayout>
                    </Card.Section>

                    <Card.Section>
                      <FormLayout>
                        <Select
                          options={triggerOptions}
                          label="Triggers"
                          value={values?.triggers}
                          error={
                            touched.triggers &&
                            errors.triggers
                          }
                          onChange={(e) =>
                            setFieldValue(`triggers`, e)
                          }
                          helpText={
                            <span>
                              Add a trigger to target the weekly menu to
                              specific customers and orders.
                            </span>
                          }
                        />
                      </FormLayout>
                    </Card.Section>

                    <Card.Section>
                      <FormLayout>
                        <FormLayout.Group>
                          <div className="build-box-search">
                            <TextContainer>
                              <Subheading>Subscription plan</Subheading>
                            </TextContainer>
                            <Select
                              options={[{ label: 'is any', value: 'is_any' }]}
                              label=""
                              value={'is_any'}
                              onChange={() => {/* for future and avoid warning */ }}
                            />

                            <div className="search">
                              <SearchPlan
                                idForTextField={`serchPlan-${Math.random()}`}
                                value={values.sellingPlans}
                                setFieldValue={setFieldValue}
                                fieldName={`sellingPlans`}
                                allSelectedPlans={allSelectedPlans || []}
                                setAllSelectedPlans={setAllSelectedPlans}
                                error={
                                  values.sellingPlans &&
                                  touched.sellingPlans
                                    ?.sellingPlanId &&
                                  errors.sellingPlans
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
                          <Subheading>WEEKLY-MENU CONFIGURATION</Subheading>
                        </TextContainer>
                        <div className="limit-section">
                          <FormLayout.Group>
                            <Checkbox
                              label="Sort box choices by collection"
                              checked={
                                values?.boxSubscriptionType === 'collection'
                              }
                              error={
                                touched?.boxSubscriptionType &&
                                errors?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `boxSubscriptionType`,
                                  e === true ? 'collection' : ''
                                );
                              }}
                            />
                            <Checkbox
                              label="Display box choices by products"
                              checked={
                                values?.boxSubscriptionType === 'products'
                              }
                              error={
                                touched.boxSubscriptionType &&
                                errors.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `boxSubscriptionType`,
                                  e === true ? 'products' : ''
                                );
                              }}
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            {values?.boxSubscriptionType ===
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
                            {values?.boxSubscriptionType ===
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
                          {values?.boxSubscriptionType ===
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
                          {values?.boxSubscriptionType ===
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
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Page>
    </Frame>
  );
};

export default WeeklyMenuForm;
