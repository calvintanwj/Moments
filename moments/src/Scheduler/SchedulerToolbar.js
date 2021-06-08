import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// The scheduler toolbar component
function SchedulerToolbar(props) {
  // Go to the specified date
  function goToDate(date) {
    props.setdateDesired(date);
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.gotoDate(date);
  }

  // Logic to handle when today button is clicked
  function handleToday() {
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.today();
    props.setdateDesired(calendarApi.getDate());
  }

  // Logic to toggle between day and list view.
  function toggleView(view) {
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.changeView(view);
  }

  function handleBackButton() {
    toggleView("dayGridMonth");
    props.setNewView(true);
  }

  const dayListView = (
    <>
      <button id="day-button" onClick={() => toggleView("timeGridDay")}>
        Day
      </button>
      <button id="list-button" onClick={() => toggleView("listDay")}>
        List
      </button>
    </>
  );

  const monthWeekView = (
    <>
      <button id="month-button" onClick={() => toggleView("dayGridMonth")}>
        Month
      </button>
      <button id="week-button" onClick={() => toggleView("timeGridWeek")}>
        Week
      </button>
    </>
  );

  const backButton = (
    <>
      <button id="scheduler-back-button" onClick={() => handleBackButton()}>
        Back
      </button>
    </>
  );

  // The scheduler toolbar
  return (
    <div id="scheduler-toolbar">
      {props.view ? <></> : backButton}
      <button id="today-button" onClick={() => handleToday()}>
        Today
      </button>
      <button id="add-event-button" onClick={() => props.openEventForm()}>
        Add Event
      </button>
      <div id="date-picker">
        <DatePicker
          selected={props.dateDesired}
          onChange={(date) => goToDate(date)}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          scrollableMonthYearDropdown
        />
      </div>
      <h2 id="scheduler-date">
        {props.dateDesired.toDateString().substring(0, 3) +
          "," +
          props.dateDesired.toDateString().substring(3, 10) +
          ", " +
          props.dateDesired.toDateString().substring(11)}
      </h2>
      {props.view ? monthWeekView : dayListView}
    </div>
  );
}

export default SchedulerToolbar;
