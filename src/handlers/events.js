const colors = require("colors");
const path = require("path");
const fs = require("fs");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
  console.log(colors.yellow("Loading events.."));
  for (const file of eventFiles) {
    const eventHandler = require(path.join(eventsPath, file));
    const eventName = file.split(".")[0];
    console.log(
      colors.green(`Loaded event: `) + colors.cyan(eventName) + colors.green(".")
    );
    client.on(eventName, (...args) => eventHandler(client, ...args));
  }
};
