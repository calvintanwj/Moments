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
        Data: Data to be displayed in DayBox 
*/
function DayBox(props) {
    return (
        <td>{props.data}</td>
    );
}

/*
    One row in a calendar
    props:
        Data: Array of data to go into a WeekRow, sequentially added to week 
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
    props:
        calendarLabel: String Label for calendar e.g Month-Year
        days: Integer, number of days in the calendar month
*/
function Calendar(props) {
    const calendarBody = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
        const row = Array(6);
        for (let j = 0; j < 7; j++) {
            if (day <= props.days) {
                row[j] = day;
                day += 1;
            } else {
                row[j] = null
            }

        }
        calendarBody.push(<WeekRow data={row} />);
    }

    return (
        <>
            <table>
                <caption>{props.calendarLabel}</caption>
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
