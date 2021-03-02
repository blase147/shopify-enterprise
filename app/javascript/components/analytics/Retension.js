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
} from '@shopify/polaris';
import {
  DropdownMinor,
  CaretUpMinor,
  CaretDownMinor,
} from '@shopify/polaris-icons';

const Retention = () => {
  // MRR
  const mrrRows = [['Jan 2021', '$875.00', 124689, 140, '$122,500.00']];
  const mrrHeadings = [
    'Activated Month and Year',
    'Initial MRR',
    'Jan 2021',
    'Feb 2021',
    'Mar 2021',
    'Apr 2021',
    'May 2021',
    'Jun 2021',
    'Jul 2021',
  ];

  return (
    <FormLayout>
      {/* MRR */}
      <DisplayText size="medium">MRR Retention Cohort</DisplayText>
      <Card>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'numeric',
            'numeric',
            'numeric',
          ]}
          headings={mrrHeadings}
          rows={mrrRows}
        />
      </Card>

      {/* MOM */}
      <DisplayText size="medium">MOM Change in Total Sales</DisplayText>
      <Card></Card>
    </FormLayout>
  );
};
export default Retention;
