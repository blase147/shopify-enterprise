import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  DataTable,
  Stack,
  Spinner,
  EmptyState,
  Heading,
  Icon,
} from '@shopify/polaris';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';

const Bundles = ({ handleForm, handleBack }) => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/bundle_groups', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        setBundles(data);
        setLoading(false);
      });
  }, []);

  const removeBundleGroup = (id) => {
    fetch(`/bundle_groups/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const newBundles = [...bundles];
          const removedBundle = newBundles.indexOf(newBundles.find(b => b.id == id))
          newBundles.splice(removedBundle, 1);
          setBundles(newBundles);
        }
      });
  }

  return (
    <>
      <div className="back-button pointer" onClick={handleBack}>
        <Icon source={MobileBackArrowMajor} color="base" />
      </div>
      <Card sectioned>
        <Stack>
          <Heading>My Bundles</Heading>
          <Stack.Item fill />
          <Button primary onClick={() => handleForm('')}>
            Create Bundle
          </Button>
        </Stack>
        <br />
        {loading ? (
          <Spinner
            accessibilityLabel="Spinner example"
            size="large"
            color="teal"
          />
        ) : bundles.length === 0 ? (
          <EmptyState
            heading="Generate Bundles"
            action={{
              content: 'Create bundle',
              onAction: () => handleForm(''),
            }}
            image="/not_found.png"
          >
            <p>Create bundles for your customers.</p>
          </EmptyState>
        ) : (
          <DataTable
            columnContentTypes={['text', 'text', 'text']}
            headings={['Name', 'Location', '']}
            rows={
              !loading && bundles && bundles.length > 0
                ? bundles.map((bundle) => [
                    bundle.internal_name,
                    bundle?.location?.replace('_', ' '),
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                      <Button primary onClick={() => handleForm(bundle.id)}>
                        Edit
                      </Button>
                      <Button destructive onClick={() => removeBundleGroup(bundle.id)}>
                        Delete
                      </Button>
                    </div>
                  ])
                : []
            }
          />
        )}
      </Card>
    </>
  );
};

export default Bundles;
