import React, { useRef, useState, useCallback } from 'react';

import { TextField, Button, Toast } from '@shopify/polaris';
import { ClipboardMinor } from '@shopify/polaris-icons';


const CodeSnippet = (props) => {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    ref.current.getElementsByTagName('input')[0].select();
    document.execCommand('copy');
    setCopied(true);
  }, [ref, setCopied]);

  return (
    <span ref={ref}>
      {copied && <Toast content="Copied to clipboard" onDismiss={() => setCopied(false)} />}

      <TextField
        label=""
        labelHidden
        onChange={() => undefined}
        connectedRight={<Button icon={ClipboardMinor} onClick={copyToClipboard}></Button>}
        value={props.code}
      />
    </span>
  )
};

export default CodeSnippet;