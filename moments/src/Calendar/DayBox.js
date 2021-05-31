import getDate from "date-fns/getDate";

/*
    Box for each individual day in a calendar
    props: 
        label: label to be displayed in DayBox 
        events: Array of events that is within a day
        
*/
function DayBox(props) {
    // date label for dayBox
    const date = props.date;
    // events for dayBox
    const events = props.events;

    // conditionally rendering default text if no events in a day
    const eventsRow = events.length ?
        events.map((event) =>
            <tr>
                <td>
                    {event}
                </td>
            </tr>
        )
        : <tr><td>No Events</td></tr>;
    return (
        <td onClick={props.dayHandler}>
            <table className="innerTable">
                <thead>
                    <tr>
                        <th className="dateRow">{getDate(date)}</th>
                    </tr>

                </thead>
                <tbody>
                    {eventsRow}
                </tbody>
            </table>

        </td>
    );
}

export default DayBox;