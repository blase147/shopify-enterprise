import React, { useState, useEffect, useMemo } from 'react';
import {
  DisplayText,
  ButtonGroup,
  Select,
  TextField,
  Button,
  Stack,
  Card,
  Layout,
  Subheading,
  Heading,
  Modal,
} from '@shopify/polaris';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';

const CancellationReasonForm = ({ id, handleClose }) => {
  const fetchQuery = gql`
    query ($id: String!) {
      fetchSmartyCancellationReason(id: $id) {
        id
        winback
        name
      }
    }
  `;

  const addQuery = gql`
    mutation ($input: AddSmartyCancellationInput!) {
      addSmartyCancellation(input: $input) {
        smartyCancellationReason {
          id
          name
          winback
        }
      }
    }
  `;

  const updateQuery = gql`
    mutation ($input: UpdateSmartyCancellationInput!) {
      updateSmartyCancellation(input: $input) {
        smartyCancellationReason {
          id
          name
          winback
        }
      }
    }
  `;

  const winbackOptions = [
    { label: 'skip_order', value: 'skip' },
    { label: 'not_defined', value: 'not_defined' },
    { label: 'swap_product', value: 'swap' },
  ];

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', winback: 'skip' });
  const [getSingleReason, { data }] = useLazyQuery(fetchQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const [addReason, { loading: addLoading }] = useMutation(addQuery);
  const [updateReason, { loading: updateLoading }] = useMutation(updateQuery);

  const validate = () => {
    const { name } = formData;
    const errors = {};
    if (!name) {
      errors.name = 'Please enter a name';
    }
    setErrors(errors);
    return !isEmpty(errors) ? true : false;
  };

  useEffect(() => {
    if (id) {
      getSingleReason({
        variables: {
          id: id,
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      const { name, winback } = data?.fetchSmartyCancellationReason;
      setFormData({ name, winback });
    }
  }, [data]);

  const handleSubmit = () => {
    const { name, winback } = formData;
    if (!validate()) {
      if (id) {
        updateReason({
          variables: {
            input: {
              params: {
                id: id,
                name: name,
                winback: winback,
              },
            },
          },
        });
      } else {
        addReason({
          variables: {
            input: {
              params: {
                name: name,
                winback: winback,
              },
            },
          },
        });
      }
    }
  };

  return (
    <Modal open={true} onClose={handleClose}>
      <Card>
        <Card.Section>
          <Heading>Add New Cancellation Reasons</Heading>
        </Card.Section>
        <Card.Section>
          <div className="cancel-reason-inputs">
            <TextField
              label="Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
            />

            <Select
              label="Winback"
              options={winbackOptions}
              value={formData.winback}
              onChange={(value) => setFormData({ ...formData, winback: value })}
            />
          </div>
        </Card.Section>
        <Card.Section subdued>
          <Stack distribution="trailing">
            <ButtonGroup>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                primary
                loading={updateLoading || addLoading}
                onClick={handleSubmit}
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </ButtonGroup>
          </Stack>
        </Card.Section>
      </Card>
    </Modal>
  );
};

export default CancellationReasonForm;
