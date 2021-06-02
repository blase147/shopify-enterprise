import React, { useState, useEffect, useCallback, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import dayjs from 'dayjs';
import CounterUp from 'react-countup';
import { gql, useLazyQuery } from '@apollo/client';
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
import { isEmpty } from 'lodash';



const SmartSms = () => {
  const fetchReport = gql`
  query($startDate: String!, $endDate: String!) {  
    fetchSmsAnalytics(startDate: $startDate, endDate: $endDate) {
        swapCount {
          value
          percent
          up
        }
        skipCount {
          value
          percent
          up
        }
        delayCount {
          value
          percent
          up
        }
        oneTimeRevenue {
          value
          percent
          up
        }
        optOutMessages {
          value
          percent
          up 
        }
        messages {
            date
            data {
                inboundSms
                outboundSms
                totalSms
            }
        }
        mostSwapedProduct {
            productId
            image
            title
        }
        mostSwapedProductTo {
            productId
            image
            title
        }
        mostSkippedProduct {
            productId
            image
            title
        }
    }
}
  `;
  const messagesChartOptions={
    chart: {
        type: 'area'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [],
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            formatter: function () {
                return this.value;
            }
        }
    },
    tooltip: {
        split: true,
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
        name: 'Total SMS',
        color:"#00A023",
        data: []
    }, {
        name: 'Outbound SMS',
        color:"#007EFF",
        data: []
    }, {
        name: 'Inbound SMS',
        color:"#FFA000",
        data: []
    }]
}

  /// cards ... List 1
  const productListKeys=[
    {section:"Product Swaps",key:"swapCount"},
    {section:"Skipped Orders",key:"skipCount"}
  ]
  const [sectionProductList,setSectionProductList] = useState({
    swapCount:{
      percent: 0,
      up: true,
      value: '0',
    },
    skipCount:{
      percent: 0,
      up: true,
      value: '0'
    }
  });

  /// cards ... List 2
  const serviceListKeys=[
    {section:"Service Opt-Outs",key:"optOutMessages"},
    {section:"Delayed Orders",key:"delayCount"},
    {section:"Add One-time Item Revenue",key:"oneTimeRevenue",prefix :"$" , decimal:true}
  ]
  const [sectionServiceList,setSectionServiceList] = useState({
    optOutMessages:{
      percent: 0,
      up: true,
      value: '0',
    },
    delayCount:{
      percent: 0,
      up: true,
      value: '0'
    },
    oneTimeRevenue:{
      percent: 0,
      up: true,
      value: '0'
    }
  });

  const [swappedCards,setSwappedCards]=useState({
    mostSwapedProduct:{image:"",title:""},
    mostSwapedProductTo:{image:"",title:""},
    mostSkippedProduct:{image:"",title:""}
  })

  const [chartOptions,setChartOptions]=useState({
    messagesChart:messagesChartOptions
  })
    // const [filters,setFilters]=useContext(FilterContext)
    const [filters,setFilters]=useState({startDate:dayjs(new Date()).subtract(30,'days').format("YYYY-MM-DD"),endDate:dayjs(new Date()).format("YYYY-MM-DD"),span:"30 days"})
    const handleFiltersDates=(dates,span)=>{
      if(!isEmpty(dates)){
        const {start,end}=dates;
        setFilters({startDate:dayjs(start).format("YYYY-MM-DD"),endDate:dayjs(end).format("YYYY-MM-DD"),span:span});
      }
    }

    const [getReport, { loading, data:reportData }] = useLazyQuery(fetchReport,{fetchPolicy:"network-only"});

  const getReportData = useCallback(() => {
    getReport({
      variables:{
        startDate:filters.startDate,
        endDate:filters.endDate
      }
    })
  }, [filters,getReport])

  useEffect(() => {
    getReportData()
  }, [filters])

  useEffect(()=>{
    if(!isEmpty(reportData?.fetchSmsAnalytics)){

      const {
        swapCount,
        skipCount,
        optOutMessages,
        delayCount,
        oneTimeRevenue,

        //swapped cards
        mostSwapedProduct,
        mostSwapedProductTo,
        mostSkippedProduct,
        
        //Charts data
        messages
      }=reportData?.fetchSmsAnalytics;

    setSectionProductList(prevList=>({
      swapCount:swapCount || prevList.swapCount,
      skipCount:skipCount || prevList.skipCount
    }))

    setSectionServiceList(prevList=>({
      optOutMessages:optOutMessages || prevList.optOutMessages,
      delayCount:delayCount || prevList.delayCount,
      oneTimeRevenue:oneTimeRevenue || prevList.oneTimeRevenue
    }))

    setSwappedCards({...swappedCards,mostSwapedProduct:mostSwapedProduct,mostSwapedProductTo:mostSwapedProductTo,mostSkippedProduct:mostSkippedProduct});
    //Set Chart Options...

      const newMessagesChartOptions = {
        ...messagesChartOptions, xAxis: { ...messagesChartOptions.xAxis, categories: messages.map(data => data.date) || [] },
        series: [{
          name: 'Total SMS',
          color: "#00A023",
          data: messages.map(data => data.totalSms || 0) || []
        }, {
          name: 'Outbound SMS',
          color: "#007EFF",
          data: messages.map(data => data.outboundSms || 0) || []
        }, {
          name: 'Inbound SMS',
          color: "#FFA000",
          data: messages.map(data => data.inboundSms || 0) || []
        }]
      };

    setChartOptions({
      ...chartOptions,
      messagesChart:newMessagesChartOptions
    })
  }

  },[reportData])
  return (
    <>
    {(loading || !reportData) ? (
      <Card>
        <Spinner
          accessibilityLabel="Spinner example"
          size="large"
          color="teal"
        />
      </Card>
      ) :
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
                {productListKeys?.map((item, i) => (
                  <Stack.Item>
                    <Card sectioned>
                    <div className="count-section">
                       
                          <TextStyle variation="strong">
                            {item.section}
                          </TextStyle>
                          <TextStyle
                            variation={sectionProductList[item.key]?.up ? 'positive' : 'negative'}
                            
                          >
                            <Icon
                              source={sectionProductList[item.key]?.up ? CaretUpMinor : CaretDownMinor}
                              color={sectionProductList[item.key]?.up ? 'green' : 'red'}
                            />
                            {(sectionProductList[item.key]?.up===false && sectionProductList[item.key]?.percent==0)?100:Math.abs(sectionProductList[item.key].percent)}%
                          </TextStyle>
                        
                        </div>
                      <Stack>
                        <Stack.Item>
                          <DisplayText size="medium">
                            <TextStyle variation="strong">
                            <CounterUp prefix={item?.prefix || ""} suffix={item?.suffix || ""} start={0} end={Number.parseFloat(sectionProductList[item.key]?.value)} duration={1.5} />
                            </TextStyle>
                          </DisplayText>
                        </Stack.Item>
                      </Stack>
                    </Card>
                  </Stack.Item>
                  ))}
              </Stack>
            </Layout.Section>
          </div>
          {/* </Layout.Section> */}
          <div className="container-right">
            <Layout.Section>
              <div className="card-chart">
                <Card>
                {
                  console.log(chartOptions.messagesChart,"---")
                }
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions.messagesChart}
                  />
                </Card>
              </div>
            </Layout.Section>
          </div>
          </Layout>
          
         
        </div>
          <Layout>
            <Layout.Section>
              <div className="smart-card">
                <Stack distribution="fill" wrap={true}>
                  {
                  serviceListKeys?.map((item, i) => (
                    <>
                    <Stack.Item >
                      <Card sectioned>
                        <Stack>
                          <Stack.Item fill>
                            <TextStyle variation="strong">
                              {item.section} 
                            </TextStyle>
                          </Stack.Item>
                          <Stack.Item>
                            <TextStyle
                              variation={sectionServiceList[item.key]?.up ? 'positive' : 'negative'}
                            >
                            {(sectionServiceList[item.key]?.percent==0 && !sectionServiceList[item.key]?.up)?100:Math.abs(sectionServiceList[item.key]?.percent)}%
                            </TextStyle>
                          </Stack.Item>
                        </Stack>

                        <Stack>
                          <Stack.Item>
                            <DisplayText size="medium">
                              <TextStyle variation="strong">
                              <CounterUp prefix={item.prefix || ''} suffix={item.suffix || ''} start={0} end={Number.parseFloat(sectionServiceList[item.key]?.value || 0).toFixed(2)} duration={1.5} decimals={item?.decimal ?2:0} />
                              </TextStyle>
                            </DisplayText>
                          </Stack.Item>
                        </Stack>
                      </Card>
                    </Stack.Item>
                  </>
                    ))}
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
                            { swappedCards?.mostSwapedProduct?.image &&
                              <img src={swappedCards?.mostSwapedProduct?.image || ""}/>
                            }
                          </div>
                          <p>{swappedCards?.mostSwapedProduct?.title || "No Data Yet"}</p>
                          <small>Not enough data to calculate this metric.</small>
                        </Card>
                        </Stack.Item>
                        <Stack.Item fill>
                        <Card sectioned>
                          <TextStyle small>Most Swapped Product To </TextStyle>
                          <div className="img-section">
                            { swappedCards?.mostSwapedProductTo?.image &&
                              <img src={swappedCards?.mostSwapedProductTo?.image || ""}/>
                            }
                          </div>
                          <p>{swappedCards?.mostSwapedProductTo?.title || "No Data Yet"}</p>
                          <small>Not enough data to calculate this metric.</small>
                        </Card>
                        </Stack.Item>
                        <Stack.Item fill>
                        <Card sectioned>
                          <TextStyle small>Most Skipped Product</TextStyle>
                          <div className="img-section">
                            { swappedCards?.mostSkippedProduct?.image &&
                              <img src={swappedCards?.mostSkippedProduct?.image || ""}/>
                            }
                          </div>
                          <p><b>{swappedCards?.mostSkippedProduct?.title || "No Data Yet"}</b> </p>
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
    }
   </>
  )
}

export default SmartSms
