'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('adminopennoms')
  .setDescription('Open the nomination window');

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  // Only authorized users can authorize other users
  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  const nomsOpen = await gameInfo.get('nomsOpen');

  if (nomsOpen) {
    await interaction.editReply({
      content: `The nominations are already open.`,
      ephemeral: true,
    });
  } else {
    await gameInfo.set('nomsOpen', true);
    await gameInfo.set('gameState', {
      noms: [],
    });

    await interaction.editReply({
      content: `The nominations are now open.`,
      ephemeral: true,
    });
  }
}

module.exports = {
  data,
  execute,
};
