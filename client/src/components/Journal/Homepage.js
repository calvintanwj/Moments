import React, { useState, useEffect } from "react";
import Journal from "./Journal";
import MarkdownEntry from "./MarkdownEntry";
import axios from "axios";
import "./Homepage.css";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HomePage() {
  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [selectedID, setSelectedID] = useState(-1);
  const [animate, setAnimate] = useState(true)

  function handleSelectEntry(index) {
    console.log(`Selecting to ${index}`);
    setSelectedID(index);
  }

  function handleUnselectEntry(entry) {
    setSelectedID(-1);
  }

  async function handleAddEntry() {
    // const res = await axios.post(
    //   "https://momentsorbital.herokuapp.com/journal/",
    //   {
    //     date: format(date, "yyyy-MM-dd"),
    //     title: "Journal Title",
    //     entry: "",
    //   }
    // );
    const res = await axios.post('http://localhost:5000/journal/', {
      date: format(date, 'yyyy-MM-dd'),
      title: "Journal Title",
      entry: ""
    });
    const newEntries = [...entries, res.data.data];
    setEntries(newEntries);
  }

  async function handleDeleteEntry(entry, index) {
    console.log("Deleting entry");
    await axios.delete(`http://localhost:5000/journal/${entry._id}`)
    // await axios.delete(`https://momentsorbital.herokuapp.com/journal/${entry._id}`);
    const newEntries = [
      ...entries.slice(0, index),
      ...entries.slice(index + 1),
    ];
    console.log(newEntries);
    setEntries(newEntries);
  }

  function handleEditEntry(entry, index) {
    const newEntries = [
      ...entries.slice(0, index),
      entry,
      ...entries.slice(index + 1),
    ];
    setEntries(newEntries);
  }

  function toggleAnimate() {
    setAnimate(!animate)
  }

  useEffect(() => {
    async function fetchData() {
      const queryObject = await axios.get(`http://localhost:5000/journal/${format(date, 'yyyy-MM-dd')}`);
      // const queryObject = await axios.get(
      //   `https://momentsorbital.herokuapp.com/journal/${format(
      //     date,
      //     "yyyy-MM-dd"
      //   )}`
      // );
      console.log(queryObject.data.entries);
      setEntries(queryObject.data.entries ?? []);
    }
    fetchData();
  }, [date]);

  return (
    <div id="journal-component">
      {selectedID === -1 ? (
        <div id="journal-homepage">
          <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat={'dd-MM-yyy'} />
          <div>
            {/* <label>{animate ? "Disable journal animation" : "Enable journal animation"}</label> */}
            <button onClick={toggleAnimate}>
              {animate ? "Disable journal animation" : "Enable journal animation"}
            </button>
          </div>
          <button id="Add-Entry-bar" class="sticky" onClick={handleAddEntry}>Add New Entry</button>

          <div id="entries-container">
            {entries.map((entryObject, index) => {
              return (
                <>
                  <MarkdownEntry
                    entry={entryObject}
                    clickHandler={() => handleSelectEntry(index)}
                    deleteHandler={() => handleDeleteEntry(entryObject, index)}
                  />
                </>
              );
            })}
            <button id="AddButton" onClick={handleAddEntry}>
              <i class="fas fa-plus-circle fa-3x"></i>
              <span>Add new entry</span>
            </button>
          </div>
        </div>
      ) : (
        <Journal
          entry={entries[selectedID]}
          editHandler={(entryData) => handleEditEntry(entryData, selectedID)}
          unselectHandler={() => handleUnselectEntry(entries[selectedID])}
          deleteHandler={() =>
            handleDeleteEntry(entries[selectedID], selectedID)
          }
          animate={animate}
        />
      )}
    </div>
  );
}

export default HomePage;
