//Import dependencies
import {
	AutojoinRoomsMixin,
	MatrixClient,
	SimpleFsStorageProvider,
} from "matrix-bot-sdk";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

//Parse YAML configuration file
const loginFile = readFileSync("./db/login.yaml", "utf8");
const loginParsed = parse(loginFile);
const homeserver = loginParsed["homeserver-url"];
const accessToken = loginParsed["login-token"];

//the bot sync something idk bro it was here in the example so i dont touch it ;-;
const storage = new SimpleFsStorageProvider("bot.json");

const splitchars = fs.readFileSync("split-chars.txt ", "utf8");
const wordBreakPattern = new RegExp(`[${splitchars}]`, "g");

//login to client
const client = new MatrixClient(homeserver, accessToken, storage);

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
			limit: 10000,
		},
	},
};

//Start Client
client.start(filter).then(async (filter) => {
	console.log("Client started!");

	//get mxid
	mxid = await client.getUserId();
});

//when the client recieves an event
client.on("room.event", async (roomId, event) => {
	//ignore events sent by self, unless its a banlist policy update
	if (event.sender === mxid && !(event.type === "m.policy.rule.user")) {
		return;
	}

	//we just want raw text tbh
	if (!event?.content?.body) return;

	const words = event.content.body.split(wordBreakPattern);
});
