import React, { useState, useCallback, useEffect } from 'react';
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
  TextField,
} from '@shopify/polaris';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import SearchPlan from '../upsell/SearchPlan';
import SearchCollection from '../plans/SearchCollection';
import SearchProduct from '../upsell/SearchProduct';
import RangePickr from '../build-a-box/RangePickr';
import removeIcon from '../../../assets/images/subscriptionsPlans/removeProduct.svg';

const BundleForm = ({ id, handleClose }) => {
  const [bundleGroup, setBundleGroup] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCollectionOptions, setSelectedCollectionOptions] = useState(
    []
  );
  const [selectedCollections, setSelectedCollections] = useState([]);

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
  const setFieldValue = (key, value) => {
    const newBundleGroup = { ...bundleGroup };
    newBundleGroup[key] = value;
    setBundleGroup(newBundleGroup);
  };
  const handleSubmit = () => {
    console.log('handle submit');
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
  const setAllSelectedPlans = (e) => {
    console.log(e);
  };
  const allSelectedPlans = [];

  return (
    <>
      <div className="back-button pointer" onClick={handleClose}>
        <Icon source={MobileBackArrowMajor} color="base" />
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="build-a-box-create">
          <Card title="Box campaign group" sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  value={bundleGroup.internal_name}
                  label="Internal name"
                  placeholder="Best Bundle"
                  type="text"
                  onChange={(e) => setFieldValue('internal_name', e)}
                  helpText={
                    <span>
                      Internal name of the group, used to identify it in the
                      admin
                    </span>
                  }
                />
                <Select
                  options={locationOptions}
                  label="Select box campaign location"
                  value={bundleGroup?.location}
                  onChange={(e) => setFieldValue(`location`, e)}
                  helpText={
                    <span>
                      Customer portal shows directly after Shopify's checkout.
                    </span>
                  }
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <div>
                  <TextContainer>
                    <h4>
                      <strong>DISPLAY RULES</strong>
                    </h4>
                    <h5>
                      Show these offers when any of the following individual
                      criteria are met
                    </h5>
                  </TextContainer>
                  <br />
                  <div className="date-range-label">
                    <TextContainer>
                      <Subheading element="h3">Campaign Duration:</Subheading>
                    </TextContainer>
                  </div>
                  <RangePickr
                    startLabel={'startDate'}
                    endLabel={'endDate'}
                    setFieldValue={setFieldValue}
                    start={bundleGroup?.startDate || ''}
                    end={bundleGroup?.endDate || ''}
                  />
                </div>
                <br />
              </FormLayout.Group>

              <Select
                options={triggerOptions}
                label="Triggers"
                value={bundleGroup?.triggers}
                onChange={(e) => setFieldValue(`triggers`, e)}
                helpText={
                  <span>
                    Add a trigger to target the box campaign to specific
                    customers and orders.
                  </span>
                }
              />
            </FormLayout>
            <div className="limit-section">
              <FormLayout.Group>
                <Checkbox
                  label="Sort box choices by collection"
                  checked={bundleGroup?.boxSubscriptionType === 'collection'}
                  onChange={(e) => {
                    setFieldValue(
                      `boxSubscriptionType`,
                      e === true ? 'collection' : ''
                    );
                  }}
                />
                <Checkbox
                  label="Display box choices by products"
                  checked={bundleGroup?.boxSubscriptionType === 'products'}
                  onChange={(e) => {
                    setFieldValue(
                      `boxSubscriptionType`,
                      e === true ? 'products' : ''
                    );
                  }}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                {bundleGroup?.boxSubscriptionType === 'collection' && (
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
                {bundleGroup?.boxSubscriptionType === 'products' && (
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
              {bundleGroup?.boxSubscriptionType ===
                'collection' && (
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
                                  <div key={j} className="building-box-product">
                                    <img
                                      className="product"
                                      src={product?.image}
                                    />
                                    <img
                                      className="removeIcon"
                                      onClick={() => {
                                        handleRemoveCollectionProduct(i, j);
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
              {bundleGroup?.boxSubscriptionType ===
                'products' && (
                <div className="product-stack">
                  <div>Selected products (subscription box options)</div>
                  <Stack>
                    {selectedProducts?.map(
                      (product, i) =>
                        product._destroy === false && (
                          <div key={i} className="building-box-product">
                            <img className="product" src={product?.image} />
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
          <Card title="Bundles" sectioned>
            <Card.Section>
              <p>WORK IN PROGRESS!</p>
            </Card.Section>
          </Card>
        </div>
      </Form>
    </>
  );
};

export default BundleForm;
