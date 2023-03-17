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
import LoadingScreen from '../LoadingScreen';
import PixelIcon from '../../images/PixelIcon';
import TimePicker from 'react-time-picker';

const CreateRebuy = () => {
    const { id } = useParams();
    var handleClose = () => {
    }
    const options = [...Array(99).keys()].map((foo) => (foo + 1).toString());
    const [updated, setUpdated] = useState(false);

    const locationOptions = [
        { label: 'Curvos', value: 'curvos' },
        { label: 'Huron', value: 'huron' },
    ];

    const interOptions = [
        { label: 'Day(s)', value: 'DAY' },
        { label: 'Week(s)', value: 'WEEK' },
        { label: 'Month(s)', value: 'MONTH' },
    ];

    const satusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
    ];

    const initialValues = {
        id: '',
        intervalType: 'DAY',
        intervalCount: '1',
        rebuyType: '',
        status: 'active',
        productImages: [],
        collectionImages: [],
        notificationTime: ""
    };

    const [formErrors, setFormErrors] = useState([]);
    const [rebuyMenuData, setrebuyMenuData] = useState(null);
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

    const GET_REBUY_MENU = gql`
    query ($id: ID!) {
        fetchRebuyMenu(id: $id) {
            id        
            intervalType
            intervalCount
            status
            rebuyType
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

    const [getRebuMenu, { data, loading, error }] = useLazyQuery(
        GET_REBUY_MENU,
        {
            variables: { id: +id },
            fetchPolicy: 'no-cache',
        }
    );

    useEffect(() => {
        if (id) {
            getRebuMenu();
        }
    }, []);

    const CREATE_REBUY_MENU = gql`
    mutation ($input: AddRebuyMenuInput!) {
        addRebuyMenu(input: $input) {
            rebuyMenu{
                id
            }
      }
    }
  `;

    const history = useHistory();

    const [CreateRebuyGQL] = useMutation(CREATE_REBUY_MENU);

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
        if (data && data?.fetchRebuyMenu) {
            let rebuyData = data.fetchRebuyMenu
            delete rebuyData['__typename'];
            setrebuyMenuData(rebuyData);
            setSelectedProducts(
                data.fetchRebuyMenu.productImages
            );
            setSelectedProductOptions(() => {
                const defaultOption = [];
                data.fetchRebuyMenu.productImages?.map(
                    (image) =>
                        image._destroy == false && defaultOption.push(image.productId)
                );
                return defaultOption;
            });
            setrebuyType(
                data.fetchRebuyMenu.rebuyType
            )
            setSelectedCollections(
                data.fetchRebuyMenu.collectionImages
            );
            setSelectedCollectionOptions(() => {
                const defaultOption = [];
                data.fetchRebuyMenu.collectionImages?.map(
                    (image) =>
                        image._destroy == false && defaultOption.push(image.collectionId)
                );
                return defaultOption;
            });
        }
    }, [data]);

    const [rebuyType, setrebuyType] = useState("")
    const [freerebuyType, setFreerebuyType] = useState("")
    const [time, setTime] = useState('10:00');
    const [offNotification, setOffNotification] = useState(true);
    console.log("offNotification");
    return (
        <Frame>
            <Page
                title={id ? "Update Rebuy" : "Create Rebuy"}
                breadcrumbs={[
                    {
                        content: 'Rebuy',
                        onAction: () => history.push("/rebuy"),
                    },
                ]}
            >
                {loading && id && (
                    <LoadingScreen />
                )}
                {(rebuyMenuData || !id) && (
                    <Formik
                        validationSchema={validationSchema}
                        initialValues={rebuyMenuData || initialValues}
                        innerRef={formRef}
                        onSubmit={(values, { setSubmitting }) => {
                            const formData = { ...values };
                            formData.collectionImages = selectedCollections;
                            formData.productImages = selectedProducts;
                            formData.rebuyType = rebuyType;
                            if (offNotification) {
                                formData.notificationTime = null;
                            } else {
                                formData.notificationTime = time;
                            }
                            // Manipulate later
                            // formData.upsellCampaigns[0].productOffer = allProducts;
                            if (id) {
                                formData.id = +id
                            }
                            //const variables = formatUpsellCampaignGroup(values);
                            CreateRebuyGQL({
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
                                        setTimeout(() => {
                                            location.reload();
                                        }, 500)
                                    }
                                })
                                .catch((error) => {
                                    setSubmitting(false);
                                    setFormErrors(error);
                                });

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
                                        content="Bundle Menu is saved"
                                        onDismiss={hideSaveSuccess}
                                    />
                                )}

                                {formErrors.length > 0 && (
                                    <>
                                        <Banner
                                            title="Bundle Menu group could not be saved"
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
                                            Create Rebuy
                                        </div>} sectioned>
                                        <Card.Section>
                                            <FormLayout>
                                                <TextContainer>
                                                    <br />
                                                    <Subheading>Frequency</Subheading>
                                                </TextContainer>
                                                <FormLayout.Group>
                                                    <Select
                                                        label="Interval"
                                                        value={values.intervalCount}
                                                        error={
                                                            touched?.intervalCount &&
                                                            errors?.intervalCount
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `intervalCount`,
                                                                e
                                                            )
                                                        }
                                                        options={options}
                                                    />
                                                    <Select
                                                        options={interOptions}
                                                        label="  "
                                                        value={values.intervalType}
                                                        error={
                                                            touched.intervalType &&
                                                            errors?.intervalType
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `intervalType`,
                                                                e
                                                            )
                                                        }
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <Checkbox
                                                        label="Turn Off notification"
                                                        checked={
                                                            offNotification
                                                        }
                                                        onChange={() => {
                                                            setOffNotification(!offNotification)
                                                        }}
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    {(offNotification === false) && (
                                                        <div>
                                                            <TextContainer>Select Notification Time</TextContainer>
                                                            <TimePicker
                                                                onChange={setTime}
                                                                value={time}
                                                                amPmAriaLabel="Select AM /PM"
                                                            />
                                                            <p>Selected Time: {time}</p>
                                                        </div>
                                                    )}
                                                </FormLayout.Group>
                                                <FormLayout.Group>
                                                    <Select
                                                        options={satusOptions}
                                                        label="Status"
                                                        value={values.status}
                                                        error={
                                                            touched.status &&
                                                            errors?.status
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `status`,
                                                                e
                                                            )
                                                        }
                                                    />
                                                </FormLayout.Group>
                                            </FormLayout>
                                        </Card.Section>
                                        <Card.Section>
                                            <FormLayout>
                                                <TextContainer>
                                                    <Subheading>Choose Rebuy Offer Mode</Subheading>
                                                </TextContainer>
                                                <div className="limit-section">

                                                    <FormLayout.Group>
                                                        <Checkbox
                                                            label="Auto( 5 most popular variant ids)"
                                                            checked={
                                                                rebuyType === 'auto'
                                                            }
                                                            onChange={(e) => {
                                                                setrebuyType(
                                                                    'auto'
                                                                );
                                                            }}
                                                        />
                                                        <Checkbox
                                                            label="All Products"
                                                            checked={
                                                                rebuyType === 'all_products'
                                                            }
                                                            onChange={(e) => {
                                                                setrebuyType(
                                                                    'all_products'
                                                                );
                                                            }}
                                                        />
                                                        <Checkbox
                                                            label="Create Rebuy Offer from Shopify Collection"
                                                            checked={
                                                                rebuyType === 'Collection'
                                                            }
                                                            onChange={(e) => {
                                                                setrebuyType(
                                                                    e === true ? 'Collection' : ''
                                                                );
                                                            }}
                                                        />
                                                        <Checkbox
                                                            label="Create Rebuy Offer from Shopify Products"
                                                            checked={
                                                                rebuyType === 'Product'
                                                            }
                                                            onChange={(e) => {
                                                                setrebuyType(
                                                                    e === true ? 'Product' : ''
                                                                );
                                                            }}
                                                        />
                                                    </FormLayout.Group>
                                                    <FormLayout.Group>
                                                        {rebuyType ===
                                                            'Collection' && (
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
                                                        {rebuyType ===
                                                            'Product' && (
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
                                                    {rebuyType ===
                                                        'Collection' && (
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
                                                    {rebuyType ===
                                                        'Product' && (
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
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    <Button onClick={handleSubmit}>Save</Button>
                                                </FormLayout.Group>
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

export default CreateRebuy;
