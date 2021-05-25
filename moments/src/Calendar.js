const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function DayHeaderRow() {
    const row = dayNames.map((day) =>
        <td>{day}</td>);

    return (
        <tr>
            {row}
        </tr>
    );
}

/*
    Calendar box for one month
*/
function Calendar() {
    return (
        <>
            <table>
                <DayHeaderRow />
            </table>
        </>
    );
}

export default Calendar;
