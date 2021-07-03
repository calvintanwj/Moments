import React, { useState, useEffect } from "react";
import Journal from "./Journal";
import axios from "axios";

function HomePage() {
	const [entries, setEntries] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const queryObject = await axios.get("http://localhost:5000/journal/2021-04-20");
			console.log(queryObject.data.entries);
			setEntries(queryObject.data.entries ?? [])
		}
		fetchData();
	}, []);
	return (
		<div>
			{
				entries.map((entryObject) => {
					const { entry, _id } = entryObject;
					return <Journal entry={entry} id={_id} />
				})}
		</div>
	)
}

export default HomePage;