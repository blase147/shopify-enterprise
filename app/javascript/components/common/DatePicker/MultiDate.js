import React from "react";
import { Button, DatePicker, Popover,ButtonGroup } from "@shopify/polaris";
import {
  DropdownMinor
} from '@shopify/polaris-icons';
import '@shopify/polaris/dist/styles.css'
import './DatePicker.css'
import dayjs from "dayjs";
export default class MultiDate extends React.Component {
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
      <>
      <div className="filter-parent">
        <Button
          
          monochrome
          onClick={this.togglePopover}
          disclosure={'down'}
          textAlign='left'
            >
            Choose date
        </Button>

          <div className="analytics-btn-group">
            {/* <Button primary onClick={this.applyFilter} type="button">Run</Button> */}
          </div>
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
        />
        {/* <div className="applybtn">
        <Button onClick={this.applyFilter} primary>Apply</Button>
        </div> */}
      </Popover>
    );
  }

  applyFilter=(e)=>{
   e.stopPropagation();
  //  this.togglePopover();
   this.props.handleDates && this.props.handleDates(this.state.selected,this.state.span)  
  }
  handleChange = value => {
      console.log("date",value)
    this.setState({ selected: value });
  };

  handleMonthChange = (month, year) => {
    this.setState({
      month,
      year
    });
  };
}
