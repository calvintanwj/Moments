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
    One row in a calendar
*/
function WeekRow(props) {
    // const array = Array(7).fill(NaN); // range to get 7 numbers
    const row = props.data.map((data) =>
        <DayBox data={data} />
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
    const calendarBody = [];
    let counter = 0;
    for (let i = 0; i < 6; i++) {
        const row = Array(6);
        for (let j = 0; j < 7; j++) {
            row[j] = counter;
            counter += 1;
        }
        calendarBody.push(<WeekRow data={row} />);
    }

    return (
        <>
            <table>
                <thead>
                    <DayHeaderRow />
                </thead>
                <tbody>
                    {calendarBody}
                </tbody>
            </table>
        </>
    );
}

export default Calendar;
