import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// The scheduler toolbar component
function SchedulerToolbar(props) {
  // Keeps track of the date desired/clicked
  const [dateDesired, setdateDesired] = useState(new Date());

  // Go to the specified date
  function goToDate(date) {
    setdateDesired(date);
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.gotoDate(date);
  }

  // Logic to handle when today button is clicked
  function handleToday() {
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.today();
    setdateDesired(calendarApi.getDate());
  }

  // Logic to toggle between day and list view.
  function toggleView(view) {
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.changeView(view);
  }

  // The scheduler toolbar
  return (
    <div id="scheduler-toolbar">
      <button id="today-button" onClick={() => handleToday()}>
        Today
      </button>
      <button id="add-event-button" onClick={() => props.openEventForm()}>
        Add Event
      </button>
      <div id="date-picker">
        <DatePicker
          selected={dateDesired}
          onChange={(date) => goToDate(date)}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          scrollableMonthYearDropdown
        />
      </div>
      <h2 id="scheduler-date">
        {dateDesired.toDateString().substring(0, 3) +
          "," +
          dateDesired.toDateString().substring(3, 10) +
          ", " +
          dateDesired.toDateString().substring(11)}
      </h2>
      <button id="day-button" onClick={() => toggleView("timeGridDay")}>
        Day
      </button>
      <button id="list-button" onClick={() => toggleView("listDay")}>
        List
      </button>
    </div>
  );
}

export default SchedulerToolbar;
