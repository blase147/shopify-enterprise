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
  const {
    selectedOptions,
    setSelectedOptions,
    selectedCollections,
    setSelectedCollections,
  } = props;

  // Search collections to add
  const GET_COLLECTION = gql`
    query($query: String!) {
      collections(first: 5, query: $query) {
        edges {
          node {
            id
            title
            products(first: 20) {
              edges {
                node {
                  id
                  title
                  featuredImage {
                    id
                    transformedSrc
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const [collectionList, setCollectionList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [GetCollections, { loading, data, errors }] = useLazyQuery(GET_COLLECTION, {
    fetchPolicy: 'no-cache',
    context: { clientName: 'shopify-link' },
  });

  useEffect(() => {
    if (data && data.collections) {
      setCollectionList(() => {
        const result = [];
        data.collections.edges.map((collection) => {
          let productsList = [];
          collection.node.products.edges.map((product) =>
            productsList.push({
              productId: product.node.id,
              label: product.node.title,
              image: product.node.featuredImage?.transformedSrc,
              _destroy: false
            })
          );
          result.push({
            value: collection.node.id,
            label: collection.node.title,
            products: productsList
          })
        });
        return result;
      });
    }
  }, [data]);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);
      if (value) {
        GetCollections({ variables: { query: `title:*${value}*` } });
      }
    },
    [collectionList]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      placeholder="Search for a product(s) to add..."
    />
  );

  const removeTag = (index) => {
    setSelectedCollections(() => {
      let newSelectedCollection = [...(selectedCollections || [])];
      newSelectedCollection[index]._destroy = true;
      return newSelectedCollection;
    });
  };

  const handelSelected = (selected) => {
    if (
      selected.length >
        selectedCollections.filter((item) => item._destroy === false).length &&
      !selectedCollections.find((collection) => collection.value === selected[0])
    ) {
      setSelectedOptions(selected);
      setSelectedCollections(() => {
        let newCollectionList = [...selectedCollections];
        const newItemIndex = collectionList.findIndex(
          (item) => item.value === selected[0]
        );

        const isHave = newCollectionList.findIndex(
          (collection) => collection.collectionId === collectionList[newItemIndex].value
        );

        if (isHave != -1) {
          newCollectionList[isHave]._destroy = false;
        } else {
          newCollectionList.push({
            collectionId: collectionList[newItemIndex].value,
            collectionTitle: collectionList[newItemIndex].label,
            products: collectionList[newItemIndex].products,
            _destroy: false,
          });
        }
        return newCollectionList;
      });
    } else {
      for (var i = 0; i < selectedCollections.length; i++) {
        if (!selected.find((item) => item === selectedCollections[i].collectionId)) {
          removeTag(i);
        }
      }
      setSelectedOptions(selected);
    }
  };

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
      allowMultiple
      options={collectionList}
      selected={selectedOptions}
      textField={textField}
      onSelect={(selected) => handelSelected(selected)}
      listTitle="Suggested Tags"
      loading={loading}
      emptyState={emptyState}
      willLoadMoreResults={true}
    />
  );
};

export default SearchCollection;
