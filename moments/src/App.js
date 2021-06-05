import Calendar from "./Calendar/Calendar.js"
import Journal from "./Journal/Journal.js";
import Scheduler from "./Scheduler/Scheduler.js";
import "./index.css";
import Modal from "react-modal";

Modal.setAppElement('#root');

function App() {
  return (
    <div id="App">
      <Calendar key="calendar"/>
      <Scheduler />
      <Journal />
    </div>
  );
  
}

export default App;
