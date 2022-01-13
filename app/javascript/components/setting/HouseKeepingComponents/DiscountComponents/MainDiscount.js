import { Icon, Layout, Stack, TextStyle } from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import Discount from './Discount';
import DiscountForm from './DiscountForm';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';

const MainDiscount = ({ handleBack }) => {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, [setShowForm]);
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
  }, [setShowForm]);

  return (
    <>
      <Layout>
        <Layout.Section>
          <div className="back-button pointer" onClick={handleBack}>
            <Icon source={MobileBackArrowMajor} color="base" />
            <p>
              <TextStyle variation="subdued">Settings</TextStyle>
            </p>
          </div>
        </Layout.Section>
      </Layout>
      {showForm ? (
        <DiscountForm handleCloseForm={handleCloseForm} />
      ) : (
        <Discount handleDiscountCodeForm={handleShowForm} />
      )}
    </>
  );
};

export default MainDiscount;
