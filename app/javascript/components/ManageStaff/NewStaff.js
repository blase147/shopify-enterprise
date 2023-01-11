import { Button, Card, FormLayout, Layout, Page, TextField } from '@shopify/polaris';
import { method } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../layout/Layout';

const NewStaff = ({ setFormErrors, setSaveSuccess, refetch, setAddStaff }) => {
    const [checkedSettings, setCheckedSettings] = useState([]);
    const [formData, setFormData] = useState({ firstName: null, lastName: null, email: null, password: null, confirmPassword: null });

    const handleChange = (event) => {
        let settings = checkedSettings
        if (event?.target?.checked) {
            settings.push(event?.target?.value)
        } else {
            let indexOf = settings?.indexOf(event?.target?.value)
            settings.splice(indexOf, 1)
        }
        setCheckedSettings(settings)
    }

    const submitForm = () => {
        let success = true;
        let formErrors = []
        if (!formData?.email) {
            formErrors.push({ message: "Please Enter a email" })
            success = false
        }
        if (!formData?.password) {
            formErrors.push({ message: "Please Enter a Password" })
            success = false
        }
        if (formData?.password?.lenght < 6) {
            formErrors.push({ message: "Minimum length of password should 6" })
            success = false
        } else if ((formData?.password != formData?.confirmPassword)) {
            formErrors.push({ message: "Password and confirm Password should be same" })
            success = false
        }
        if (success) {
            fetch("user_shops/create_user_shop_child", {
                method: "POST",
                body: JSON.stringify({ user_data: formData, settings: checkedSettings, shop_domain: localStorage.getItem("currentShopDomain") }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            ).then((response) => response.json())
                .then((data) => {
                    console.log("datafdsfsdfsdfds", data);
                    if (data?.error) {
                        formErrors.push({ message: JSON.stringify(data?.error) })
                        setFormErrors(formErrors)
                    } else {
                        refetch()
                        setAddStaff(false)
                        setSaveSuccess(success)
                    }
                })
        } else {
            setFormErrors(formErrors)
        }
    }
    return (
        <>
            <Page
                title="Add Staff"
            >
                <Card>
                    <Card.Section>
                        <Layout>
                            <Layout.Section>
                                <div className='add_staff_main'>
                                    <FormLayout>
                                        <FormLayout.Group>
                                            <TextField
                                                label="First Name"
                                                type="text"
                                                value={formData?.firstName}
                                                onChange={(val) => { setFormData({ ...formData, firstName: val }) }}
                                            ></TextField>
                                            <TextField
                                                label="Last Name"
                                                value={formData?.lastName}
                                                onChange={(val) => { setFormData({ ...formData, lastName: val }) }}
                                            ></TextField>
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                value={formData?.email}
                                                onChange={(val) => { setFormData({ ...formData, email: val }) }}
                                            ></TextField>
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <TextField
                                                label="Password"
                                                type="password"
                                                value={formData?.password}
                                                onChange={(val) => { setFormData({ ...formData, password: val }) }}
                                            ></TextField>
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <TextField
                                                label="Confirm Password"
                                                type="password"
                                                value={formData?.confirmPassword}
                                                onChange={(val) => { setFormData({ ...formData, confirmPassword: val }) }}
                                            ></TextField>
                                        </FormLayout.Group>
                                    </FormLayout>
                                </div>
                                <div className='add_staff_settings'>
                                    <label>
                                        <input type='checkbox' className='settings' value="dashboard_access" onChange={(e) => handleChange(e)} />
                                        Dashboard
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="manage_plan_access" onChange={(e) => handleChange(e)} />
                                        Mange Plans
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="subscription_orders_access" onChange={(e) => handleChange(e)} />
                                        Subscriptions Orders
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="analytics_access" onChange={(e) => handleChange(e)} />
                                        Analytics
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="installation_access" onChange={(e) => handleChange(e)} />
                                        Installation
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="tiazen_access" onChange={(e) => handleChange(e)} />
                                        Tiazen
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="toolbox_access" onChange={(e) => handleChange(e)} />
                                        Toolbox
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="settings_access" onChange={(e) => handleChange(e)} />
                                        Settings
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="ways_to_earn" onChange={(e) => handleChange(e)} />
                                        WaysToEarn Point
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="customer_modal" onChange={(e) => handleChange(e)} />
                                        Customer Modal
                                    </label>
                                    <label>
                                        <input type='checkbox' className='settings' value="manage_staff" onChange={(e) => handleChange(e)} />
                                        Manage Staff
                                    </label>
                                </div>
                                <div className='submit'>
                                    <Button onClick={() => submitForm()}>Save Changes</Button>
                                </div>
                            </Layout.Section>
                        </Layout>
                    </Card.Section>
                </Card>
            </Page>
        </>
    )
}

export default NewStaff;