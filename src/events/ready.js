module.exports = async (client) => {
  console.log(client.c.green("Logged as ") + client.c.cyan(client.user.tag));
  console.log(
    client.c.green("I am in ") +
      client.c.cyan(client.guilds.cache.size + " guilds.")
  );
  console.log(client.c.green("--------------------------------"));

  await Promise.all(
    client.guilds.cache.map(async (guild) => {
      const owner = await client.users.fetch(guild.ownerId);
      console.log(
        client.c.green("Watching ") +
          client.c.cyan(guild.name) +
          client.c.green(". It has ") +
          client.c.cyan(guild.memberCount) +
          client.c.green(" members, ") +
          client.c.green("and ") +
          client.c.cyan(guild.channels.cache.size) +
          client.c.green(" channels, ") +
          client.c.green("and ") +
          client.c.cyan(guild.roles.cache.size) +
          client.c.green(" roles. The owner of this guild is ") +
          client.c.cyan(owner.username + "#" + owner.discriminator) +
          client.c.green("\n")
      );
    })
  );

  console.log(client.c.green("--------------------------------"));
  require("../handlers/commands")(client);
};
