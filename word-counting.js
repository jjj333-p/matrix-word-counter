import fs from "node:fs";
import { Module } from "node:module";

class WordCount {
	constructor() {
		const a = fs.readdirSync("./db");

		//make sure dir exists
		if (!a.some((b) => b === "count")) {
			//if not, make the folder for it
			fs.mkdirSync("./db/count");
		}
		const roomJSONlist = fs.readdirSync("./db/count");

		//map to store everything in
		this.perRoom = new Map();
		this.writePromise = new Map();
		this.writeQueued = new Map();
		this.statsString = new Map();

		//every stored room
		for (const obj of roomJSONlist) {
			//read and parse file
			let roomFile;

			try {
				roomFile = fs.readFileSync(`./db/count/${obj}`);
			} catch (e) {
				console.log(`error reading file ${obj}, it may be a dir\n${e}`);
				break;
			}

			const rm = JSON.parse(roomFile);

			// Get room ID from the file name
			const roomID = obj.substring(0, obj.length - 5);

			// Create a submap for the room
			const roomMap = new Map();
			this.perRoom.set(roomID, roomMap);

			// Iterate through each word and its stats
			const wordsSaved = Object.keys(rm);
			for (const word of wordsSaved) {
				const stats = rm[word];
				const users = Object.keys(stats);

				// Create a map for each word to store each user's stats
				const wordMap = new Map();
				roomMap.set(word, wordMap);

				// Process each user's stats
				for (const user of users) {
					const userUsage = stats[user];

					// Check if userUsage is a number
					if (!Number.isNaN(userUsage)) {
						wordMap.set(user, userUsage);
					} else {
						console.warn(`Invalid data for user '${user}' in word '${word}'.`);
						// Handle invalid data differently if needed
					}
				}
			}
		}
	}

	async addToUser(room, word, user, amount) {
		if (!this.perRoom.has(room)) this.perRoom.set(room, new Map());

		let stats = this.perRoom.get(room).get(word);

		if (!stats) {
			stats = new Map();

			this.perRoom.get(room).set(word, stats);
		}

		let current = stats.get(user);

		//if undefined set it to 0 just to make sure i dont footgun myself
		if (!current) current = 0;

		//set new value
		stats.set(user, current + amount);

		this.queueWrite(room);
	}

	async queueWrite(room) {
		//the data is being global, if theres a scheduled write queued already
		//the data will be written already so we can just toss any other queued
		//for that room
		if (this.writeQueued.get(room)) return;

		//get the last write to await
		const currentWritePromise = this.writePromise.get(room);

		if (currentWritePromise) {
			//say we already have one right after this
			this.writeQueued.set(room, true);

			//prevent racey writes
			await currentWritePromise;
		}

		//save the promise to prevent racey writes
		this.writePromise.set(room, this.write(room));

		//no longer queueing
		this.writeQueued.delete(room);
	}

	async write(room) {
		const statsMap = this.perRoom.get(room);

		const words = Array.from(statsMap.keys());

		const statsObjMap = new Map();

		for (const word of words) {
			statsObjMap.set(word, Object.fromEntries(statsMap.get(word).entries()));
		}

		const statsObj = Object.fromEntries(statsObjMap.entries());

		const statsString = JSON.stringify(statsObj, null, 2);

		const oldStatsString = this.statsString.get(room);

		//if its the same as what was already written no need to write
		if (oldStatsString === statsString) return;

		try {
			fs.writeFileSync(`./db/count/${room}.json`, statsString);
		} catch (e) {
			console.log(`error writing file for ${room}\n${e}`);
		}
	}
}

export { WordCount };
