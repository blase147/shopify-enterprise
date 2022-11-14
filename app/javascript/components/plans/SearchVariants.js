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

const SearchVariants = (props) => {
  const { value, setFieldValue, fieldName, allVariants, error, setAllVarients } = props;
  // Search variant to add
  const GET_VARIANTS = gql`
  query ($query: String!) {
    productVariants(first: 10, query: $query) {
        edges {
            node {
                    id
                    title
                    product {
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
}
  `;

  const [variantList, setvariantList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [GetProducts, { loading, data, errors }] = useLazyQuery(GET_VARIANTS, {
    fetchPolicy: 'no-cache',
    context: { clientName: 'shopify-link' },
  });

  useEffect(() => {
    if (data && data.productVariants) {
      setvariantList(() => {
        const result = [];
        data.productVariants.edges.map((variant) =>
          result.push({
            value: `${variant.node.title} - ${variant.node.product.title}`,
            label: `${variant.node.title} - ${variant.node.product.title}`,
            id: variant.node.id,
            images: variant.node.product.images.edges.map(img => {
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
      setFieldValue(fieldName, { title: value, variantId: '' });
      if (value) {
        GetProducts({ variables: { query: `title:*${value}*` } });
      }
    },
    [value]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selected?.length > 0) {
        const variant = variantList.find((item) => item.value === selected[0]);
        setFieldValue(fieldName, {
          title: variant.value,
          variantId: variant.id,
          image: variant.images[0],
        });
        setSelectedOptions(selected);



        let flag = true;

        for (let i = 0; allVariants?.length > i; i++) {
          if (allVariants[i]?.title == variant.value) {
            flag = false;
            break;
          } else {
            flag = true;
          }
        }

        if (flag) {
          allVariants ? allVariants.push({
            title: variant.value,
            variantId: variant.id,
            image: variant.images[0]
          }) : allVariants = [{
            title: variant.value,
            variantId: variant.id,
            image: variant.images[0]
          }];
        }
        setAllVarients(allVariants)
      }
    },
    [variantList, value]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      type="text"
      value={value.title}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search for variant to add"
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
      options={variantList ?? variantList}
      selected={selectedOptions}
      onSelect={updateSelection}
      textField={textField}
      emptyState={emptyState}
      willLoadMoreResults={true}
    />
  );
};

export default SearchVariants;
