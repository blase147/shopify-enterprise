import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    Form,
    FormLayout,
    Button,
    Frame,
    Toast,
    Page,
    Modal,
    Stack,
    DropZone,
    Thumbnail,
    Caption,
    RadioButton,
    Icon,
    Layout,
} from '@shopify/polaris';
import "./style.css";
import CustomerAutocomplete from './CustomerAutocomplete';
import { NoteMinor } from '@shopify/polaris-icons';
import Papa from 'papaparse';
import mixpanel from 'mixpanel-browser';
import { DomainContext } from '../domain-context';
import StripeProducts from './StripeProducts';
import BankDetail from './BankDetail';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import { useHistory } from 'react-router';

const StripeContract = () => {
    const { domain } = useContext(DomainContext)

    const history = useHistory();
    const initFormValues = { email: null, stripe_product: null, stripe_product_name: null, phone: '', city: '', address1: '', zip_code: '', country: '', state: '', bank_detail: '', payment_by: 'customer' }
    const [formField, setFormField] = useState(initFormValues)
    const handleChange = (e) => {
        setFormField({ ...formField, [e.target.name]: e.target.value })
    }

    const [toastActive, setToastActive] = useState(false);
    const toggleToastActive = useCallback(() => setToastActive((toastActive) => !toastActive), []);
    const [toastContent, setToastContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [allFilled, setAllFilled] = useState(true);
    //Initialise Mixpanel
    mixpanel.init("467d5df251a711e7b0ae20d18c8fb2e1", { debug: true });
    const mixpanelId = localStorage.getItem("distinct_id_admin_chargezen");

    const submitForm = () => {
        if (validateForm()) {
            mixpanel.identify(mixpanelId);
            mixpanel.track("Created Stripe Contract", { customer_id: selectedCustomers });
            const formData = new FormData();
            formData.append("formData", JSON.stringify(formField));
            formData.append("shopify_domain", domain);
            formData.append("file", selectedFile);
            fetch('/createStripeContract', {
                method: "POST",
                body: formData
            }).then(response => response.json())
                .then((data) => {
                    setToastContent(data?.response)
                    if (!data?.error) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000)
                    }
                    setToastActive(true)
                });
        }
    }

    const validateForm = () => {
        // validate form
        if (formField?.email,
            formField?.stripe_product,
            formField?.phone,
            formField?.state,
            formField?.country,
            formField?.city,
            selectedFile
        ) {
            setAllFilled(true);
            return true;
        }
        else {
            setAllFilled(false);
            return false;
        }
    }

    const [selectedStripeProduct, setSelectedStripeProduct] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState();

    const [deselectedOptions, setDeselectedOptions] = useState([]);
    //upload file
    const [active, setActive] = useState(false);
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFile((file) => acceptedFiles[0]),
        []
    );
    const [file, setFile] = useState();
    const fileUpload = !file && <DropZone.FileUpload />;
    const csvData = [];

    const parsedata =
        file &&
        Papa.parse(file, {
            header: false,
            step: function (result) {
                csvData.push(result.data);
            },
            complete: function (results, file) {
                // console.log('csvData: ', csvData);
            },
        });
    const uploadedFile = file && (
        <Stack>
            <Thumbnail size="small" alt={file.name} source={NoteMinor} />
            <div>
                {file.name} <Caption>{file.size} bytes</Caption>
            </div>
        </Stack>
    );

    const fetchCustomers = (value) => {
        fetch(`/fetchStripeCustomers/${domain?.replace('.myshopify.com', '')}?query=${value}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then((data) => {
                var tempData = [];
                data.customers?.map((customer) => {
                    tempData.push({ value: customer, label: customer })
                })
                setDeselectedOptions(tempData);
            }
            );
    }
    useEffect(() => {
        fetchCustomers("")
    }, [])

    const UploadFile = (event) => {
        setSelectedFile(event.target.files[0])
    }

    return (
        <div className='customer_migration'>
            <Frame>
                <Layout>
                    {
                        toastActive && (
                            <Toast content={toastContent} onDismiss={toggleToastActive} />
                        )
                    }
                    <Layout.Section>
                        <Page title={
                            <>
                                <div className="back-button pointer back_button_with_title" onClick={() => history.push('/StripeContractsList')}>
                                    <Icon
                                        source={MobileBackArrowMajor}
                                        color="base" />
                                </div>
                                Create Stripe Contract
                            </>
                        }>
                            <Form>
                                {
                                    !allFilled && (
                                        <FormLayout>
                                            <div className='compulsory_message'>
                                                Please fill all compulsory fields
                                            </div>
                                        </FormLayout>
                                    )
                                }
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            <CustomerAutocomplete fetchCustomers={fetchCustomers} deselectedOptions={deselectedOptions} setSelectedCustomers={setSelectedCustomers} setFormField={setFormField} formField={formField} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            Email<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="email" value={formField?.email} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>

                                {/* Optional fields */}
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            Customer Phone<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="tel" className="form-control" onChange={(e) => handleChange(e)} name="phone" value={formField?.phone} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            Country<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="country" value={formField?.country} />
                                        </label>
                                        <label>
                                            State<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="state" value={formField?.state} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            City<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="city" value={formField?.city} />
                                        </label>
                                        <label>
                                            Postal Code<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="number" className="form-control" onChange={(e) => handleChange(e)} name="zip_code" value={formField?.zip_code} />
                                        </label>

                                    </FormLayout.Group>
                                </FormLayout>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            Address<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="address1" value={formField?.address1} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>

                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            Bank Details<span className='compulsary_mark'>*</span>: {"\n"}
                                            <BankDetail setFormField={setFormField} formField={formField} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>



                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            Select or upload file<span className='compulsary_mark'>*</span>: {"\n"}
                                            <input type="file" className="form-control" name="file" onChange={(e) => UploadFile(e)}
                                                accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <div className='payment_by_options'>
                                            <RadioButton
                                                label="Checkout by Customer"
                                                helpText="Payment can be made by both admin and customer."
                                                name="payment_by"
                                                checked={formField?.payment_by === 'customer'}
                                                onChange={() => setFormField({ ...formField, payment_by: 'customer' })}
                                            />
                                            <RadioButton
                                                label="Checkout by Admin"
                                                helpText="Only admin can make the payment for this contract."
                                                checked={formField?.payment_by === 'admin'}
                                                name="payment_by"
                                                onChange={() => setFormField({ ...formField, payment_by: 'admin' })}
                                            />
                                        </div>
                                    </FormLayout.Group>
                                </FormLayout>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <label>
                                            <StripeProducts setSelectedStripeProduct={setSelectedStripeProduct} selectedStripeProduct={selectedStripeProduct} setFormField={setFormField} formField={formField} />
                                        </label>
                                    </FormLayout.Group>
                                </FormLayout>

                                <Button onClick={submitForm}>Submit</Button>
                            </Form>
                        </Page>
                    </Layout.Section>
                </Layout>
            </Frame>
        </div>
    )
}
export default StripeContract