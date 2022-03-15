import React from 'react';
import { Button, DatePicker, Popover, ButtonGroup } from '@shopify/polaris';
import { DropdownMinor } from '@shopify/polaris-icons';
import '@shopify/polaris/dist/styles.css';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
export default class RangePickr extends React.Component {
  state = {
    month: dayjs().get('month'),
    year: dayjs().get('year'),
    //  month: 4,
    //  year: 2021,
    selected:
      this.props.cutoff
        ? {
            cutoff: new Date(Date.parse(this.props.cutoff)) || new Date(),
          }
        : null,
    active: false,
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
        <div className="filter-parent" style={{ width: '100%' }}>
          <Button
            monochrome
            onClick={this.togglePopover}
            disclosure={'down'}
            textAlign="left"
          >
            {!isEmpty(this.state.selected)
              ? `${dayjs(this.state.selected?.cutoff).format('DD MMM, YYYY')}`
              : 'Choose date'}
          </Button>

          <div className="analytics-btn-group"></div>
        </div>
      </>
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
        />
      </Popover>
    );
  }

  handleChange = (value) => {
    this.setState({ selected: value });
    this.props.setFieldValue &&
      this.props.setFieldValue(
        this.props.cutoffLabel,
        dayjs(value.cutoff).format('YYYY-MM-DD')
      );
  };

  handleMonthChange = (month, year) => {
    this.setState({
      month,
      year,
    });
  };
}
