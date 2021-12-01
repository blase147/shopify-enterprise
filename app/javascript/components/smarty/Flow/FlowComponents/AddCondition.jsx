
import React,{useEffect, useState} from 'react'; 
import {triggerList, actionList, conditionOptions, conditions} from '../layout/triggerList';
import {
  Button,
  Card,
  Icon,
  Select,
  Stack,
  Subheading,
  TextField,
  TextStyle,
} from "@shopify/polaris";

const AddCondition = (props) => {

const onChangeUpdateElements = (value, field, item) => {
  const tempCondition = {
    conditionValue : props.conditionValue,
    condition: props.condition,
    value: props.value
  };
  tempCondition[field] = value;
  const {itemKey, parentKey} = props;
  props.handle(tempCondition,itemKey,parentKey, value, props.index);
}

return(
  <div>
    <div>
      {props.type === 'select' && <Select
        label="Condition"
        name="Condition"
        placeholder="Choose an option"
        value={props.conditionValue}
        options={props.options}
        onChange={(value,item) => {onChangeUpdateElements(value, 'conditionValue', item);}}
      />}
      {props.type === 'box' && <TextField
        label="Value"
        name="value"
        value={props.value}
        onChange={(value)=>{onChangeUpdateElements(value, 'value');}}
        autoComplete="off"
      />}
    </div>
    {/* <div>
      <Select
        label="condition"
        name="condition"
        value={props.condition}
        options={props.subOptions}
        onChange={(value)=>onChangeUpdateElements(value, 'condition')}
      />
    </div>
    <div>
      <TextField
        label="add variables"
        name="value"
        value={props.value}
        onChange={(value)=>{onChangeUpdateElements(value, 'value');}}
        autoComplete="off"
      />
    </div> */}
  </div>
)
}
export default AddCondition;