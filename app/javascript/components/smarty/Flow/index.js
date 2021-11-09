import React, { useState, useEffect } from 'react';
import {
  Card,
  Spinner,
  Button,
  Stack,
  DataTable,
  Heading,
} from '@shopify/polaris';
import ToggleButton from 'react-toggle-button';

const FlowIndex = ({ handleEditFlow }) => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/sms_flows', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        setFlows(data);
        setLoading(false);
      });
  }, []);
  console.log('flows: ' + flows);
  return (
    <Card sectioned>
      <Stack>
        <Heading>Collect Subscribers</Heading>
        <Stack.Item fill />
        <Button primary>Create Flow</Button>
      </Stack>
      <br />
      <DataTable
        columnContentTypes={[
          'text',
          'numeric',
          'numeric',
          'text',
          'text',
          'text',
        ]}
        headings={['Name', 'Sent', 'Clicks', 'Revenue', 'Status', 'Actions']}
        rows={
          !loading && flows && flows.length > 0
            ? flows.map((flow) => [
                flow.name,
                flow.sent,
                flow.clicks,
                `$${flow.revenue}`,
                <ToggleButton
                  inactiveLabel={''}
                  activeLabel={''}
                  value={flow.status}
                  onToggle={(value) => {
                    console.log('toggle');
                  }}
                />,
                <Button primary onClick={() => handleEditFlow(flow.id)}>
                  Edit
                </Button>,
              ])
            : []
        }
      />
      {loading && (
        <Spinner
          accessibilityLabel="Spinner example"
          size="large"
          color="teal"
        />
      )}
    </Card>
  );
};

export default FlowIndex;
