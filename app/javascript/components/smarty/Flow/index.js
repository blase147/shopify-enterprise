import React, { useState, useEffect } from 'react';
import {
  Card,
  Spinner,
  Button,
  Stack,
  DataTable,
  Heading,
  EmptyState,
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

  return (
    <Card sectioned>
      <Stack>
        <Heading>My Flows</Heading>
        <Stack.Item fill />
        <Button primary onClick={() => handleEditFlow('')}>
          Create Flow
        </Button>
      </Stack>
      <br />
      {loading ? (
        <Spinner
          accessibilityLabel="Spinner example"
          size="large"
          color="teal"
        />
      ) : flows.length === 0 ? (
        <EmptyState
          heading="Generate Automated Flows"
          action={{
            content: 'Create Flow',
            onAction: () => handleEditFlow(''),
          }}
          image="/not_found.png"
        >
          <p>Create flows and notify customers using SMS.</p>
        </EmptyState>
      ) : (
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
              ? flows
                  .sort((a, b) => (b.created_at > a.created_at ? 1 : -1))
                  .map((flow) => [
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
                        const newFlow = { ...flow };
                        newFlow.status = !value;
                        fetch(`/sms_flows/${flow.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(newFlow),
                        })
                          .then((response) => response.json())
                          //Then with the data from the response in JSON...
                          .then((newFlow) => {
                            console.log('Success:', newFlow);
                            const newFlows = [...flows];
                            newFlows.find((f) => f.id == newFlow.id).status =
                              newFlow.status;
                            setFlows(newFlows);
                          });
                      }}
                    />,
                    <Button primary onClick={() => handleEditFlow(flow.id)}>
                      Edit
                    </Button>,
                  ])
              : []
          }
        />
      )}
    </Card>
  );
};

export default FlowIndex;
