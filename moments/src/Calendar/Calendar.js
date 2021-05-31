import './Calendar.css';
import DayHeaderRow from './DayHeaderRow';
import React, { useState } from 'react';

import WeekRow from './WeekRow';

import {
    addMonths,
    getDate,
    format,
    startOfMonth,
    getDay,
    addDays
} from 'date-fns'


/*
    Calendar template for one month
*/
function Calendar() {
    // Date of date that is selected
    const [date, setDate] = useState(new Date());

    const [formEventName, setFormEventName] = useState("");

    // // generate calendar body data - default is current calendar month
    const [dayData, setDayData] = useState(CalendarBody(date));

    // index of current selected day in dayData array
    const [row, setRow] = useState(null);
    const [col, setCol] = useState(null);

    /*
        Handler to focus cell in calendar when clicked
    */
    function dayHandler(date, row, col) {
        setRow(row);
        setCol(col);
        setDate(date);
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
        // shallow copy columns dayData
        const newDayData = [...dayData]
        // deep copy the dayData -> dayData is a 2-d array containig objects
        newDayData.map((row) => { // copy row
            return [row.map((day) => {
                return { ...day }  // copy object
            })]
        });
        // add new event to day
        newDayData[row][col]["events"].push(formEventName)
        setDayData(newDayData);

        //clear form
        setFormEventName("");
    }


    /*
        function to handle states when changing of calendar dates
    */
    function changeDate(newDate) {
        setDate(newDate);
    }

    /*
        function to handle state change when going to today
    */
    function gotoToday() {
        changeDate(new Date());
    }

    /*
        Change the current month that is being rendered
    */
    function changeMonth(offset) {
        changeDate(addMonths(date, offset));
    }

    function CalendarBody(calendarDate) {
        const dayData = [];
        let boxKey = 0;
        const dateOfFirstDay = startOfMonth(calendarDate);
        let currentDifference = -getDay(dateOfFirstDay);

        // Create a 5 row by 7 col calendar body to fill with numbers 
        for (let i = 0; i < 6; i++) {
            const row = new Array(6);
            for (let j = 0; j < 7; j++) {
                const currDate = addDays(dateOfFirstDay, currentDifference);
                const dayObject = {
                    events: [],
                    key: boxKey,
                    row: i,
                    col: j,
                    date: currDate
                }
                row[j] = dayObject;

                currentDifference += 1;
                boxKey += 1;
            }
            dayData.push(row);
        }
        return dayData;
    }

    return (
        <>
            <h1>Focused Day: {getDate(date)}</h1>

            <input type="text" value={formEventName}
                onChange={handleChangeFormEventName
                }>
            </input>
            {/* <input type="submit" value="Create Event" onClick={handleSubmitEvent}></input> */}
            <input type="submit" value="Create Event" onClick={handleSubmitEvent}></input>
            <button onClick={() => { changeMonth(-1) }}>Previous Month</button>
            <button onClick={() => { changeMonth(1) }}>Next Month</button>
            <button onClick={gotoToday}>Today</button>

            <table id="Outer-Calendar">
                <caption>{format(date, 'MMM y')}</caption>
                <thead>
                    <DayHeaderRow key="DayHeaderRow" />
                </thead>
                <tbody>
                    {/* <CalendarBody dayhandler={dayHandler} calendarDate={date} /> */}
                    {dayData.map((row, index) =>
                        <WeekRow key={"row-" + index} days={row} dayHandler={dayHandler} />)
                    }
                </tbody>
            </table>
        </>
    );
}

export default Calendar;
