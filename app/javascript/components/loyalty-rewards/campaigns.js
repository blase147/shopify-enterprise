import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  Select,
  FormLayout,
  Button,
  Icon,
  Modal,
  TextField,
  Layout,
  Page,
  Stack,
  Tabs,
  DataTable,
} from '@shopify/polaris';

const Campaigns = () => {
  const [textFieldValue, setTextFieldValue] = useState('');

  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    [],
  );

  const handleClearButtonClick = useCallback(() => setTextFieldValue(''), []);
  const rows = [
    [1,'Emerald Silk Gown', '$875.00', '124689', '140', '$122,500.00'],
    [2,'Mauve Cashmere Scarf', '$230.00', '124533', '83', '$19,090.00'],
    [3,
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
      '124518',
      '32',
      '$14,240.00',
    ],
    [1,'Emerald Silk Gown', '$875.00', '124689', '140', '$122,500.00'],
    [2,'Mauve Cashmere Scarf', '$230.00', '124533', '83', '$19,090.00'],
    [3,
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
      '124518',
      '32',
      '$14,240.00',
    ],
  ];
    
  return (
    <FormLayout>
      <Card 
        title="" 
        sectioned 
      >             
        <TextField
          placeholder='Search'
          value={textFieldValue}
          onChange={handleTextFieldChange}
          clearButton
          onClearButtonClick={handleClearButtonClick}
          autoComplete="off"
        />
        <Button>Create Campaign</Button>
        <DataTable
          columnContentTypes={[
            'numeric',
            'text',
            'text',
            'text',
            'text',
            'text',
          ]}
          headings={[
            'ID',
            'Name',
            'Date Created',
            'Conversion Rate',
            'Revenue',
            'Status',
          ]}
          rows={rows}
          hideScrollIndicator={true}
          footerContent={`Showing ${rows.length} of ${rows.length} results`}
        />
      </Card>
    </FormLayout>
  );
}
export default Campaigns;