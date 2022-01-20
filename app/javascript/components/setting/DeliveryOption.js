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

const DeliveryOption = ( {handleBack} ) => {
  const [monday, setMonday] = useState(false);
  const [mondayTime, setMondayTime] = useState('');
  const [mondayProd, setMondayProd] = useState('');

  const [tuesday, setTuesday] = useState(false);
  const [tuesdayTime, setTuesdayTime] = useState('');
  const [tuesdayProd, setTuesdayProd] = useState('');

  const [wednesday, setWednesday] = useState(false);
  const [wednesdayTime, setWednesdayTime] = useState('');
  const [wednesdayProd, setWednesdayProd] = useState('');

  const [thursday, setThursday] = useState(false);
  const [thursdayTime, setThursdayTime] = useState('');
  const [thursdayProd, setThursdayProd] = useState('');

  const [friday, setFriday] = useState(false);
  const [fridayTime, setFridayTime] = useState('');
  const [fridayProd, setFridayProd] = useState('');

  const [saturday, setSaturday] = useState(false);
  const [saturdayTime, setSaturdayTime] = useState('');
  const [saturdayProd, setSaturdayProd] = useState('');

  const [sunday, setSunday] = useState(false);
  const [sundayTime, setSundayTime] = useState('');
  const [sundayProd, setSundayProd] = useState('');

  const [deliveryOptions, setDeliveryOptions] = useState('3');

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

  const d_options = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ];

  const eligible_weekdays_for_delivery_options = [
    { label: 'Every weekday', value: 'Every weekday' },
    { label: 'Only business days', value: 'only business days' },
    { label: 'Monday to thursday', value: 'monday to thursday' },
    { label: 'Tuesday to Friday', value: 'tuesday to friday' },
    { label: 'Tuesday to thursday', value: 'tuesday to thursday' },
  ];

  return (
    <>
      <Layout>
        <Layout.Section>
          <div className="back-button pointer" onClick={handleBack}>
            <Icon source={MobileBackArrowMajor} color="base" />
            <p>
              <TextStyle variation="subdued">Delivery Options</TextStyle>
            </p>
          </div>
        </Layout.Section>
        <Card>
          <Card.Section>
            <div className="delivery">
              <FormLayout>

                <Checkbox
                  label="Monday"
                  checked={monday}
                  onChange={useCallback((newChecked) => setMonday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={mondayProd}
                  onChange={useCallback((newChecked) => setMondayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={mondayTime}
                  onChange={useCallback((newChecked) => setMondayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Checkbox
                  label="Tuesday"
                  checked={tuesday}
                  onChange={useCallback((newChecked) => setTuesday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={tuesdayProd}
                  onChange={useCallback((newChecked) => setTuesdayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={tuesdayTime}
                  onChange={useCallback((newChecked) => setTuesdayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Checkbox
                  label="Wednesday"
                  checked={wednesday}
                  onChange={useCallback((newChecked) => setWednesday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={wednesdayProd}
                  onChange={useCallback((newChecked) => setWednesdayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={wednesdayTime}
                  onChange={useCallback((newChecked) => setWednesdayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Checkbox
                  label="Thursday"
                  checked={thursday}
                  onChange={useCallback((newChecked) => setThursday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={thursdayProd}
                  onChange={useCallback((newChecked) => setThursdayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={thursdayTime}
                  onChange={useCallback((newChecked) => setThursdayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Checkbox
                  label="Friday"
                  checked={friday}
                  onChange={useCallback((newChecked) => setFriday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={fridayProd}
                  onChange={useCallback((newChecked) => setFridayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={fridayTime}
                  onChange={useCallback((newChecked) => setFridayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Checkbox
                  label="Saturday"
                  checked={saturday}
                  onChange={useCallback((newChecked) => setSaturday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={saturdayProd}
                  onChange={useCallback((newChecked) => setSaturdayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={saturdayTime}
                  onChange={useCallback((newChecked) => setSaturdayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Checkbox
                  label="Sunday"
                  checked={sunday}
                  onChange={useCallback((newChecked) => setSunday(newChecked), [])}
                />
                <Select
                  label="Cutoff Day"
                  value={sundayProd}
                  onChange={useCallback((newChecked) => setSundayProd(newChecked), [])}
                  options={day_of_production_options}
                />
                <TextField
                  label="Cutoff Time"
                  value={sundayTime}
                  onChange={useCallback((newChecked) => setSundayTime(newChecked), [])}
                  autoComplete="off"
                  type="time"
                />
                <hr/>

                <Select
                  label="Delivery Options"
                  value={sundayProd}
                  onChange={useCallback((newChecked) => setDeliveryOptions(newChecked), [])}
                  options={d_options}
                />
                {/* <Select
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
                />*/}
              </FormLayout>
            </div>
          </Card.Section>
        </Card>
      </Layout>
    </>
  );
};

export default DeliveryOption;
