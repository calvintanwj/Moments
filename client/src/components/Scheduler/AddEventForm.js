import React, { useState } from "react";
import axios from "axios";

// Event Form Modal
function AddEventForm(props) {
  // title of event
  const [title, setTitle] = useState("");

  // starting time of event
  const [startStr, setStart] = useState("");

  // ending time of event
  const [endStr, setEnd] = useState("");

  // all day of event
  const [allDay, setallDay] = useState(false);

  // color of event
  const [color, setColor] = useState("#0000FF");

  // logic to handle an event add
  async function onEventAdded(event) {
    // let calendarApi = props.calendarRef.current.getApi();
    // calendarApi.addEvent(event);
    try {
      // await axios.post("http://localhost:5000/events/add", event);
      await axios.post(
        "https://momentsorbital.herokuapp.com/events/add/",
        event
      );
      setTitle("");
      setStart("");
      setEnd("");
      setallDay(false);
      setColor("0000FF");
      props.closeEventForm();
      props.renderEvents();
    } catch (err) {
      console.error(err);
    }
  }

  // logic when submit button is clicked for event form.
  function onSubmit(e) {
    e.preventDefault();

    if (title === "") {
      alert("Please key in a title");
      return false;
    } else if (allDay === false) {
      if (startStr === "") {
        alert("Please key in starting time");
        return false;
      } else if (endStr === "") {
        alert("Please key in ending time");
        return false;
      }
    } else if (allDay === true) {
      if (startStr === "") {
        alert("Plese key in date");
        return false;
      }
    }

    props.closeEventForm();
    onEventAdded({
      title,
      start: startStr,
      end: endStr,
      allDay,
      color,
    });
  }

  // The Event Form
  return (
    <div id="event-form-container">
      <div id="event-form-header">
        <h2>Event Form</h2>
        <button
          id="event-close-button"
          onClick={() => props.closeEventForm()}
        ></button>
      </div>
      <form id="event-form" onSubmit={onSubmit}>
        <div>
          <label for="title">Title: </label>
          <input
            id="event-form-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label for="start-time">Starting time: </label>
          <input
            id="event-form-start"
            type="datetime-local"
            name="start-time"
            value={startStr}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label for="end-time">Ending time:</label>
          <input
            id="event-form-end"
            type="datetime-local"
            name="end-time"
            value={endStr}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div>
          <label for="all-day">All Day: </label>
          <input
            id="event-form-allday"
            type="checkbox"
            name="all-day"
            value={allDay}
            onChange={(e) => setallDay(e.target.checked)}
          />
        </div>
        <div>
          <label for="color">Color: </label>
          <input
            id="event-form-color"
            type="color"
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <input id="event-form-submit" type="submit" value="Add Event" />
        </div>
      </form>
    </div>
  );
}

export default AddEventForm;
