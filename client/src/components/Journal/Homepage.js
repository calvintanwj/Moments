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
  const [animate, setAnimate] = useState(true);

  function handleSelectEntry(index) {
    setSelectedID(index);
  }

  function handleUnselectEntry() {
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
    const res = await axios.post("http://localhost:5000/journal/", {
      date: format(date, "yyyy-MM-dd"),
      title: "Journal Title",
      entry: "",
    });
    const newEntries = [...entries, res.data.data];
    setEntries(newEntries);
  }

  async function handleDeleteEntry(entry, index) {
    handleUnselectEntry(entry);
    await axios.delete(`http://localhost:5000/journal/${entry._id}`);
    // await axios.delete(`https://momentsorbital.herokuapp.com/journal/${entry._id}`);
    removeEntry(index);
  }

  function handleEditEntry(entry, index) {
    const newEntries = [
      ...entries.slice(0, index),
      entry,
      ...entries.slice(index + 1),
    ];
    setEntries(newEntries);
  }

  function removeEntry(index) {
    const newEntries = [
      ...entries.slice(0, index),
      ...entries.slice(index + 1),
    ];
    setEntries(newEntries);
  }

  function handleEntryDateChange(date) {
    setDate(date);
  }

  function toggleAnimate() {
    setAnimate(!animate);
  }

  useEffect(() => {
    async function fetchData() {
      const queryObject = await axios.get(
        `http://localhost:5000/journal/${format(date, "yyyy-MM-dd")}`
      );
      // const queryObject = await axios.get(
      //   `https://momentsorbital.herokuapp.com/journal/${format(
      //     date,
      //     "yyyy-MM-dd"
      //   )}`
      // );
      const entries = queryObject.data.entries ?? [];
      setEntries(entries);
    }
    fetchData();
  }, [date]);

  return (
    <div id="journal-component">
      {selectedID === -1 ? (
        <div id="journal-homepage">
          <div class="sticky">
            <DatePicker
              id="journal-datepicker"
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd-MM-yyy"
              showYearDropdown
              popperClassName="popper"
              wrapperClassName="center-in-grid"
            />
            <button id="journal-animation-bt" onClick={toggleAnimate}>
              {animate
                ? "Disable journal animation"
                : "Enable journal animation"}
            </button>
            <button id="Add-Entry-bar" onClick={handleAddEntry}>
              Add New Entry
            </button>
          </div>
          <div id="entries-container">
            {entries.map((entryObject, index) => {
              return (
                <>
                  <MarkdownEntry
                    entry={entryObject}
                    clickHandler={() => handleSelectEntry(index)}
                    deleteHandler={() => handleDeleteEntry(entryObject, index)}
                    key={entryObject._id}
                  />
                </>
              );
            })}
            <button id="AddButton" onClick={handleAddEntry}>
              <i className="fas fa-plus-circle fa-3x"></i>
              <span>Add new entry</span>
            </button>
          </div>
        </div>
      ) : (
        <Journal
          index={selectedID}
          entry={entries[selectedID]}
          editHandler={(entryData, index) => handleEditEntry(entryData, index)}
          unselectHandler={() => handleUnselectEntry()}
          dateChangeHandler={(newEntry) => handleEntryDateChange(newEntry)}
          deleteHandler={(index) => handleDeleteEntry(entries[index], index)}
          animate={animate}
        />
      )}
    </div>
  );
}

export default HomePage;
