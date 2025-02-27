import React, { useEffect } from 'react';
import { useState, useCallback } from "react";
import { Autocomplete, Icon, TextContainer } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

function CustomerAutocomplete({ fetchCustomers, deselectedOptions, setSelectedCustomers, setFormField, formField }) {

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const updateText = useCallback(
        (value) => {

            fetchCustomers(value);

            setInputValue(value);

            setOptions(resultOptions);
        },
        []
    );

    const updateSelection = useCallback(
        (selected) => {
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = deselectedOptions.find((deselectedOption) => {
                    return deselectedOption.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });
            setSelectedOptions(selected);
            setInputValue(selectedValue[0]);
            console.log(selected)
            setSelectedCustomers(selected[0]);
            setFormField({ ...formField, email: selected[0] });
        },
        [deselectedOptions]
    );

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Search Customer"
            value={inputValue}
            prefix={<Icon source={SearchMinor} color="base" />}
            placeholder="Search"
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
        <div>
            <Autocomplete
                options={deselectedOptions}
                selected={selectedOptions}
                onSelect={updateSelection}
                emptyState={emptyState}
                textField={textField}
            />
        </div>
    );
}

export default CustomerAutocomplete;  