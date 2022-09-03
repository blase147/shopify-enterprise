import React from "react";
import { Button, DatePicker, Popover,ButtonGroup } from "@shopify/polaris";
import {
  DropdownMinor
} from '@shopify/polaris-icons';
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
    active: false,
    span:this.props.span
  };

  togglePopover = () => {
    this.setState(({ active }) => {
      return { active: !active };
    });
  };

  handleSpan=(span)=>{
    switch(span){
      case "30 days":
      {
        let start=new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(2,"days")).subtract(30, 'days'))).format()))
        let end =new Date(Date.parse(dayjs(new Date()).subtract(1,"days").format()));
        this.setState({selected:{start:start,end:end},span:span})
      }
      break;
      case "3 months":
        {
          let start=new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1,"days")).subtract(3, 'month'))).format()))
          let end =new Date(Date.parse(dayjs(new Date()).subtract(1,"days").format()));
          this.setState({selected:{start:start,end:end},span:span})
        }
      break;
      case "6 months":
        {
          let start=new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1,"days")).subtract(6, 'month'))).format()))
          let end =new Date(Date.parse(dayjs(new Date()).subtract(1,"days").format()));
          this.setState({selected:{start:start,end:end},span:span})
        }
        break;
      case "12 months":
        {
          let start=new Date(Date.parse(dayjs(dayjs(dayjs(dayjs(new Date()).subtract(1,"days")).subtract(12, 'month'))).format()))
          let end =new Date(Date.parse(dayjs(new Date()).subtract(1,"days").format()));
          this.setState({selected:{start:start,end:end},span:span})
        }  
    }
  }

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
            Choose date range
        </Button>

          <div className="analytics-btn-group">
            <ButtonGroup segmented>
              <Button onClick={()=>this.handleSpan("30 days")}   primary={this.state.span==="30 days"} >30 days</Button>
              <Button onClick={()=>this.handleSpan("3 months")}  primary={this.state.span==="3 months"} >3 Months</Button>
              <Button onClick={()=>this.handleSpan("6 months")}  primary={this.state.span==="6 months"} >6 Months</Button>
              <Button onClick={()=>this.handleSpan("12 months")} primary={this.state.span==="12 months"} >12 Months</Button>
            </ButtonGroup>
            <Button primary onClick={this.applyFilter} type="button">Run</Button>
            <Button primary onClick={this.forceUpdate} type="button">Refresh</Button>
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
          allowRange={true}
          multiMonth={true}
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

  forceUpdate=(e)=>{
    e.stopPropagation();
    this.props.handleForceUpdates && this.props.handleForceUpdates(this.state.selected,this.state.span)  
  }

  handleChange = value => {
    this.setState({ selected: value, span:"custom" });
  };

  handleMonthChange = (month, year) => {
    this.setState({
      month,
      year
    });
  };
}
