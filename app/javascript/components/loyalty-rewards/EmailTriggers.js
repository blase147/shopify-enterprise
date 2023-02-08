import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    Card,
    FormLayout,
    DisplayText,
    Heading,
    Stack,
    Select,
    Button,
    TextField
} from '@shopify/polaris';
import { DomainContext } from '../domain-context';

const EmailTriggers = () => {
    const { domain } = useContext(DomainContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState(0);
    const [referral, setReferral] = useState(0);

    useEffect(() => {
        fetch(`/loyalty_email_settings?shopify_domain=${domain}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setName(data.settings?.name);
                    setEmail(data.settings?.email);
                    setNotification(data.settings?.notification.toString());
                    setReferral(data.settings?.referral.toString());
                }
            })
    }, [])

    const saveEmailSettings = () => {
        fetch('/loyalty_email_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, email: email, notification: notification, referral: referral, shopify_domain: domain })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // if(data.status){
                // }
            })
    }

    return (
        <FormLayout>
            <Card
                sectioned
                footerActionAlignment="left"
            >
                <div className='card-box'>
                    <h2 className='blue-title'>Triggered Email Settings</h2>
                    <p className='description'>Automatically send customized emails about your rewards program.</p>

                    <div className='form-holder'>
                        <TextField
                            label="From Name"
                            placeholder='Name'
                            type="text"
                            value={name}
                            onChange={useCallback((newValue) => setName(newValue), [])}
                            autoComplete="off"
                        />
                        <TextField
                            label="From Email"
                            placeholder='Email'
                            type="email"
                            value={email}
                            onChange={useCallback((newValue) => setEmail(newValue), [])}
                            autoComplete="off"
                        />
                        <TextField
                            label="Trigger Customer Reminder Notification..."
                            placeholder='30'
                            type="number"
                            min="0"
                            prefix={"After"}
                            suffix={"days of inactivity"}
                            value={notification}
                            onChange={useCallback((newValue) => setNotification(newValue), [])}
                            autoComplete="off"
                        />
                        <TextField
                            label="Trigger Referral Reminder Notification..."
                            placeholder='3'
                            type="number"
                            min="0"
                            prefix={"After"}
                            suffix={"days without purchase"}
                            value={referral}
                            onChange={useCallback((newValue) => setReferral(newValue), [])}
                            autoComplete="off"
                        />
                        <Button primary onClick={saveEmailSettings}> Save </Button>
                    </div>
                </div>

                <div className='holder'>
                    <br />
                    <div className='cards-list'>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">VIP TIER EARNED</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers an email when they reach a new tier.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Coupon Earned (Customer)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers an email confirmation each time they redeem their points for a coupon.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Points Used (Merchant)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Receive an email each time one of your customers redeems their points for a coupon</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Points Reminder (Customer)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers an email when they reach a new tier.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Points Used (Merchant)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Receive an email each time one of your customers redeems their points for a coupon</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Points Reminder (Customer)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers an email when they reach a new tier.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Redemption Reminder (Customer)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers an email to tell them they have enough points for a discount.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Referrer Thank You</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers a thank you email when they refer someone to your store.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Referrer Thank You</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers a thank you email when they refer someone to your store.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Referral Share Email</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>The email your customers send to tell their friends about your store.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Referral Share Email Reminder</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers a reminder about their discount.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Happy Birthday</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Send your customers an email on their birthday.</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                        <Card sectioned>
                            <div className='card-header' id='not-activated'>
                                <Heading element="h2">Referral Link Disabled (Merchant)</Heading>
                                <div className='button-holder'>
                                    <Button primary outline size="slim">Enable Notification</Button>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>Receive an email when Swell disables a customer's referral link due to block domain activity detection</p>
                                <Stack distribution="fill">
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Sent</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Opened</p>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <p><strong>0</strong> Emails Clicked</p>
                                    </Stack.Item>
                                </Stack>
                            </div>
                            <div className='card-footer button-holder'>
                                <Stack>
                                    <Stack.Item>
                                        <Button primary outline size="slim">Customize Email</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button id="success-outline" outline size="slim">Send Preview Email</Button>
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
        </FormLayout>
    );
}
export default EmailTriggers;
