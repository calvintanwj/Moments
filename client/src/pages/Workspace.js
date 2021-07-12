import JournalHomePage from "../components/Journal/Homepage.js";
import Scheduler from "../components/Scheduler/Scheduler.js";
import "../index.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Workspace() {
  return (
    <div id="workspace" >
      <Scheduler />
      <JournalHomePage />
    </div>
  );
}

export default Workspace;
