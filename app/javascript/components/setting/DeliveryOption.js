import React, { useCallback, useState, useEffect, useContext } from 'react';
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
import { Text } from "html-react-parser";
import { DomainContext } from '../domain-context';

const DeliveryOption = ({ handleBack }) => {
  const { domain } = useContext(DomainContext);

  const [monday, setMonday] = useState(false);
  const [mondayTime, setMondayTime] = useState('00:00');
  const [mondayProd, setMondayProd] = useState('');

  const [tuesday, setTuesday] = useState(false);
  const [tuesdayTime, setTuesdayTime] = useState('00:00');
  const [tuesdayProd, setTuesdayProd] = useState('');

  const [wednesday, setWednesday] = useState(false);
  const [wednesdayTime, setWednesdayTime] = useState('00:00');
  const [wednesdayProd, setWednesdayProd] = useState('');

  const [thursday, setThursday] = useState(false);
  const [thursdayTime, setThursdayTime] = useState('00:00');
  const [thursdayProd, setThursdayProd] = useState('');

  const [friday, setFriday] = useState(false);
  const [fridayTime, setFridayTime] = useState('00:00');
  const [fridayProd, setFridayProd] = useState('');

  const [saturday, setSaturday] = useState(false);
  const [saturdayTime, setSaturdayTime] = useState('00:00');
  const [saturdayProd, setSaturdayProd] = useState('');

  const [sunday, setSunday] = useState(false);
  const [sundayTime, setSundayTime] = useState('00:00');
  const [sundayProd, setSundayProd] = useState('');

  const [deliveryOptions, setDeliveryOptions] = useState('3');

  const day_of_production_options = [
    { label: 'Select', value: '' },
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


  const time = [
    { label: '00:00', value: '00:00' },
    { label: '01:00', value: '01:00' },
    { label: '02:00', value: '02:00' },
    { label: '03:00', value: '03:00' },
    { label: '04:00', value: '04:00' },
    { label: '05:00', value: '05:00' },
    { label: '06:00', value: '06:00' },
    { label: '07:00', value: '07:00' },
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
    { label: '17:00', value: '17:00' },
    { label: '18:00', value: '18:00' },
    { label: '19:00', value: '19:00' },
    { label: '20:00', value: '20:00' },
    { label: '21:00', value: '21:00' },
    { label: '22:00', value: '22:00' },
    { label: '23:00', value: '23:00' },


  ]
  const [errorMsg, setErrorMsg] = useState('')
  const toastMarkup = function (msg) { setErrorMsg(msg); }

  const submission = function () {
    var delivery_sets = {
      delivery_option: deliveryOptions
    };

    var settings = [];
    setErrorMsg('');
    if (monday) {
      if (mondayProd == '' || mondayTime == '') {
        toastMarkup('Please select cutoff day/time for Monday.')
        return false;
      }
      settings[settings.length] = { delivery: 'monday', cutoff_day: mondayProd, cutoff_time: mondayTime };
    }
    if (tuesday) {
      if (tuesdayProd == '' || tuesdayTime == '') {
        toastMarkup('Please select cutoff day/time for Tuesday.')
        return false;
      }
      settings[settings.length] = { delivery: 'tuesday', cutoff_day: tuesdayProd, cutoff_time: tuesdayTime };
    }
    if (wednesday) {
      if (wednesdayProd == '' || wednesdayTime == '') {
        toastMarkup('Please select cutoff day/time for Wednesday.')
        return false;
      }
      settings[settings.length] = { delivery: 'wednesday', cutoff_day: wednesdayProd, cutoff_time: wednesdayTime };
    }
    if (thursday) {
      if (thursdayProd == '' || thursdayTime == '') {
        toastMarkup('Please select cutoff day/time for Thursday.')
        return false;
      }
      settings[settings.length] = { delivery: 'thursday', cutoff_day: thursdayProd, cutoff_time: thursdayTime };
    }
    if (friday) {
      if (fridayTime == '' || fridayProd == '') {
        toastMarkup('Please select cutoff day/time for Friday.')
        return false;
      }
      settings[settings.length] = { delivery: 'friday', cutoff_day: fridayProd, cutoff_time: fridayTime };
    }
    if (saturday) {
      if (saturdayProd == '' || saturdayTime == '') {
        toastMarkup('Please select cutoff day/time for Saturday.')
        return false;
      }
      settings[settings.length] = { delivery: 'saturday', cutoff_day: saturdayProd, cutoff_time: saturdayTime };
    }
    if (sunday) {
      if (sundayProd == '' || sundayProd == '') {
        toastMarkup('Please select cutoff day/time for Sunday.')
        return false;
      }
      settings[settings.length] = { delivery: 'sunday', cutoff_day: sundayProd, cutoff_time: sundayProd };
    }
    delivery_sets.settings = settings;

    console.log('Setting: ', delivery_sets);

    fetch(`/settings/delivery_options?shopify_domain=${domain}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(delivery_sets),
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        setErrorMsg('Delivery option settings updated successfully.');
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }

  useEffect(() => {
    fetch(`/settings/delivery_options?shopify_domain=${domain}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.options && data.options.settings != null) {
          let settings = data.options.settings;
          for (let i = 0; i < settings.length; i++) {
            if (settings[i].delivery == 'monday') {
              setMonday(true);
              setMondayProd(settings[i].cutoff_day);
              setMondayTime(settings[i].cutoff_time);
            } else if (settings[i].delivery == 'tuesday') {
              setTuesday(true);
              setTuesdayProd(settings[i].cutoff_day);
              setTuesdayTime(settings[i].cutoff_time);
            } else if (settings[i].delivery == 'wednesday') {
              setWednesday(true);
              setWednesdayProd(settings[i].cutoff_day);
              setWednesdayTime(settings[i].cutoff_time);
            } else if (settings[i].delivery == 'thursday') {
              setThursday(true);
              setThursdayProd(settings[i].cutoff_day);
              setThursdayTime(settings[i].cutoff_time);
            } else if (settings[i].delivery == 'friday') {
              setFriday(true);
              setFridayProd(settings[i].cutoff_day);
              setFridayTime(settings[i].cutoff_time);
            } else if (settings[i].delivery == 'saturday') {
              setSaturday(true);
              setSaturdayProd(settings[i].cutoff_day);
              setSaturdayTime(settings[i].cutoff_time);
            } else if (settings[i].delivery == 'sunday') {
              setSunday(true);
              setSundayProd(settings[i].cutoff_day);
              setSundayTime(settings[i].cutoff_time);
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }, [])
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
                  <Select
                    label="Cutoff Time"
                    value={mondayTime}
                    onChange={useCallback((newChecked) => setMondayTime(newChecked), [])}
                    autoComplete="off"
                    options={time}
                    type="time"
                  />
                  <hr />

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
                  <Select
                    options={time}
                    label="Cutoff Time"
                    value={tuesdayTime}
                    onChange={useCallback((newChecked) => setTuesdayTime(newChecked), [])}
                    autoComplete="off"
                    type="time"
                  />
                  <hr />

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
                  <Select
                    options={time}
                    label="Cutoff Time"
                    value={wednesdayTime}
                    onChange={useCallback((newChecked) => setWednesdayTime(newChecked), [])}
                    autoComplete="off"
                    type="time"
                  />
                  <hr />

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
                  <Select
                    options={time}
                    label="Cutoff Time"
                    value={thursdayTime}
                    onChange={useCallback((newChecked) => setThursdayTime(newChecked), [])}
                    autoComplete="off"
                    type="time"
                  />
                  <hr />

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
                  <Select
                    options={time}
                    label="Cutoff Time"
                    value={fridayTime}
                    onChange={useCallback((newChecked) => setFridayTime(newChecked), [])}
                    autoComplete="off"
                    type="time"
                  />
                  <hr />

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
                  <Select
                    options={time}
                    label="Cutoff Time"
                    value={saturdayTime}
                    onChange={useCallback((newChecked) => setSaturdayTime(newChecked), [])}
                    autoComplete="off"
                    type="time"
                  />
                  <hr />

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
                  <Select
                    options={time}
                    label="Cutoff Time"
                    value={sundayTime}
                    onChange={useCallback((newChecked) => setSundayTime(newChecked), [])}
                    autoComplete="off"
                    type="time"
                  />
                  <hr />

                  <Select
                    label="Delivery Options"
                    value={deliveryOptions}
                    onChange={useCallback((newChecked) => setDeliveryOptions(newChecked), [])}
                    options={d_options}
                  />

                  <DisplayText size="small">{errorMsg}</DisplayText>
                  <Button

                    class="primary"
                    onClick={submission}
                  >Submit</Button>
                </FormLayout>
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};

export default DeliveryOption;
