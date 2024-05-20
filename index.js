//Import dependencies
import {
	AutojoinRoomsMixin,
	MatrixClient,
	SimpleFsStorageProvider,
	RichRepliesPreprocessor,
} from "matrix-bot-sdk";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { WordCount } from "./word-counting.js";

//Parse YAML configuration file
const loginFile = readFileSync("./db/login.yaml", "utf8");
const loginParsed = parse(loginFile);
const homeserver = loginParsed["homeserver-url"];
const accessToken = loginParsed["login-token"];

//prefix
const prefix = ".";

//the bot sync something idk bro it was here in the example so i dont touch it ;-;
const storage = new SimpleFsStorageProvider("bot.json");

//login to client
const client = new MatrixClient(homeserver, accessToken, storage);
AutojoinRoomsMixin.setupOnClient(client);

//do not include replied message in message
client.addPreprocessor(new RichRepliesPreprocessor(false));

const counter = new WordCount();

//preallocate variables so they have a global scope
let mxid;

const filter = {
	//dont expect any presence from m.org, but in the case presence shows up its irrelevant to this bot
	presence: { senders: [] },
	room: {
		//ephemeral events are never used in this bot, are mostly inconsequentail and irrelevant
		ephemeral: { senders: [] },
		//we fetch state manually later, hopefully with better load balancing
		state: {
			senders: [],
			types: [],
			lazy_load_members: true,
		},
		//we will manually fetch events anyways, this is just limiting how much backfill bot gets as to not
		//respond to events far out of view
		timeline: {
			limit: 1000,
		},
	},
};

//Start Client
client.start(filter).then(async (filter) => {
	console.log("Client started!");

	//get mxid
	mxid = await client.getUserId().catch(() => {});
});

//when the client recieves an event
client.on("room.event", async (roomId, event) => {
	//ignore events sent by self, unless its a banlist policy update
	if (event.sender === mxid) {
		return;
	}

	//we just want raw text tbh
	if (!event?.content?.body) return;

	const body = event.content.body.toLowerCase();

	if (body.startsWith(`${prefix}count`)) {
		//get word param
		const word = body.split(" ")[1];

		//get stats map
		const wordstats = counter.perRoom.get(roomId)?.get(word);

		//if no stats
		if (!wordstats) {
			client.replyNotice(roomId, event, "❌ | That word has not been used");

			return;
		}

		let count = 0;

		// biome-ignore lint/complexity/noForEach: <explanation>
		wordstats.forEach((a) => {
			count += a;
		});

		//get all users
		const users = Array.from(wordstats.keys());

		//generate human readable string
		let msg = `<b>Total</b>: ${count}<br><br>`;
		for (const user of users) {
			msg += `<b>${user}</b>: ${wordstats.get(user)}<br>`;
		}

		client.replyHtmlNotice(roomId, event, msg);
	} else {
		//split on regex and and filter out empty words
		const words = body.split(/[^a-z0-9]/gi).filter((w) => w);

		const wordCounts = new Map();

		for (const word of words) {
			// If the word already exists in wordCounts, increment its count
			if (wordCounts.has(word)) {
				wordCounts.set(word, wordCounts.get(word) + 1);
			} else {
				// If the word doesn't exist, initialize its count to 1
				wordCounts.set(word, 1);
			}
		}

		//add each count to the user
		const countedWords = wordCounts.keys();
		for (const word of countedWords) {
			counter.addToUser(roomId, word, event.sender, wordCounts.get(word));
		}
	}
});
