const { Client, ActivityType, GatewayIntentBits, Collection } = require("discord.js");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
console.clear();
console.log(
  colors.green("Discord Bot Template made by") + colors.blue(" TheOldZoom")
);

const client = new Client({
  presence: {
    status: "dnd",
    activities: [
      {
        name: "Template Bot made by TheOldZoom",
        type: ActivityType.Custom,
      },
    ],
  },
  intents: [GatewayIntentBits.Guilds],
});
client.c = colors
client.commands = new Collection()
require("./handlers/events")(client)

client.login(require("./config.json").token);
