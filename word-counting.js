import fs from "node:fs";

class WordCount {
	constructor() {
		const a = readdirSync("./db");

		if (!a.some((b) => b === "count")) {
			//if not, make the folder for it
			mkdirSync("./db/count");
		}

		const roomJSONlist = readdirsync("./db/count");

		this.perRoom = new Map();

		for (obj in roomJSONlist) {
			const roomFile = fs.readFileSync(`/db/count${obj}`);

			const rm = JSON.parse(roomFile);

			const wordsSaved = Object.keys(rm);
		}
	}
}
