import React, { useContext, useEffect, useState } from 'react';
import ReactFlow, { Handle, ReactFlowProvider } from 'react-flow-renderer';
import { PlusMinor, DeleteMinor, EditMinor } from '@shopify/polaris-icons';
import Tags from '@yaireo/tagify/dist/react.tagify';
import {
  triggerList,
  actionList,
  conditionOptions,
  conditions,
} from './layout/triggerList';
import { updateElementList, makeElementSelected } from './FlowComponents/util';
import AndOrComponent from './FlowComponents/AndOrComponent';
import {
  Button,
  Card,
  Icon,
  Select,
  Stack,
  Subheading,
  TextField,
  TextStyle,
} from '@shopify/polaris';
import LayoutFlow, { getLayoutedElements } from './layout/Layout';
import ModalComp from './FlowComponents/modal';
import '@yaireo/tagify/dist/tagify.css';
import { DomainContext } from '../../domain-context';

const edgeType = 'smoothstep';
const customNodeStyles1 = {
  border: '1px solid #9CA8B3',
  color: '#000',
  padding: 10,
  minWidth: '20rem',
  maxWidth: '20rem',
};
const highlightCls1 = {
  border: '1px solid red',
  color: '#000',
  padding: 10,
  minWidth: '20rem',
  maxWidth: '20rem',
};
const highlightCls = {
  cursor: 'pointer',
  zIndex: '99999',
  background: 'rgb(255, 255, 255)',
  borderWidth: '1px 1px 3px',
  borderStyle: 'solid',
  borderColor: 'red red rgb(200, 111, 221)',
  borderImage: 'initial',
  borderRadius: '0.3rem',
  position: 'relative',
  textAlign: 'center',
  boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 4px 0px',
  padding: 10,
  minWidth: '20rem',
  maxWidth: '20rem',
};
const customNodeStyles = {
  cursor: 'pointer',
  zIndex: '99999',
  background: 'rgb(255, 255, 255)',
  borderBottom: '3px solid rgb(225, 113, 34)',
  borderRadius: '0.3rem',
  position: 'relative',
  textAlign: 'center',
  boxShadow: 'rgb(0 0 0 / 40%) 0px 0px 6px 0px',
  padding: 10,
  minWidth: '20rem',
  maxWidth: '20rem',
};

const addStepStyles = {
  border: '1px solid #9CA8B3',
  color: '#000',
  padding: 10,
  minWidth: '20rem',
  maxWidth: '20rem',
};

const addConditonStyles = {
  border: '1px solid #9CA8B3',
  color: '#000',
  padding: 10,
  fontSize: '0.8em',
  height: '100px',
};
const elipses = {
  textAlign: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: '18rem',
  whiteSpace: 'nowrap',
};

const ElementsContext = React.createContext();

const FlowComponent = ({ id, data }) => {
  const elements = useContext(ElementsContext);
  return (
    <div className="nodrag" style={data.styles}>
      {!data.disableStart && (
        <Handle id={id} type="target" isConnectable={false}></Handle>
      )}
      {data.child({
        id,
        elements,
        selectedTrigger: data.selectedTrigger,
        nodeData: data.nodeData,
      })}
      {!data.disableEnd && (
        <Handle
          id={id}
          type="source"
          position="bottom"
          isConnectable={false}
        ></Handle>
      )}
    </div>
  );
};

const smartyVariables = [
  'card_brand - card_last4',
  'card_exp_month/card_exp_year',
  'subscription_title',
  'subscription_charge_date',
  'delay_weeks',
  'shop_email',
  'first_name',
  'old_charge_date',
  'line_item_qty',
  'line_item_list',
  'line_item_name',
  'manage_subscriptions_url',
  'cancellation_reasons',
  'shop_name',
  '@shop_email',
  '@shop_name',
];

const flowStatusOptions = [
  { label: 'Active', value: true },
  { label: 'Draft', value: false },
];

