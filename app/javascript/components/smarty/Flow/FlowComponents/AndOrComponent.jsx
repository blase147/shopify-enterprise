
import React, { useEffect, useState } from 'react'; 
import {
  Button,
  Card,
  Stack,
  Subheading,
} from "@shopify/polaris";
import AddCondition from './AddCondition';
import ConditionManager from './ConditionManager';
import AndOrBtn from './Btn';
import DeleteIcon from './DeleteIcon';
import {triggerList, actionList, conditionOptions, conditions} from '../layout/triggerList';
import '../styles/generalStyles.css';

const AndOrComponent = (props) => {

const [conditionModal, setConditionModal] = useState([]);
const [subOptions,setSubOptions] = useState(conditions);

useEffect(()=>{
if(props.input && props.input != false){
  if(Object.keys(props.input).length > 0){
  setConditionModal(props.input);
  }else if(Object.keys(props.input).length === 0){
    setConditionModal([]);
  }
}
},[props.input]);

const generateAndOr = () => {
const input = [{
  conditionValue : '',
  condition: '',
  value: ''
}];

const updateConditionModal = [...conditionModal];
updateConditionModal.push(input);
setConditionModal(updateConditionModal);
}

const generateAndNode = (itemKey) => {
  const input = {
    conditionValue : '',
    condition: '',
    value: ''
  };
  
  const updateConditionModal = [...conditionModal];
  updateConditionModal[itemKey].push(input);
  setConditionModal(updateConditionModal);
}

const generateORNode = () => {
  generateAndOr();
}

const handleChange = (mainObj, itemKey, parentKey, outputValue) => {
  const updateConditionModal = [...conditionModal];
  updateConditionModal[parentKey][itemKey] = [...mainObj];
  setConditionModal(updateConditionModal);
};

const updateSubOption = (inputValue) => {
  console.log(conditionOptions);
  conditionOptions.filter(item => {
    const exist = item.options.find(itemI => itemI.value === inputValue);
    if(exist && exist.subOption ) {
      setSubOptions(exist.subOption);
    }
  });
}

const updateList = ()=>{
  props.updateHandle(conditionModal);
}

const removeCondition = (parentKey, itemKey) => {
  const updateConditionModal = [...conditionModal];
  updateConditionModal[parentKey].splice(itemKey, 1);
  setConditionModal(updateConditionModal);
}

const removeMainCondition = (parentKey) => {
  const updateConditionModal = [...conditionModal];
  updateConditionModal.splice(parentKey, 1);
  setConditionModal(updateConditionModal);
}

return(
  <div>
    <div className="rightFlex"> 
      <Button onClick={updateList}>Apply</Button>
    </div>
    {conditionModal.map((mainItem, mainKey) => {
      return (
        <div className="gridSection">
          <Card sectioned>
          {/* <DeleteIcon removeNode={()=>removeMainCondition(mainKey)} /> */}
          {mainItem.map((andList, secondKey) => {
            return <div className="condSection">
              <DeleteIcon removeNode={()=>removeCondition(mainKey, secondKey)} />
              <Stack>
                <Subheading>IF</Subheading>
                <Stack.Item fill />
              </Stack>
              <div>
                <ConditionManager list={andList} itemKey={secondKey} parentKey={mainKey} options={conditionOptions} updateSubOption={updateSubOption}  handle={handleChange} />
              </div>
            </div>
          })}
          <AndOrBtn text="AND" handle={()=>generateAndNode(mainKey)}/>
          </Card>
        </div>
      )
    })}
    {conditionModal && conditionModal.length > 0 && <AndOrBtn text="OR" handle={generateORNode} />}
    {conditionModal && conditionModal.length === 0 && <AndOrBtn text="Add Condition" handle={generateAndOr} />}
  </div>
)}
export default AndOrComponent;