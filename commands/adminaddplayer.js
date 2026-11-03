'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('adminaddplayer')
  .setDescription('Add a player to the circle')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('The player to add')
      .setRequired(true),
  );

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  // Only authorized users can authorize other users
  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  let playerList = await gameInfo.get('playerList');
  const targetUser = interaction.options.getUser('user').id;

  playerList.push(targetUser);

  await playerList.set('playerList', playerList);

  await interaction.editReply({
    content: `The player is added. The order is:\n${playerList.map((e, i) => `${i + 1}. <@${e}>`).join('\n')}`,
    ephemeral: true,
  });
}

module.exports = {
  data,
  execute,
};
