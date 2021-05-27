import React from "react";
import { Button, DatePicker, Popover } from "@shopify/polaris";
import '@shopify/polaris/dist/styles.css'
import './DatePicker.css'
import dayjs from "dayjs";
export default class DateRangePicker extends React.Component {
  state = {
     month: dayjs().get('month'),
     year: dayjs().get('year'),
    //  month: 4,
    //  year: 2021,
    selected: {
      start: new Date(Date.parse(this.props.start)) || new Date(),
      end: new Date(Date.parse(this.props.end)) || new Date()
    },
    active: false
  };

  togglePopover = () => {
    this.setState(({ active }) => {
      return { active: !active };
    });
  };

  render() {
    const { month, year, selected } = this.state;
    const activator = (
      <Button onClick={this.togglePopover}>
        Filter
      </Button>
    );

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
        <div className="applybtn">
        <Button onClick={this.applyFilter} primary>Apply</Button>
        </div>
      </Popover>
    );
  }

  applyFilter=()=>{
   this.togglePopover();
   this.props.handleDates && this.props.handleDates(this.state.selected)  
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
