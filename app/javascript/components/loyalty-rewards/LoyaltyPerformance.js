import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  FormLayout,
  Icon,
  Button,
  Collapsible,
  Stack,
  DisplayText,
  TextField,
  TextContainer,
  Heading,
  Select
} from '@shopify/polaris';
import {
  CaretUpMinor,
  CaretDownMinor
} from '@shopify/polaris-icons';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const LoyaltyPerformance = () => {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const [selected, setSelected] = useState('today');
  const handleSelectChange = useCallback((value) => setSelected(value), []);


  const [valueText, setValueText] = useState('30');
  const handleTextChange = useCallback((newValue) => setValueText(valueText), []);

  const options = [
    {label: 'Today', value: 'today'},
    {label: 'Yesterday', value: 'yesterday'},
    {label: 'Last 7 days', value: 'lastWeek'},
  ];
  const chartOption = {
    chart: {
      type: 'column'
    },
    credits: {
      enabled: false
    },
    title: {
        text: 'Total Revenue Generated',
        style: {
          fontSize: '20px',
          fontWeight: '600',
          fontFamily: '-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif',
      }
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      crosshair: false,
      tickWidth: 0,
      lineWidth: 0,
      minorGridLineWidth: 0,
      lineColor: 'transparent',
      minorTickLength: 0,
      tickLength: 0,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: '400',
          color: '#B7B7B7',
          fontFamily: '-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif',
        },
        rotation: 90,
        formatter: function() {
          return Highcharts.dateFormat('%H:%M:%S.%L', this.value);
        }
      }
    },
    yAxis: {
        min: 0,
        crosshair: false,
        gridLineWidth: 0,
        title: {
            text: 'Total Sales',
            style: {
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: '-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif',
          }
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {
          color: '#007EFF',
          pointWidth: 40
        },
    },
    series: [{
        name: 'Day',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
    }]
  };

  return (
    <>
    <FormLayout>
      <Card 
        title="Revenue Trends - Basic" 
        sectioned 
        footerActionAlignment="left"
      > 
        <div className='filters'>
          <Button
            onClick={handleToggle}
            ariaExpanded={open}
            ariaControls="basic-collapsible"
            plain monochrome
          >
            <Stack>{ open ? <Icon
            source={CaretUpMinor}
            color="base" /> : <Icon
            source={CaretDownMinor}
            color="base" /> } <TextContainer element='h5'><p>Filter</p></TextContainer></Stack>
          </Button>
          <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
          >
            <div className='filter-list'>
              <Stack alignment="center">
                <TextContainer><p>Date Range</p></TextContainer>
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <TextField
                  value={valueText}
                  onChange={handleTextChange}
                  autoComplete="off"
                />
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </Stack>
            </div>

            <div className='filter-list'>
              <Stack alignment="center">
                <TextContainer><p>Graph Time Period</p></TextContainer>
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </Stack>
            </div>

            <div className='filter-list'>
              <Stack alignment="center">
                <TextContainer><p>Redemption tied to Purchase</p></TextContainer>
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </Stack>
            </div>

            <div className='filter-list'>
              <Stack alignment="center">
                <TextContainer><p>Only Loyalty Members</p></TextContainer>
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </Stack>
            </div>

            <div className='filter-list'>
              <Stack alignment="center">
                <TextContainer><p>Has Account</p></TextContainer>
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </Stack>
            </div>
            <div className='filter-list'>
              <Button primary>Run</Button>
            </div>
          </Collapsible>
        </div>
      </Card>
    </FormLayout>
    <div className='loyalty-performance'>
      <Heading element='h3'>Loyalty Performance</Heading>
      <div className='holder'>
          <div className='cards-list'>
            <Card sectioned>
                <TextContainer>
                    <p>Referral Participation <br /> Rate</p>
                    <strong>43</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Referral  <br /> Customers</p>
                    <strong>80</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Referral Conversion <br /> Rate</p>
                    <strong>$5000</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Total Revenue <br /> Generated</p>
                    <strong>$550</strong>
                </TextContainer>
            </Card>
        </div>
      </div>
    </div>

    <div className='total-rev-chart'>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOption}
      />
    </div>

    <div className='loyalty-performance'>
      <Heading element='h3'>Referred Customer</Heading>
      <div className='holder'>
          <div className='cards-list'>
            <Card sectioned>
                <TextContainer>
                    <p>Unique <br /> Clicks</p>
                    <strong>43</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Referral  <br /> Customers</p>
                    <strong>80</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>First Purchase <br /> Revenue</p>
                    <strong>$550</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Lifetime <br /> Revenue</p>
                    <strong>$550</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Referral Acquisition <br /> Rate</p>
                    <strong>43</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Repeat Purchase <br /> Rate</p>
                    <strong>80</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>Average <br /> Orders</p>
                    <strong>$5000</strong>
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <p>ARPU <br /> &nbsp;</p>
                    <strong>$550</strong>
                </TextContainer>
            </Card>
        </div>
      </div>
    </div>

    <div className="bottom-section-customer">
      <Stack distribution="fillEvenly">
        <Stack.Item>
          <div className='loyalty-performance'>
            <Heading element='h3'>Reactivated Customers</Heading>
              <div className='holder'>
                  <div className='cards-list'>
                    <Card sectioned>
                        <TextContainer>
                            <p>Unique <br /> Clicks</p>
                            <strong>43</strong>
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                            <p>Referral  <br /> Customers</p>
                            <strong>80</strong>
                        </TextContainer>
                    </Card>
                </div>
              </div>
            </div>
        </Stack.Item>
        <Stack.Item>
          <div className='loyalty-performance'>
            <Heading element='h3'>Reactivated Customers</Heading>
              <div className='holder'>
                  <div className='cards-list'>
                    <Card sectioned>
                        <TextContainer>
                            <p>Unique <br /> Clicks</p>
                            <strong>43</strong>
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <TextContainer>
                            <p>Referral  <br /> Customers</p>
                            <strong>80</strong>
                        </TextContainer>
                    </Card>
                </div>
              </div>
            </div>
        </Stack.Item>
      </Stack>
    </div>
    </>
  );
}
export default LoyaltyPerformance;