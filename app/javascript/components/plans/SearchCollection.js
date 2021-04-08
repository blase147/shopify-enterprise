import React, { useState, useCallback, useEffect } from 'react';
import { SearchMinor } from '@shopify/polaris-icons';
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client';
import {
  Autocomplete,
  TextField,
  Icon,
  TextContainer,
  Spinner,
} from '@shopify/polaris';

const SearchCollection = (props) => {
  const { value, setFieldValue, fieldName, error } = props;

  // Search collections to add
  const GET_COLLECTION = gql`
    query($query: String!) {
      collections(first: 10, query: $query) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;

  const [collectionList, setCollectionList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [GetCollections, { loading, data, errors }] = useLazyQuery(GET_COLLECTION, {
    fetchPolicy: 'no-cache',
    context: { clientName: 'shopify-link' },
  });

  useEffect(() => {
    if (data && data.collections) {
      setCollectionList(() => {
        const result = [];
        data.collections.edges.map((collection) =>
          result.push({
            value: collection.node.title,
            label: collection.node.title,
            id: collection.node.id,
          })
        );

        return result;
      });
    }
  }, [data]);

  const updateText = useCallback(
    (value) => {
      setFieldValue(fieldName, { title: value, collectionId: '' });
      if (value) {
        GetCollections({ variables: { query: `title:*${value}*` } });
      }
    },
    [value]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selected?.length > 0) {
        const collection = collectionList.find((item) => item.value === selected[0]);
        setFieldValue(fieldName, {
          title: collection.value,
          collectionId: collection.id,
        });
        setSelectedOptions(selected);
      }
    },
    [collectionList, value]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      type="text"
      value={value.title}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search for collections to add"
      error={error}
      suffix={
        loading && (
          <Spinner accessibilityLabel="Loading" size="small" />
        )
      }
    />
  );

  const emptyState = (
    <React.Fragment>
      <Icon source={SearchMinor} />
      <div style={{ textAlign: 'center' }}>
        <TextContainer>Could not find any results</TextContainer>
      </div>
    </React.Fragment>
  );

  return (
    <Autocomplete
      options={collectionList}
      selected={selectedOptions}
      onSelect={updateSelection}
      textField={textField}
      emptyState={emptyState}
    />
  );
};

export default SearchCollection;
