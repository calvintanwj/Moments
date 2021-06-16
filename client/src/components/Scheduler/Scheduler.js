import "./Scheduler.css";
import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import SchedulerToolbar from "./SchedulerToolbar.js";
import AddEventForm from "./AddEventForm.js";

// Scheduler component
function Scheduler() {
  // Plugins for scheduler
  const calendarPlugins = [
    interactionPlugin,
    momentPlugin,
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
  ];

  // Header toolbar for scheduler (blank)
  const headerToolbar = {
    start: "",
    center: "",
    end: "",
  };

  // Array of events
  const events = [];

  // styling for Edit Form
  const customStylesForEdit = {
    overlay: { zIndex: 9999 },
    content: {
      top: "40%",
      bottom: "30%",
      right: "52%",
      left: "17%",
    },
  };

  // styling for Add Event Form
  const customStylesForAdd = {
    overlay: { zIndex: 9999 },
    content: {
      top: "15%",
      bottom: "30%",
      left: "10%",
      right: "10%",
    },
  };

  // Keeps track of whether edit form is open
  const [editFormIsOpen, seteditFormIsOpen] = useState(false);

  // Keeps track of whether event form is open
  const [eventFormIsOpen, seteventFormIsOpen] = useState(false);

  // Keeps track of event to be edited.
  const [editingEvent, setEditingEvent] = useState(null);

  // Handles opening of event form
  function openEventForm() {
    seteventFormIsOpen(true);
  }

  // Handles closing of event form
  function closeEventForm() {
    seteventFormIsOpen(false);
  }

  // Handles opening of edit form
  function openEditForm() {
    seteditFormIsOpen(true);
  }

  // Handles closing of edit form
  function closeEditForm() {
    seteditFormIsOpen(false);
  }

  // Keeps track of calendar API reference
  const calendarRef = useRef(null);

  // Logic to handle an event click
  function handleEventClick(event) {
    setEditingEvent(
      event.event,
      setTimeout(() => {
        setNewTitle(event.event.title);
        setNewStart(event.event.startStr);
        setNewEnd(event.event.endStr);
        setNewAllDay(event.event.allDay);
        setNewColor(event.event.backgroundColor);
        openEditForm();
      }, 1)
    );
  }

  // States to keep track of new attributes of event edited.
  const [newTitle, setNewTitle] = useState("");
  const [newStartStr, setNewStart] = useState("");
  const [newEndStr, setNewEnd] = useState("");
  const [newAllDay, setNewAllDay] = useState(false);
  const [newColor, setNewColor] = useState("#0000FF");

  // Logic to handle when remove button is clicked
  function handleRemoveEvent() {
    editingEvent.remove();
    setEditingEvent(null);
    closeEditForm();
  }

  // Logic to handle when submit button is pushed in edit form
  const onSubmit = (event) => {
    event.preventDefault();

    editingEvent.setProp("color", newColor);
    editingEvent.setProp("title", newTitle);
    editingEvent.setStart(newStartStr);
    editingEvent.setEnd(newEndStr);
    editingEvent.setAllDay(newAllDay);

    closeEditForm();
  };

  const [view, setNewView] = useState(true);

  // Keeps track of the date desired/clicked
  const [dateDesired, setdateDesired] = useState(new Date());

  function handleNavClick(date) {
    setNewView(false);
    let calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(date);
    calendarApi.changeView("timeGridDay");
    setdateDesired(date);
  }

  // Scheduler interface component
  return (
    <div id="scheduler-interface">
      <SchedulerToolbar
        calendarRef={calendarRef}
        openEventForm={openEventForm}
        view={view}
        dateDesired={dateDesired}
        setdateDesired={setdateDesired}
        setNewView={setNewView}
      />
      <Modal
        isOpen={eventFormIsOpen}
        onRequestClose={closeEventForm}
        style={customStylesForAdd}
      >
        <AddEventForm
          closeEventForm={closeEventForm}
          calendarRef={calendarRef}
        />
      </Modal>
      <Modal
        isOpen={editFormIsOpen}
        onRequestClose={closeEditForm}
        style={customStylesForEdit}
      >
        <div id="edit-form-header">
          <h2>Edit Event</h2>
          <button
            id="edit-close-button"
            onClick={() => closeEditForm()}
          ></button>
        </div>
        <form id="edit-form" onSubmit={onSubmit}>
          <div>
            <label for="title">Change Title: </label>
            <input
              id="edit-form-title"
              name="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label for="start-time">Change starting time: </label>
            <input
              id="edit-form-start"
              type="datetime-local"
              name="start-time"
              value={newStartStr}
              onChange={(e) => setNewStart(e.target.value)}
            />
          </div>
          <div>
            <label for="end-time">Change ending time:</label>
            <input
              id="edit-form-end"
              type="datetime-local"
              name="end-time"
              value={newEndStr}
              onChange={(e) => setNewEnd(e.target.value)}
            />
          </div>
          <div>
            <label for="all-day">All Day: </label>
            <input
              id="edit-form-allday"
              type="checkbox"
              name="all-day"
              value={newAllDay}
              onChange={(e) => setNewAllDay(e.target.checked)}
            />
          </div>
          <div>
            <label for="color">Change color: </label>
            <input
              id="edit-form-color"
              type="color"
              name="color"
              value={newColor}
              checked={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
          </div>
          <div id="edit-form-footer">
            <button id="edit-form-remove" onClick={() => handleRemoveEvent()}>
              Remove Event
            </button>
            <input id="edit-form-submit" type="submit" value="Submit Changes" />
          </div>
        </form>
      </Modal>
      <div id="scheduler">
        <FullCalendar
          ref={calendarRef}
          nowIndicator={true}
          eventResizableFromStart={true}
          editable={true}
          events={events}
          height="100%"
          headerToolbar={headerToolbar}
          initialDate={new Date()}
          plugins={calendarPlugins}
          initialView="dayGridMonth"
          dayHeaders={true}
          eventClick={(event) => handleEventClick(event)}
          navLinks={true}
          navLinkDayClick={(date) => handleNavClick(date)}
        />
      </div>
    </div>
  );
}

export default Scheduler;
