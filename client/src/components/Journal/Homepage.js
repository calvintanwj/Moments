import React, { useState, useEffect } from "react";
import Journal from "./Journal";
import MarkdownEntry from "./MarkdownEntry";
import axios from "axios";
import "./Homepage.css";
import { format } from "date-fns";

function HomePage() {
  const [date, setDate] = useState(new Date());
  // const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [selectedID, setSelectedID] = useState(-1);

  function handleSelectEntry(index) {
    console.log(`Selecting to ${index}`);
    setSelectedID(index);
  }

  function handleUnselectEntry(entry) {
    setSelectedID(-1);
  }

  async function handleAddEntry() {
    const res = await axios.post(
      "https://momentsorbital.herokuapp.com/journal/",
      {
        date: format(date, "yyyy-MM-dd"),
        title: "Journal Title",
        entry: "",
      }
    );
    // const res = await axios.post('http://localhost:5000/journal/', {
    // 	date: format(date, 'yyyy-MM-dd'),
    // 	title: "Journal Title",
    // 	entry: ""
    // });
    const newEntries = [...entries, res.data.data];
    setEntries(newEntries);
  }

  async function handleDeleteEntry(entry, index) {
    console.log("Deleting entry");
    // await axios.delete(`http://localhost:5000/journal/${entry._id}`)
    await axios.delete(`https://momentsorbital.herokuapp.com/${entry._id}`);
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

  useEffect(() => {
    async function fetchData() {
      // const queryObject = await axios.get(`http://localhost:5000/journal/${format(date, 'yyyy-MM-dd')}`);
      const queryObject = await axios.get(
        `https://momentsorbital.herokuapp.com/journal/${format(
          date,
          "yyyy-MM-dd"
        )}`
      );
      console.log(queryObject.data.entries);
      setEntries(queryObject.data.entries ?? []);
    }
    fetchData();
  }, [date]);

  function dateHandler(e) {
    setDate(Date.parse(e.target.value));
    console.log(e.target.value);
  }

  return (
    <div>
      <input
        type="date"
        value={format(date, "yyyy-MM-dd")}
        onChange={dateHandler}
      />
      {selectedID === -1 ? (
        <div id="entries-container">
          {entries.map((entryObject, index) => {
            return (
              <>
                <MarkdownEntry
                  entry={entryObject.entry}
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
      ) : (
        <Journal
          entry={entries[selectedID]}
          editHandler={(entryData) => handleEditEntry(entryData, selectedID)}
          unselectHandler={() => handleUnselectEntry(entries[selectedID])}
          deleteHandler={() =>
            handleDeleteEntry(entries[selectedID], selectedID)
          }
        />
      )}
    </div>
  );
}

export default HomePage;
