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

export default DayHeaderRow;