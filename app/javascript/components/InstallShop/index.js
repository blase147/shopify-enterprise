import { Card, Frame, Layout, Page } from '@shopify/polaris';
import React from 'react';
import "./loginWithoutShop.css";
const InstallShop = () => {
    return (
        <div className='module-navbar'>
            <div className='loginWithoutShopMain app_content'>
                <Frame>
                    <Page>
                        <Layout>
                            <Layout.Section>
                                <Card>
                                    <Card.Section>
                                        <main className="container" role="main">
                                            <h3 className="title">
                                                Shopify App&nbsp;–&nbsp;Installation
                                            </h3>
                                            <p className="subtitle">
                                                <label htmlFor="shop">Enter your shop domain to log in or install this app.</label>
                                            </p>

                                            <form action="/login" acceptCharset="UTF-8" method="post">
                                                <input id="shop" name="shop" type="text" autoFocus="autoFocus" placeholder="example.myshopify.com" className="marketing-input" />
                                                <button type="submit" className="marketing-button">Install</button>
                                            </form>
                                        </main>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                        </Layout>
                    </Page>
                </Frame>
            </div>
        </div>
    )
}

export default InstallShop;