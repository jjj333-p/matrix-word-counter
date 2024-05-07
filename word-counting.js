import fs from "node:fs";

class WordCount {
	constructor() {
		const a = readdirSync("./db");

		//make sure dir exists
		if (!a.some((b) => b === "count")) {
			//if not, make the folder for it
			mkdirSync("./db/count");
		}
		const roomJSONlist = readdirsync("./db/count");

		//map to store everything in
		this.perRoom = new Map();

		//every stored room
		for (const obj of roomJSONlist) {
			//read and parse file
			const roomFile = fs.readFileSync(`/db/count${obj}`);
			const rm = JSON.parse(roomFile);

			//get room id from the file name
			const roomID = rm.substring(0, rm.length - 5);

			//create a submap for the room
			this.perRoom.set(roomID, new Map());

			//each word is a key to a set of stats per user
			const wordsSaved = Object.keys(rm);
			for (const word of wordsSaved) {
				//get the set of stats for that word
				const stats = rm[word];
				const users = Object.keys(stats);

				for (const user of users) {
				}
			}
		}
	}
}
