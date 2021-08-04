import React from "react";
import { Button, DatePicker, Popover,ButtonGroup } from "@shopify/polaris";
import {
  DropdownMinor
} from '@shopify/polaris-icons';
import '@shopify/polaris/dist/styles.css'
import './DatePicker.css'
import dayjs from "dayjs";
export default class DatePickr extends React.Component {
  state = {
     month: dayjs().get('month'),
     year: dayjs().get('year'),
    //  month: 4,
    //  year: 2021,
    selected: null,
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
      <div className="filter-parent" style={{width:'100%'}}>
        <Button

          monochrome
          onClick={this.togglePopover}
          disclosure={'down'}
          textAlign='left'
            >
            {this.props.date[this.props.index]?.[this.props.type] ? dayjs(this.props.selectedDate).format('DD MMM, YYYY'):"Choose date"}
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
    this.setState({ selected: value });
    const {date,index,type}=this.props;
    let dates=this.props.existingValues;
    if(!dates?.some(date=>date==dayjs(value.start).format("YYYY-MM-DD"))){
      if(dates){
        dates.push(dayjs(value.start).format("YYYY-MM-DD"))
      }else{
        dates=[dayjs(value.start).format("YYYY-MM-DD")]
      }
    this.props.callback && this.props.callback(this.props.input,dates)
    let selected=date;
    selected[index][type]=value.start
    this.props.handleDate(selected);
    this.props.setUpdated(true)
    }
    this.setState({active:false})
  };

  handleMonthChange = (month, year) => {
    this.setState({
      month,
      year
    });
  };
}
