const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

/*
    Calendar header for the names of the days
    e.g monday, tuesday etc..
*/
function DayHeaderRow() {
    const days = dayNames.map((day) =>
        <th scope="col" key={day}>{day}</th>);

    return (
        <tr className="dayRow">
            {days}
        </tr>
    );
}

export default DayHeaderRow;