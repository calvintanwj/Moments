import Calendar from "./Calendar.js";
import Journal from "./Journal.js";

function App() {
    return (
        <>
            <Calendar calendarLabel='May 2021' days={31} offset={6} />
            <Journal />
        </>
    );
}

export default App;