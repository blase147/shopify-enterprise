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

const SearchProduct = (props) => {
  const { value, setFieldValue, fieldName, allProducts, error, setAllProducts } = props;
  // Search product to add
  const GET_PRODUCT = gql`
    query($query: String!) {
      products(first: 10, query: $query) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
          }
        }
      }
    }
  `;

  const [productList, setProductList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

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
            value: product.node.title,
            label: product.node.title,
            id: product.node.id,
            images: product.node.images.edges.map(img => {
              return img.node.originalSrc;
            })
          })
        );

        return result;
      });
    }
  }, [data]);

  const updateText = useCallback(
    (value) => {
      setFieldValue(fieldName, { title: value, productId: '' });
      if (value) {
        GetProducts({ variables: { query: `title:*${value}*` } });
      }
    },
    [value]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selected?.length > 0) {
        const product = productList.find((item) => item.value === selected[0]);
        setFieldValue(fieldName, {
          title: product.value,
          productId: product.id,
          image: product.images[0]
        });
        setSelectedOptions(selected);

        let flag = true;

        for (let i = 0; allProducts?.length > i; i++) {
          if (allProducts[i]?.title == product.value) {
            flag = false;
            break;
          } else {
            flag = true;
          }
        }

        if (flag) {
          allProducts ? allProducts.push({
            title: product.value,
            productId: product.id,
            image: product.images[0]
          }):allProducts=[{
            title: product.value,
            productId: product.id,
            image: product.images[0]
          }];
          setAllProducts(allProducts)
        }

      }
    },
    [productList, value]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      type="text"
      value={value.title}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search for product to add"
      error={error}
      suffix={
        loading && (
          <Spinner accessibilityLabel="Small spinner example" size="small" />
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
      options={productList}
      selected={selectedOptions}
      onSelect={updateSelection}
      textField={textField}
      emptyState={emptyState}
    />
  );
};

export default SearchProduct;
