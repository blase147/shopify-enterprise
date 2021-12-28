
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
import AddCondition from './AddCondition';

const ConditionManager = (props) => {
  let tempCondition = [{
    ...props
  }];
  if (props.list.length>0) {
    tempCondition = [...props.list];
  }
  const [section, setSections] = useState([...tempCondition]);
  const existHandle = (exit, index, itemKey, parentKey) =>{
    if(exit){
      const input = {
        conditionValue: '',
        conditionTitle: '',
        condition: '',
        value: '',
        itemKey: itemKey,
        parentKey: parentKey,
        options: []
      };
      if(exit.subOptions) {
        input.options = [...exit.subOptions];
      }
      const updateSection = [ ...section ];
      if(index === 0){
        updateSection.splice(1, updateSection.length-1);
        updateSection[1] = input;
      } else {
        updateSection.push(input);
      }
      updateSection[index].conditionValue = exit.value;
      updateSection[index].conditionTitle = exit.label;
      setSections(updateSection);
    }else{
     
    }
  }
  const handleBox = (condition, itemKey, parentKey, value, index) => {
    if(index === 0){
      const updateSection = [ ...section ];
      updateSection[index].value = value;
      setSections(updateSection);
    }
  }

  const handle = (condition, itemKey, parentKey, value, index) => {
    console.log(condition, section[index]);
    if (index===0) {
      section[index].options.forEach((item) => {
        const exit = item.options.find(optionItem => {
          return optionItem.value === value;
        });
        existHandle(exit, index, itemKey, parentKey);
      })
    } else if (section[index]) {
       const exit = section[index].options.find((optionItem) => {
        return optionItem.value === value;
      });
      existHandle(exit, index, itemKey, parentKey);
    }
    // props.handle()
  }
  useEffect(()=>{
    props.handle(section, props.itemKey, props.parentKey);
  },[section])

return(
  <div>
    {section.map((pin,index) => {
      return (
        <>
        {pin.options.length>0 && <AddCondition type="select"
          {...pin}
          index={index}
          handle={handle}
        />}
        </>
      )
    })}
     <div>
     <AddCondition type="box"
        { ...section[0]}
        index={0}
        handle={handleBox}
      />
    </div>
  </div>
)}
export default ConditionManager;