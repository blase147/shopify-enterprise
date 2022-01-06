import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  Select,
  FormLayout,
  Button,
  Icon,
  Modal,
  TextField,
  Layout,
  Page,
  Stack,
  Tabs,
  ColorPicker,
} from '@shopify/polaris';

const Campaigns = () => {
    
  return (
    <>
        <FormLayout>
            <Card 
                title="Campaigns" 
                sectioned 
            />
        </FormLayout>
    </>
  );
}
export default Campaigns;