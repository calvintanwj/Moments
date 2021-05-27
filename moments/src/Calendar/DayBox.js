/*
    Box for each individual day in a calendar
    props: 
        label: label to be displayed in DayBox 
        events: Array of events that is within a day
        
*/
function DayBox(props) {
    // date label for dayBox
    const label = props.label;
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

export default DayBox;