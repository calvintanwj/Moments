import WeekRow from './WeekRow';
import {
    getDay,
    addDays,
    startOfMonth
} from "date-fns";

/* 
    Create body of calendar
*/
function CalendarBody(props) {
    const dayData = [];
    let boxKey = 0;
    const dateOfFirstDay = startOfMonth(props.calendarDate);
    let currentDifference = -getDay(dateOfFirstDay);

    // Create a 5 row by 7 col calendar body to fill with numbers 
    for (let i = 0; i < 6; i++) {
        const row = new Array(6);
        for (let j = 0; j < 7; j++) {
            const currDate = addDays(dateOfFirstDay, currentDifference);
            const dayObject = {
                events: ["Goto barber",
                    "Walk the dog",
                    "Take out the trash",
                    "Do homework",
                    "This is meant ot represent a very long task name, such that it doesn't affect the table"],
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
    const calendarBody = dayData.map((row, index) =>
        <WeekRow key={"row-" + index} days={row} dayHandler={props.dayHandler} />);

    return calendarBody;

}

export default CalendarBody;