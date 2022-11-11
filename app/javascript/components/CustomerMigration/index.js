import React, { useEffect, useState } from 'react'
import {
    Form,
    FormLayout,
    Button,
} from '@shopify/polaris';
import "./style.css";
import CustomerAutocomplete from './CustomerAutocomplete';
import SellingPlans from './SellingPlans';
const CustomerMigration = () => {
    const [formField, setFormField] = useState({ customer_id: '', next_billing_date: '', delivery_date: '', delivery_price: '', variant_id: '', quantity: '', current_price: '', billing_policy_interval: '', billing_policy_interval_count: '', delivery_policy_interval: '', delivery_policy_interval_count: '' })
    const handleChange = (e) => {
        setFormField({ ...formField, [e.target.name]: e.target.value })
    }

    const submitForm = () => {
        fetch('/subscriptions/customer_migration', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "data": formField, "customer_id": selectedCustomers, "sellingplan": selectedSellingPlan })
        }).then(response => response.json())
            .then(data => alert(`Your Contract Id is ${data.response}`));
    }

    const [selectedSellingPlan, setSelectedSellingPlan] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState();

    const [deselectedOptions, setDeselectedOptions] = useState([]);
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

    return (
        <div className='customer_migration'>
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
        </div>
    )
}
export default CustomerMigration