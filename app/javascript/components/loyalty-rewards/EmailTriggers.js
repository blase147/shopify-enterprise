import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  FormLayout,
  DisplayText,
  Heading, 
  TextField
} from '@shopify/polaris';

const EmailTriggers = () => {
  const [name, setName] = useState('');
  const handleName = useCallback((newValue) => setName(newValue), []);
  const [email, setEmail] = useState('');
  const handleEmail = useCallback((newValue) => setEmail(newValue), []);
  const [notification, setNotification] = useState('');
  const handleNotification = useCallback((newValue) => setNotification(newValue), []);
  const [referral, setReferral] = useState('');
  const handleReferral = useCallback((newValue) => setReferral(newValue), []);
    
  return (
    <FormLayout>
      <Card 
        title="Triggered Email Settings" 
        sectioned 
      > 
        <div>
          <TextField
            label="From Name"
            value={name}
            onChange={handleName}
            autoComplete="off"
          />
          <TextField
            label="From Email"
            value={email}
            onChange={handleEmail}
            autoComplete="off"
          />
          <TextField
            label="Trigger Customer Reminder Notification..."
            placeholder='After 30 days of inactivity'
            type="number"
            value={notification}
            onChange={handleNotification}
            autoComplete="off"
          />
          <TextField
            label="Trigger Referral Reminder Notification..."
            placeholder='After 30 days of inactivity'
            type="number"
            value={referral}
            onChange={handleReferral}
            autoComplete="off"
          />
        </div>
      </Card>
    </FormLayout>
  );
}
export default EmailTriggers;