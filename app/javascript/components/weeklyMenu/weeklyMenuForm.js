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

const WeeklyMenuForm = ({ id, handleClose }) => {
  const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());
  const [canceledProducts, setCanceledProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [updated, setUpdated] = useState(false);

  const locationOptions = [
    { label: 'Customer Portal', value: 'customer_portal' },
    { label: 'Product Page', value: 'product_page' },
  ];

  const triggerOptions = [
    {
      label: 'Customer is subscribed to subscription plan',
      value: 'customer_is_subscribed_to_subscription_plan',
    },
  ];

  const initialValues = {
    internalName: '',
    location: 'customer_portal',
    weeklyMenu: {
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
  const [menuData, setMenuData] = useState(null);
  const [checkboxDisabled, setcheckboxDisabled] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const hideSaveSuccess = useCallback(() => setSaveSuccess(false), []);

  const handleRemovingUpsellMenu = useCallback((values, index) => {
    const menus = [...(values.upsellMenus || [])];
    menus[index]._destroy = true;
    return menus;
  });

  const handleAddUpsellMenu = useCallback((values) => {
    const menus = [...(values.upsellMenus || [])];
    menus.push(initialValues.upsellMenus[0]);

    return menus;
  });

  const validationSchema = yup.object().shape({
    internalName: yup.string().required().label('Internal name'),
    weeklyMenu: yup.object().shape({
      boxSubscriptionType: yup
        .string()
        .required()
        .label('box subscription type'),
    }),
  });

  const GET_UPSELL_MENU = gql`
    query ($id: ID!) {
      weeklyMenu(id: $id) {
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
  `;
  // const { id } = useParams();

  const [getUpsell, { data, loading, error }] = useLazyQuery(
    GET_UPSELL_MENU,
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

  const UPDATE_BOX_MENU = gql`
    mutation ($input: UpdateWeeklyMenuInput!) {
      updateWeeklyMenu(input: $input) {
        menu {
          id
          internalName
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
          internalName
        }
      }
    }
  `;

  const history = useHistory();
  const [createUpsellMenu] = useMutation(CREATE_WEEKLY_MENU);

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
      formRef.current?.values.weeklyMenu.productImages !=
        selectedProducts
    ) {
      formRef.current.setFieldValue(
        'weeklyMenu.productImages',
        selectedProducts
      );
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (
      selectedCollections &&
      formRef.current &&
      formRef.current?.values.weeklyMenu.collectionImages !=
        selectedCollections
    ) {
      formRef.current.setFieldValue(
        'weeklyMenu.collectionImages',
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
      data.weeklyMenu.triggers =
        data.weeklyMenu.triggers[0]?.name; //Manipulate later
      data.weeklyMenu.endDate =
        data.weeklyMenu.endDate || '';
      data.weeklyMenu.startDate =
        data.weeklyMenu.startDate || '';
      setMenuData(data);
      setSelectedProducts(
        data.weeklyMenu.productImages
      );
      setSelectedProductOptions(() => {
        const defaultOption = [];
        data.weeklyMenu.productImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.productId)
        );
        return defaultOption;
      });
      setSelectedCollections(
        data.weeklyMenu.collectionImages
      );
      setSelectedCollectionOptions(() => {
        const defaultOption = [];
        data.weeklyMenu.collectionImages?.map(
          (image) =>
            image._destroy == false && defaultOption.push(image.collectionId)
        );
        return defaultOption;
      });
      setAllSelectedPlans(
        data.weeklyMenu.sellingPlans
      );
    }
  }, [data]);

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
            initialValues={menuData || initialValues}
            innerRef={formRef}
            onSubmit={(values, { setSubmitting }) => {
              const formData = { ...values };
              formData.weeklyMenu.collectionImages = selectedCollections;
              formData.weeklyMenu.productImages = selectedProducts;
              formData.weeklyMenu.sellingPlans = allSelectedPlans;
              formData.weeklyMenu.triggers = [
                { name: formData?.weeklyMenu?.triggers },
              ]; // Manipulate later

              if (id) {
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
                
                createUpsellMenu({
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
                    content="Upsell menu group is saved"
                    onDismiss={hideSaveSuccess}
                  />
                )}

                {formErrors.length > 0 && (
                  <>
                    <Banner
                      title="Upsell menu group could not be saved"
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
                  <Card title="Weekly menu group" sectioned>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          value={values.internalName}
                          label="Internal name"
                          placeholder="Subscribe & Save"
                          type="text"
                          error={touched.internalName && errors.internalName}
                          onChange={(e) => setFieldValue('internalName', e)}
                          helpText={
                            <span>
                              Internal name of the group, used to identify it in
                              the admin
                            </span>
                          }
                        />
                        <Select
                          options={locationOptions}
                          label="Select weekly menu location"
                          value={values.location}
                          error={touched.location && errors.location}
                          onChange={(e) => setFieldValue(`location`, e)}
                          helpText={
                            <span>
                              Customer portal shows directly after Shopify's
                              checkout.
                            </span>
                          }
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </Card>

                  <Card title="Weekly Menu" sectioned>
                    <Card.Section>
                      <FormLayout>
                        <FormLayout.Group>
                          <div>
                            <TextField
                              value={values?.weeklyMenu?.displayName}
                              label="Display name"
                              placeholder="Build A Weekly Menu"
                              type="text"
                              error={touched.displayName && errors.displayName}
                              onChange={(e) => {
                                setFieldValue(`weeklyMenu.displayName`, e);
                              }}
                              helpText={
                                <span>
                                  Display Name that will appear on build a box page.
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
                            <div className="date-range-label">
                              <TextContainer>
                                <Subheading element="h3">
                                  Menu Duration:
                                </Subheading>
                              </TextContainer>
                            </div>
                            <RangePickr
                              startLabel={'weeklyMenu.startDate'}
                              endLabel={'weeklyMenu.endDate'}
                              setFieldValue={setFieldValue}
                              start={values?.weeklyMenu?.startDate || ''}
                              end={values?.weeklyMenu?.endDate || ''}
                            />
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
                          value={values?.weeklyMenu?.triggers}
                          error={
                            touched.weeklyMenu?.triggers &&
                            errors.weeklyMenu?.triggers
                          }
                          onChange={(e) =>
                            setFieldValue(`weeklyMenu.triggers`, e)
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
                            />

                            <div className="search">
                              <SearchPlan
                                idForTextField={`serchPlan-${Math.random()}`}
                                value={values.weeklyMenu?.sellingPlans}
                                setFieldValue={setFieldValue}
                                fieldName={`weeklyMenu.sellingPlans`}
                                allSelectedPlans={allSelectedPlans || []}
                                setAllSelectedPlans={setAllSelectedPlans}
                                error={
                                  values.weeklyMenu?.sellingPlans &&
                                  touched.weeklyMenu?.sellingPlans
                                    ?.sellingPlanId &&
                                  errors.weeklyMenu?.sellingPlans
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
                          <Subheading>BUILD-A-BOX CONFIGURATION</Subheading>
                        </TextContainer>
                        <div className="limit-section">
                          <FormLayout.Group>
                            <div className="box-subscription-detail">
                              <TextField
                                label="Limit Options"
                                value={values.weeklyMenu.boxQuantityLimit.toString()}
                                error={
                                  touched.weeklyMenu?.boxQuantityLimit &&
                                  errors.weeklyMenu?.boxQuantityLimit
                                }
                                type="number"
                                onChange={(e) => {
                                  setFieldValue(
                                    `weeklyMenu.boxQuantityLimit`,
                                    parseInt(e)
                                  );
                                }}
                                // placeholder="1"
                              />
                            </div>
                          </FormLayout.Group>
                          <FormLayout.Group>
                            <Checkbox
                              label="Sort box choices by collection"
                              checked={
                                values?.weeklyMenu
                                  ?.boxSubscriptionType === 'collection'
                              }
                              error={
                                touched.weeklyMenu
                                  ?.boxSubscriptionType &&
                                errors.weeklyMenu?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `weeklyMenu.boxSubscriptionType`,
                                  e === true ? 'collection' : ''
                                );
                              }}
                            />
                            <Checkbox
                              label="Display box choices by products"
                              checked={
                                values?.weeklyMenu
                                  ?.boxSubscriptionType === 'products'
                              }
                              error={
                                touched.weeklyMenu
                                  ?.boxSubscriptionType &&
                                errors.weeklyMenu?.boxSubscriptionType
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `weeklyMenu.boxSubscriptionType`,
                                  e === true ? 'products' : ''
                                );
                              }}
                            />
                          </FormLayout.Group>
                          <FormLayout.Group>
                            {values?.weeklyMenu?.boxSubscriptionType ===
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
                            {values?.weeklyMenu?.boxSubscriptionType ===
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
                          {values?.weeklyMenu?.boxSubscriptionType ===
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
                          {values?.weeklyMenu?.boxSubscriptionType ===
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
