import { Layout, Stack } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import Discount from './Discount'
import DiscountForm from './DiscountForm'

const MainDiscount = ({handleBack}) => {

  const [showForm,setShowForm]=useState(false)

  const handleShowForm=useCallback(
    () => {
     setShowForm(true)
    },
    [setShowForm]
  )
  const handleCloseForm=useCallback(
    () => {
     setShowForm(false);
    },
    [setShowForm]
  )

  return (
    <>
      <Layout>
        <Layout.Section>
          <Stack>
            <Stack.Item>
              <p className="pointer" onClick={handleBack}>
                {'< Back'}
              </p>
            </Stack.Item>
          </Stack>
        </Layout.Section>
      </Layout>
      {showForm ? (
        <DiscountForm handleCloseForm={handleCloseForm} />
      ) : (
        <Discount handleDiscountCodeForm={handleShowForm} />
      )}
    </>
  );
}

export default MainDiscount
