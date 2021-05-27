import './Calendar.css';
import React, { useState } from 'react';

const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

/*
    Box for each individual day in a calendar
    props: 
        label: label to be displayed in DayBox 
*/
function DayBox(props) {
    // date label for dayBox
    const label = props.label;
    // events for dayBox
    const [events, setEvents] = useState(props.events);

    // conditionally rendering default text if no events in a day
    const eventsRow = events.length ?
        events.map((event) =>
            <tr>{event}</tr>
        )
        : <td>No Events</td>;
    return (
        <td onClick={props.dayHandler}>
            <table>
                <thead>
                    <tr>
                        <th>{label}</th>
                    </tr>

                </thead>
                <tbody>
                    {eventsRow}
                </tbody>
            </table>

        </td>
    );
}

/*
    One row in a calendar
    props:
        label: Array of labels to go into a WeekRow, sequentially added to week 
*/
function WeekRow(props) {
    // const array = Array(7).fill(NaN); // range to get 7 numbers
    const row = props.days.map((day) =>
        <DayBox
            label={day["label"]}
            dayHandler={() =>
                props.dayHandler(day["label"])
            }
            events={day["events"]}
        />
    );
    return (
        <tr>
            {row}
        </tr>
    );
}

/*
    Calendar header for the names of the days
    e.g monday, tuesday etc..
*/
function DayHeaderRow() {
    const days = dayNames.map((day) =>
        <th scope="col">{day}</th>);

    return (
        <tr>
            {days}
        </tr>
    );
}

/*
    Calendar template for one month
    props:
        calendarCaption: String caption for calendar e.g Month-Year
        days: Integer, number of days in the calendar month
        offset: Number of days to shift start of month by, excluding current day
        e.g if day starts on Monday, offset is 0
*/
function Calendar(props) {

    // keep track of the day that is currently selected
    const [selectedDay, setDay] = useState(null);
    const [formEventName, setFormEventName] = useState(null);
    /*
        Handler for cell in calendar when clicked
    */
    function dayHandler(day) {
        setDay(day);
    }

    /*
        Handler for change in temporary input field, used to make name a new event
    */
    function handleChangeFormEventName(e) {
        const name = e.target.value;
        setFormEventName(name);
    }

    /*
        Handler for button to submit details from temporary input field to make a new event
    */
    function handleSubmitEvent() {
        console.log("Created event " + formEventName);
        setFormEventName("");
    }

    const calendarBody = [];
    let day = 1;
    let offsetCounter = 0;

    // Create a 5 row by 7 col calendar body to fill with numbers 
    for (let i = 0; i < 6; i++) {
        const row = Array(6);
        for (let j = 0; j < 7; j++) {
            if (offsetCounter < props.offset) { // offset the first day of the month
                row[j] = {
                    label: null,
                    events: [],
                }
                offsetCounter += 1;

            } else if (day <= props.days) { // normal calendar days
                row[j] = {
                    label: day,
                    events: ["Go workout"],
                }
                day += 1;
            } else { // Calendar month has been labelled and remainer of cells should be empty
                row[j] = {
                    label: null,
                    events: [],
                }
            }
            // ["Goto the barber", "Go workout"]
        }
        calendarBody.push(<WeekRow key={"row-" + i} days={row} dayHandler={dayHandler} />);
    }

    return (
        <>
            <h1>Focused Day: {selectedDay}</h1>

            <input type="text" value={formEventName}
                onChange={handleChangeFormEventName
                }>
            </input>
            <input type="submit" value="Create Event" onClick={handleSubmitEvent}></input>

            <table id="Outer-Calendar">
                <caption>{props.calendarCaption}</caption>
                <thead>
                    <DayHeaderRow key="DayHeaderRow" />
                </thead>
                <tbody>
                    {calendarBody}
                </tbody>
            </table>
        </>
    );
}

export default Calendar;
