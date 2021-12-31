import React, { useCallback, useState } from 'react';
import { Button, Modal, TextContainer } from '@shopify/polaris';

export default function ModalComp(props) {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator =
    props.addBtn == true ? (
      <div>
        <Button onClick={handleChange}>
          {props.title} {props.nodeData.length}
        </Button>
      </div>
    ) : (
      <div onClick={handleChange}>
        {props.title}
        {props.addBtn}
      </div>
    );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '19rem',
      }}
    >
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Conditions"
        // primaryAction={{
        //   content: 'Add Instagram',
        //   onAction: handleChange,
        // }}
        // secondaryActions={[
        //   {
        //     content: 'Learn more',
        //     onAction: handleChange,
        //   },
        // ]}
      >
        <Modal.Section>
          <TextContainer>{props.content}</TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