const FlowTree = ({ id }) => {
  const { domain } = useContext(DomainContext);
  const [displayTrigger, setDisplayTrigger] = useState(null);
  const [displayDelay, setDisplayDelay] = useState(false);
  const [modificationId, setModificationId] = useState(false);
  const [displayActions, setDisplayActions] = useState(false);
  const [displayCondition, setDisplayCondition] = useState(false);
  const [basicElements, setBasicElements] = useState([]);
  const [outputElements, setOutputElements] = useState([]);
  const [smartyMessage, setSmartyMessage] = useState('');
  const [flowName, setFlowName] = useState('');
  const [flowStatus, setFlowStatus] = useState(false);
  const [flowId, setFlowId] = useState('');

  useEffect(() => {
    if (id && id > 0) {
      fetch(`/sms_flows/${id}/edit?shopify_domain=${domain}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      })
        .then((response) => response.json())
        .then((data) => {
          setBasicElements(data.content);
          setFlowName(data.name);
          setFlowStatus(data.status);
          setFlowId(data.id);
        });
    }
  }, [id]);

  const delayOptions = [
    { label: 'Minute/s', value: 'minutes' },
    { label: 'Hour/s', value: 'hours' },
    { label: 'Day/s', value: 'days' },
  ];

  const removeNode = (id, elements) => {
    if (id == '1') {
      setDisplayTrigger(null);
      setBasicElements([]);
    } else {
      const elementToRemove = elements.find((e) => e.id == id);
      const newElements = elements.filter((e) => e.id != id);
      newElements.forEach((e) => {
        if (e.parent == id) {
          e.parent = elementToRemove.parent;
        }
      });
      setBasicElements(newElements);
      setDisplayDelay(false);
    }
    setModificationId(false);
  };

  const removeAllConnectedNodes = (id, elements) => {
    const elementToRemove = elements.find((e) => e.id == id);
    const insertionIndex = elements.indexOf(elementToRemove);
    if (elementToRemove.type === 'condition') {
      const removeConnectedNodes = [];
      const childConnections = getAllConnectedChildList(id, elements);
      elements.forEach((pinItem) => {
        const condValI = pinItem.parent == id;
        const exist = childConnections.find(
          (itemSkip) => itemSkip.id === pinItem.id
        );
        if (exist === undefined) {
          removeConnectedNodes.push(pinItem);
        }
      });
      // removeConnectedNodes.splice(insertionIndex,1)
      const parentToRemove = removeConnectedNodes.find((e) => e.id == id);
      const updateIndex = removeConnectedNodes.indexOf(parentToRemove);
      removeConnectedNodes[updateIndex] = {
        parent: removeConnectedNodes[updateIndex].parent,
        id: removeConnectedNodes[updateIndex].id,
        type: 'end',
      };
      setBasicElements(removeConnectedNodes);
    }
    setDisplayDelay(false);
    setModificationId(false);
  };

  const getAllConnectedChildList = (id, elements) => {
    let parentNodeList = [];
    elements.filter((item) => {
      if (item.parent === id) {
        parentNodeList.push(item);
        const list = getAllConnectedChildList(item.id, elements);
        parentNodeList = [...parentNodeList, ...list];
      }
    });
    return parentNodeList;
  };

  const generateID = () => Math.random().toString(36).substr(2, 5);

  const addStep = (id, elements) => {
    const basicElementId = id.split('-')[0];
    const newElements = [...elements];
    const newId = (elements.length + 1).toString() + generateID();
    const insertBefore = newElements.find((e) => e.id == basicElementId);
    const insertionIndex = newElements.indexOf(insertBefore);
    if (['yes', 'no'].includes(id.split('-')[1])) {
      newElements[insertionIndex].type = 'chooseNext';
      const endNode = {
        parent: newElements[insertionIndex].id,
        id: newId,
        type: 'end',
      };
      newElements.push(endNode);
      setBasicElements(newElements);
    } else {
      newElements.splice(insertionIndex, 0, {
        parent: insertBefore.parent,
        id: newId,
        type: 'chooseNext',
      });

      insertBefore.parent = newId;
      setBasicElements(newElements);
    }
  };

  const setDelay = (id, elements) => {
    return () => {
      const element = elements.find((e) => e.id == id);
      setDisplayDelay(element.nodeData || {});
      setModificationId(id);
      setDisplayActions(false);
    };
  };
  const sortList = (list) => {
    return list.sort((pin, pinI) => pinI.id > pin.id);
  };

  const chooseAction = (id, elements, nodeData) => {
    console.log('choose action');
    toggleLeftPanels(id, 'action');
    if (
      nodeData &&
      nodeData.selectedActionId &&
      nodeData.selectedActionId === displayActions.selectedAction
    ) {
      setSmartyMessage(nodeData.msg);
      setDisplayActions({
        selectedAction: nodeData.selectedActionId,
        title: nodeData.title,
      });
    } else {
      setSmartyMessage('');
      setDisplayActions({});
    }
    // setDisplayDelay(false);
    // setDisplayActions({});
  };
  const chooseDelay = (id, elements, nodeData) => {
    console.log('choose action');
    toggleLeftPanels(id, 'delay');
    setDisplayDelay(nodeData);
  };

  const addActionNodeChild = ({ id, elements, nodeData }) => {
    return (
      <>
        <div
          style={{
            padding: '0 3rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextStyle variation="subdued">Action </TextStyle>
            <div
              style={{ marginRight: '0.5rem', cursor: 'pointer' }}
              onClick={() => chooseAction(id, elements, nodeData)}
            >
              <Icon source={EditMinor} color="#9CA8B3" />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: '0',
              marginRight: '0.5rem',
              cursor: 'pointer',
            }}
            onClick={() => removeNode(id, elements)}
          >
            <Icon source={DeleteMinor} color="#9CA8B3" />
          </div>
        </div>
        {nodeData && nodeData.msg.length > 0 && (
          <ModalComp
            title={
              <p title={nodeData.msg} style={{ ...elipses }} id={id}>
                {nodeData?.msg ? `${nodeData.msg}` : 'Write Msg'}
              </p>
            }
            AddBtn={false}
            nodeData={nodeData}
            content={
              <p id={id}>{nodeData?.msg ? `${nodeData.msg}` : 'Write Msg'}</p>
            }
          />
        )}
        <div
          style={{
            border: '1px solid #9CA8B3',
            margin: '1rem 0 0 0',
            padding: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <p style={{ textAlign: 'center' }}>
            {nodeData?.notify ? `To ${nodeData.notify}` : 'Choose Action'}
          </p>
        </div>
      </>
    );
  };

  const addConditionNodeChild = ({ id, elements, nodeData }) => {
    return (
      <>
        <div
          style={{
            padding: '0 3rem',
            justifyContent: 'center',
            maxHeight: '100px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextStyle variation="subdued">Check IF </TextStyle>
            <div
              style={{ marginRight: '0.5rem', cursor: 'pointer' }}
              onClick={() => onNodeClick(id, elements, nodeData)}
            >
              <Icon source={EditMinor} color="#9CA8B3" />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: '0',
              marginRight: '0.5rem',
              cursor: 'pointer',
            }}
            onClick={() => removeAllConnectedNodes(id, elements)}
          >
            <Icon source={DeleteMinor} color="#9CA8B3" />
          </div>
          <div style={{ display: 'flex' }}>
            {nodeData && nodeData.length > 0 && (
              <ModalComp
                title="Conditions"
                addBtn={true}
                nodeData={nodeData}
                content={nodeData.map((orItem, key) => {
                  return (
                    <>
                      <div
                        style={{
                          margin: '1%',
                          padding: '1%',
                          border: '1px solid lightgrey',
                          overflow: 'auto',
                        }}
                      >
                        {orItem.map((andItem, index) => {
                          return (
                            <>
                              {andItem &&
                                andItem.length > 0 &&
                                andItem.map((finalItem) => {
                                  return (
                                    <>
                                      <h5>
                                        {finalItem &&
                                          finalItem.conditionTitle != '' &&
                                          `${finalItem.conditionTitle},`}
                                      </h5>
                                    </>
                                  );
                                })}
                              {andItem && andItem.length > 0 && (
                                <h3 style={{ fontWeight: 'bolder' }}>
                                  of Value: {andItem[0].value}
                                </h3>
                              )}
                              {andItem && index !== orItem.length - 1 && (
                                <h3 style={{ fontWeight: 'bolder' }}>And</h3>
                              )}
                            </>
                          );
                        })}
                      </div>
                      {key !== nodeData.length - 1 && (
                        <h3 style={{ fontWeight: 'bolder' }}>Or</h3>
                      )}
                    </>
                  );
                })}
              />
            )}
          </div>
        </div>
        <p style={{ textAlign: 'center' }} id={id} data-id={id}>
          {nodeData?.msg ? `${nodeData.msg}` : ''}
        </p>
      </>
    );
  };

  const addDelayNodeChild = ({ id, elements, nodeData }) => {
    return (
      <>
        <div
          style={{
            padding: '0 3rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextStyle variation="subdued">Delay </TextStyle>
            <div
              style={{ marginRight: '0.5rem', cursor: 'pointer' }}
              onClick={() => chooseDelay(id, elements, nodeData)}
            >
              <Icon source={EditMinor} color="#9CA8B3" />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: '0',
              marginRight: '0.5rem',
              cursor: 'pointer',
            }}
            onClick={() => removeNode(id, elements)}
          >
            <Icon source={DeleteMinor} color="#9CA8B3" />
          </div>
        </div>
        <div
          style={{
            border: '1px solid #9CA8B3',
            margin: '1rem 0 0 0',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
          }}
          onClick={setDelay(id, elements)}
        >
          {nodeData && (
            <p
              title={nodeData.duration}
              style={{ textAlign: 'center', ...elipses, width: '70%' }}
            >
              {nodeData.duration}
            </p>
          )}
          {nodeData && <p>{nodeData.interval}</p>}
          {nodeData ? '' : <p>{'Set Up Delay & interval'}</p>}
        </div>
      </>
    );
  };

  const addStepNodeChild = ({ id, elements }) => {
    return (
      <>
        <div
          style={{
            padding: '0 3rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button onClick={() => addStep(id, elements)} plain fullWidth>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '12px', marginTop: '1px' }}>
                <PlusMinor />
              </div>
              Add Step
            </div>
          </Button>
        </div>
      </>
    );
  };

  const triggerNodeChild = ({ id, selectedTrigger, elements }) => (
    <>
      <div
        style={{ padding: '0 3rem', display: 'flex', justifyContent: 'center' }}
        onClick={() => setModificationId(id)}
      >
        <p style={{ ...elipses }}>
          {selectedTrigger ? selectedTrigger.title : 'Trigger'}
        </p>
        <div
          style={{
            position: 'absolute',
            right: '0',
            marginRight: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={() => removeNode(id, elements)}
        >
          <Icon source={DeleteMinor} color="#9CA8B3" />
        </div>
      </div>
      <div
        style={{
          border: '1px solid #9CA8B3',
          margin: '1rem 0 0 0',
          padding: '0.5rem',
          ...(displayTrigger ? {} : { cursor: 'pointer' }),
        }}
      >
        <p style={{ textAlign: 'center', ...elipses, width: '95%' }}>
          {selectedTrigger ? selectedTrigger.title : 'Add Trigger'}
        </p>
      </div>
    </>
  );

  const chooseNextNodeChild = ({ id, elements }) => (
    <>
      <div
        style={{ padding: '0 3rem', display: 'flex', justifyContent: 'center' }}
      >
        <p>
          <TextStyle variation="subdued">Choose Next</TextStyle>
        </p>
        <div
          style={{
            position: 'absolute',
            right: '0',
            marginRight: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={() => removeNode(id, elements)}
        >
          <Icon source={DeleteMinor} color="#9CA8B3" />
        </div>
      </div>
      <div
        style={{
          border: '1px solid #9CA8B3',
          margin: '1rem 0 0 0',
          padding: '0.5rem',
          cursor: 'pointer',
        }}
        onClick={transformInto(id, 'condition', elements)}
      >
        <p style={{ textAlign: 'center' }}>Add Condition</p>
      </div>
      <div
        style={{
          border: '1px solid #9CA8B3',
          margin: '1rem 0 0 0',
          padding: '0.5rem',
          cursor: 'pointer',
        }}
        onClick={transformInto(id, 'action', elements)}
      >
        <p style={{ textAlign: 'center' }}>Add Action</p>
      </div>
      <div
        style={{
          border: '1px solid #9CA8B3',
          margin: '1rem 0 0 0',
          padding: '0.5rem',
          cursor: 'pointer',
        }}
        onClick={transformInto(id, 'delay', elements)}
      >
        <p style={{ textAlign: 'center' }}>Add Delay</p>
      </div>
    </>
  );

  const endNodeChild = (id) => (
    <div
      style={{ padding: '0 3rem', display: 'flex', justifyContent: 'center' }}
    >
      <p>
        <TextStyle variation="strong">End</TextStyle>
      </p>
    </div>
  );

  const notifyOptions = [
    { label: 'Customer', value: 'customer' },
    { label: 'Admin', value: 'admin' },
  ];

  const triggerModifier = () => (
    <>
      <div style={{ padding: '1rem', borderBottom: '1px solid #cdcdcd' }}>
        <p>Select a trigger to start your workflow</p>
      </div>
      {triggerList.map((trigger, i) => {
        return (
          <div style={{ padding: '1rem' }} key={i}>
            <div style={{ marginBottom: '1rem' }}>
              <Subheading>{trigger.title}</Subheading>
            </div>
            {trigger.events.map((event, i) => {
              return (
                <div
                  key={i}
                  className="cursor-pointer mb-1"
                  onClick={() => {
                    setDisplayTrigger(event);
                    setModificationId(false);
                    setDisplayDelay(false);
                  }}
                >
                  <Card sectioned key={i}>
                    <div style={{ marginBottom: '1rem' }}>
                      <Subheading>{event.title}</Subheading>
                    </div>
                    <p>{event.description}</p>
                  </Card>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );

  const delayModifier = () => {
    return (
      displayDelay && (
        <>
          <div style={{ padding: '1rem', borderBottom: '1px solid #cdcdcd' }}>
            <p>Set up delay details</p>
          </div>
          <div style={{ padding: '1rem' }}>
            <Select
              label="Delay Interval"
              options={delayOptions}
              value={displayDelay.interval}
              placeholder="Select Interval"
              onChange={(value) => {
                const newDelay = { ...displayDelay };
                newDelay.interval = value;
                setDisplayDelay(newDelay);
                updateDelayNode(newDelay);
              }}
            ></Select>
            <TextField
              type="number"
              label="Delay Duration"
              value={displayDelay.duration}
              onChange={(value) => {
                const newDelay = { ...displayDelay };
                newDelay.duration = value;
                setDisplayDelay(newDelay);
                updateDelayNode(newDelay);
              }}
            ></TextField>
          </div>
        </>
      )
    );
  };

  const actionModifier = () => {
    return displayActions.selectedAction ? (
      <div>
        <div style={{ padding: '1rem', borderBottom: '1px solid #cdcdcd' }}>
          <Stack>
            <p>Set Up Action</p>
            <Stack.Item fill />
            <Button onClick={() => setDisplayActions({})} plain>
              X
            </Button>
          </Stack>
        </div>
        <div style={{ padding: '1rem' }}>
          <Card sectioned>
            <Stack>
              <Subheading>Text Message</Subheading>
              <Stack.Item fill />
              <Button plain onClick={() => console.log('preview message')}>
                Preview
              </Button>
            </Stack>
            <div className="var-auto-complition">
              <TextField
                label="add variables"
                value={smartyMessage}
                onChange={(value) => {
                  onChangeUpdateElements(value, 'msg');
                  setSmartyMessage(value);
                }}
                autoComplete="off"
              />
              <p>
                <TextStyle variation="subdued">
                  Type @ to have the variables auto-completion.
                </TextStyle>
              </p>
            </div>
            <div>
              <Select
                label="Notify"
                name="Notify"
                options={notifyOptions}
                onChange={(value) => onChangeUpdateElements(value, 'notify')}
                value={modificationNode?.nodeData?.notify || 'customer'}
              />
            </div>
          </Card>
        </div>
      </div>
    ) : (
      <>
        <div style={{ padding: '1rem', borderBottom: '1px solid #cdcdcd' }}>
          <p>Select an Action</p>
        </div>
        {actionList.map((action, i) => {
          return (
            <div
              style={{ margin: '1rem' }}
              key={i}
              className="cursor-pointer"
              onClick={() => {
                setDisplayActions({
                  selectedAction: action.id,
                  title: action.title,
                });
              }}
            >
              <Card sectioned key={i}>
                <div style={{ marginBottom: '1rem' }}>
                  <Subheading>{action.title}</Subheading>
                </div>
                <p>{action.description}</p>
              </Card>
            </div>
          );
        })}
      </>
    );
  };

  const conditionModifier = () => {
    return (
      <div>
        <div style={{ padding: '1rem', borderBottom: '1px solid #cdcdcd' }}>
          <Stack>
            <p>Set Up Condition</p>
            <Stack.Item fill />
            <Button onClick={() => setDisplayActions({})} plain>
              X
            </Button>
          </Stack>
        </div>
        <div style={{ padding: '1rem' }}>
          <AndOrComponent
            input={displayCondition}
            updateHandle={updateCondtionSecion}
          ></AndOrComponent>
        </div>
      </div>
    );
  };

  const updateCondtionSecion = (conditionList) => {
    const newElements = [...basicElements];
    const element = newElements.find((e) => e.id == modificationId);
    element.nodeData = [...conditionList];
    setBasicElements(newElements);
  };

  const onChangeUpdateElements = (value, field) => {
    const newElements = updateElementList(
      basicElements,
      value,
      modificationId,
      field
    );
    const element = newElements.find((e) => e.id == modificationId);
    if (!element.nodeData) {
      element.nodeData = {};
    }
    element.nodeData.title = displayActions.title;
    element.nodeData.selectedActionId = displayActions.selectedAction;
    setBasicElements(makeElementSelected(newElements, modificationId));
  };

  const basicElementMap = {
    trigger: {
      data: {
        disableStart: true,
        child: triggerNodeChild,
        styles: customNodeStyles,
        selectedTrigger: displayTrigger,
      },
      marginBottom: 120,
      modifier: triggerModifier,
    },
    addStep: {
      data: {
        child: addStepNodeChild,
        styles: addStepStyles,
      },
      marginBottom: 50,
      marginRight: 43,
    },
    chooseNext: {
      data: {
        child: chooseNextNodeChild,
        styles: customNodeStyles,
      },
      marginBottom: 200,
      marginRight: 43,
    },
    end: {
      data: {
        child: endNodeChild,
        styles: customNodeStyles,
        disableEnd: true,
      },
      marginBottom: 100,
    },
    condition: {
      data: {
        child: addConditionNodeChild,
        styles: customNodeStyles,
        className: 'boxDiv',
      },
      modifier: conditionModifier,
    },
    delay: {
      data: {
        child: addDelayNodeChild,
        styles: customNodeStyles,
      },

      modifier: delayModifier,
      marginBottom: 120,
      insertionCallback: () => {
        setDisplayDelay({});
      },
    },
    action: {
      data: {
        child: addActionNodeChild,
        styles: customNodeStyles,
      },
      marginBottom: 120,
      modifier: actionModifier,
    },
    yes: {
      data: {
        child: () => <p>Yes</p>,
        styles: customNodeStyles,
      },
      marginBottom: 120,
      marginRight: -120,
    },
    no: {
      data: {
        child: () => <p>No</p>,
        styles: customNodeStyles,
      },
      marginBottom: 120,
      marginRight: 320,
    },
  };

  const transformInto = (id, type, elements) => {
    return () => {
      const newElements = [...elements];
      const insertAt = newElements.find((e) => e.id == id);
      const insertionIndex = newElements.indexOf(insertAt);
      const newId = id;
      // (
      //   Math.max.apply(
      //     Math,
      //     elements.map((e) => e.id)
      //   ) + 1
      // ).toString()+'keyGen';
      newElements[insertionIndex] = {
        parent: insertAt.parent,
        id: newId,
        type: type,
      };

      if (type === 'condition') {
        let prevEndNode = newElements.find(
          (e) => e.parent == id && e.type === 'end'
        );
        if (prevEndNode === undefined) {
          const adjustNode = newElements.find((e) => e.parent == id);
          const adjustIndexNode = newElements.indexOf(adjustNode);
          const yesElement = {
            parent: adjustNode.parent,
            id: `${adjustNode.id}Y`,
            type: 'yes',
          };
          prevEndNode = adjustNode;
          newElements[adjustIndexNode].parent = yesElement.id;
          newElements.splice(adjustIndexNode, 0, yesElement);
        } else {
          const prevEndNodeIndex = newElements.indexOf(prevEndNode);
          newElements[prevEndNodeIndex] = {
            parent: newId,
            id: `${prevEndNode.id}Y`,
            type: 'yes',
          };
        }
        const newElementsPoint = newElements.length - 1;
        newElements[newElementsPoint + 1] = {
          parent: newId,
          id: `${+newElementsPoint + 1}N`,
          type: 'no',
        };

        newElements[newElementsPoint + 2] = {
          parent: `${+newElementsPoint + 1}N`,
          id: `${+newElementsPoint + 2}`,
          type: 'end',
        };

        if (prevEndNode !== undefined) {
          newElements[newElementsPoint + 3] = {
            parent: `${prevEndNode.id}Y`,
            id: `${+newElementsPoint + 3}`,
            type: 'end',
          };
        }
      }

      const elementsUpdated = makeElementSelected(newElements, id);
      toggleLeftPanels(id, type);
      setBasicElements(elementsUpdated);
    };
  };
  const toggleLeftPanels = (id, type) => {
    if (type == 'delay') {
      setDisplayDelay({});
      setModificationId(id);
      setDisplayActions(false);
      setDisplayCondition(false);
    } else if (type == 'action') {
      setDisplayDelay(false);
      setDisplayActions({});
      setModificationId(id);
      setDisplayCondition(false);
    } else if (type == 'condition') {
      setDisplayCondition({});
      setDisplayDelay(false);
      setDisplayActions(false);
      setModificationId(id);
    }
  };

  useEffect(() => {
    if (basicElements.length < 1) {
      setBasicElements([
        {
          id: '1',
          type: 'trigger',
        },
      ]);
      setModificationId('1');
    } else if (displayTrigger && basicElements.length == 1) {
      setBasicElements([
        {
          id: '1',
          type: 'trigger',
          nodeData: displayTrigger,
        },
        {
          parent: '1',
          id: '2',
          type: 'chooseNext',
        },
        {
          parent: '2',
          id: '3',
          type: 'end',
        },
      ]);
    }

    const outPutElements = JSON.parse(JSON.stringify(basicElements));
    const updatetedList = outPutElements.map((eleObj) => {
      const item = { ...eleObj };
      if (item.type === 'condition') {
        if (item.nodeData && item.nodeData.length > 0) {
          item.nodeData = item.nodeData.map((itemData, index) => {
            itemData = itemData.map((itemDataI, indexI) => {
              itemDataI = itemDataI.map((itemDataII, indexII) => {
                if (itemDataII.options) {
                  const exist = itemDataII.options.find(
                    (opt) => opt.value === itemDataII.conditionValue
                  );
                  if (exist) {
                    delete exist.subOptions;
                    itemDataII.selectedOption = exist;
                  } else {
                    if (indexII == 0 && itemDataII.options) {
                      const existI = itemDataII.options[0].options.find(
                        (opt) => opt.value === itemDataII.conditionValue
                      );
                      if (existI) {
                        delete existI.subOptions;
                        itemDataII.selectedOption = existI;
                      }
                    }
                  }
                  delete itemDataII.options;
                  delete itemDataII.handle;
                  delete itemDataII.updateSubOption;
                }
                return itemDataII;
              });
              return itemDataI;
            });

            return itemData;
          });
        }
      }
      return item;
    });

    setOutputElements(updatetedList);
  }, [displayTrigger, basicElements]);

  const generateFlowElements = (basicElements) => {
    const flowElements = [];
    const flowElements2 = [];
    const position = { x: 0, y: 0 };
    let graphY = 5;

    basicElements.forEach((basicElement, i) => {
      if (i > 0) {
        if (!['yes', 'no'].includes(basicElement.type)) {
          const addStepMapData = basicElementMap.addStep;
          // let positionValue = {
          //   x: addStepMapData.marginRight
          //     ? 100 + addStepMapData.marginRight
          //     : 100,
          //   y: graphY,
          // }

          flowElements.push({
            id: `${basicElement.id}-as`,
            parent: basicElement.parent,
            type: 'flowNode',
            actualType: 'addStep',
            data: addStepMapData.data,
            position: position,
            style: {
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
            },
          });
          // graphY += addStepMapData.marginBottom;

          flowElements2.push({
            id: `e1${basicElement.parent}-${basicElement.id}-as`,
            source: basicElement.parent,
            target: `${basicElement.id}-as`,
            type: edgeType,
            animated: true,
          });
          flowElements2.push({
            id: `e${basicElement.id}-as-${basicElement.id}`,
            source: `${basicElement.id}-as`,
            target: basicElement.id,
            type: edgeType,
            animated: true,
          });
        }
      }
      const mapData = basicElementMap[basicElement.type];
      // let positionValue = {
      //   x: mapData.marginRight ? 100 + mapData.marginRight : 100,
      //   y: graphY,
      // };

      flowElements.push({
        id: basicElement.id,
        parent: basicElement.parent,
        type: 'flowNode',
        actualType: basicElement.type,
        data: {
          ...mapData.data,
          nodeData: basicElement.nodeData,
          styles:
            basicElement.selected == true
              ? { ...mapData.styles, ...highlightCls }
              : { ...mapData.data.styles },
        },
        position: position,
      });

      graphY += mapData.marginBottom;
      if (['yes', 'no'].includes(basicElement.type)) {
        //condition to yes/No
        flowElements2.push({
          id: `eup${basicElement.parent}-${basicElement.id}-${basicElement.type}`,
          source: basicElement.parent,
          target: `${basicElement.id}`,
          type: edgeType,
          animated: true,
        });
        // flowElements.push({
        //   id: `${basicElement.id}-${basicElement.type}`,
        //   type: "flowNode",
        //   actualType: "addStep",
        //   data: addStepMapData.data,
        //   position: {
        //     x: flowElements[flowElements.length-2].position.x+43,
        //     y: graphY,
        //   }
        // });
        // //yes to add step
        // flowElements.push({
        //   id: `edown${basicElement.parent}-${basicElement.id}-${basicElement.type}`,
        //   source: `${basicElement.id}`,
        //   target: `${basicElement.id}-${basicElement.type}`
        // });
      }
    });
    return [...flowElements, ...flowElements2];
  };

  const updateDelayNode = (delayData) => {
    if (delayData.interval && delayData.duration) {
      const newElements = [...basicElements];
      const element = newElements.find((e) => e.id == modificationId);
      element.nodeData = delayData;

      setBasicElements(newElements);
    }
  };

  const onSelectNode = (event) => {
    const { id } = event.target;
    if (id) {
      const newElements = [...basicElements];
      setModificationId(id);
      setBasicElements(makeElementSelected(newElements, id));
    }
  };

  const onNodeClick = (id, elements, nodeData) => {
    if (id) {
      const showCondition = nodeData ? nodeData : {};
      const newElements = [...basicElements];
      toggleLeftPanels(id, 'condition');
      setDisplayCondition(showCondition);
      setBasicElements(makeElementSelected(newElements, id));
    }
  };

  let modifier;
  let modificationNode;
  if (modificationId) {
    modificationNode = basicElements.find((e) => e.id == modificationId);
    if (modificationNode)
      modifier = basicElementMap[modificationNode.type].modifier;
  }

  return (
    <ElementsContext.Provider value={basicElements}>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '30%',
            borderRight: '1px solid #cdcdcd',
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          {modificationId && modifier != undefined && modifier()}
          {/* {displayTrigger == null ? (
            <>
              <div
                style={{ padding: "1rem", borderBottom: "1px solid #cdcdcd" }}
              >
                <p>Select a trigger to start your workflow</p>
              </div>
              {triggerList.map((trigger, i) => {
                return (
                  <div style={{ padding: "1rem" }} key={i}>
                    <div style={{ marginBottom: "1rem" }}>
                      <Subheading>{trigger.title}</Subheading>
                    </div>
                    {trigger.events.map((event, i) => {
                      return (
                        <div
                          key={i}
                          className="cursor-pointer mb-1"
                          onClick={() => {
                            setDisplayTrigger(event);
                            setModificationId(false);
                            setDisplayDelay(false);
                          }}
                        >
                          <Card sectioned key={i}>
                            <div style={{ marginBottom: "1rem" }}>
                              <Subheading>{event.title}</Subheading>
                            </div>
                            <p>{event.description}</p>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ) : null}
          {displayDelay ? (
            <>
              <div
                style={{ padding: "1rem", borderBottom: "1px solid #cdcdcd" }}
              >
                <p>Set up delay details</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <Select
                  label="Delay Interval"
                  options={delayOptions}
                  value={displayDelay.interval}
                  placeholder="Select Interval"
                  onChange={(value) => {
                    const newDelay = { ...displayDelay };
                    newDelay.interval = value;
                    setDisplayDelay(newDelay);
                    updateDelayNode(newDelay);
                  }}
                ></Select>
                <TextField
                  type="number"
                  label="Delay Duration"
                  value={displayDelay.duration}
                  onChange={(value) => {
                    const newDelay = { ...displayDelay };
                    newDelay.duration = value;
                    setDisplayDelay(newDelay);
                    updateDelayNode(newDelay);
                  }}
                ></TextField>
              </div>
            </>
          ) : null}
          {displayActions &&
            (displayActions.selectedAction ? (
              <div>
                <div
                  style={{ padding: "1rem", borderBottom: "1px solid #cdcdcd" }}
                >
                  <Stack>
                    <p>Set Up Action</p>
                    <Stack.Item fill />
                    <Button onClick={() => setDisplayActions({})} plain>
                      X
                    </Button>
                  </Stack>
                </div>
                <div style={{ padding: "1rem" }}>
                  <Card sectioned>
                    <Stack>
                      <Subheading>Text Message</Subheading>
                      <Stack.Item fill />
                      <Button
                        plain
                        onClick={() => console.log("preview message")}
                      >
                        Preview
                      </Button>
                    </Stack>
                    <div className="var-auto-complition">
                      <Tags
                        InputMode="textarea"
                        settings={{
                          mixTagsInterpolator: ["{{", "}}"],
                          mode: "mix",
                          pattern: /@/,
                          dropdown: {
                            enabled: true,
                            fuzzySearch: true,
                            position: "text",
                          },
                          enforceWhitelist: true,
                        }}
                        whitelist={smartyVariables}
                        value={smartyMessage}
                        placeholder="add variables"
                      />
                      <p>
                        <TextStyle variation="subdued">
                          Type @ to have the variables auto-completion.
                        </TextStyle>
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{ padding: "1rem", borderBottom: "1px solid #cdcdcd" }}
                >
                  <p>Select an Action</p>
                </div>
                {actionList.map((action, i) => {
                  return (
                    <div
                      style={{ margin: "1rem" }}
                      key={i}
                      className="cursor-pointer"
                      onClick={() => {
                        setDisplayActions({ selectedAction: action.id });
                      }}
                    >
                      <Card sectioned key={i}>
                        <div style={{ marginBottom: "1rem" }}>
                          <Subheading>{action.title}</Subheading>
                        </div>
                        <p>{action.description}</p>
                      </Card>
                    </div>
                  );
                })}
              </>
            ))} */}
        </div>

        <div style={{ width: '70%' }}>
          <div
            className="flex"
            style={{
              padding: '1rem',
              borderBottom: '1px solid #cdcdcd',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              placeholder="Flow Name"
              value={flowName}
              onChange={(value) => setFlowName(value)}
            />

            <Select
              options={flowStatusOptions}
              value={flowStatus}
              onChange={(value) => setFlowStatus(value)}
            />

            <Button
              primary
              onClick={() =>
                fetch('/sms_flows', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    shopify_domain: domain,
                    basicElements: outputElements,
                    flowName,
                    flowStatus,
                    flowId,
                  }),
                })
                  .then((response) => response.json())
                  //Then with the data from the response in JSON...
                  .then((data) => {
                    var Toast = window['app-bridge'].actions.Toast;
                    Toast.create(window.app, {
                      message: 'Saved',
                      duration: 5000,
                    }).dispatch(Toast.Action.SHOW);
                  })
              }
            >
              Save
            </Button>
          </div>
          <div className="layoutflow" style={{ height: '100%' }}>
            <ReactFlowProvider>
              <ReactFlow
                nodesConnectable={false}
                nodesDraggable={false}
                elements={getLayoutedElements(
                  generateFlowElements(sortList(basicElements))
                )}
                connectionLineType="smoothstep"
                zoomOnScroll={false}
                panOnScroll={true}
                nodeTypes={{
                  flowNode: FlowComponent,
                }}
                onElementClick={onSelectNode}
              />
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </ElementsContext.Provider>
  );
};
export default FlowTree;
