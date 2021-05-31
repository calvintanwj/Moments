import Calendar from "./Calendar/Calendar.js"
import Journal from "./Journal/Journal.js";
import "./index.css";

function App() {
  return (
    <div id="App">
      <Calendar key="calendar"/>
      <Journal />
    </div>
  );
  
}

export default App;
