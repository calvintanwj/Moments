import "./Scheduler.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import SchedulerToolbar from "./SchedulerToolbar.js";
import AddEventForm from "./AddEventForm.js";
import axios from "axios";
import { CirclePicker } from "react-color";
import AuthContext from "../../context/AuthContext";

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
  const [events, setEvents] = useState([]);
  const { loggedIn } = useContext(AuthContext);

  async function renderEvents() {
    try {
      // await axios
      //   .get("http://localhost:5000/events/retrieve")
      await axios
        .get("https://momentsorbital.herokuapp.com/events/retrieve/")
        .then((response) => {
          setEvents(response.data);
        });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (loggedIn) {
      renderEvents();
    }
  }, [loggedIn]);

  // styling for Edit Form
  const customStylesForEdit = {
    overlay: { zIndex: 9999 },
    content: {
      top: "25%",
      bottom: "15%",
      right: "40%",
      left: "15%",
    },
  };

  // styling for Add Event Form
  const customStylesForAdd = {
    overlay: { zIndex: 9999 },
    content: {
      top: "15%",
      bottom: "20%",
      left: "20%",
      right: "20%",
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
    setTitle("");
    setStart("");
    setEnd("");
    setAllDay(false);
    setColor("#2196f3");
    setReminder("No reminder");
  }

  // Handles opening of edit form
  function openEditForm() {
    seteditFormIsOpen(true);
  }

  // Handles closing of edit form
  function closeEditForm() {
    seteditFormIsOpen(false);
  }

  const customStylesForDiscard = {
    overlay: { zIndex: 9999 },
    content: {
      top: "43%",
      bottom: "42.5%",
      left: "41%",
      right: "41%",
    },
  };

  const [discardIsOpen, setDiscardIsOpen] = useState(false);

  function openDiscard() {
    setDiscardIsOpen(true);
  }

  function closeDiscard() {
    setDiscardIsOpen(false);
  }

  function handleDiscard() {
    closeDiscard();
    closeEditForm();
  }

  // Keeps track of calendar API reference
  const calendarRef = useRef(null);

  async function handleEventResize(event) {
    // await axios.put("http://localhost:5000/events/resize", event.event);
    await axios.put(
      "https://momentsorbital.herokuapp.com/events/resize/",
      event.event
    );
  }
  async function handleEventDrop(event) {
    // await axios.put("http://localhost:5000/events/drop", event.event);
    await axios.put(
      "https://momentsorbital.herokuapp.com/events/drop/",
      event.event
    );
  }

  // States to keep track of new attributes of event edited.
  const [newTitle, setNewTitle] = useState("");
  const [newStartStr, setNewStart] = useState("");
  const [newEndStr, setNewEnd] = useState("");
  const [newAllDay, setNewAllDay] = useState(false);
  const [newColor, setNewColor] = useState("#2196f3");
  const [newReminder, setNewReminder] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  // States to keep track of attributes of event added.
  const [title, setTitle] = useState("");
  const [startStr, setStart] = useState("");
  const [endStr, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState("#2196f3");
  const [reminder, setReminder] = useState("No reminder");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Logic to handle when remove button is clicked
  async function handleRemoveEvent() {
    // await axios.post("http://localhost:5000/events/delete", editingEvent);
    await axios.post(
      "https://momentsorbital.herokuapp.com/events/delete/",
      editingEvent
    );
    setEditingEvent(null);
    closeEditForm();
  }

  // Logic to handle when submit button is pushed in edit form
  async function onSubmit(event) {
    event.preventDefault();
    let newStart = newStartStr;
    if (newStartTime) {
      newStart = newStart + "T" + newStartTime;
    }
    let newEnd = newEndStr;
    if (newEndTime) {
      newEnd = newEnd + "T" + newEndTime;
    }
    const eventData = {
      color: newColor,
      title: newTitle,
      start: newStart,
      end: newEnd,
      allDay: newAllDay,
      reminder: newReminder,
      editingEvent: editingEvent,
    };

    // await axios.put("http://localhost:5000/events/edit", eventData);
    await axios.put(
      "https://momentsorbital.herokuapp.com/events/edit/",
      eventData
    );
    closeEditForm();
    await renderEvents();
  }

  // Keeps track of the date desired/clicked
  const [dateDesired, setdateDesired] = useState(new Date());

  const [view, setView] = useState("month");

  function handleDateClick(date) {
    if (view === "month") {
      setStart(date.dateStr.split("T")[0]);
      setEnd(date.dateStr.split("T")[0]);
      setAddEndTime(false);
      setAddStartTime(false);
      openEventForm();
    } else {
      setStart(date.dateStr.split("T")[0]);
      setEnd(date.dateStr.split("T")[0]);
      setAddStartTime(true);
      setAddEndTime(true);
      setStartTime(date.dateStr.split("T")[1].split(":", 2).join(":"));
      setEndTime(date.dateStr.split("T")[1].split(":", 2).join(":"));
      openEventForm();
    }
  }

  // Logic to handle an event click
  function handleEventClick(event) {
    setEditingEvent(event.event);
    setAddEndTime(false);
    setAddStartTime(false);
    setNewTitle(event.event.title);
    setNewStart(event.event.startStr.split("T")[0]);
    setNewEnd(event.event.endStr.split("T")[0]);
    setNewAllDay(event.event.allDay);
    setNewColor(event.event.backgroundColor);
    if (!event.event.backgroundColor.includes("#")) {
      setNewColor("#" + event.event.backgroundColor);
    }
    setNewReminder(event.event.extendedProps.reminder);
    if (event.event.startStr.split("T")[1]) {
      setAddStartTime(true);
      setNewStartTime(
        event.event.startStr.split("T")[1].split(":", 2).join(":")
      );
    }
    if (event.event.endStr.split("T")[1]) {
      setAddEndTime(true);
      setNewEndTime(event.event.endStr.split("T")[1].split(":", 2).join(":"));
    }
    if (!event.event.endStr && event.event.allDay) {
      setNewEnd(event.event.startStr.split("T")[0]);
    }
    openEditForm();
  }

  function handleNavClick(date) {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(date);
    calendarApi.changeView("timeGridDay");
    setView("day");
    setdateDesired(date);
  }

  function handleCloseEditForm() {
    if (
      newTitle === editingEvent.title &&
      newAllDay === editingEvent.allDay &&
      newReminder === editingEvent.extendedProps.reminder &&
      newStartStr === editingEvent.startStr.split("T")[0] &&
      newEndStr === editingEvent.endStr.split("T")[0]
    ) {
      closeEditForm();
    } else {
      openDiscard();
    }
  }

  function handleAllDay(e) {
    setNewAllDay(e.target.checked);
    if (e.target.checked) {
      setAddEndTime(false);
      setAddStartTime(false);
      setNewEnd(newStartStr);
    }
  }

  const [addStartTime, setAddStartTime] = useState(false);

  function handleAddStartTime(e) {
    e.preventDefault();
    if (allDay) {
      setAllDay(false);
    }
    if (newAllDay) {
      setNewAllDay(false);
    }
    if (addStartTime) {
      setNewStartTime("");
      setStartTime("");
    }
    setAddStartTime(!addStartTime);
  }

  const [addEndTime, setAddEndTime] = useState(false);

  function handleAddEndTime(e) {
    e.preventDefault();
    if (allDay) {
      setAllDay(false);
    }
    if (newAllDay) {
      setNewAllDay(false);
    }
    if (addEndTime) {
      setNewEndTime("");
      setEndTime("");
    }
    setAddEndTime(!addEndTime);
  }

  function handleSelect(info) {
    if (view === "month") {
      setStart(info.startStr.split("T")[0]);
      setEnd(info.endStr.split("T")[0]);
      setAddEndTime(false);
      setAddStartTime(false);
      openEventForm();
    } else {
      setStart(info.startStr.split("T")[0]);
      setEnd(info.endStr.split("T")[0]);
      setAddStartTime(true);
      setAddEndTime(true);
      setStartTime(info.startStr.split("T")[1].split(":", 2).join(":"));
      setEndTime(info.endStr.split("T")[1].split(":", 2).join(":"));
      openEventForm();
    }
  }

  // Scheduler interface component
  return (
    <div id="scheduler-interface">
      <SchedulerToolbar
        calendarRef={calendarRef}
        openEventForm={openEventForm}
        dateDesired={dateDesired}
        setdateDesired={setdateDesired}
        setAddStartTime={setAddStartTime}
        setAddEndTime={setAddEndTime}
        view={view}
        setView={setView}
      />
      <Modal
        isOpen={eventFormIsOpen}
        onRequestClose={closeEventForm}
        style={customStylesForAdd}
      >
        <AddEventForm
          closeEventForm={closeEventForm}
          calendarRef={calendarRef}
          renderEvents={renderEvents}
          setTitle={setTitle}
          setColor={setColor}
          setReminder={setReminder}
          setAllDay={setAllDay}
          setStart={setStart}
          setEnd={setEnd}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          title={title}
          color={color}
          reminder={reminder}
          allDay={allDay}
          startStr={startStr}
          startTime={startTime}
          endStr={endStr}
          endTime={endTime}
          addStartTime={addStartTime}
          addEndTime={addEndTime}
          setAddStartTime={setAddStartTime}
          setAddEndTime={setAddEndTime}
          handleAddEndTime={handleAddEndTime}
          handleAddStartTime={handleAddStartTime}
        />
      </Modal>
      <Modal
        isOpen={editFormIsOpen}
        onRequestClose={closeEditForm}
        style={customStylesForEdit}
      >
        <Modal
          isOpen={discardIsOpen}
          onRequestClose={closeDiscard}
          style={customStylesForDiscard}
        >
          <div id="discard-prompt">
            <p>Discard unsaved changes?</p>
            <button id="discard-bt" onClick={handleDiscard}>
              Discard
            </button>
            <button id="cancel-bt" onClick={closeDiscard}>
              Cancel
            </button>
          </div>
        </Modal>
        <div id="edit-form-header">
          <h2>Edit Event</h2>
          <button
            id="edit-event-close-button"
            onClick={handleCloseEditForm}
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
            <label id="edit-start-label" for="start-time">
              Change starting time:{" "}
            </label>
            <input
              id="edit-form-start"
              type="date"
              name="start-time"
              max="2999-12-31"
              value={newStartStr}
              onChange={(e) => setNewStart(e.target.value)}
            />
            {addStartTime ? (
              <input
                id="edit-form-start-time"
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              ></input>
            ) : (
              <></>
            )}
            <button
              className="add-start-time"
              onClick={(e) => handleAddStartTime(e)}
            >
              {addStartTime ? "Remove Time" : "Add Time"}
            </button>
          </div>
          <div>
            <label id="edit-end-label" for="end-time">
              Change ending time:
            </label>
            <input
              id="edit-form-end"
              type="date"
              name="end-time"
              max="2999-12-31"
              value={newEndStr}
              onChange={(e) => setNewEnd(e.target.value)}
            />
            {addEndTime ? (
              <input
                id="edit-form-end-time"
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
              ></input>
            ) : (
              <></>
            )}
            <button
              className="add-end-time"
              onClick={(e) => handleAddEndTime(e)}
            >
              {addEndTime ? "Remove Time" : "Add Time"}
            </button>
          </div>
          <div>
            <label for="all-day">All Day: </label>
            <input
              id="edit-form-allday"
              type="checkbox"
              name="all-day"
              checked={newAllDay}
              value={newAllDay}
              onChange={(e) => handleAllDay(e)}
            />
          </div>
          <div>
            <label for="color">Change color: </label>
            <CirclePicker
              id="event-form-color"
              name="color"
              colors={[
                "#f22724",
                "#f87e40",
                "#fde830",
                "#57e92f",
                "#2196f3",
                "#57e7cf",
                "#9751c6",
                "#e356f4",
                "#cfcacf",
              ]}
              circleSize="28"
              circleSpacing="14"
              width="130px"
              color={newColor}
              onChange={(e) => setNewColor(e.hex)}
            />
          </div>
          <div>
            <label for="reminder">Change Reminder:</label>
            <select
              id="edit-form-reminders"
              name="reminder"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
            >
              <option id="one-day-before" value="Remind me one day before">
                One day before
              </option>
              <option id="two-days-before" value="Remind me two days before">
                Two days before
              </option>
              <option id="one-week-before" value="Remind me one week before">
                One week before
              </option>
              <option id="none" value="No reminder">
                No Reminder
              </option>
            </select>
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
          selectable={true}
          editable={true}
          droppable={true}
          events={events}
          height="100%"
          headerToolbar={headerToolbar}
          initialDate={new Date()}
          plugins={calendarPlugins}
          initialView="dayGridMonth"
          dayHeaders={true}
          eventClick={(event) => handleEventClick(event)}
          navLinks={true}
          dateClick={(date) => handleDateClick(date)}
          select={(info) => handleSelect(info)}
          navLinkDayClick={(date) => handleNavClick(date)}
          eventResize={(event) => handleEventResize(event)}
          eventDrop={(event) => handleEventDrop(event)}
        />
      </div>
    </div>
  );
}

export default Scheduler;
