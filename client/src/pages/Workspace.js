import Journal from "../components/Journal/Journal.js";
import Scheduler from "../components/Scheduler/Scheduler.js";
import "../index.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

function onLoad() {
  console.log("Hello");
}

function Workspace() {
  return (
    <div id="workspace" onLoad={onLoad}>
      <Scheduler />
      <Journal />
    </div>
  );
}

export default Workspace;
