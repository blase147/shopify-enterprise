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
} from '@shopify/polaris';
import "./style.css";
import CustomerAutocomplete from './CustomerAutocomplete';
import { NoteMinor } from '@shopify/polaris-icons';
import Papa from 'papaparse';
import mixpanel from 'mixpanel-browser';
import { DomainContext } from '../domain-context';
import StripeProducts from './StripeProducts';

const StripeContract = () => {
    const { domain } = useContext(DomainContext)
    const initFormValues = { email: null, stripe_product: null, stripe_product_name: null }
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
        if (formField?.email, formField?.stripe_product, selectedFile) {
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
                {
                    toastActive && (
                        <Toast content={toastContent} onDismiss={toggleToastActive} />
                    )
                }
                <Page>
                    <Form>
                        {
                            !allFilled && (
                                <FormLayout>
                                    <div className='compulsory_message'>
                                        All fields are compulsory
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
                                    Email: {"\n"}
                                    <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="email" value={formField?.email} />
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    Select or upload file: {"\n"}
                                    <input type="file" className="form-control" name="file" onChange={(e) => UploadFile(e)}
                                        accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    />
                                </label>
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
            </Frame>
        </div>
    )
}
export default StripeContract