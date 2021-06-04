import React from "react";
import { Button, DatePicker, Popover,ButtonGroup,Select } from "@shopify/polaris";
import {
  DropdownMinor
} from '@shopify/polaris-icons';
import '@shopify/polaris/dist/styles.css'
import './DatePicker.css'
import dayjs from "dayjs";

const options = [
    {label: 'Customer', value: 'customer'},
    {label: 'Product', value: 'product'},
    {label: 'Analytics', value: 'analytic'}
  ];

export default class ExportFilter  extends React.Component {
  state = {
     month: dayjs().get('month'),
     year: dayjs().get('year'),
    selected: {
      start: new Date(Date.parse(dayjs(new Date()).subtract(30,'days').format("YYYY-MM-DD"))),
      end: new Date(Date.parse(dayjs(new Date()).format("YYYY-MM-DD")))
    },
    reportType:"customer",
    active: false,
    span:this.props.span
  };

  togglePopover = () => {
    this.setState(({ active }) => {
      return { active: !active };
    });
  };

  render() {
    const { month, year, selected } = this.state;
    const activator = (
      <>
      <div style={{width:'100%',marginTop:"20px"}}>
        <Button
          monochrome
          onClick={this.togglePopover}
          disclosure={'down'}
          textAlign='left'
            >
            Choose date range
        </Button>
      </div>
            <div style={{ marginTop: '20px',maxWidth:'300px' }}>
                <Select
                    label="Select Export Type"
                    options={options}
                    onChange={(value) => this.setState({ reportType: value })}
                    value={this.state.reportType}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
                <Button primary onClick={this.applyFilter} loading={this.props.loading} type="button">Export</Button>
            </div>
      </>)

    return (
      <Popover
        active={this.state.active}
        activator={activator}
        onClose={this.togglePopover}
        sectioned
        fullWidth
      >
        <DatePicker
          month={month}
          year={year}
          onChange={this.handleChange}
          onMonthChange={this.handleMonthChange}
          selected={selected}
          allowRange={true}
          multiMonth={true}
        />
      </Popover>
    );
  }

  applyFilter=(e)=>{
   e.stopPropagation();
//    this.togglePopover();
   this.props.handleDates && this.props.handleDates(this.state.selected,this.state.reportType)  
  }
  handleChange = value => {
    this.setState({ selected: value });
  };

  handleMonthChange = (month, year) => {
    this.setState({
      month,
      year
    });
  };
}
