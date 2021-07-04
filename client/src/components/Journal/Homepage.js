import React, { useState, useEffect } from "react";
import Journal from "./Journal";
import axios from "axios";

import { format } from 'date-fns';

function HomePage() {
	const [date, setDate] = useState(new Date('2021-04-20'));
	const [entries, setEntries] = useState([]);
	const [selectedID, setSelectedID] = useState(-1);

	function handleSelectEntry(entry) {
		console.log(`Setting selected to ${entry._id}`)
		setSelectedID(entry._id)
	}

	function handleUnselectEntry(entry) {
		setSelectedID(-1)
	}

	useEffect(() => {
		async function fetchData() {
			const queryObject = await axios.get(`http://localhost:5000/journal/${format(date, 'yyyy-MM-dd')}`);
			console.log(queryObject.data.entries);
			setEntries(queryObject.data.entries ?? [])
		}
		fetchData();
	}, [date]);

	function dateHandler(e) {
		setDate(Date.parse(e.target.value));
		console.log(e.target.value);
	}
	return (
		<div>
			<h1>{format(date, 'yyyy-MM-dd')}</h1>
			<input type="date" value={format(date, 'yyyy-MM-dd')} onChange={dateHandler} />
			{
				entries.map((entryObject, index) => {
					console.log(entryObject._id === selectedID)
					return <Journal entry={entryObject} selected={entryObject._id === selectedID ? true : false}
						selectHandler={() => handleSelectEntry(entryObject)}
						unselectHandler={() => handleUnselectEntry(entryObject)} />
				})
			}
		</div >
	)
}

export default HomePage;