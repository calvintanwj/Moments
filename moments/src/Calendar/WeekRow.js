import DayBox from './DayBox.js'

/*
    One row in a calendar
    props:
        label: Array of labels to go into a WeekRow, sequentially added to week 
        
*/
function WeekRow(props) {
    // const array = Array(7).fill(NaN); // range to get 7 numbers
    const row = props.days.map((day) => {
        if (day["label"] === "") {
            return <DayBox
                label={day["label"]}
                dayHandler={() => null} // empty dayHandler for blank calendar days
                events={day["events"]}
                key={day["key"]}
                row={day["row"]}
                col={day["col"]}
            />
        } else {
            return <DayBox
                label={day["label"]}
                dayHandler={() =>
                    props.dayHandler(day["label"], day["row"], day["col"])
                }
                events={day["events"]}
                key={day["key"]}
                row={day["row"]}
                col={day["col"]}
            />
        }
    }

    );
    return (
        <tr>
            {row}
        </tr>
    );
}

export default WeekRow;