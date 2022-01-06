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
  ColorPicker,
} from '@shopify/polaris';

const Customize = () => {
    const [color, setColor] = useState({
      hue: 120,
      brightness: 1,
      saturation: 1,
    });
    
  return (
    <>
        <FormLayout>
            <Card 
                title="Customize" 
                sectioned 
                primaryFooterAction={{content: 'Save and Continue'}}
                footerActionAlignment="left"
            >
                <div>
                    <TextField type="text" label="Name your Loyalty Program" placeholder='Subscribe and Save' autoComplete="off" />                        
                    <TextField type="text" label="Select Loyalty Location" placeholder='Customer portal' autoComplete="off" />
                </div>
                
                <div>
                    <h3>COLORS</h3>                  
                    <div>
                        <p>Primary Theme Color</p>
                        <ColorPicker onChange={setColor} color={color} />
                        <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />

                        <p>Secondary Theme Color</p>
                        <ColorPicker onChange={setColor} color={color} />
                        <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                    </div>    
                    <div>
                        <p>Primary Text Color</p>
                        <ColorPicker onChange={setColor} color={color} />
                        <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />

                        <p>Secondary Text Color</p>
                        <ColorPicker onChange={setColor} color={color} />
                        <TextField type="text" placeholder='None' onChange={() => {}} autoComplete="off" />
                    </div>
                </div>
            </Card>
        </FormLayout>
    </>
  );
}
export default Customize;