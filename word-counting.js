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
			const roomMap = new Map();
			this.perRoom.set(roomID, roomMap);

			//each word is a key to a set of stats per user
			const wordsSaved = Object.keys(rm);
			for (const word of wordsSaved) {
				//get the set of stats for that word
				const stats = rm[word];
				const users = Object.keys(stats);

				//create a map for each word to store each user
				const wordMap = new Map();
				wordMap.set(word, wordMap);

				//process each user
				for (const user of users) {
					//remaining bit to parce should just be an int to plop in
					const userUsage = stats[user];

					//if not a number its invalid data
					if (Number.isNaN(userUsage)) return;

					wordMap.set(user, userUsage);
				}
			}
		}
	}
}
