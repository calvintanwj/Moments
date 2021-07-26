import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { CirclePicker } from "react-color";

// Event Form Modal
function AddEventForm(props) {
  // logic to handle an event add
  async function onEventAdded(event) {
    try {
      // await axios.post("http://localhost:5000/events/add", event);
      await axios.post(
        "https://momentsorbital.herokuapp.com/events/add/",
        event
      );
      props.setTitle("");
      props.setStart("");
      props.setEnd("");
      props.setAllDay(false);
      props.setColor("#2196f3");
      props.setReminder("No reminder");
      props.setEndTime("");
      props.setStartTime("");
      props.closeEventForm();
      props.renderEvents();
    } catch (err) {
      console.error(err);
    }
  }

  // logic when submit button is clicked for event form.
  function onSubmit(e) {
    e.preventDefault();

    if (props.title === "") {
      alert("Please key in a title");
      return false;
    } else if (props.allDay === false) {
      if (props.startStr === "") {
        alert("Please key in a starting time");
        return false;
      } else if (props.endStr === "") {
        alert("Please key in a ending time");
        return false;
      }
    } else if (props.allDay === true) {
      if (props.startStr === "") {
        alert("Plese key in date");
        return false;
      }
    }
    props.closeEventForm();
    let startStr = props.startStr;
    if (props.startTime) {
      startStr = startStr + "T" + props.startTime;
    }
    let endStr = props.endStr;
    if (props.endTime) {
      endStr = endStr + "T" + props.endTime;
    }
    onEventAdded({
      title: props.title,
      start: startStr,
      end: endStr,
      allDay: props.allDay,
      color: props.color,
      reminder: props.reminder,
    });
  }

  function handleSetStart(e) {
    props.setStart(e.target.value);
    if (props.endStr === "") {
      props.setEnd(e.target.value);
    }
  }

  function handleCloseEventForm() {
    if (
      props.title === "" &&
      props.allDay === false &&
      props.reminder === "No reminder"
    ) {
      props.closeEventForm();
    } else {
      openDiscard();
    }
  }

  const customStylesForDiscard = {
    overlay: { zIndex: 9999, width: "100vw", height: "100vh" },
    content: {
      top: "44.5%",
      bottom: "42.5%",
      left: "42%",
      right: "42%",
      overflow: "auto",
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
    props.closeEventForm();
  }

  function handleAllDay(e) {
    props.setAllDay(e.target.checked);
    if (e.target.checked) {
      props.setAddEndTime(false);
      props.setAddStartTime(false);
    }
  }

  // The Event Form
  return (
    <div id="event-form-container">
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
      <div id="event-form-header">
        <h2>Event Form</h2>
        <button
          id="event-close-button"
          onClick={() => handleCloseEventForm()}
        ></button>
      </div>
      <form id="event-form" onSubmit={onSubmit}>
        <div>
          <label for="title">Title: </label>
          <input
            id="event-form-title"
            name="title"
            value={props.title}
            onChange={(e) => props.setTitle(e.target.value)}
          />
        </div>
        <div>
          <label for="start-time">Starting time: </label>
          <input
            id="event-form-start"
            type="date"
            name="start-time"
            max="2999-12-31"
            value={props.startStr}
            onChange={(e) => handleSetStart(e)}
          />
          {props.addStartTime ? (
            <input
              id="event-form-start-time"
              type="time"
              value={props.startTime}
              onChange={(e) => props.setStartTime(e.target.value)}
            ></input>
          ) : (
            <></>
          )}
          <button
            className="add-start-time"
            onClick={(e) => props.handleAddStartTime(e)}
          >
            {props.addStartTime ? "Remove Time" : "Add Time"}
          </button>
        </div>
        <div>
          <label for="end-time">Ending time:</label>
          <input
            id="event-form-end"
            type="date"
            name="end-time"
            max="2999-12-31"
            value={props.endStr}
            onChange={(e) => props.setEnd(e.target.value)}
          />
          {props.addEndTime ? (
            <input
              id="event-form-end-time"
              type="time"
              value={props.endTime}
              onChange={(e) => props.setEndTime(e.target.value)}
            ></input>
          ) : (
            <></>
          )}
          <button
            className="add-end-time"
            onClick={(e) => props.handleAddEndTime(e)}
          >
            {props.addEndTime ? "Remove Time" : "Add Time"}
          </button>
        </div>
        <div>
          <label for="all-day">All Day: </label>
          <input
            id="event-form-allday"
            type="checkbox"
            name="all-day"
            checked={props.allDay}
            value={props.allDay}
            onChange={(e) => handleAllDay(e)}
          />
        </div>
        <div>
          <label for="color">Color: </label>
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
            color={props.color}
            onChange={(e) => props.setColor(e.hex)}
          />
        </div>

        <div>
          <label for="reminder">Remind me:</label>
          <select
            id="event-form-reminders"
            name="reminder"
            value={props.reminder}
            onChange={(e) => props.setReminder(e.target.value)}
          >
            <option value="Remind me one day before">One day before</option>
            <option value="Remind me two days before">Two days before</option>
            <option value="Remind me one week before">One week before</option>
            <option value="No reminder">No Reminder</option>
          </select>
        </div>
        <div>
          <input id="event-form-submit" type="submit" value="Add Event" />
        </div>
      </form>
    </div>
  );
}

export default AddEventForm;
