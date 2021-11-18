import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Card,
  Form,
  FormLayout,
  Heading,
  Icon,
  Select,
  Subheading,
  TextContainer,
  Stack,
  Checkbox,
  Spinner,
  TextField,
  Button,
} from '@shopify/polaris';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import SearchPlan from '../upsell/SearchPlan';
import SearchCollection from '../plans/SearchCollection';
import SearchProduct from '../plans/SearchProduct';
import RangePickr from '../build-a-box/RangePickr';
import removeIcon from '../../../assets/images/subscriptionsPlans/removeProduct.svg';
import DeleteSVG from '../../../assets/images/delete.svg';
import toPath from 'lodash/toPath';
import { Formik, setIn } from 'formik';
import * as yup from 'yup';

const BundleForm = ({ id, handleClose }) => {
  const [bundleGroup, setBundleGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCollectionOptions, setSelectedCollectionOptions] = useState(
    []
  );
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [allSelectedPlans, setAllSelectedPlans] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetch(`/bundle_groups/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      })
        .then((response) => response.json())
        .then((data) => {
          setBundleGroup(data);
          setLoading(false);
        });
    }
  }, []);
  // const setFieldValue = (key, value) => {
  //   setBundleGroup(setIn(bundleGroup, key, value));
  // };
  const handleSubmit = () => {
    console.log('handle submit');
    debugger;
  };
  const locationOptions = [
    { label: 'Customer Portal', value: 'customer_portal' },
    { label: 'Product Page', value: 'product_page' },
  ];
  const triggerOptions = [
    {
      label: 'No subscription required',
      value: 'no_subscription',
    },
    {
      label: 'Customer is subscribed to subscription plan',
      value: 'customer_is_subscribed_to_subscription_plan',
    },
  ];
  // const validationSchema = yup.object().shape({
  //   internal_name: yup.string().required().label('Internal name'),
  //   location: yup.string().required().label('Select box campaign location'),
  //   triggers: yup.string().required().label('Triggers'),
  //   bundles: yup.object().shape({
  //     boxSubscriptionType: yup
  //       .string()
  //       .required()
  //       .label('box subscription type'),
  //   }),
  // })
  const handleRemoveProduct = (index) => {
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
    setSelectedCollections(() => {
      let newSelectedCollection = [...(selectedCollections || [])];
      newSelectedCollection[collectionIndex].products[
        productIndex
      ]._destroy = true;
      return newSelectedCollection;
    });
  };
  const handleRemovePlan = (id) => {
    setAllSelectedPlans(
      allSelectedPlans.filter((plan) => plan.sellingPlanId !== id)
    );
  };

  useEffect(() => {
    if (
      selectedProducts &&
      formRef.current &&
      formRef.current?.values.product_images != selectedProducts
    ) {
      formRef.current.setFieldValue('product_images', selectedProducts);
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (
      selectedCollections &&
      formRef.current &&
      formRef.current?.values.collection_images != selectedCollections
    ) {
      formRef.current.setFieldValue('collection_images', selectedCollections);
    }
  }, [selectedCollections]);
  console.log('bundleGroup: ', bundleGroup);
  const customFunction = (v) => {
    debugger;
    handleSubmit();
  };
  return (
    <>
      <div className="back-button pointer" onClick={handleClose}>
        <Icon source={MobileBackArrowMajor} color="base" />
      </div>
      {loading && id && (
        <Spinner
          accessibilityLabel="Spinner example"
          size="large"
          color="teal"
        />
      )}
      {(bundleGroup || !id) && (
        <Formik
          enableReinitialize
          initialValues={bundleGroup || { bundles: [{}] }}
          innerRef={formRef}
          onSubmit={(values, { setSubmitting }) => {
            // const formData = { ...values };
            // formData.collection_images = selectedCollections;
            // formData.product_images = selectedProducts;
            // formData.selling_plans = allSelectedPlans;
            // formData.triggers = [
            //   { name: formData?.triggers },
            // ]; // Manipulate later
            // formData.upsellCampaigns[0].productOffer = allProducts;
            if (id) {
              debugger;
              fetch(`/bundle_groups/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bundle_group: values }),
              })
                .then((response) => response.json())
                //Then with the data from the response in JSON...
                .then((newFlow) => {
                  console.log('Success:', newFlow);
                  const newFlows = [...flows];
                  newFlows.find((f) => f.id == newFlow.id).status =
                    newFlow.status;
                  setFlows(newFlows);
                })
                .catch((error) => {
                  setSubmitting(false);
                  setFormErrors(error);
                });
            } else {
              //const variables = formatUpsellCampaignGroup(values);
              // createUpsellCampaign({
              //   variables: { input: { params: formData } },
              // })
              //   .then((resp) => {
              //     const data = resp.data;
              //     const errors = data.errors;
              //     if (errors) {
              //       setFormErrors(errors);
              //       setSubmitting(false);
              //     } else {
              //       // setSaveSuccess(true);
              //       handleClose();
              //     }
              //   })
              //   .catch((error) => {
              //     setSubmitting(false);
              //     setFormErrors(error);
              //   });
              fetch(`/bundle_groups`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bundle_group: values }),
              })
                .then((response) => response.json())
                //Then with the data from the response in JSON...
                .then((newBundleGroup) => {
                  console.log('Success:', newBundleGroup);
                  if (newBundleGroup.errors) {
                    setFormErrors(newBundleGroup.errors.messages);
                  }
                  setSubmitting(false);
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
              <div className="build-a-box-create">
                <Card title="Box campaign group" sectioned>
                  <FormLayout>
                    <FormLayout.Group>
                      <TextField
                        value={values.internal_name}
                        label="Internal name"
                        placeholder="Best Bundle"
                        type="text"
                        onChange={(e) => setFieldValue('internal_name', e)}
                        helpText={
                          <span>
                            Internal name of the group, used to identify it in
                            the admin
                          </span>
                        }
                      />
                      <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button primary onClick={handleSubmit}>
                          Save
                        </Button>
                      </div>
                    </FormLayout.Group>
                    <Select
                      options={locationOptions}
                      label="Select box campaign location"
                      value={values?.location}
                      onChange={(e) => setFieldValue(`location`, e)}
                      helpText={
                        <span>
                          Customer portal shows directly after Shopify's
                          checkout.
                        </span>
                      }
                    />
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
                              Campaign Duration:
                            </Subheading>
                          </TextContainer>
                        </div>
                        <RangePickr
                          startLabel={'start_date'}
                          endLabel={'end_date'}
                          setFieldValue={setFieldValue}
                          start={values?.start_date || ''}
                          end={values?.end_date || ''}
                        />
                      </div>
                      <br />
                    </FormLayout.Group>

                    <Select
                      options={triggerOptions}
                      label="Triggers"
                      value={values?.triggers}
                      onChange={(e) => setFieldValue(`triggers`, e)}
                      helpText={
                        <span>
                          Add a trigger to target the box campaign to specific
                          customers and orders.
                        </span>
                      }
                    />

                    {values?.triggers ==
                      'customer_is_subscribed_to_subscription_plan' && (
                      <>
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
                                value={values?.selling_plans || []}
                                setFieldValue={setFieldValue}
                                fieldName={`selling_plans`}
                                allSelectedPlans={allSelectedPlans || []}
                                setAllSelectedPlans={setAllSelectedPlans}
                              />
                            </div>
                          </div>
                        </FormLayout.Group>
                        <FormLayout.Group>
                          <Stack vertical={true}>
                            {allSelectedPlans &&
                              allSelectedPlans?.map((plan, i) => (
                                <Stack.Item key={i}>
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
                      </>
                    )}
                  </FormLayout>
                  <div className="limit-section">
                    <FormLayout.Group>
                      <Checkbox
                        label="Sort box choices by collection"
                        checked={values?.bundle_type === 'collection'}
                        onChange={(e) => {
                          setFieldValue(
                            `bundle_type`,
                            e === true ? 'collection' : ''
                          );
                        }}
                      />
                      <Checkbox
                        label="Display box choices by products"
                        checked={values?.bundle_type === 'products'}
                        onChange={(e) => {
                          setFieldValue(
                            `bundle_type`,
                            e === true ? 'products' : ''
                          );
                        }}
                      />
                    </FormLayout.Group>
                    <FormLayout.Group>
                      {values?.bundle_type === 'collection' && (
                        <div className="box-subscription-search">
                          <TextContainer>Collection</TextContainer>
                          <SearchCollection
                            selectedOptions={selectedCollectionOptions}
                            setSelectedOptions={setSelectedCollectionOptions}
                            selectedCollections={selectedCollections}
                            setSelectedCollections={setSelectedCollections}
                          />
                        </div>
                      )}
                      {values?.bundle_type === 'products' && (
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
                    {values?.bundle_type === 'collection' && (
                      <div className="collection-stack">
                        {selectedCollections?.map(
                          (collection, i) =>
                            collection._destroy === false && (
                              <div key={i} className="building-box-collection">
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
                    {values?.bundle_type === 'products' && (
                      <div className="product-stack">
                        <div>Selected products (subscription box options)</div>
                        <Stack>
                          {selectedProducts?.map(
                            (product, i) =>
                              product._destroy === false && (
                                <div key={i} className="building-box-product">
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
                </Card>
                <Card title="Bundles">
                  {(values?.bundles || [{}]).map((bundle, index) => {
                    return (
                      <Card.Section key={index}>
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              label="Box Size"
                              value={bundle?.quantity_limit}
                              type="number"
                              onChange={(e) =>
                                setFieldValue(
                                  `bundles[${index}].quantity_limit`,
                                  e
                                )
                              }
                            ></TextField>
                            <TextField
                              label="Display Label"
                              value={bundle?.label}
                              onChange={(e) =>
                                setFieldValue(`bundles[${index}].label`, e)
                              }
                            ></TextField>
                          </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              label="Price Per Item"
                              value={bundle?.price_per_item}
                              type="number"
                              onChange={(e) =>
                                setFieldValue(
                                  `bundles[${index}].price_per_item`,
                                  e
                                )
                              }
                            ></TextField>
                            <div>
                              <p>Shopper Pays</p>
                              <p
                                style={{
                                  marginTop: '1rem',
                                  marginLeft: '0.5rem',
                                }}
                              >
                                {(bundle?.price_per_item || 0) *
                                  (bundle?.quantity_limit || 0) || '-'}
                              </p>
                            </div>
                          </FormLayout.Group>
                        </FormLayout>
                      </Card.Section>
                    );
                  })}
                  <div style={{ marginLeft: '2rem' }}>
                    <Button
                      primary
                      onClick={() => {
                        setFieldValue('bundles', [...values.bundles, {}]);
                      }}
                    >
                      Add Bundle Option
                    </Button>
                    <br />
                    <br />
                  </div>
                </Card>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default BundleForm;
