import React, { Component } from "react";
import { render } from "react-dom";
import moment from "moment";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { DateRangePicker } from "react-dates";

class DateRangeComponent extends Component {
  BLOCKED_DATES = [
    moment().add(10, "days"),
    moment().add(11, "days"),
    moment().add(12, "days"),
  ];

  constructor() {
    super();
    this.state = {
      focusedInput: null,
      startDate: moment(),
      endDate: moment().add(7, "days"),
      fullscreen: false,
      direction: "left",
      dateFormat: "DD/MM/YYYY",
      small: false,
      block: false,
      orientation: "horizontal",
      numMonths: 2,
      minimumNights: 7,
    };
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.handleChangeFullscreen = this.handleChangeFullscreen.bind(this);
    this.handleChangeDirection = this.handleChangeDirection.bind(this);
    this.handleChangeDateFormat = this.handleChangeDateFormat.bind(this);
    this.handleIsDayBlocked = this.handleIsDayBlocked.bind(this);
  }

  handleDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  handleFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  handleChangeFullscreen() {
    this.setState({ fullscreen: !this.state.fullscreen });
  }

  handleChangeDirection(e) {
    this.setState({ direction: e.target.value });
  }

  handleChangeDateFormat(e) {
    this.setState({ dateFormat: e.target.value });
  }

  handleIsDayBlocked(day) {
    return this.BLOCKED_DATES.filter((d) => d.isSame(day, "day")).length > 0;
  }

  render() {
    return (
      <div style={{ padding: "10px",
      }}>
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={this.handleDatesChange} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={this.handleFocusChange} // PropTypes.func.isRequired,
          displayFormat={this.state.dateFormat}
          hideKeyboardShortcutsPanel={true}
          numberOfMonths={this.state.numMonths || 2}
          block={this.state.block}
          small={this.state.small}
          withFullScreenPortal={this.state.fullscreen}
          anchorDirection={this.state.direction}
          orientation={this.state.orientation}
          minimumNights={this.state.minimumNights}
          isDayBlocked={this.handleIsDayBlocked}
        />
        <br />
      </div>
    );
  }
}

export default DateRangeComponent;
