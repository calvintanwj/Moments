import Calendar from "./Calendar.js";
import Journal from "./Journal/Journal.js";
import './index.css';
import './Journal/Journal.css';

function App() {
    return (
        <div className="App">
            <Calendar />
            <Journal />
        </div>
    );
}

export default App;