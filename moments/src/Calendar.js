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
*/
function DayBox(props) {
    return (
        <td>{props.data}</td>
    );
}

/*
    Calendar header for the names of the days
    e.g monday, tuesday etc..
*/
function DayHeaderRow() {
    const days = dayNames.map((day) =>
        <td>{day}</td>);

    return (
        <tr>
            {days}
        </tr>
    );
}

/*
    Calendar template for one month
*/
function Calendar() {
    return (
        <>
            <table>
                <thead>
                    <DayHeaderRow />
                </thead>
                <tbody>
                </tbody>
            </table>
        </>
    );
}

export default Calendar;
