const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = async (client) => {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  const commands = [];

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));

    if (!command.data || !command.data.name) {
      console.warn(
        `Command at ${file} is missing "data" or "data.name" property.`
      );
      continue;
    }
    client.commands.set(command.data.name, command);
    console.log(client.c.green("Loaded command: " + command.data.name));
    if (command.data instanceof SlashCommandBuilder) {
      commands.push(command.data.toJSON());
    } else {
      command.push(command.data);
    }
  }

  const rest = new REST({ version: "10" }).setToken(client.token);

  (async () => {
    try {
      console.log(
        client.c.green("Started refreshing application (/) commands.")
      );

      const existingCommands = await rest.get(
        Routes.applicationCommands(client.user.id)
      );

      const newCommands = commands.filter(
        (command) =>
          !existingCommands.some(
            (existingCommand) => existingCommand.name === command.name
          )
      );

      const deletedCommands = existingCommands.filter(
        (existingCommand) =>
          !commands.some((command) => command.name === existingCommand.name)
      );

      if (newCommands.length > 0) {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: newCommands,
        });
        console.log(
          client.c.green(
            "Successfully registered " + commands.length + " commands"
          )
        );
      }

      for (const deletedCommand of deletedCommands) {
        await rest.delete(
          Routes.applicationCommand(client.user.id, deletedCommand.id)
        );
        console.log(client.c.red(`Deleted command ${deletedCommand.name}`));
      }

      console.log(
        client.c.green(
          "Successfully reloaded application " +
            commands.length +
            " (/) commands."
        )
      );
    } catch (error) {
      console.error(client.c.red(error));
    }
  })();
};
