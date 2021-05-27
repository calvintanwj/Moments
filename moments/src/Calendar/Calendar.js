import './Calendar.css';
import WeekRow from './WeekRow.js';
import DayHeaderRow from './DayHeaderRow';
import React, { useState } from 'react';

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
    const [formEventName, setFormEventName] = useState("");
    const dayData = [];


    /*
        Handler for cell in calendar when clicked
    */
    function dayHandler(label, row, col) {
        console.log(`${row}row, ${col}col`);
        setDay(label);
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

    let day = 1;
    let offsetCounter = 0;
    let boxKey = 0;

    // Create a 5 row by 7 col calendar body to fill with numbers 
    for (let i = 0; i < 6; i++) {
        const row = new Array(6);
        for (let j = 0; j < 7; j++) {
            const dayObject = {
                events: [],
                key: boxKey,
                row: i,
                col: j
            }
            if (offsetCounter < props.offset) { // offset the first day of the month
                row[j] = {
                    ...dayObject,
                    label: ""
                }
                offsetCounter += 1;

            } else if (day <= props.days) { // normal calendar days
                row[j] = {
                    ...dayObject,
                    label: day,
                }
                day += 1;
            } else { // Calendar month has been labelled and remainer of cells should be empty
                row[j] = {
                    ...dayObject,
                    label: ""
                }
            }
            boxKey += 1;
            // ["Goto the barber", "Go workout"]
        }
        dayData.push(row);
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
                    {dayData.map((row, index) =>
                        <WeekRow key={"row-" + index} days={row} dayHandler={dayHandler} />
                    )}
                </tbody>
            </table>
        </>
    );
}

export default Calendar;
