'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('adminclearplayers')
  .setDescription('Clear players from the circle');

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  // Only authorized users can authorize other users
  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  await playerList.set('playerList', []);

  await interaction.editReply({
    content: `The player list is cleared.`,
    ephemeral: true,
  });
}

module.exports = {
  data,
  execute,
};
