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

const AppendProductsModal = (props) => {
  const {
    active,
    setActiveModal,
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

  const removeTag = (index) => {
    setSelectedProducts(() => {
      let newSelectedProduct = [...(selectedProducts || [])];
      newSelectedProduct[index]._destroy = true;
      return newSelectedProduct;
    });
  };

  const tagsMarkup = selectedProducts.map((product, index) => (
    <div
      key={index}
      className={`building-box-product ${
        product._destroy == true ? 'hidden' : ''
      }`}
    >
      <img className="product" src={product?.image} />
      <img
        onClick={() => {
          removeTag(index);
          setSelectedOptions([
            ...selectedOptions.slice(0, index),
            ...selectedOptions.slice(index + 1),
          ]);
        }}
        className="removeIcon"
        src={removeIcon}
      />
    </div>
  ));

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Search for product to add"
      value={inputValue}
      placeholder="Search for product to add"
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
    <Modal
      title="Append products (subscription box options)"
      open={active}
      onClose={() => setActiveModal(false)}
    >
      <Modal.Section>
        <TextContainer>
          <Stack>{tagsMarkup}</Stack>
        </TextContainer>
        <br />
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

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Modal.Section>
    </Modal>
  );
};

export default AppendProductsModal;
