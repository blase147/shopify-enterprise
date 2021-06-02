import React, { useState, useEffect, useCallback, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import dayjs from 'dayjs';

import {
  Card,
  FormLayout,
  Icon,
  Layout,
  Page,
  Stack,
  Button,
  Select,
  TextField,
  DisplayText,
  TextStyle,
  Heading,
  DataTable,
  TextContainer,
  DatePicker,
  Spinner
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';

import { Form } from 'formik';
import DateRangePicker from '../common/DatePicker/DateRangePicker';



const SmartSms = () => {

  const chartOptions={
    chart: {
        type: 'area'
    },
    title: {
        text: 'Historic and Estimated Worldwide Population Growth by Region'
    },
    subtitle: {
        text: 'Source: Wikipedia.org'
    },
    xAxis: {
        categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: 'Billions'
        },
        labels: {
            formatter: function () {
                return this.value / 1000;
            }
        }
    },
    tooltip: {
        split: true,
        valueSuffix: ' millions'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [{
        name: 'Asia',
        data: [502, 635, 809, 947, 1402, 3634, 5268]
    }, {
        name: 'Africa',
        data: [106, 107, 111, 133, 221, 767, 1766]
    }, {
        name: 'Europe',
        data: [163, 203, 276, 408, 547, 729, 628]
    }, {
        name: 'America',
        data: [18, 31, 54, 156, 339, 818, 1201]
    }, {
        name: 'Oceania',
        data: [2, 2, 2, 6, 13, 30, 46]
    }]
}

    // const [filters,setFilters]=useContext(FilterContext)
    const [filters,setFilters]=useState({startDate:dayjs(new Date()).subtract(30,'days').format("YYYY-MM-DD"),endDate:dayjs(new Date()).format("YYYY-MM-DD"),span:"30 days"})
    const handleFiltersDates=(dates,span)=>{
      if(!isEmpty(dates)){
        const {start,end}=dates;
        setFilters({startDate:dayjs(start).format("YYYY-MM-DD"),endDate:dayjs(end).format("YYYY-MM-DD"),span:span});
      }
    }
  return (
   
      <FormLayout>
      
          <Layout>
                <Layout.Section>
                  <Card title="">
                    <Card.Section>
                      <div className="rev-date-picker">
                        <DateRangePicker
                          start={filters.startDate}
                          end={filters.endDate}
                          span={filters.span}
                          handleDates={handleFiltersDates}
                        />
                        </div>
                      
                    </Card.Section>
                  </Card>
                </Layout.Section>
          </Layout>

        <div className="card-tabs">
          <Layout>
          {/* <Layout.Section secondary> */}
          <div className="container-left customer-count">
            <Layout.Section>
              <Stack vertical distribution="equalSpacing">
                {/* {customerListKeys?.map((item, i) => ( */}
                  <Stack.Item>
                    <Card sectioned>
                    <div className="count-section">
                       
                          <TextStyle variation="strong">
                            {/* {item.section} */}
                            sasass
                          </TextStyle>
                          <TextStyle
                            // variation={sectionCustomerList[item.key]?.up ? 'positive' : 'negative'}
                            
                          >
                            sadasdds
                            <Icon
                              // source={sectionCustomerList[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                              // color={sectionCustomerList[item.key]?.up ? 'green' : 'red'}
                            />
                            {/* {(sectionCustomerList[item.key]?.up===false && sectionCustomerList[item.key]?.percent==0)?100:Math.abs(sectionCustomerList[item.key].percent)}% */}
                          </TextStyle>
                        
                        </div>
                      <Stack>
                        <Stack.Item>
                          <DisplayText size="medium">
                            <TextStyle variation="strong">
                              sasass
                            {/* <CounterUp prefix={item?.prefix || ""} suffix={item?.suffix || ""} start={0} end={Number.parseFloat(sectionCustomerList[item.key]?.value).toFixed(2)} duration={1.5} decimals={2} /> */}
                            </TextStyle>
                          </DisplayText>
                        </Stack.Item>
                      </Stack>
                    </Card>
                  </Stack.Item>
                {/* ))} */}
              </Stack>
            </Layout.Section>
          </div>
          {/* </Layout.Section> */}
          <div className="container-right">
            <Layout.Section>
              <div className="card-chart">
                <Card>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                  />

                  
                
                </Card>
              </div>
            </Layout.Section>
          </div>
          </Layout>
          
         
      </div>
          <Layout>
            <Layout.Section>
              {/* <DisplayText size="medium">Revenue</DisplayText> */}
              <div className="smart-card">
                <Stack distribution="fill" wrap={true}>
                  {
                    <>
                    <Stack.Item >
                      <Card sectioned>
                        <Stack>
                          <Stack.Item fill>
                            <TextStyle variation="strong">
                              {/* {item.section} */} hello
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>
                            <TextStyle
                              // variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                            >
                            100* {/* {(cardData[item.key]?.percent==0 && !cardData[item.key]?.up)?100:Math.abs(cardData[item.key]?.percent)}% */}
                            </TextStyle>
                          </Stack.Item>
                        </Stack>

                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                              8765{/* <CounterUp prefix={item.prefix || ''} suffix={item.suffix || ''} start={0} end={Number.parseFloat(cardData[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={2} /> */}
                              </TextStyle>
                            </DisplayText>
                          </Stack.Item>
                        </Stack>
                      </Card>
                    </Stack.Item>

                    <Stack.Item >
                      <Card sectioned>
                        <Stack>
                          <Stack.Item fill>
                            <TextStyle variation="strong">
                              {/* {item.section} */} hello
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>
                            <TextStyle
                              // variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                            >
                            100* {/* {(cardData[item.key]?.percent==0 && !cardData[item.key]?.up)?100:Math.abs(cardData[item.key]?.percent)}% */}
                            </TextStyle>
                          </Stack.Item>
                        </Stack>

                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                              8765{/* <CounterUp prefix={item.prefix || ''} suffix={item.suffix || ''} start={0} end={Number.parseFloat(cardData[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={2} /> */}
                              </TextStyle>
                            </DisplayText>
                          </Stack.Item>
                        </Stack>
                      </Card>
                    </Stack.Item>

                    <Stack.Item >
                      <Card sectioned>
                        <Stack>
                          <Stack.Item fill>
                            <TextStyle variation="strong">
                              {/* {item.section} */} hello
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>
                            <TextStyle
                              // variation={cardData[item.key]?.up ? 'positive' : 'negative'}
                            >
                            100* {/* {(cardData[item.key]?.percent==0 && !cardData[item.key]?.up)?100:Math.abs(cardData[item.key]?.percent)}% */}
                            </TextStyle>
                          </Stack.Item>
                        </Stack>

                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                              8765{/* <CounterUp prefix={item.prefix || ''} suffix={item.suffix || ''} start={0} end={Number.parseFloat(cardData[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={2} /> */}
                              </TextStyle>
                            </DisplayText>
                          </Stack.Item>
                        </Stack>
                      </Card>
                    </Stack.Item>
                  </>
                    
                  }
                </Stack>
              </div>
            </Layout.Section>
            </Layout>

          <div className="image-card-section">
            <Layout>
            <Layout.Section>
              <Stack distribution="fill">
                  <Stack.Item>
                    <div className="smarty-card-section">
                      <Stack>
                        <Stack.Item fill>
                        <Card sectioned>
                          <TextStyle small>Most Swapped Product From </TextStyle>
                          <div className="img-section">
                            <img src="https://www.gstatic.com/webp/gallery/4.sm.jpg"/>
                          </div>
                          <p>No Data Yet</p>
                          <small>Not enough data to calculate this metric.</small>
                        </Card>
                        </Stack.Item>
                        <Stack.Item fill>
                        <Card sectioned>
                          <TextStyle small>Most Swapped Product From </TextStyle>
                          <div className="img-section"></div>
                          <p>No Data Yet</p>
                          <small>Not enough data to calculate this metric.</small>
                        </Card>
                        </Stack.Item>
                        <Stack.Item fill>
                        <Card sectioned>
                          <TextStyle small>Most Swapped Product From </TextStyle>
                          <div className="img-section"></div>
                          <p><b>No Data Yet</b> </p>
                          <small>Not enough data to calculate this metric.</small>
                        </Card>
                        </Stack.Item>
                      </Stack>
                   
                    </div>
                  </Stack.Item>
               
              </Stack>
              </Layout.Section>
            </Layout>
          </div>

      </FormLayout>
   
  )
}

export default SmartSms
