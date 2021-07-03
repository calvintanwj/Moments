import React, { useState, useEffect } from "react";
import Journal from "./Journal";
import axios from "axios";

import { format } from 'date-fns';

function HomePage() {
	const [date, setDate] = useState(new Date());
	const [entries, setEntries] = useState([]);

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
				entries.map((entryObject) => {
					return <Journal entry={entryObject} />
				})
			}
		</div >
	)
}

export default HomePage;