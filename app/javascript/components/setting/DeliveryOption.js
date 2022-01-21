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
import {Text} from "html-react-parser";

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

  const [errorMsg, setErrorMsg] = useState('')
  const toastMarkup = function(msg){ setErrorMsg(msg); }

  const submission = function (){
    var delivery_sets = {
      delivery_option: deliveryOptions
    };

    var settings = [];
    setErrorMsg('');
    if( monday ){
      if( mondayProd == '' || mondayTime == '' ){
        toastMarkup('Please select cutoff day/time for Monday.')
        return false;
      }
      settings[settings.length] = {delivery: 'monday', cutoff_day: mondayProd, cutoff_time: mondayTime};
    }
    if( tuesday ){
      if( tuesdayProd == '' || tuesdayTime == '' ){
        toastMarkup('Please select cutoff day/time for Tuesday.')
        return false;
      }
      settings[settings.length] = {delivery: 'tuesday', cutoff_day: tuesdayProd, cutoff_time: tuesdayTime};
    }
    if( wednesday ){
      if( wednesdayProd == '' || wednesdayTime == '' ){
        toastMarkup('Please select cutoff day/time for Wednesday.')
        return false;
      }
      settings[settings.length] = {delivery: 'wednesday', cutoff_day: wednesdayProd, cutoff_time: wednesdayTime};
    }
    if( thursday ){
      if( thursdayProd == '' || thursdayTime == '' ){
        toastMarkup('Please select cutoff day/time for Thursday.')
        return false;
      }
      settings[settings.length] = {delivery: 'thursday', cutoff_day: thursdayProd, cutoff_time: thursdayTime};
    }
    if( friday ){
      if( fridayTime == '' || fridayProd == '' ){
        toastMarkup('Please select cutoff day/time for Friday.')
        return false;
      }
      settings[settings.length] = {delivery: 'friday', cutoff_day: fridayProd, cutoff_time: fridayTime};
    }
    if( saturday ){
      if( saturdayProd == '' || saturdayTime == '' ){
        toastMarkup('Please select cutoff day/time for Saturday.')
        return false;
      }
      settings[settings.length] = {delivery: 'saturday', cutoff_day: saturdayProd, cutoff_time: saturdayTime};
    }
    if( sunday ){
      if( sundayProd == '' || sundayProd == '' ){
        toastMarkup('Please select cutoff day/time for Sunday.')
        return false;
      }
      settings[settings.length] = {delivery: 'sunday', cutoff_day: sundayProd, cutoff_time: sundayProd};
    }
    delivery_sets.settings = settings;

    console.log('Setting: ', delivery_sets);

    fetch('/settings/delivery_options', {
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

  useEffect(()=>{
    fetch('/settings/delivery_options', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        if( data.options && data.options.settings != null ){
          let settings = data.options.settings;
          for( let i = 0; i < settings.length; i++ ){
            if( settings[i].delivery == 'monday' ){
              setMonday(true);
              setMondayProd( settings[i].cutoff_day );
              setMondayTime(settings[i].cutoff_time);
            }else if( settings[i].delivery == 'tuesday' ){
              setTuesday(true);
              setTuesdayProd( settings[i].cutoff_day );
              setTuesdayTime(settings[i].cutoff_time);
            }else if( settings[i].delivery == 'wednesday' ){
              setWednesday(true);
              setWednesdayProd( settings[i].cutoff_day );
              setWednesdayTime(settings[i].cutoff_time);
            }else if( settings[i].delivery == 'thursday' ){
              setThursday(true);
              setThursdayProd( settings[i].cutoff_day );
              setThursdayTime(settings[i].cutoff_time);
            }else if( settings[i].delivery == 'friday' ){
              setFriday(true);
              setFridayProd( settings[i].cutoff_day );
              setFridayTime(settings[i].cutoff_time);
            }else if( settings[i].delivery == 'saturday' ){
              setSaturday(true);
              setSaturdayProd( settings[i].cutoff_day );
              setSaturdayTime(settings[i].cutoff_time);
            }else if( settings[i].delivery == 'sunday' ){
              setSunday(true);
              setSundayProd( settings[i].cutoff_day );
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
      </Layout>
    </>
  );
};

export default DeliveryOption;
