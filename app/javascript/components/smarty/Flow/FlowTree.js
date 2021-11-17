import React, { useContext, useEffect, useState } from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';
import { PlusMinor, DeleteMinor } from '@shopify/polaris-icons';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/dist/tagify.css';
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

const customNodeStyles = {
  border: '1px solid #9CA8B3',
  color: '#000',
  padding: 10,
  minWidth: '17rem',
};

const addStepStyles = {
  border: '1px solid #9CA8B3',
  color: '#000',
  padding: 5,
  fontSize: '0.8em',
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
  { label: "Active", value: true },
  { label: "Draft", value: false }
]

const FlowTree = ({ id }) => {
  const [displayTrigger, setDisplayTrigger] = useState(null);
  const [displayDelay, setDisplayDelay] = useState(false);
  const [modificationId, setModificationId] = useState(false);
  const [displayActions, setDisplayActions] = useState(false);
  const [basicElements, setBasicElements] = useState([]);
  const [smartyMessage, setSmartyMessage] = useState('');
  const [flowName, setFlowName] = useState('');
  const [flowStatus, setFlowStatus] = useState( false );
  const [flowId, setFlowId] = useState( '' );

  useEffect(() => {
    if (id) {
      fetch(`/sms_flows/${id}/edit`, {
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
          setFlowId(data.id)
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
      setModificationId(false);
      setDisplayDelay(false);
    }
  };

  const addStep = (id, elements) => {
    const basicElementId = id.split('-')[0];
    const newId = (
      Math.max.apply(
        Math,
        elements.map((e) => e.id)
      ) + 1
    ).toString();
    const newElements = [...elements];
    const insertBefore = newElements.find((e) => e.id == basicElementId);
    const insertionIndex = newElements.indexOf(insertBefore);
    newElements.splice(insertionIndex, 0, {
      parent: insertBefore.parent,
      id: newId,
      type: 'chooseNext',
    });
    insertBefore.parent = newId;

    setBasicElements(newElements);
  };

  const setDelay = (id, elements) => {
    return () => {
      const element = elements.find((e) => e.id == id);
      setDisplayDelay(element.nodeData || {});
      setModificationId(id);
      setDisplayActions(false);
    };
  };

  const chooseAction = (id, elements) => {
    return () => {
      console.log('choose action');
      setDisplayDelay(false);
      setDisplayActions({});
    };
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
          <p>
            <TextStyle variation="subdued">Action</TextStyle>
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
          onClick={chooseAction(id, elements)}
        >
          <p style={{ textAlign: 'center' }}>
            {nodeData?.notify ? `To ${nodeData.notify}` : 'Choose Action'}
          </p>
        </div>
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
          <p>
            <TextStyle variation="subdued">Delay</TextStyle>
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
          onClick={setDelay(id, elements)}
        >
          <p style={{ textAlign: 'center' }}>
            {nodeData
              ? `${nodeData.duration} ${nodeData.interval}`
              : 'Set Up Delay'}
          </p>
        </div>
      </>
    );
  };

  const addStepNodeChild = ({ id, elements }) => {
    return (
      <Button onClick={() => addStep(id, elements)} plain>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '12px', marginTop: '1px' }}>
            <PlusMinor />
          </div>
          Add Step
        </div>
      </Button>
    );
  };

  const triggerNodeChild = ({ id, selectedTrigger, elements }) => (
    <>
      <div
        style={{ padding: '0 3rem', display: 'flex', justifyContent: 'center' }}
        onClick={() => setModificationId(id)}
      >
        <p>
          <TextStyle variation="subdued">Trigger</TextStyle>
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
        <p style={{ textAlign: 'center' }}>
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
        onClick={() => {
          debugger;
        }}
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

  const delayModifier = () => (
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
  );

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
              <Tags
                InputMode="textarea"
                settings={{
                  mixTagsInterpolator: ['{{', '}}'],
                  mode: 'mix',
                  pattern: /@/,
                  dropdown: {
                    enabled: true,
                    fuzzySearch: true,
                    position: 'text',
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
            <div>
              <Select
                label="Notify"
                options={notifyOptions}
                onChange={(value) => {
                  const newElements = [...basicElements];
                  const element = newElements.find(
                    (e) => e.id == modificationId
                  );
                  if (!element.nodeData) {
                    element.nodeData = {};
                  }
                  element.nodeData.notify = value;
                  setBasicElements(newElements);
                }}
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
                setDisplayActions({ selectedAction: action.id });
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
      marginRight: 34,
    },
    chooseNext: {
      data: {
        child: chooseNextNodeChild,
        styles: customNodeStyles,
      },
      marginBottom: 200,
    },
    end: {
      data: {
        child: endNodeChild,
        styles: customNodeStyles,
        disableEnd: true,
      },
      marginBottom: 100,
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
  };

  const transformInto = (id, type, elements) => {
    return () => {
      const newElements = [...elements];
      const insertAt = newElements.find((e) => e.id == id);
      const insertionIndex = newElements.indexOf(insertAt);

      newElements[insertionIndex] = {
        parent: insertAt.parent,
        id: id,
        type: type,
      };

      setBasicElements(newElements);
      if (type == 'delay') {
        setDisplayDelay({});
        setModificationId(id);
        setDisplayActions(false);
      } else if (type == 'action') {
        setDisplayDelay(false);
        setDisplayActions({});
        setModificationId(id);
      }
    };
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
  }, [displayTrigger, basicElements]);

  const triggerList = [
    {
      title: 'Order',
      events: [
        {
          title: 'Abandoned checkout',
          id: 'abandoned_checkout',
          description:
            'Triggered when a customer abandons an order at the checkout.',
        },
        {
          title: 'Order Created',
          id: 'order_created',
          description: 'Triggered after the customer places an order.',
        },
        {
          title: 'Cross-sell',
          id: 'cross_sell',
          description:
            'Recommend a product to the customer based on what they purchased.',
        },
        {
          title: 'Order paid',
          id: 'order_paid',
          description: 'Triggered after the order payment is confirmed.',
        },
        {
          title: 'Order cancelled',
          id: 'order_cancelled',
          description: 'Triggers if the order is cancelled.',
        },
        {
          title: 'Order refund',
          id: 'order_refund',
          description: 'Sent to the customer if their order is refunded.',
        },
        {
          title: 'Order delivered',
          id: 'order_delivered',
          description:
            'Sent automatically to the client when their order is delivered.',
        },
      ],
    },
    {
      title: 'Shipping',
      events: [
        {
          title: 'Order fulfillment',
          id: 'order_fulfillment',
          description:
            'Sent automatically to the client when their order is fulfilled.',
        },
        {
          title: 'Shipping update ',
          id: 'shipping_update',
          description:
            "Sent automatically to the client if their fulfilled order's tracking number is updated.",
        },
      ],
    },
    {
      title: 'SmartySms',
      events: [
        {
          title: 'New Subscriber Confirmation',
          id: 'new_subscriber_confirmation',
          description:
            'Configure the text message customers will receive after they subscribed based on the subscription source.',
        },
        {
          title: 'Browse Abandonment ',
          id: 'browse_abandonment',
          description:
            'Triggered when someone has viewed a product in your store.',
        },
      ],
    },
    {
      title: 'Customer',
      events: [
        {
          title: 'New customer registration',
          id: 'new_customer_registration',
          description:
            'This event will be triggered when a new customer registers in your store or he/she is added manually by the store admin.',
        },
        {
          title: 'Customer deleted',
          id: 'customer_deleted',
          description:
            'This event will be triggered when customer is deleted from your store.',
        },
        {
          title: 'Customer winback',
          id: 'customer_winback',
          description:
            'This event will be triggered periodically and will target customers who have not purchased anything in the specified period. ',
        },
      ],
    },
    {
      title: 'Product',
      events: [
        {
          title: 'Product created',
          id: 'product_created',
          description: 'This event is triggered when a new product is created.',
        },
        {
          title: 'Product update',
          id: 'product_update',
          description: 'This event is triggered when a product is updated.',
        },
        {
          title: 'Product deleted',
          id: 'product_deleted',
          description:
            'This event is triggered when a product is deleted by administrator.',
        },
      ],
    },
  ];

  const actionList = [
    {
      title: 'SMS message',
      id: 'sms',
      description: 'Send SMS when condition is met.',
    },
    {
      title: 'SMS/MMS with Responses',
      id: 'sms_mms',
      description:
        'Send SMS/MMS with keywords which trigger automated personalised responses.',
    },
    {
      title: 'MMS message',
      id: 'mms',
      description: 'Send MMS when condition is met.',
    },
    {
      title: 'Add to list',
      id: 'add_to_list',
      description: 'Add customer to specific list when condition is met.',
    },
    {
      title: 'Send Slack Notification',
      id: 'slack_notification',
      description: 'Send Slack Notification.',
    },
  ];

  const generateFlowElements = (basicElements) => {
    const flowElements = [];
    let graphY = 25;

    basicElements.forEach((basicElement, i) => {
      if (i > 0) {
        const addStepMapData = basicElementMap.addStep;

        flowElements.push({
          id: `${basicElement.id}-as`,
          type: 'flowNode',
          actualType: 'addStep',
          data: addStepMapData.data,
          position: {
            x: addStepMapData.marginRight
              ? 100 + addStepMapData.marginRight
              : 100,
            y: graphY,
          },
        });
        graphY += addStepMapData.marginBottom;

        flowElements.push({
          id: `e${basicElement.parent}-${basicElement.id}-as`,
          source: basicElement.parent,
          target: `${basicElement.id}-as`,
        });
        flowElements.push({
          id: `e${basicElement.id}-as-${basicElement.id}`,
          source: `${basicElement.id}-as`,
          target: basicElement.id,
        });
      }
      const mapData = basicElementMap[basicElement.type];

      flowElements.push({
        id: basicElement.id,
        type: 'flowNode',
        actualType: basicElement.type,
        data: { ...mapData.data, nodeData: basicElement.nodeData },
        position: {
          x: mapData.marginRight ? 100 + mapData.marginRight : 100,
          y: graphY,
        },
      });

      graphY += mapData.marginBottom;
    });
    return flowElements;
  };

  const updateDelayNode = (delayData) => {
    if (delayData.interval && delayData.duration) {
      const newElements = [...basicElements];
      const element = newElements.find((e) => e.id == modificationId);
      element.nodeData = delayData;

      setBasicElements(newElements);
    }
  };

  let modifier;
  let modificationNode;
  if (modificationId) {
    modificationNode = basicElements.find((e) => e.id == modificationId);
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
          {modificationId && modifier()}
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
                  body: JSON.stringify({basicElements, flowName, flowStatus, flowId}),
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
          <ReactFlow
            nodesConnectable={false}
            nodesDraggable={false}
            elements={generateFlowElements(basicElements)}
            nodeTypes={{
              flowNode: FlowComponent,
            }}
          />
        </div>
      </div>
    </ElementsContext.Provider>
  );
};

export default FlowTree;
