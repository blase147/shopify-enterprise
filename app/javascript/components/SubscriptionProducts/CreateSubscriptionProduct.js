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
import SearchPlan from '../upsell/SearchPlan';
import LoadingScreen from '../LoadingScreen';
import PixelIcon from '../../images/PixelIcon';
import SearchProduct from './SearchProduct';
import Preview from '../plans/Preview';


const CreateSubscriptionProduct = () => {
    var id;
    var handleClose = () => {

    }

    const statusOptions = [
        {
            label: 'Active',
            value: 'active',
        },
        {
            label: 'Draft',
            value: 'draft',
        },
    ];

    const initialValues = {
        status: 'active',
        sellingPlan: [],
        productImages: [],
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
        // sellingPlan: yup.array().required().label("Please select a SellingPlan.")
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

    const CREATE_SUBSCRIPTION_PRODUCT = gql`
    mutation ($input: AddSubscriptionProductInput!) {
        addSubscriptionProduct(input: $input) {
            subscriptionProduct{
                id
            }
        }
    }
  `;

    const history = useHistory();
    const [createMemberShipGQL] = useMutation(CREATE_SUBSCRIPTION_PRODUCT);

    const formRef = useRef(null);

    const [selectedProductOptions, setSelectedProductOptions] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [selectedFreeProductOptions, setSelectedFreeProductOptions] = useState([]);
    const [selectedFreeProducts, setSelectedFreeProducts] = useState([]);

    const [selectedCollectionOptions, setSelectedCollectionOptions] = useState(
        []
    );
    const [selectedFreeCollectionOptions, setSelectedFreeCollectionOptions] = useState(
        []
    );

    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedFreeCollections, setSelectedFreeCollections] = useState([]);

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

    //// All Search Plans
    const [allSelectedPlans, setAllSelectedPlans] = useState([]);

    const handleRemovePlan = (id) => {
        setUpdated(true);
        setAllSelectedPlans(
            allSelectedPlans.filter((plan) => plan.sellingPlanId !== id)
        );
    };

    // useEffect(() => {
    //   if (data && data?.fetchBuildABoxCampaignGroup) {
    //     data.fetchBuildABoxCampaignGroup.buildABoxCampaign.triggers =
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.triggers[0]?.name; //Manipulate later
    //     data.fetchBuildABoxCampaignGroup.buildABoxCampaign.endDate =
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.endDate || '';
    //     data.fetchBuildABoxCampaignGroup.buildABoxCampaign.startDate =
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.startDate || '';
    //     setCampaignData(data.fetchBuildABoxCampaignGroup);
    //     setSelectedProducts(
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.productImages
    //     );
    //     setSelectedProductOptions(() => {
    //       const defaultOption = [];
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.productImages?.map(
    //         (image) =>
    //           image._destroy == false && defaultOption.push(image.productId)
    //       );
    //       return defaultOption;
    //     });
    //     setSelectedCollections(
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.collectionImages
    //     );
    //     setSelectedCollectionOptions(() => {
    //       const defaultOption = [];
    //       data.fetchBuildABoxCampaignGroup.buildABoxCampaign.collectionImages?.map(
    //         (image) =>
    //           image._destroy == false && defaultOption.push(image.collectionId)
    //       );
    //       return defaultOption;
    //     });
    //     setAllSelectedPlans(
    //       data.fetchBuildABoxCampaignGroup.sellingPlans
    //     );
    //   }
    // }, [data]);

    const [updated, setUpdated] = useState(false);

    const [allProducts, setAllProducts] = useState([]);
    const [allVarients, setAllVarients] = useState([]);
    const [sellingPlanType, setSellingPlanType] = useState("all");

    console.log("allSelectedPlans", allSelectedPlans);
    console.log("allProducts", allProducts);
    return (
        <Frame>
            <Page
                title="Create Subscription Product"
                breadcrumbs={[
                    {
                        content: 'Subscription Products',
                        onAction: () => history.push("/subscriptionProducts"),
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
                            values.productImages = allProducts || [];
                            const formData = { ...values };
                            formData.sellingPlan = allSelectedPlans;

                            // formData.upsellCampaigns[0].productOffer = allProducts;  Manipulate later
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
                                createMemberShipGQL({
                                    variables: { input: { params: formData } },
                                })
                                    .then((resp) => {
                                        const data = resp.data;
                                        const errors = data.errors;
                                        if (errors) {
                                            setFormErrors(errors);
                                            setSubmitting(false);
                                        } else {
                                            setSaveSuccess(true);
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
                                        content="Subscription Product is saved"
                                        onDismiss={() => {
                                            hideSaveSuccess;
                                            location.reload();
                                        }}
                                    />
                                )}

                                {formErrors.length > 0 && (
                                    <>
                                        <Banner
                                            title="Subscription Product could not be created"
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
                                            Create Subscription Product
                                        </div>} sectioned>
                                        <Card.Section>
                                            <FormLayout>

                                                <FormLayout.Group>
                                                    <Checkbox
                                                        label="For All SellingPlans"
                                                        checked={
                                                            sellingPlanType === "all"
                                                        }
                                                        onChange={() => {
                                                            setSellingPlanType("all")
                                                            setFieldValue(
                                                                'selling_plan', []
                                                            );
                                                        }}
                                                    />
                                                    <Checkbox
                                                        label="For a specific SellingPlan"
                                                        checked={
                                                            sellingPlanType === 'selling_plan'
                                                        }
                                                        onChange={() => {
                                                            setSellingPlanType("selling_plan")
                                                        }}
                                                    />
                                                </FormLayout.Group>
                                                {
                                                    sellingPlanType === 'selling_plan' && (

                                                        <FormLayout.Group>
                                                            <div className="build-box-search">
                                                                <TextContainer>
                                                                    <Subheading>Subscription Plan</Subheading>
                                                                </TextContainer>
                                                                <Select
                                                                    options={[{ label: 'is any', value: 'is_any' }]}
                                                                    label=""
                                                                    value={'is_any'}
                                                                />

                                                                <div className="search">
                                                                    <SearchPlan
                                                                        idForTextField={`selling_plan-${Math.random()}`}
                                                                        value={values.sellingPlan}
                                                                        setFieldValue={setFieldValue}
                                                                        fieldName={`sellingPlan`}
                                                                        allSelectedPlans={allSelectedPlans || []}
                                                                        setAllSelectedPlans={setAllSelectedPlans}
                                                                        error={
                                                                            values?.sellingPlan &&
                                                                            touched?.sellingPlan
                                                                                ?.sellingPlanId &&
                                                                            errors?.sellingPlan
                                                                                ?.sellingPlanId
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </FormLayout.Group>

                                                    )
                                                }
                                                <FormLayout.Group>
                                                    <div className="box-subscription-search">
                                                        <TextContainer>Select Products</TextContainer>
                                                        <SearchProduct
                                                            value={values.productImages || [[]]}
                                                            setFieldValue={setFieldValue}
                                                            fieldName={`productImages`}
                                                            allProducts={allProducts || [[]]}
                                                            setAllProducts={setAllProducts}
                                                            error={
                                                                touched.productImages?.productId &&
                                                                errors.productImages?.productId
                                                            }
                                                        />
                                                    </div>
                                                </FormLayout.Group>
                                                <Preview
                                                    isUpdate={false}
                                                    allProducts={allProducts || [[]]}
                                                    setAllProducts={setAllProducts}
                                                    setUpdated={setUpdated}
                                                />

                                                <FormLayout.Group>
                                                    <Select
                                                        options={statusOptions}
                                                        label="Status"
                                                        value={values.status}
                                                        error={touched.status && errors.status}
                                                        onChange={(e) => setFieldValue(`status`, e)}
                                                    />
                                                </FormLayout.Group>

                                                <FormLayout.Group>
                                                    <Button onClick={() => handleSubmit()}>Save</Button>
                                                </FormLayout.Group>

                                            </FormLayout>
                                        </Card.Section>
                                    </Card>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </Page>
        </Frame >
    );
};

export default CreateSubscriptionProduct;
