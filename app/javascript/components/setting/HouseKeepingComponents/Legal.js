import { Layout, Stack } from '@shopify/polaris'
import React from 'react'

const Legal = ({handleBack}) => {
    return (
        <Layout>
            <Layout.Section>
                <Stack>
                    <Stack.Item >
                        <p className="pointer" onClick={handleBack}>{'< Back'}</p>
                    </Stack.Item>
                </Stack>
            </Layout.Section>
            Legal Content
        </Layout>
    )
}

export default Legal
