import React, { useCallback, useEffect, useState } from 'react'
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
import SellingPlans from './SellingPlans';
import { NoteMinor } from '@shopify/polaris-icons';
import Papa from 'papaparse';
const CustomerMigration = () => {
    const initFormValues = { customer_id: '', next_billing_date: '', delivery_date: '', delivery_price: '', variant_id: '', quantity: '', current_price: '', billing_policy_interval: '', billing_policy_interval_count: '', delivery_policy_interval: '', delivery_policy_interval_count: '', payment_method: '' }
    const [formField, setFormField] = useState(initFormValues)
    const handleChange = (e) => {
        setFormField({ ...formField, [e.target.name]: e.target.value })
    }
    const [toastActive, setToastActive] = useState(false);
    const toggleToastActive = useCallback(() => setToastActive((toastActive) => !toastActive), []);
    const [toastContent, setToastContent] = useState("");
    const submitForm = () => {
        fetch('/subscriptions/customer_migration', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "data": formField, "customer_id": selectedCustomers, "sellingplan": selectedSellingPlan })
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

    const [selectedSellingPlan, setSelectedSellingPlan] = useState('');
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
        fetch(`/subscriptions/fetch_customers_from_shopify?query=${value}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then((data) => {
                var tempData = [];
                data.customers?.map((customer) => {
                    tempData.push({ value: customer.data.node.id, label: customer.data.node.email })
                })
                setDeselectedOptions(tempData);
            }
            );
    }
    useEffect(() => {
        fetchCustomers("")
    }, [])

    const handleImportCustomer = () => {
        const rcs = [];
        const tempData = csvData.slice(1);
        tempData?.map((item) => {
            if (item[0]) {
                rcs.push({
                    customer_email: item[0],
                    sellingplan: `gid://shopify/SellingPlan/${item[8]}`,
                    data: {
                        customer_email: item[0],
                        payment_method: item[1],
                        next_billing_date: item[2],
                        delivery_date: item[3],
                        delivery_price: `${[4]}`,
                        variant_id: item[5],
                        quantity: item[6],
                        current_price: item[7],
                    }
                });
            }
        });

        fetch('/subscriptions/import_customer_migrations', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "data": rcs })
        }).then(response => response.json())
            .then((data) => {
                setToastActive(true)
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            })
        setFile();
    };

    return (
        <div className='customer_migration'>
            <Frame>
                {
                    toastActive && (
                        <Toast content={toastContent} onDismiss={toggleToastActive} />
                    )
                }
                <Page primaryAction={
                    <Button
                        onClick={() => {
                            toggleActive();
                            setFile();
                        }}
                    >
                        Import Customer Migrations
                    </Button>
                }>
                    <Form>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    <CustomerAutocomplete fetchCustomers={fetchCustomers} deselectedOptions={deselectedOptions} setSelectedCustomers={setSelectedCustomers} />
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    Select Customer Payment Method: {"\n"}
                                    <select className="form-control" onChange={(e) => handleChange(e)} name="payment_method" >
                                        <option value="shopify_payment">Shopify Payment</option>
                                        <option value="stripe">Strip</option>
                                    </select>
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    Next Billing Date: {"\n"}
                                    <input type="date" className="form-control" onChange={(e) => handleChange(e)} name="next_billing_date" />
                                </label>
                                <label>
                                    Delivery Date: {"\n"}
                                    <input type="date" className="form-control" onChange={(e) => handleChange(e)} name="delivery_date" />
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    Delivery Price:
                                    <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="delivery_price" />
                                </label>
                                <label>
                                    Variant Id:
                                    <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="variant_id" />
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    Quantity:
                                    <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="quantity" />
                                </label>
                                <label>
                                    Current Price:
                                    <input type="text" className="form-control" onChange={(e) => handleChange(e)} name="current_price" />
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <FormLayout>
                            <FormLayout.Group>
                                <label>
                                    <SellingPlans setSelectedSellingPlan={setSelectedSellingPlan} selectedSellingPlan={selectedSellingPlan} />
                                </label>
                            </FormLayout.Group>
                        </FormLayout>
                        <Button onClick={submitForm}>Submit</Button>
                    </Form>
                </Page>
                <Modal
                    large
                    open={active}
                    onClose={toggleActive}
                    title="Import customer migrations by CSV"
                    primaryAction={{
                        content: 'Import customer migrations',
                        onAction: () => {
                            toggleActive();
                            handleImportCustomer();
                            // parsedata;
                        },
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => {
                                toggleActive();
                                setFile();
                            },
                        },
                    ]}
                >
                    <Modal.Section>
                        <Stack vertical>
                            <DropZone
                                allowMultiple={false}
                                onDrop={handleDropZoneDrop}
                                accept=".csv"
                                errorOverlayText="File type must be .csv"
                                type="file"
                            >
                                {uploadedFile}
                                {fileUpload}
                            </DropZone>
                            {/* <Checkbox
              checked={checked}
              label="Overwrite existing customers that have the same customer ID"
              onChange={handleCheckbox}
            /> */}
                        </Stack>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    )
}
export default CustomerMigration