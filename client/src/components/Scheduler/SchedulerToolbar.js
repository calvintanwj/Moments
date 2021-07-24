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

  function toggleView(view) {
    props.setView(view);
    let calendarApi = props.calendarRef.current.getApi();
    if (view === "month") {
      calendarApi.changeView("dayGridMonth");
    } else if (view === "week") {
      calendarApi.changeView("timeGridWeek");
    } else if (view === "day") {
      calendarApi.changeView("timeGridDay");
    } else if (view === "list") {
      calendarApi.changeView("listDay");
    }
  }

  const dateOptions = { weekday: "short", year: "numeric", month: "long" };
  const dateOptionsDay = { year: "numeric", month: "long", day: "numeric" };

  const date = (
    <>
      {props.view === "month"
        ? props.dateDesired
            .toLocaleDateString(undefined, dateOptions)
            .split(" ")[0] +
          ", " +
          props.dateDesired
            .toLocaleDateString(undefined, dateOptions)
            .split(" ")[1]
        : props.view === "week"
        ? props.dateDesired
            .toLocaleDateString(undefined, dateOptions)
            .split(" ")[0] +
          ", " +
          props.dateDesired
            .toLocaleDateString(undefined, dateOptions)
            .split(" ")[1]
        : props.dateDesired
            .toLocaleDateString(undefined, dateOptionsDay)
            .split(",")[0] +
          ", " +
          props.dateDesired
            .toLocaleDateString(undefined, dateOptionsDay)
            .split(" ")[2]}
    </>
  );

  function handleLeft() {
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.prev();
    props.setdateDesired(calendarApi.getDate());
  }

  function handleRight() {
    let calendarApi = props.calendarRef.current.getApi();
    calendarApi.next();
    props.setdateDesired(calendarApi.getDate());
  }

  function handleAddEvent() {
    props.setAddEndTime(false)
    props.setAddStartTime(false)
    props.openEventForm()
  }

  // The scheduler toolbar
  return (
    <div id="scheduler-toolbar">
      <button id="add-event-button" onClick={handleAddEvent}>
        <i class="fas fa-plus"></i> Add Event
      </button>
      <div id="scheduler-date-div">
        <h2 id="scheduler-date">{date}</h2>
        <div id="date-picker">
          <DatePicker
            className="date-picker"
            selected={props.dateDesired}
            onChange={(date) => goToDate(date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            // scrollableMonthYearDropdown
          />
        </div>
      </div>
      <select
        name="views"
        id="calendar-views"
        value={props.view}
        onChange={(e) => toggleView(e.target.value)}
      >
        <option value="month">Month</option>
        <option value="week">Week</option>
        <option value="day">Day</option>
        <option value="list">List</option>
      </select>
      <button id="today-button" onClick={() => handleToday()}>
        Today
      </button>
      <div id="navigate-calendar">
        <button id="scheduler-left-button" onClick={() => handleLeft()}>
          <i class="fas fa-chevron-left"></i>
        </button>
        <button id="scheduler-right-button" onClick={() => handleRight()}>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default SchedulerToolbar;
