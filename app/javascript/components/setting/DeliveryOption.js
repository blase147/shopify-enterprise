import React, { useCallback, useState, useEffect } from 'react';
import { MobileBackArrowMajor } from '@shopify/polaris-icons';
import {
  Card,
  Layout,
  Toast,
  List,
  Button,
  TextField,
  Icon,
  FormLayout,
  DisplayText,
  TextStyle,
  Select,
  ResourceItem,
  ResourceList,
  SettingToggle, Checkbox
} from '@shopify/polaris';
import { post } from 'jquery';

const DeliveryOption = ( props ) => {
  const [active, setActive] = useState(false);
  const handleToggle = () => {
    fetch('/debug_mode?status='+(!active),{
      method: 'POST',
    })
    .then((response) => response.json())
    .then((data) => {
      setActive(!active);
    })
  }

  useEffect(()=>{
    fetch('/debug_mode',{
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => {
      setActive(data.debug_mode);
    })
  },[])

  const day_of_production_options = [
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },

  ];

  const delivery_interval_after_production_options = [
    { label: '1 business day', value: '1 business day' },
    { label: '2 business days', value: '2 business days' },
    { label: '3 business days', value: '3 business days' },
    { label: '4 business days', value: '4 business days' },
    { label: '5 business days', value: '5 business days' },
  ];

  const eligible_weekdays_for_delivery_options = [
    { label: 'Every weekday', value: 'Every weekday' },
    { label: 'Only business days', value: 'only business days' },
    { label: 'Monday to thursday', value: 'monday to thursday' },
    { label: 'Tuesday to Friday', value: 'tuesday to friday' },
    { label: 'Tuesday to thursday', value: 'tuesday to thursday' },
  ];

  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);
  const { values, touched, errors, setFieldValue, handleBack } = props;
  return (
    <>
      <Layout>
        <Layout.Section>
          <div className="back-button pointer" onClick={handleBack}>
            <Icon source={MobileBackArrowMajor} color="base" />
            <p>
              <TextStyle variation="subdued">Settings</TextStyle>
            </p>
          </div>
        </Layout.Section>
        <Card>
          <Card.Section>
            <div className="delivery">
              <FormLayout>

                <Checkbox
                  label="Monday"
                  onChange={handleChange}/>


                <Select
                  label="Cut off day"
                  value={values.dayOfProduction}
                  error={touched.dayOfProduction && errors.dayOfProduction}
                  onChange={(e) => setFieldValue('dayOfProduction', e)}
                  options={day_of_production_options}
                />

                <TextField label={'Time (PST)'} type={'time'} />

                <hr/>

                <Checkbox
                  label="Tuesday"
                  onChange={handleChange}/>


                <Select
                  label="Cut off day"
                  value={values.dayOfProduction}
                  error={touched.dayOfProduction && errors.dayOfProduction}
                  onChange={(e) => setFieldValue('dayOfProduction', e)}
                  options={day_of_production_options}
                />

                <TextField label={'Time (PST)'} type={'time'} autoComplete='off' />

                <hr/>
                <Checkbox
                  label="Wednesday"
                  onChange={handleChange}/>


                <Select
                  label="Cut off day"
                  value={values.dayOfProduction}
                  error={touched.dayOfProduction && errors.dayOfProduction}
                  onChange={(e) => setFieldValue('dayOfProduction', e)}
                  options={day_of_production_options}
                />

                <TextField label={'Time (PST)'} type={'time'} />

               
                <Select
                  label="day of production options"
                  value={values.dayOfProduction}
                  error={touched.dayOfProduction && errors.dayOfProduction}
                  onChange={(e) => setFieldValue('dayOfProduction', e)}
                  options={day_of_production_options}
                />

                <TextStyle variation="subdued">
                  delivery interval after production options
                </TextStyle>

                <Select
                  label="delivery interval after production options"
                  value={values.deliveryIntervalAfterProduction}
                  error={touched.deliveryIntervalAfterProduction && errors.deliveryIntervalAfterProduction}
                  onChange={(e) => setFieldValue('deliveryIntervalAfterProduction', e)}
                  options={delivery_interval_after_production_options}
                />

                <TextStyle variation="subdued">
                  eligible weekdays for delivery options
                </TextStyle>

                <Select
                  label="eligible weekdays for delivery options"
                  value={values.eligibleWeekdaysForDelivery}
                  error={touched.eligibleWeekdaysForDelivery && errors.eligibleWeekdaysForDelivery}
                  onChange={(e) => setFieldValue('eligibleWeekdaysForDelivery', e)}
                  options={eligible_weekdays_for_delivery_options}
                />
              </FormLayout>
            </div>
          </Card.Section>
        </Card>
      </Layout>
    </>
  );
};

export default DeliveryOption;
