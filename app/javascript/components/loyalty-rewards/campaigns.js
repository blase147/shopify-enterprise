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
    [1,'Emerald Silk Gown', '$875.00', '124689', '140', <label className="switch-status"><input type="checkbox" /><span className="slider-status"></span></label>],
    [2,'Mauve Cashmere Scarf', '$230.00', '124533', '83', <label className="switch-status"><input type="checkbox" /><span className="slider-status"></span></label>],
    [3,
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
      '124518',
      '32',
      <label className="switch-status"><input type="checkbox" /><span className="slider-status"></span></label>,
    ],
    [1,'Emerald Silk Gown', '$875.00', '124689', '140', <label className="switch-status"><input type="checkbox" /><span className="slider-status"></span></label>],
    [2,'Mauve Cashmere Scarf', '$230.00', '124533', '83', <label className="switch-status"><input type="checkbox" /><span className="slider-status"></span></label>],
    [3,
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
      '124518',
      '32',
      <label className="switch-status"><input type="checkbox" /><span className="slider-status"></span></label>,
    ],
  ];
    
  return (
    <FormLayout>
      <Card 
        title="" 
        sectioned 
      >        
        <div className='campaign-search'>     
            <Stack distribution="equalSpacing">
                <TextField
                  placeholder='Search'
                  value={textFieldValue}
                  onChange={handleTextFieldChange}
                  clearButton
                  onClearButtonClick={handleClearButtonClick}
                  autoComplete="off"
                />
              <Button primary>Create Campaign</Button>
            </Stack>
        </div>
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