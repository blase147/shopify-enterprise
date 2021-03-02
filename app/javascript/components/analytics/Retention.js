import React, { useState, useEffect, useCallback, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';
import { Form } from 'formik';

const CustomerInsights = () => {
  const rows_Mrr = [
    [
      'Jan 2021',
      '$50.29k',
      '$50.08k',
      '99.56%',
      '97.53%',
      '99.56%',
      '99.56%',
      '97.60%',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    [
      'Feb 2021',
      '$44.85k',
      '-',
      '100.00%',
      '99.89%',
      '99.56%',
      '99.56%',
      '97.60%',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    [
      'Mar 2021',
      '$54.54k',
      '-',
      '-',
      '99.89%',
      '99.56%',
      '99.56%',
      '97.60%',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    [
      'Apr 2021',
      '$54.54k',
      '-',
      '-',
      '-',
      '99.56%',
      '99.56%',
      '97.60%',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    [
      'May 2021',
      '$54.54k',
      '-',
      '-',
      '-',
      '-',
      '99.56%',
      '97.60%',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    [
      'jun 2021',
      '$54.54k',
      '-',
      '-',
      '-',
      '-',
      '-',
      '97.60%',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    [
      'jul 2021',
      '$54.54k',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '94.57%',
      '97.60%',
      '94.57%',
    ],
    ['Aug 2021', '$54.54k', '-', '-', '-', '-', '-', '-', '-', '94.57%'],
    ['Sep 2021', '$54.54k', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['Oct 2021', '$54.54k', '-', '-', '-', '-', '-', '-', '-', '-'],
  ];
  const rows_Mom = [
    [
      'Jan 2021',
      '-45%',
      '-34%',
      '-5%',
      '-45%',
      '-34%',
      '-5%',
      '-16%',
      '-',
      '-',
    ],
    ['Jan 2021', '-45%', '-34%', '-5%', '-45%', '-34%', '-5%', '-', '-', '-'],
    ['Jan 2021', '-45%', '-34%', '-5%', '-45%', '-34%', '-', '-', '-', '-'],
    ['Jan 2021', '-45%', '-34%', '-5%', '-45%', '-', '-', '-', '-', '-'],
    ['Jan 2021', '-45%', '-34%', '-5%', '-', '-', '-', '-', '-', '-'],
    ['Jan 2021', '-45%', '-34%', '-', '-', '-', '-', '-', '-', '-'],
  ];
  return (
    <FormLayout>
      <Stack vertical spacing="extraLoose">
        <Layout>
          <Layout.Section>
            <DisplayText size="medium">MRR Retention Cohort</DisplayText>
            <Card>
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'Activated Month and Year',
                  'Initial MRR',
                  'Jan 2021',
                  'Feb 2021',
                  'Mar 2021',
                  'Apr 2021',
                  'May 2021',
                  'Jun 2021',
                  'Jul 2021',
                  'Aug 2021',
                  'Sep 2021',
                  'Oct 2021',
                  'Nov 2021',
                  'Dec 2021',
                ]}
                rows={rows_Mrr}
                hideScrollIndicator={true}
              />
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <DisplayText size="medium">MOM Change in Total Sales</DisplayText>
            <Card>
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'Month',
                  'MO1',
                  'MO2',
                  'MO3',
                  'MO4',
                  'MO5',
                  'MO6',
                  'MO7',
                  'MO8',
                  'MO9',
                  'MO10',
                ]}
                rows={rows_Mrr}
                hideScrollIndicator={true}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </FormLayout>
  );
};

export default CustomerInsights;
