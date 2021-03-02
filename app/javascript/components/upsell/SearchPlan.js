import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchMinor } from '@shopify/polaris-icons';
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client';
import {
  Autocomplete,
  TextField,
  Icon,
  TextContainer,
  Spinner,
} from '@shopify/polaris';

const SearchPlan = (props) => {
  const { value, setFieldValue, fieldName, error } = props;

  // Search product to add
  const GET_SELLING_PLAN = gql`
    query($name: String!) {
      fetchSellingPlanByName(name: $name) {
        id
        name
      }
    }
  `;

  const [sellingPlanList, setSellingPlanList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [GetPlans, { loading, data, errors }] = useLazyQuery(GET_SELLING_PLAN, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data && data.fetchSellingPlanByName) {
      handleSetSellingPlan(data.fetchSellingPlanByName);
    }
  }, [data]);

  const handleSetSellingPlan = useCallback(
    (plans) => {
      const result = [];
      plans.map((plan) =>
        result.push({
          value: plan.id,
          label: plan.name,
        })
      );
      if (!loading) {
        setSellingPlanList(result);
      }
    },
    [sellingPlanList]
  );

  useEffect(() => {}, [sellingPlanList]);
  const updateText = useCallback(
    (value) => {
      setFieldValue(fieldName, { sellingPlanId: '', sellingPlanName: value });
      if (value) {
        GetPlans({ variables: { name: value } });
      }
    },
    [value]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selected?.length > 0) {
        const plan = sellingPlanList.find((item) => item.value === selected[0]);
        setFieldValue(fieldName, {
          sellingPlanName: plan.label,
          sellingPlanId: plan.value,
        });
        setSelectedOptions(selected);
      }
    },
    [sellingPlanList, value]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      type="text"
      value={value.sellingPlanName}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search for plan to add"
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
    <>
      <Autocomplete
        options={sellingPlanList}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
        emptyState={emptyState}
      />
    </>
  );
};

export default SearchPlan;
