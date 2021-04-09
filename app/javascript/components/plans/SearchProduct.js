import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Stack,
  Modal,
  TextContainer,
  Autocomplete,
  Icon,
} from '@shopify/polaris';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SearchMinor } from '@shopify/polaris-icons';
import removeIcon from '../../../assets/images/subscriptionsPlans/removeProduct.svg';

const SearchProduct = (props) => {
  const {
    selectedOptions,
    setSelectedOptions,
    selectedProducts,
    setSelectedProducts,
  } = props;

  const GET_PRODUCT = gql`
    query($query: String!) {
      products(first: 10, query: $query) {
        edges {
          node {
            id
            title
            featuredImage {
              id
              transformedSrc
            }
            description
          }
        }
      }
    }
  `;

  const [productList, setProductList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [GetProducts, { loading, data, errors }] = useLazyQuery(GET_PRODUCT, {
    fetchPolicy: 'no-cache',
    context: { clientName: 'shopify-link' },
  });

  useEffect(() => {
    if (data && data.products) {
      setProductList(() => {
        const result = [];
        data.products.edges.map((product) =>
          result.push({
            value: product.node.id,
            label: product.node.title,
            image: product.node.featuredImage?.transformedSrc,
          })
        );

        return result;
      });
    }
  }, [data]);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);
      if (value) {
        GetProducts({ variables: { query: `title:*${value}*` } });
      }
    },
    [productList]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      placeholder="Search for a product(s) to add..."
    />
  );

  const handelSelected = (selected) => {
    if (
      selected.length >
        selectedProducts.filter((item) => item._destroy === false).length &&
      !selectedProducts.find((product) => product.value === selected[0])
    ) {
      setSelectedOptions(selected);
      setSelectedProducts(() => {
        let newProductList = [...selectedProducts];
        const newItemIndex = productList.findIndex(
          (item) => item.value === selected[0]
        );

        const isHave = newProductList.findIndex(
          (product) => product.productId === productList[newItemIndex].value
        );

        if (isHave != -1) {
          newProductList[isHave]._destroy = false;
        } else {
          newProductList.push({
            productId: productList[newItemIndex].value,
            image: productList[newItemIndex].image,
            _destroy: false,
          });
        }

        return newProductList;
      });
    } else {
      for (var i = 0; i < selectedProducts.length; i++) {
        if (!selected.find((item) => item === selectedProducts[i].productId)) {
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
      options={productList}
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

export default SearchProduct;
